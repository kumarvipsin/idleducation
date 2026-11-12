import crypto from 'crypto';
import { cookies, headers } from 'next/headers';
import { doc, getDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '@/lib/firebase';
import {
  getBranchDisplayName,
  normalizeBranchId,
  recordMatchesBranch,
} from '@/lib/branch-utils';
import { serializeFirestoreData } from '@/app/actions/utils';

const SESSION_COOKIE_NAME = 'idl_session_token';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface ServerAdminContext {
  uid: string;
  email: string;
  name: string;
  role: 'admin';
  isSuperAdmin: boolean;
  isBranchAdmin: boolean;
  branchId: string;
  branchName: string;
}

interface SessionPayload {
  uid: string;
  email: string;
  issuedAt: number;
  exp: number;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastSignInTime?: string | null;
}

function getSigningKey(): Buffer {
  const rawSecret =
    process.env.IDL_SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.GCS_CREDENTIALS ||
    `${firebaseConfig.projectId}:${firebaseConfig.appId}:idl-server-session`;

  return crypto.createHash('sha256').update(rawSecret).digest();
}

function signPayload(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSigningKey())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, providedSig] = parts;
  if (!encoded || !providedSig) return null;

  const expectedSig = crypto
    .createHmac('sha256', getSigningKey())
    .update(encoded)
    .digest('base64url');

  const providedBuf = Buffer.from(providedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed?.uid || typeof parsed.exp !== 'number' || Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Verifies a client-supplied Firebase ID Token against Google Identity Toolkit.
 */
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<{
  uid: string;
  email: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastSignInTime?: string | null;
} | null> {
  if (!idToken || typeof idToken !== 'string') return null;
  try {
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
      firebaseConfig.apiKey
    )}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const data = await response.json();
    const userRecord = Array.isArray(data?.users) ? data.users[0] : null;
    if (!userRecord?.localId) return null;

    const lastLoginMs = Number(userRecord.lastLoginAt);
    const lastSignInTime = Number.isFinite(lastLoginMs) && lastLoginMs > 0
      ? new Date(lastLoginMs).toISOString()
      : null;

    return {
      uid: String(userRecord.localId),
      email: String(userRecord.email || ''),
      emailVerified: typeof userRecord.emailVerified === 'boolean' ? userRecord.emailVerified : undefined,
      twoFactorEnabled: Array.isArray(userRecord.mfaInfo) ? userRecord.mfaInfo.length > 0 : false,
      lastSignInTime,
    };
  } catch {
    return null;
  }
}

/**
 * Sets the signed HttpOnly session cookie for a verified user session.
 */
