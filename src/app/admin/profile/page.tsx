'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';
import { useAuth, type UserProfile } from '@/context/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GcsImage } from '@/components/gcs-image';
import { ProfileEditForm } from './profile-edit-form';
import { getBranchDisplayName, normalizeBranchId } from '@/lib/branch-utils';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface DetailEntry {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'warning' | 'neutral';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.charAt(0).toUpperCase() || 'A';
}

function formatLastActiveTimestamp(rawValue: string | null | undefined): string | null {
  if (!rawValue || typeof rawValue !== 'string') return null;
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return format(parsed, 'MMM d, yyyy, h:mm a');
}

function resolveAccountStatus(status: string | null | undefined): { label: string; isActive: boolean } | null {
  if (!status || typeof status !== 'string') return null;
  const normalized = status.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'inactive' || normalized === 'denied') {
    return { label: 'Inactive', isActive: false };
  }
  if (normalized === 'pending') {
    return { label: 'Pending', isActive: false };
  }
  if (normalized === 'approved' || normalized === 'active') {
    return { label: 'Active', isActive: true };
  }
  return null;
}

function TwoColumnSection({
  title,
  entries,
  fullWidthEntry,
  emptyMessage,
}: {
  title: string;
  entries: DetailEntry[];
  fullWidthEntry?: DetailEntry | null;
  emptyMessage?: string;
}) {
  const rows: DetailEntry[][] = [];
  for (let i = 0; i < entries.length; i += 2) {
    rows.push(entries.slice(i, i + 2));
  }

  return (
    <section className="px-6 py-6 sm:px-8 sm:py-7">
      <h2 className="text-[15px] font-semibold tracking-tight text-[#0B1B43] mb-5">{title}</h2>
      {rows.length === 0 && !fullWidthEntry ? (
        <p className="text-sm text-[#64748B]">{emptyMessage || 'No details available.'}</p>
      ) : (
        <div className="divide-y divide-[#E8EDF3]">
          {rows.map((pair, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                'grid grid-cols-1 md:grid-cols-2',
                rowIndex > 0 && 'pt-5',
                rowIndex < rows.length - 1 || fullWidthEntry ? 'pb-5' : ''
              )}
            >
              <div className="min-w-0 md:pr-8">
                <p className="text-xs font-medium text-[#64748B] mb-1.5">{pair[0].label}</p>
                <ValueText entry={pair[0]} />
              </div>
              {pair[1] && (
                <div className="min-w-0 pt-4 mt-4 border-t border-[#E8EDF3] md:pt-0 md:mt-0 md:border-t-0 md:pl-8 md:border-l md:border-[#E8EDF3]">
                  <p className="text-xs font-medium text-[#64748B] mb-1.5">{pair[1].label}</p>
                  <ValueText entry={pair[1]} />
                </div>
              )}
            </div>
          ))}
          {fullWidthEntry && (
            <div className={cn('min-w-0', rows.length > 0 && 'pt-5')}>
              <p className="text-xs font-medium text-[#64748B] mb-1.5">{fullWidthEntry.label}</p>
              <ValueText entry={fullWidthEntry} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ValueText({ entry }: { entry: DetailEntry }) {
  return (
    <p
      className={cn(
        'text-sm font-medium break-words',
        entry.tone === 'positive'
          ? 'text-emerald-700'
          : entry.tone === 'warning'
            ? 'text-amber-700'
            : entry.tone === 'neutral'
              ? 'text-[#475569]'
              : 'text-[#0B1B43]'
      )}
    >
      {entry.value}
    </p>
  );
}

export default function AdminProfilePage() {
  const { user, loading, login } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: UserProfile) => {
    login({
      ...user,
      ...updatedUser,
      emailVerified: updatedUser.emailVerified ?? user?.emailVerified,
      twoFactorEnabled: updatedUser.twoFactorEnabled ?? user?.twoFactorEnabled,
      lastSignInTime: updatedUser.lastSignInTime ?? user?.lastSignInTime,
    });
    setIsEditDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-white border border-[#E8EDF3] rounded-lg divide-y divide-[#E8EDF3]">
        <div className="px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-white border border-[#E8EDF3] rounded-lg px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#64748B]">
          Your session has expired. Please sign in again to view this profile.
        </p>
      </div>
    );
  }

  const displayName = (user.name || user.email?.split('@')[0] || 'Administrator').trim();
  const initials = getInitials(displayName);
  const normalizedBranchId = normalizeBranchId(user.branchId);
  const isBranchAdmin = user.role === 'admin' && Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchDisplayName = isBranchAdmin
    ? user.branchName || (normalizedBranchId ? getBranchDisplayName(normalizedBranchId, true) : '')
    : '';
  const accountRole =
    user.role === 'admin'
      ? isBranchAdmin
        ? 'Branch Admin'
        : 'Super Admin'
      : user.role
        ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`
        : 'Administrator';
  const accountRoleDetail =
    isBranchAdmin && branchDisplayName ? `${accountRole} (${branchDisplayName})` : accountRole;

  const accountStatus = resolveAccountStatus(user.status);

  const firebaseUser = auth.currentUser?.uid === user.uid ? auth.currentUser : null;
  const emailVerified =
    typeof firebaseUser?.emailVerified === 'boolean'
      ? firebaseUser.emailVerified
      : typeof user.emailVerified === 'boolean'
        ? user.emailVerified
        : undefined;
  const twoFactorEnabled = typeof user.twoFactorEnabled === 'boolean' ? user.twoFactorEnabled : undefined;
  const lastActiveFormatted = formatLastActiveTimestamp(
    firebaseUser?.metadata?.lastSignInTime || user.lastSignInTime
  );

  const personalEntries: DetailEntry[] = [
    { label: 'Full Name', value: displayName },
    { label: 'Account Role', value: accountRoleDetail },
  ];

  const contactEntries: DetailEntry[] = [
    { label: 'Email Address', value: user.email || 'Not provided' },
    { label: 'Phone Number', value: user.phone?.trim() || 'Not provided' },
  ];

  const trimmedAddress = user.address?.trim() || '';
  const addressEntry: DetailEntry | null = trimmedAddress
    ? { label: 'Primary Address', value: trimmedAddress }
    : null;

  const securityEntries: DetailEntry[] = [];
  if (typeof emailVerified === 'boolean') {
    securityEntries.push({
      label: 'Email Verification Status',
      value: emailVerified ? 'Verified' : 'Not Verified',
      tone: emailVerified ? 'positive' : 'warning',
    });
  }
  if (typeof twoFactorEnabled === 'boolean') {
    securityEntries.push({
      label: 'Two-Factor Authentication Status',
      value: twoFactorEnabled ? 'Enabled' : 'Not Enabled',
      tone: twoFactorEnabled ? 'positive' : 'neutral',
    });
  }
  if (lastActiveFormatted) {
    securityEntries.push({
      label: 'Last Active',
      value: lastActiveFormatted,
      tone: 'default',
    });
  }
  if (accountStatus) {
    securityEntries.push({
      label: 'Account Status',
      value: accountStatus.label,
      tone: accountStatus.isActive ? 'positive' : 'neutral',
    });
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white">
      <div className="border border-[#E8EDF3] rounded-lg bg-white divide-y divide-[#E8EDF3]">
        {/* 1. Profile Header */}
        <section className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              <Avatar className="h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full border border-[#E8EDF3] shrink-0">
                {user.photoURL ? (
                  <GcsImage
                    filePath={user.photoURL}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[#0B1B43] text-white text-lg sm:text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B1B43] truncate">
                  {displayName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-sm font-medium text-[#64748B]">{accountRole}</span>
                  {accountStatus && (
                    <>
                      <span className="text-[#CBD5E1]" aria-hidden="true">
                        •
                      </span>
                      <span
                        data-testid="profile-account-status"
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E8EDF3] bg-[#F8FAFC] px-2 py-0.5 text-xs font-medium text-[#0B1B43]"
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            accountStatus.isActive ? 'bg-emerald-600' : 'bg-slate-400'
                          )}
                        />
                        {accountStatus.label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto h-9 px-4 rounded-md border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B1B43] hover:text-[#2563EB] hover:border-[#93C5FD] text-sm font-medium shadow-none transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-2 text-[#2563EB]" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg rounded-lg border border-[#E8EDF3] bg-white p-6 shadow-md">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg font-semibold tracking-tight text-[#0B1B43]">
                      Edit Profile
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#64748B]">
                      Update your administrator profile photo and contact information.
                    </DialogDescription>
                  </DialogHeader>
                  <ProfileEditForm
                    user={user}
                    onSuccess={handleUpdateSuccess}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* 2. Personal Information */}
        <TwoColumnSection title="Personal Information" entries={personalEntries} />

        {/* 3. Contact Information */}
        <TwoColumnSection
          title="Contact Information"
          entries={contactEntries}
          fullWidthEntry={addressEntry}
        />

        {/* 4. Account & Security */}
        <TwoColumnSection
          title="Account & Security"
          entries={securityEntries}
          emptyMessage="Security metadata is not available for the current session."
        />
      </div>
    </div>
  );
}
