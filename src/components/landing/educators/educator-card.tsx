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

  const expDisplay = formatExperience(teacher.experience);
  const qualDisplay = (teacher.qualification || "").trim();
  const hasExp = Boolean(expDisplay);
  const hasQual = Boolean(qualDisplay);

  const bioText =
    teacher.shortBio ||
    teacher.teachingFocus ||
    "Dedicated to building deep conceptual clarity and academic excellence.";

  const designation = teacher.designation || teacher.subject || "";
  const specializationBadge = subjectLabel;

  return (
    <>
      {/* ── CARD CONTAINER ── */}
      <div className="group/card h-full w-full flex flex-col bg-[#FAFCFF] dark:bg-slate-900 rounded-[18px] sm:rounded-[20px] border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_10px_-2px_rgba(6,43,103,0.03),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_-4px_rgba(6,43,103,0.07)] hover:border-[#BFDBFE]/60 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 ease-out overflow-hidden p-3 sm:p-2.5">

        {/* ── IMAGE BLOCK (IDL Star style with outer margin and rounded-[14px] sm:rounded-[15px] corners) ── */}
        <div
          className="relative w-full aspect-[4/4.2] shrink-0 overflow-hidden rounded-[14px] sm:rounded-[15px]"
          style={{ background: "linear-gradient(145deg, #18181B 0%, #0F0F12 40%, #000000 100%)" }}
        >
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

          {/* Subtle bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
          />

          {/* ── PLAY BUTTON: bottom-right corner ── */}
          <button
            type="button"
            onClick={() => videoId ? setIsVideoOpen(true) : undefined}
            disabled={!videoId}
            aria-label={`Watch introduction of ${teacher.name}`}
            className={`absolute bottom-2.5 right-2.5 z-30 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 ${
              videoId 
                ? 'cursor-pointer hover:bg-black/65 hover:scale-105 active:scale-95 text-white' 
                : 'cursor-default opacity-40 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white text-white ml-[1px]" />
          </button>
        </div>

        {/* ── CARD BODY ── */}
        <div className="relative flex flex-col flex-1 pt-3 sm:pt-2.5 px-1 pb-0.5 text-center justify-between overflow-hidden">

          {/* Top-Left Soft Light Blue Curved Shape */}
          <div 
            aria-hidden="true" 
            className="absolute -top-10 -left-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-100/35 dark:bg-blue-900/15 pointer-events-none"
          />

          {/* Bottom-Right Soft Light Blue Curved Shape */}
          <div 
            aria-hidden="true" 
            className="absolute -bottom-8 -right-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-100/35 dark:bg-blue-900/15 pointer-events-none"
          />

          {/* Top-Right Dotted Matrix Pattern */}
          <div
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-20 h-16 pointer-events-none opacity-25 dark:opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#93C5FD 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              maskImage: 'radial-gradient(ellipse at top right, black 65%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at top right, black 65%, transparent 100%)',
            }}
          />

          <div className="relative z-10">
            {/* NAME — Dominant anchor, bold geometric sans, dark navy */}
            <h3 
              onClick={() => setIsProfileOpen(true)}
              className="font-extrabold sm:font-[900] text-[16.5px] sm:text-[17.5px] text-[#0A1E4A] dark:text-white tracking-[-0.02em] leading-snug text-center w-full truncate cursor-pointer hover:text-[#155EEF] transition-colors"
            >
              {teacher.name}
            </h3>

            {/* METADATA PILL BADGE — Uniform font size & boldness for both experience and subject */}
            <div className="flex items-center justify-center mt-2 mb-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#BFDBFE]/40 dark:border-blue-900/40 bg-transparent max-w-full text-center h-[23px] sm:h-[24px]">
                {hasExp && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] sm:text-[12px] font-bold text-[#155EEF] shrink-0 leading-none">
                    <Clock className="w-2.5 h-2.5 stroke-[2.2]" />
                    {expDisplay}
                  </span>
                )}
                {hasExp && (subjectLabel || designation) && (
                  <span className="w-1 h-1 rounded-full bg-[#93C5FD] shrink-0" aria-hidden="true" />
                )}
                {(subjectLabel || designation) && (
                  <span className="text-[11.5px] sm:text-[12px] font-bold text-[#4A5E78] dark:text-slate-300 truncate leading-none">
                    {(subjectLabel || designation || '')
                      .replace(/^Maths$/i, 'Mathematics')
                      .replace(/^Phy$/i, 'Physics')
                      .replace(/^Chem$/i, 'Chemistry')
                      .replace(/^Bio$/i, 'Biology')
                      .replace(/^Eng$/i, 'English')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* VIEW PROFILE CTA — Perfectly balanced & aligned */}
          <div className="relative z-10 mt-3 pt-2.5 border-t border-[#E8F0FA] dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label={`View profile of ${teacher.name}`}
              className="w-full flex items-center justify-center gap-1.5 bg-transparent border-none p-0 cursor-pointer group/cta text-[12.5px] sm:text-[13px] font-bold text-[#155EEF] hover:text-[#0A1E4A] transition-colors py-0.5"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3 h-3 stroke-[2.4] text-[#155EEF] group-hover/cta:text-[#0A1E4A] group-hover/cta:translate-x-0.5 transition-all duration-150" />
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