export async function setServerUserSessionCookie(params: {
  uid: string;
  email?: string | null;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastSignInTime?: string | null;
}): Promise<void> {
  if (!params.uid) return;
  const cookieStore = await cookies();
  const hdrs = await headers();
  const isHttps = hdrs.get('x-forwarded-proto') === 'https';

  const now = Date.now();
  const token = signPayload({
    uid: params.uid,
    email: params.email || '',
    issuedAt: now,
    exp: now + SESSION_TTL_MS,
    ...(typeof params.emailVerified === 'boolean' ? { emailVerified: params.emailVerified } : {}),
    ...(typeof params.twoFactorEnabled === 'boolean' ? { twoFactorEnabled: params.twoFactorEnabled } : {}),
    ...(params.lastSignInTime ? { lastSignInTime: params.lastSignInTime } : {}),
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isHttps,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

/**
 * Clears the signed HttpOnly session cookie on logout.
 */
export async function clearServerUserSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignore cookie mutation errors outside request context.
  }
}

const ADMIN_CTX_CACHE = new Map<
  string,
  { ctx: ServerAdminContext | null; expiresAt: number }
>();
const ADMIN_CTX_CACHE_TTL_MS = 30 * 1000;

/**
 * Resolves the authoritative admin context from Firestore for a verified UID.
 * Never trusts client-provided branchId or role values.
 */
export async function resolveAdminContextForUid(
  uid: string,
  fallbackEmail?: string | null
): Promise<ServerAdminContext | null> {
  if (!uid) return null;

  const now = Date.now();
  const cached = ADMIN_CTX_CACHE.get(uid);
  if (cached && cached.expiresAt > now) {
    return cached.ctx;
  }

  const superAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aksias.sos@outlook.com').toLowerCase();
  let userSnap;
  try {
    userSnap = await getDoc(doc(db, 'users', uid));
  } catch (err) {
    if (cached?.ctx) {
      return cached.ctx;
    }
    if (fallbackEmail && fallbackEmail.toLowerCase() === superAdminEmail) {
      const saCtx: ServerAdminContext = {
        uid,
        email: fallbackEmail,
        name: 'Admin',
        role: 'admin',
        isSuperAdmin: true,
        isBranchAdmin: false,
        branchId: 'all',
        branchName: 'All Branches (Super Admin)',
      };
      ADMIN_CTX_CACHE.set(uid, { ctx: saCtx, expiresAt: now + ADMIN_CTX_CACHE_TTL_MS });
      return saCtx;
    }
    return null;
  }

  if (!userSnap.exists()) {
    if (fallbackEmail && fallbackEmail.toLowerCase() === superAdminEmail) {
      const saCtx: ServerAdminContext = {
        uid,
        email: fallbackEmail,
        name: 'Admin',
        role: 'admin',
        isSuperAdmin: true,
        isBranchAdmin: false,
        branchId: 'all',
        branchName: 'All Branches (Super Admin)',
      };
      ADMIN_CTX_CACHE.set(uid, { ctx: saCtx, expiresAt: now + ADMIN_CTX_CACHE_TTL_MS });
      return saCtx;
    }
    ADMIN_CTX_CACHE.set(uid, { ctx: null, expiresAt: now + 5000 });
    return null;
  }

  const data = userSnap.data() || {};
  const email = String(data.email || fallbackEmail || '').trim();
  const roleLower = String(data.role || '').trim().toLowerCase();
  const isConfiguredSuperAdminEmail = email.toLowerCase() === superAdminEmail;

  if (roleLower !== 'admin' && !isConfiguredSuperAdminEmail) {
    ADMIN_CTX_CACHE.set(uid, { ctx: null, expiresAt: now + 5000 });
    return null;
  }

  const statusLower = String(data.status || 'approved').trim().toLowerCase();
  if (statusLower === 'pending' || statusLower === 'inactive' || statusLower === 'denied') {
    ADMIN_CTX_CACHE.set(uid, { ctx: null, expiresAt: now + 5000 });
    return null;
  }

  const normalizedBranch = normalizeBranchId(data.branchId || data.branchName || data.branch);
  const isSuperAdmin = isConfiguredSuperAdminEmail || !normalizedBranch || normalizedBranch === 'all';
  const canonicalBranchId = isSuperAdmin ? 'all' : normalizedBranch!;
  const resolvedBranchName = isSuperAdmin
    ? 'All Branches (Super Admin)'
    : data.branchName || getBranchDisplayName(canonicalBranchId, true);

  const resolvedCtx: ServerAdminContext = {
    uid,
    email,
    name: String(data.name || 'Admin'),
    role: 'admin',
    isSuperAdmin,
    isBranchAdmin: !isSuperAdmin,
    branchId: canonicalBranchId,
    branchName: resolvedBranchName,
  };
  ADMIN_CTX_CACHE.set(uid, { ctx: resolvedCtx, expiresAt: now + ADMIN_CTX_CACHE_TTL_MS });
  return resolvedCtx;
}

/**
 * Reads and verifies the current caller's admin context from the signed session cookie
 * and fresh Firestore user document. Returns null if unauthenticated or not an active admin.
 */
export async function getServerAdminContext(): Promise<ServerAdminContext | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = verifyToken(token);
    if (!payload) return null;

    return await resolveAdminContextForUid(payload.uid, payload.email);
  } catch {
    return null;
  }
}

