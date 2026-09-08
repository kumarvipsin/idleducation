
// src/app/actions/types.ts

// This file defines the TypeScript types for the content structure
// used in Firestore and throughout the content management actions.

export interface TSubTopic {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  shortNotePdfUrl?: string;
  primumNotePdfUrl?: string;
  order: number;
}

export interface TTopic {
  name: string;
  createdAt: string;
  subTopics?: TSubTopic[];
  order: number;
  pdfUrl_en?: string;
  pdfUrl_hi?: string;
  notePdfUrl_en?: string;
  notePdfUrl_hi?: string;
  notePdfUrl_en_demo?: string;
  notePdfUrl_en_primum?: string;
  notePdfUrl_hi_demo?: string;
  notePdfUrl_hi_primum?: string;
}

export interface TChapter {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  longNotePdfUrl?: string;
  shortNotePdfUrl?: string;
  topics?: TTopic[];
}

export interface TPart {
  name: string;
  createdAt: string;
  chapters: TChapter[];
  order: number;
}

export interface TSubject {
  name: string;
  createdAt: string;
  parts?: { [key: string]: TPart };
  chapters?: TChapter[];
  order: number;
}

export interface TClass {
  name: string;
  subjects: { [key: string]: TSubject };
  order: number;
}

export interface TTestimonial {
  id: string;
  name: string;
  achievement: string;
  testimonial: string;
  testimonial_hi?: string;
  avatarUrl?: string;
  createdAt: string;
  videoId?: string;
}

export interface TTopperTestimonial {
  id: string;
  studentName: string;
  studentClass: string;
  videoId: string;
  createdAt: string;
  achievement?: string;
  quote?: string;
  thumbnailUrl?: string;
  order?: number;
  featured?: boolean;
}

export interface TExcellenceResult {
  id: string;
  categoryName: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export interface TGalleryImage {
    id: string;
    title: string;
    category: string;
    alt: string;
    imageUrl: string;
    className?: string;
    createdAt: string;
}

export interface TBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content?: string;
  author: string;
  authorRole?: 'admin' | 'teacher' | 'student';
  authorId?: string;
  status?: 'pending' | 'approved';
  date: string;
  imageUrl: string;
  createdAt?: string;
}

