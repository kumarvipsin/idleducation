'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { TExpertTeacher } from "@/app/actions/types";
import { getSignedUrlForPdf } from "@/app/actions";
import {
  Clock,
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
        <div className="relative flex flex-col flex-1 pt-3 pb-0.5 text-left justify-between">

          {/* Teacher Info (Name & Pill) */}
          <div className="relative z-10 pr-10 min-w-0">
            {/* Teacher Name */}
            <h3 
              onClick={() => setIsProfileOpen(true)}
              className="font-extrabold text-[17px] sm:text-[18.5px] text-[#0A1E4A] dark:text-white tracking-tight leading-snug truncate cursor-pointer hover:text-[#155EEF] transition-colors"
              title={teacher.name}
            >
              {teacher.name}
            </h3>

            {/* Metadata Pill Badge (Experience • Subject) */}
            <div className="mt-2 flex items-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#BFDBFE]/80 bg-[#F0F6FE]/70 dark:bg-slate-800/80 dark:border-blue-900/60 shadow-sm max-w-full">
                {hasExp && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] sm:text-[12px] font-bold text-[#155EEF] shrink-0 leading-none">
                    <Clock className="w-3 h-3 stroke-[2.4]" />
                    {expDisplay}
                  </span>
                )}
                {hasExp && cleanSubject && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD] shrink-0" aria-hidden="true" />
                )}
                {cleanSubject && (
                  <span className="text-[11.5px] sm:text-[12px] font-bold text-[#334155] dark:text-slate-200 truncate leading-none">
                    {cleanSubject}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── CARD FOOTER: View Profile CTA & 3D Subject Icon ── */}
          <div className="relative mt-3 pt-2.5 sm:pt-3 border-t border-[#E8F0FA] dark:border-slate-800">
            {/* 3D Subject Icon: 50% smaller, base touches separator line, right side touches 100% */}
            <div className="absolute bottom-full -right-3 sm:-right-3.5 z-10 flex items-end justify-end pointer-events-none">
              <div className="relative flex items-end justify-end w-10 h-10 sm:w-11 sm:h-11 transition-transform duration-300 ease-out group-hover/card:scale-105">
                <Image
                  src={subjectIconPath}
                  alt={cleanSubject || "Subject"}
                  width={42}
                  height={38}
                  className="w-auto h-auto max-w-[38px] sm:max-w-[42px] max-h-[36px] sm:max-h-[38px] object-contain drop-shadow-sm select-none"
                  priority={false}
                />
              </div>
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
