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
      <div className="group/card h-full w-full flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_12px_-3px_rgba(6,43,103,0.08)] hover:shadow-[0_8px_32px_-6px_rgba(6,43,103,0.14)] hover:-translate-y-[3px] transition-all duration-200 ease-out overflow-hidden">

        {/* ── IMAGE BLOCK ── */}
        <div
          className="relative w-full aspect-[4/4.5] shrink-0 overflow-hidden"
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

          {/* ── PLAY BUTTON: bottom-right corner — clean transparent round play icon ── */}
          <button
            type="button"
            onClick={() => videoId ? setIsVideoOpen(true) : undefined}
            disabled={!videoId}
            aria-label={`Watch introduction of ${teacher.name}`}
            className={`absolute bottom-3 right-3 z-30 w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full bg-white/20 flex items-center justify-center transition-all duration-200 ${
              videoId 
                ? 'cursor-pointer hover:bg-white/30 hover:scale-105 active:scale-95' 
                : 'cursor-default opacity-40'
            }`}
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white ml-[1.5px]" />
          </button>
        </div>

        {/* ── CARD BODY — Premium lower section ── */}
        <div className="flex flex-col flex-1 px-4 pt-3.5 pb-3.5">

          {/* NAME — Dominant anchor, bold geometric sans, dark navy */}
          <h3 className="font-extrabold text-[17px] sm:text-[18px] text-[#0A1E42] tracking-[-0.025em] leading-[1.15] text-center w-full">
            {teacher.name}
          </h3>

          {/* METADATA ROW — Experience • Subject in one elegant line */}
          <div className="flex items-center justify-center gap-1.5 mt-2 mb-0.5">
            {hasExp && (
              <>
                <span className="inline-flex items-center gap-[4px] text-[11px] font-semibold text-[#2D5BA9] tracking-[0.01em]">
                  <Clock className="w-[10px] h-[10px] shrink-0 stroke-[2.5] text-[#3B6FCF]" />
                  {expDisplay}
                </span>
                {(subjectLabel || designation) && (
                  <span className="text-[10px] text-slate-300 select-none" aria-hidden="true">•</span>
                )}
              </>
            )}
            {(subjectLabel || designation) && (
              <span className="text-[11px] font-medium text-[#3D506F] tracking-[0.005em]">
                {(subjectLabel || designation || '').replace(/^Maths$/i, 'Mathematics').replace(/^Phy$/i, 'Physics').replace(/^Chem$/i, 'Chemistry').replace(/^Bio$/i, 'Biology').replace(/^Eng$/i, 'English')}
              </span>
            )}
          </div>

          {/* SUBTLE SHORT DIVIDER — barely visible accent separator */}
          <div className="mt-auto pt-3">
            <div className="w-10 h-[0.5px] bg-slate-200/80 mx-auto mb-2.5" />

            {/* VIEW PROFILE CTA — clean text-based, IDL blue, refined arrow */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label={`View profile of ${teacher.name}`}
              className="w-full flex items-center justify-center gap-1 bg-transparent border-none p-0 cursor-pointer group/cta"
            >
              <span className="text-[12px] font-bold text-[#1A56DB] group-hover/cta:text-[#0D3B9E] transition-colors duration-150 tracking-[0.015em]">
                View Profile
              </span>
              <ArrowRight className="w-[11px] h-[11px] stroke-[2.8] text-[#1A56DB] group-hover/cta:text-[#0D3B9E] group-hover/cta:translate-x-0.5 transition-all duration-150" />
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