export interface TTeamMember {
  id: string;
  name: string;
  designation: string;
  experience: string;
  biography?: string;
  avatarUrl: string;
  order: number;
  createdAt: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface TExpertTeacher {
  id: string;
  name: string;
  designation?: string;
  subject: string;
  examFocus?: string;
  specialization?: string;
  experience?: string;
  qualification?: string;
  teachingFocus?: string;
  shortBio?: string;
  avatarUrl?: string;
  photo?: string;
  photoUrl?: string;
  originalPhotoUrl?: string;
  photoPosition?: string;   // CSS object-position e.g. 'top', 'center', '50% 20%'
  videoId?: string;
  videoUrl?: string;
  introVideo?: string;
  profileUrl?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Paper {
  title: string;
  pdfUrl?: string;
}

export interface SubjectWithPapers {
  name: string;
  papers: Paper[];
}

export interface TPreviousYearQuestion {
  id: string;
  exam: string;
  year: number;
  title: string;
  subjects: SubjectWithPapers[];
  createdAt: string;
}

export interface TFreeCourseVideo {
  title: string;
  youtubeLink: string;
  order: number;
  description?: string;
}

export interface TFreeCourseChapter {
  name: string;
  number?: number;
  description?: string;
  status: 'show' | 'hide';
  videos: TFreeCourseVideo[];
}

export interface TFreeCourse {
  id: string;
  title: string;
  slug?: string;
  class: string;
  board?: string;
  subject?: string;
  chapter?: string;
  category?: string; // 'Free Course' | 'Revision' | 'One Shot' | 'Concept Class' | 'Exam Preparation' | 'Important Questions' | 'Strategy'
  medium?: string;
  batchName?: string;
  validity?: string;
  price: number;
  originalPrice: number;
  description?: string;
  shortDescription?: string;
  audience?: string;        // e.g. 'For Class 9 CBSE Students'
  startDate?: string;       // ISO string or 'DD Mon YYYY'
  endDate?: string;         // ISO string or 'DD Mon YYYY'
  youtubeUrl?: string;
  youtubeType?: 'video' | 'playlist';
  youtubeVideoId?: string;
  youtubePlaylistId?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  status: 'active' | 'inactive';
  publishStatus?: 'published' | 'draft' | 'unpublished' | 'archived';
  displayOrder?: number;
  isFeatured?: boolean;
  publishedAt?: string;
  chapters?: TFreeCourseChapter[];
  createdAt: string;
  updatedAt?: string;
}

export interface TPaidCourse extends TFreeCourse {}

export interface THeroSlide {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
}

// ============================================================
// ATTENDANCE MANAGEMENT SYSTEM TYPES
// ============================================================

export type AcademicYearStatus = 'active' | 'archived';
export type EntityStatus = 'active' | 'disabled';
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE';
export type LeaveStatus = 'pending' | 'approved' | 'cancelled';
export type FollowUpStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type FollowUpPriority = 'NORMAL' | 'HIGH';
export type CallStatus = 'NOT_CALLED' | 'CONNECTED' | 'NO_ANSWER' | 'SWITCHED_OFF' | 'BUSY' | 'CALLBACK_REQUESTED';
export type MessageStatus = 'NOT_SENT' | 'SENT' | 'RESPONSE_RECEIVED' | 'NO_RESPONSE';

export interface TAcademicYear {
  id: string;
  name: string;        // e.g. "2026–27"
  startDate: string;
  endDate: string;
  status: AcademicYearStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TAttendanceClass {
  id: string;
  name: string;          // e.g. "Class 10"
  displayName?: string;
  academicYearId: string;
  status: EntityStatus;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TBatch {
  id: string;
  classId: string;
  academicYearId: string;
  name: string;          // e.g. "Batch A"
  startTime: string;     // e.g. "17:00"
  endTime: string;       // e.g. "18:00"
  daysOfWeek: string[];  // e.g. ["Mon","Tue","Wed","Thu","Fri","Sat"]
  status: EntityStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TSubject {
  id: string;
  name: string;          // e.g. "Mathematics"
  shortName?: string;    // e.g. "Maths"
  status: EntityStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TSession {
  id: string;
  academicYearId: string;
  classId: string;
  batchId: string;
  subjectId: string;
  sessionDate: string;   // "YYYY-MM-DD"
  startTime: string;     // "HH:mm"
  endTime: string;       // "HH:mm"
  status: SessionStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Denormalized display names for quick rendering
  className?: string;
  batchName?: string;
  subjectName?: string;
}

export interface TAttendanceRecord {
  id: string;
  sessionId?: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  // Denormalized context for historical integrity
  academicYearId?: string;
  classId: string;
  className?: string;
  batchId?: string;
  subjectId: string;
  subjectName?: string;
  sessionDate: string;   // "YYYY-MM-DD"
  periodIndex?: number;  // 1, 2, or 3 (Hour 1, Hour 2, Hour 3)
  // Attendance data
  status: AttendanceStatus;
  inTime?: string;        // "HH:mm"
  outTime?: string;       // "HH:mm"
  entryTime?: string;     // alias for inTime
  durationMinutes?: number; // e.g. 60
  remark?: string;
  absenceReason?: string; // Sick, School Exam, Family, Travel, Personal, Unknown, Other
  markedAt?: string;
  markedBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface TLeave {
  id: string;
  studentId: string;
  classId: string;
  batchId: string;
  academicYearId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TFollowUp {
  id: string;
  attendanceId: string;
  studentId: string;
  sessionId: string;
  type: 'call' | 'message' | 'remark';
  status: FollowUpStatus;
  priority: FollowUpPriority;
  // Call fields
  callStatus?: CallStatus;
  callTime?: string;
  callRemark?: string;
  // Message fields
  messageStatus?: MessageStatus;
  messageTime?: string;
  messageRemark?: string;
  // Response
  parentResponse?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Extended student fields for attendance enrollment
export interface TAttendanceStudent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  parentPhone?: string;
  studentCode?: string;
  classId?: string;
  batchId?: string;
  academicYearId?: string;
  admissionDate?: string;
  status: 'approved' | 'inactive' | 'pending';
  photoURL?: string;
  role: 'student';
  // Denormalized for display
  className?: string;
  batchName?: string;
}
