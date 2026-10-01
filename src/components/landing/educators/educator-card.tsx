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
      <div className="group/card relative h-full w-full flex flex-col bg-gradient-to-b from-white via-white to-[#F9FBFE] dark:from-slate-900 dark:to-slate-900 rounded-[20px] min-[380px]:rounded-[22px] sm:rounded-[24px] border border-[#DCE8F6] dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(6,43,103,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_28px_-6px_rgba(6,43,103,0.07)] hover:border-[#BBD7FA] dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden p-2.5 min-[380px]:p-3 sm:p-3.5">

        {/* ── IMAGE BLOCK ── */}
        <div
          className="relative w-full aspect-[4/3.85] sm:aspect-[4/4.2] shrink-0 overflow-hidden rounded-[15px] min-[380px]:rounded-[16px] sm:rounded-[18px]"
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
        <div className="relative flex flex-col flex-1 pt-2 min-[380px]:pt-2.5 sm:pt-4 pb-0 text-center justify-between">

          {/* Teacher Info: Centered Name & Centered Exp / Subject */}
          <div className="relative z-10 w-full text-center">
            {/* Teacher Name — Centered with comfortable breathing room */}
            <h3 
              onClick={() => setIsProfileOpen(true)}
              className="font-extrabold text-[16px] min-[380px]:text-[17px] sm:text-[18.5px] text-[#0A1E4A] dark:text-white tracking-tight leading-snug truncate cursor-pointer hover:text-[#155EEF] transition-colors text-center w-full"
              title={teacher.name}
            >
              {teacher.name}
            </h3>

            {/* Metadata Line (Experience • Subject) — Centered, visually compact & comfortable */}
            <div className="mt-1 min-[380px]:mt-1.5 sm:mt-2.5 flex items-center justify-center">
              <div className="inline-flex items-center justify-center gap-1.5 px-1 py-0.5 max-w-full text-center">
                {hasExp && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] min-[380px]:text-[12px] sm:text-[12.5px] font-bold text-[#155EEF] shrink-0 leading-normal">
                    <Clock className="w-3 h-3 stroke-[2.4]" />
                    {expDisplay}
                  </span>
                )}
                {hasExp && cleanSubject && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD] shrink-0" aria-hidden="true" />
                )}
                {cleanSubject && (
                  <span className="text-[11.5px] min-[380px]:text-[12px] sm:text-[12.5px] font-bold text-[#4A5E78] dark:text-slate-300 leading-normal">
                    {cleanSubject}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── CARD FOOTER: View Profile CTA ── */}
          <div className="relative mt-2.5 min-[380px]:mt-3 sm:mt-4 pt-2 min-[380px]:pt-2.5 sm:pt-3 border-t border-[#E8F0FA] dark:border-slate-800">
            {/* View Profile Action */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label={`View profile of ${teacher.name}`}
              className="relative z-10 w-full flex items-center justify-center gap-1.5 bg-transparent border-none p-0 cursor-pointer group/cta text-[13px] min-[380px]:text-[13.5px] sm:text-[14px] font-bold text-[#155EEF] hover:text-[#0A1E4A] dark:hover:text-blue-400 transition-colors py-0.5 sm:py-1"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.4] text-[#155EEF] group-hover/cta:text-[#0A1E4A] dark:group-hover/cta:text-blue-400 group-hover/cta:translate-x-1 transition-all duration-200" />
            </button>
          </div>

          {/* Subtle soft-blue atmospheric wash in lower background — understated, kept strictly below metadata */}
          <div 
            aria-hidden="true" 
            className="absolute inset-x-0 bottom-0 h-14 sm:h-16 pointer-events-none -mx-2.5 min-[380px]:-mx-3 sm:-mx-3.5 -mb-2.5 min-[380px]:-mb-3 sm:-mb-3.5 rounded-b-[20px] min-[380px]:rounded-b-[22px] sm:rounded-b-[24px] overflow-hidden z-0"
          >
            {/* Extremely light soft-blue ambient gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#EDF4FD]/80 via-[#F7FAFE]/40 to-transparent dark:from-slate-800/30 dark:to-transparent" />
            
            {/* Minimal understated organic curved blue shape in the bottom-right corner */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[#E0EDFD]/70 dark:bg-blue-900/10 pointer-events-none" />
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
