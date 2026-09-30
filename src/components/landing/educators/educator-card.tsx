'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { TExpertTeacher } from "@/app/actions/types";
import { getSignedUrlForPdf } from "@/app/actions";
import {
  Clock,
  BookOpen,
  Users,
  Play,
  ArrowRight,
} from "lucide-react";
import {
  TEACHER_FALLBACK_IMAGES,
  getYouTubeId,
  formatExperience,
  getSubjectVisual,
} from "./educator-constants";
import { EducatorVideoModal } from "./educator-video-modal";
import { EducatorProfileModal } from "./educator-profile-modal";

interface EducatorCardProps {
  teacher: TExpertTeacher;
}

export function EducatorCard({ teacher }: EducatorCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const fallbackPhoto = TEACHER_FALLBACK_IMAGES[teacher.name] || "";
  const rawPhoto = teacher.photoUrl || teacher.avatarUrl || teacher.photo || "";
  const videoId = getYouTubeId(teacher.videoUrl || teacher.videoId || teacher.introVideo);

  const [imgSrc, setImgSrc] = useState<string>(rawPhoto || fallbackPhoto);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let active = true;
    setImgError(false);
    const raw = rawPhoto;
    if (!raw) {
      setImgSrc(fallbackPhoto);
      return;
    }
    if (raw.includes('storage.googleapis.com') && !raw.includes('GoogleAccessId=')) {
      getSignedUrlForPdf(raw).then((res) => {
        if (!active) return;
        if (res.success && res.url) {
          const processedUrl = raw.includes('teacher-cropped-photo')
            ? `/api/teacher-image?src=${encodeURIComponent(res.url)}`
            : res.url;
          setImgSrc(processedUrl);
        } else {
          setImgSrc(fallbackPhoto || raw);
        }
      });
    } else {
      setImgSrc(raw);
    }
    return () => { active = false; };
  }, [rawPhoto, fallbackPhoto]);

  const displaySrc = imgSrc || fallbackPhoto;
  const hasPhoto = Boolean(displaySrc) && !imgError;

  const subjectLabel =
    teacher.specialization ||
    (teacher.subject && teacher.examFocus
      ? `${teacher.subject} & ${teacher.examFocus}`
      : teacher.subject || null);

  const expDisplay = formatExperience(teacher.experience) || "5+ Years";
  const qualDisplay = (teacher.qualification || "").trim();
  const hasExp = Boolean(expDisplay);
  const hasQual = Boolean(qualDisplay);

  const bioText =
    teacher.shortBio ||
    teacher.teachingFocus ||
    "Dedicated to building deep conceptual clarity and academic excellence.";

  const designation = teacher.designation || teacher.subject || "";
  const specializationBadge = subjectLabel;

  // Resolve subject visual 3D icon from public/ and clean label
  const { iconPath: subjectIconPath, cleanSubject } = getSubjectVisual(
    teacher.subject,
    teacher.specialization,
    teacher.designation,
    teacher.name
  );

  return (
    <>
      {/* ── CARD CONTAINER ── */}
      <div className="group/card relative h-full w-full flex flex-col bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-[24px] border border-[#DCE7F6] dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(20,60,120,0.06),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_-6px_rgba(20,60,120,0.12)] hover:border-[#BFDBFE] dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden p-3 sm:p-3.5">

        {/* ── IMAGE BLOCK ── */}
        <div
          className="relative w-full aspect-[4/4.2] shrink-0 overflow-hidden rounded-[16px] sm:rounded-[18px]"
          style={{ background: "linear-gradient(150deg, #090e1a 0%, #0d1629 55%, #050811 100%)" }}
        >
          {/* Subtle curved radial highlight behind photo */}
          <div 
            aria-hidden="true" 
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,0.25),transparent_70%)] pointer-events-none" 
          />

          {/* Teacher Photo */}
          {hasPhoto && (
            <div className="absolute inset-0 z-10">
              <Image
                src={displaySrc}
                alt={teacher.name}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 25vw"
                className="object-cover object-top transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
                style={teacher.photoPosition ? { objectPosition: teacher.photoPosition } : undefined}
                unoptimized={true}
                onError={() => {
                  if (fallbackPhoto && imgSrc !== fallbackPhoto) {
                    setImgSrc(fallbackPhoto);
                  } else {
                    setImgError(true);
                  }
                }}
              />
            </div>
          )}

          {/* Fallback icon */}
          {!hasPhoto && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Users className="w-16 h-16 text-white/15" />
            </div>
          )}

          {/* Bottom vignette */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 z-20 pointer-events-none bg-gradient-to-t from-black/35 via-black/10 to-transparent"
          />

          {/* ── PLAY BUTTON: bottom-right corner ── */}
          <button
            type="button"
            onClick={() => videoId ? setIsVideoOpen(true) : undefined}
            disabled={!videoId}
            aria-label={`Watch introduction of ${teacher.name}`}
            className={`absolute bottom-2.5 right-2.5 z-30 w-8 h-8 sm:w-[36px] sm:h-[36px] rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 ${
              videoId 
                ? 'cursor-pointer hover:bg-black/85 hover:scale-105 active:scale-95 text-white' 
                : 'cursor-default opacity-40 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white text-white ml-[2px]" />
          </button>
        </div>

        {/* ── CARD BODY ── */}
        <div className="relative flex flex-col flex-1 pt-3 pb-1 text-left justify-between">

          {/* Teacher Info Row: Name & Pill on left, 3D Subject Icon on right */}
          <div className="relative flex items-center justify-between gap-2 z-10 min-h-[72px]">
            {/* Left Content */}
            <div className="flex-1 min-w-0 pr-1">
              {/* Teacher Name */}
              <h3 
                onClick={() => setIsProfileOpen(true)}
                className="font-extrabold text-[17px] sm:text-[18.5px] text-[#0A1E4A] dark:text-white tracking-tight leading-snug truncate cursor-pointer hover:text-[#155EEF] transition-colors"
                title={teacher.name}
              >
                {teacher.name}
              </h3>

              {/* Metadata Pill Badge (Experience + Subject) */}
              <div className="mt-2 flex items-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#BFDBFE]/80 bg-[#F0F6FE]/70 dark:bg-slate-800/80 dark:border-blue-900/60 shadow-sm max-w-full">
                  {hasExp && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] sm:text-[12px] font-bold text-[#155EEF] shrink-0 leading-none">
                      <Clock className="w-3 h-3 stroke-[2.4]" />
                      {expDisplay}
                    </span>
                  )}
                  {hasExp && cleanSubject && (
                    <span className="text-[#93C5FD] font-normal text-xs select-none">|</span>
                  )}
                  {cleanSubject && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] sm:text-[12px] font-bold text-[#334155] dark:text-slate-200 truncate leading-none">
                      <BookOpen className="w-3 h-3 stroke-[2.2] text-[#475569] dark:text-slate-400 shrink-0" />
                      <span className="truncate">{cleanSubject}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: 3D Subject Illustration with soft glowing aura */}
            <div className="relative shrink-0 w-20 h-18 sm:w-[86px] sm:h-[76px] flex items-center justify-center">
              {/* Soft light blue circular aura */}
              <div 
                aria-hidden="true"
                className="absolute -top-1 -right-1 w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-blue-100/80 via-sky-100/50 to-blue-50/20 dark:from-blue-900/30 dark:via-sky-950/20 dark:to-transparent pointer-events-none"
              />
              {/* Small floating sparkles/bubbles */}
              <span aria-hidden="true" className="absolute top-1 left-0 w-2.5 h-2.5 rounded-full bg-blue-200/70 pointer-events-none" />
              <span aria-hidden="true" className="absolute -top-1 right-6 w-1.5 h-1.5 rounded-full bg-blue-300/80 pointer-events-none" />
              <span aria-hidden="true" className="absolute bottom-1 right-0 w-1.5 h-1.5 rounded-full bg-blue-300/60 pointer-events-none" />

              {/* The 3D Subject Icon from public/ */}
              <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 ease-out group-hover/card:scale-105 group-hover/card:-translate-y-0.5">
                <Image
                  src={subjectIconPath}
                  alt={cleanSubject || "Subject"}
                  width={84}
                  height={76}
                  className="w-auto h-auto max-w-full max-h-[72px] sm:max-h-[76px] object-contain drop-shadow-sm select-none"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* ── CARD FOOTER: Dotted Accent & View Profile CTA ── */}
          <div className="relative mt-3 pt-2.5 sm:pt-3 border-t border-[#E8F0FA] dark:border-slate-800">
            {/* Dotted matrix pattern in the bottom-left */}
            <div 
              aria-hidden="true" 
              className="absolute bottom-1 left-1.5 flex flex-col gap-1 sm:gap-1.5 opacity-35 dark:opacity-20 pointer-events-none"
            >
              {[0, 1, 2, 3].map((r) => (
                <div key={r} className="flex gap-1 sm:gap-1.5">
                  {[0, 1, 2, 3].map((c) => (
                    <span key={c} className="w-1 h-1 rounded-full bg-[#60A5FA]" />
                  ))}
                </div>
              ))}
            </div>

            {/* View Profile Action */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label={`View profile of ${teacher.name}`}
              className="relative z-10 w-full flex items-center justify-center gap-1.5 bg-transparent border-none p-0 cursor-pointer group/cta text-[13.5px] sm:text-[14px] font-bold text-[#155EEF] hover:text-[#0A1E4A] dark:hover:text-blue-400 transition-colors py-0.5"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.4] text-[#155EEF] group-hover/cta:text-[#0A1E4A] dark:group-hover/cta:text-blue-400 group-hover/cta:translate-x-1 transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Intro Video Modal */}
      <EducatorVideoModal
        isOpen={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        teacherName={teacher.name}
        videoId={videoId}
      />

      {/* View Profile Modal */}
      <EducatorProfileModal
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        teacher={teacher}
        displaySrc={displaySrc}
        designation={designation}
        specializationBadge={specializationBadge}
        expDisplay={expDisplay}
        qualDisplay={qualDisplay}
        bioText={bioText}
      />
    </>
  );
}