/**
 * Restores a verified signed-in user's serialized profile from the HttpOnly session cookie.
 */
export async function getVerifiedSessionUserProfile(): Promise<Record<string, any> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = verifyToken(token);
    if (!payload) return null;

    const superAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aksias.sos@outlook.com').toLowerCase();
    const userSnap = await getDoc(doc(db, 'users', payload.uid));
    if (!userSnap.exists()) {
      if (payload.email.toLowerCase() === superAdminEmail) {
        return {
          uid: payload.uid,
          email: payload.email,
          name: 'Admin',
          role: 'admin',
          branchId: 'all',
          branchName: 'All Branches (Super Admin)',
          status: 'approved',
          ...(typeof payload.emailVerified === 'boolean' ? { emailVerified: payload.emailVerified } : {}),
          ...(typeof payload.twoFactorEnabled === 'boolean' ? { twoFactorEnabled: payload.twoFactorEnabled } : {}),
          ...(payload.lastSignInTime ? { lastSignInTime: payload.lastSignInTime } : {}),
        };
      }
      return null;
    }

    const userData = userSnap.data() || {};
    const statusLower = String(userData.status || 'approved').trim().toLowerCase();
    if (statusLower === 'pending' || statusLower === 'inactive' || statusLower === 'denied') {
      return null;
    }

    const isAdmin = String(userData.role || '').trim().toLowerCase() === 'admin';
    const rawBranch = normalizeBranchId(userData.branchId || userData.branchName || userData.branch);
    const branchId = isAdmin
      ? payload.email.toLowerCase() === superAdminEmail || !rawBranch || rawBranch === 'all'
        ? 'all'
        : rawBranch
      : rawBranch;
    const branchName = branchId
      ? branchId === 'all'
        ? 'All Branches (Super Admin)'
        : userData.branchName || getBranchDisplayName(branchId, true)
      : null;

    return {
      ...serializeFirestoreData(userData),
      uid: payload.uid,
      email: userData.email || payload.email,
      name: userData.name || 'User',
      role: String(userData.role || 'student').toLowerCase(),
      branchId,
      branchName,
      status: userData.status || 'approved',
      ...(typeof payload.emailVerified === 'boolean' ? { emailVerified: payload.emailVerified } : {}),
      ...(typeof payload.twoFactorEnabled === 'boolean' ? { twoFactorEnabled: payload.twoFactorEnabled } : {}),
      ...(payload.lastSignInTime ? { lastSignInTime: payload.lastSignInTime } : {}),
    };
  } catch {
    return null;
  }
}

/**
 * Resolves the effective canonical branch filter for a request.
 * Branch Admins are permanently locked to their assigned branch; Super Admins default to `'all'`
 * unless narrowing to a specific branch view. Returns null when unauthenticated.
 */
export function resolveScopedBranchFilter(
  adminCtx: ServerAdminContext | null,
  narrowBranchId?: string | null
): string | null {
  if (!adminCtx) return null;
  if (adminCtx.isBranchAdmin) {
    return adminCtx.branchId;
  }
  const normalizedNarrow = normalizeBranchId(narrowBranchId);
  if (normalizedNarrow && normalizedNarrow !== 'all') {
    return normalizedNarrow;
  }
  return 'all';
}

/**
 * Filters records down to the authenticated branch admin's branch.
 * Fails closed (`[]`) when unauthenticated unless `allowUnauthenticated` is explicitly enabled.
 */
export function scopeRecordsToBranchAdmin<T extends Record<string, any>>(
  records: T[],
  adminCtx: ServerAdminContext | null,
  options?: { allowUnauthenticated?: boolean; narrowBranchId?: string | null }
): T[] {
  if (!adminCtx) {
    return options?.allowUnauthenticated ? records : [];
  }
  const effectiveBranch = resolveScopedBranchFilter(adminCtx, options?.narrowBranchId);
  if (!effectiveBranch) {
    return [];
  }
  if (effectiveBranch === 'all') {
    return records;
  }
  return records.filter((record) => recordMatchesBranch(record, effectiveBranch));
}
