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

          {/* ── PLAY BUTTON: bottom-right corner — thicker clean outline ── */}
          <button
            type="button"
            onClick={() => videoId ? setIsVideoOpen(true) : undefined}
            disabled={!videoId}
            aria-label={`Watch introduction of ${teacher.name}`}
            className={`absolute bottom-3 right-3 z-30 w-[40px] h-[40px] rounded-full bg-black/20 backdrop-blur-[2px] border-2 border-white/90 flex items-center justify-center transition-all duration-200 ${videoId ? 'cursor-pointer hover:bg-black/30 hover:border-white hover:scale-105 active:scale-95' : 'cursor-default opacity-30'}`}
          >
            <Play
              className={`w-[13px] h-[13px] ml-[2px] ${videoId ? 'text-white fill-white' : 'text-white/40 fill-white/40'}`}
            />
          </button>
        </div>

        {/* ── CARD BODY ── */}
        <div className="flex flex-col flex-1 px-4 pt-4 pb-4">

          {/* NAME — Bold primary anchor */}
          <h3 className="font-bold text-[18px] sm:text-[19px] text-[#0C1F4A] tracking-[-0.02em] leading-[1.2] text-center w-full mb-2">
            {teacher.name}
          </h3>

          {/* EXPERIENCE BADGE — readable, anchored to name */}
          {hasExp && (
            <div className="flex justify-center mb-2.5">
              <span className="inline-flex items-center gap-[5px] px-2.5 py-[3px] rounded-full bg-[#EEF2FF] text-[#3B5EA6] text-[10.5px] font-semibold tracking-[0.02em]">
                <Clock className="w-[10px] h-[10px] shrink-0 stroke-[2.5]" />
                {expDisplay}
              </span>
            </div>
          )}

          {/* SUBJECT — medium weight, clearly readable */}
          {(subjectLabel || designation) && (
            <p className="text-[12.5px] text-[#4A5E82] font-medium text-center mb-1.5 leading-snug tracking-[0.005em]">
              {subjectLabel || designation}
            </p>
          )}


          {/* DIVIDER + VIEW PROFILE */}
          <div className="mt-auto pt-3.5">
            <div className="w-full h-px bg-slate-100 mb-3" />
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label={`View profile of ${teacher.name}`}
              className="w-full flex items-center justify-center gap-1 bg-transparent border-none p-0 cursor-pointer group"
            >
              <span className="text-[12.5px] font-semibold text-[#1A56DB] group-hover:text-[#0F3FA8] transition-colors duration-150 tracking-[0.01em]">
                View Profile
              </span>
              <ArrowRight className="w-3 h-3 stroke-[2.5] text-[#1A56DB] group-hover:text-[#0F3FA8] transition-colors duration-150" />
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
