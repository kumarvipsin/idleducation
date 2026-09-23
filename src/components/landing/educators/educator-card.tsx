'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { TExpertTeacher } from "@/app/actions/types";
import { getSignedUrlForPdf } from "@/app/actions";
import {
  Award,
  GraduationCap,
  Clock,
  Calculator,
  BookOpen,
  BarChart3,
  Sparkles,
  Users,
  User,
  PlayCircle,
} from "lucide-react";
import {
  TEACHER_FALLBACK_IMAGES,
  getYouTubeId,
  formatExperience,
} from "./educator-constants";
import { EducatorVideoModal } from "./educator-video-modal";
import { EducatorProfileModal } from "./educator-profile-modal";

function getSubjectBadgeIcon(subject?: string | null) {
  if (!subject) return <BookOpen className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  const s = subject.toLowerCase();
  if (s.includes("econ") || s.includes("commerce")) {
    return <BarChart3 className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  if (s.includes("math") || s.includes("quant")) {
    return <Calculator className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  if (s.includes("social") || s.includes("history") || s.includes("geo") || s.includes("civics")) {
    return <BookOpen className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  if (s.includes("sci") || s.includes("phys") || s.includes("chem") || s.includes("bio")) {
    return <Sparkles className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  return <BookOpen className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
}

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
    return () => {
      active = false;
    };
  }, [rawPhoto, fallbackPhoto]);

  const displaySrc = imgSrc || fallbackPhoto;
  const hasPhoto = Boolean(displaySrc) && !imgError;

  // Subject label
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
      <div className="group/card h-full w-full flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_8px_-2px_rgba(6,43,103,0.06)] hover:shadow-[0_8px_28px_-6px_rgba(6,43,103,0.12)] hover:-translate-y-[2px] transition-all duration-200 ease-out overflow-hidden">
        
        {/* ── IMAGE BLOCK: Taller, Prominent & Uncluttered Portrait ── */}
        <div
          className="relative w-full aspect-[4/4.3] shrink-0 overflow-hidden bg-black"
          style={{
            background:
              "linear-gradient(145deg, #18181B 0%, #0F0F12 40%, #000000 100%)",
          }}
        >
          {/* Teacher photo */}
          {hasPhoto && (
            <div className="absolute inset-0 z-10">
              <Image
                src={displaySrc}
                alt={teacher.name}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 25vw"
                className="object-cover object-top transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
                style={
                  teacher.photoPosition
                    ? { objectPosition: teacher.photoPosition }
                    : undefined
                }
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

          {/* No-photo fallback icon */}
          {!hasPhoto && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Users className="w-16 h-16 text-white/15" />
            </div>
          )}

          {/* Bottom subtle gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-10 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ── CARD BODY ── */}
        <div className="flex flex-col flex-1 p-3.5 sm:p-4">
          
          {/* Subject Badge: Premium, clean tag above name */}
          {subjectLabel && (
            <div className="inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md bg-blue-50/90 text-[#155EEF] text-[10px] sm:text-[10.5px] font-bold tracking-[0.03em] uppercase border border-blue-100/90 mb-1.5">
              {getSubjectBadgeIcon(subjectLabel)}
              <span className="truncate max-w-[170px]">{subjectLabel}</span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-extrabold text-[15.5px] sm:text-[16.5px] text-[#062B67] tracking-[-0.02em] leading-snug truncate w-full shrink-0">
            {teacher.name}
          </h3>

          {/* Designation / Title */}
          {designation && (
            <p className="text-[11.5px] sm:text-[12px] text-slate-500 font-medium truncate mb-3 mt-0.5 shrink-0">
              {designation}
            </p>
          )}

          {/* Qual (Left) + Exp (Right) 2-column meta row */}
          {(hasQual || hasExp) && (
            <div className="flex items-start gap-2.5 sm:gap-3.5 mb-3.5 shrink-0">
              {/* Qualification First (Left) */}
              {hasQual && (
                <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                  <div className="flex items-center gap-[4px]">
                    <GraduationCap className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2]" />
                    <span
                      className="font-bold text-[12.5px] sm:text-[13px] text-[#062B67] leading-none truncate"
                      title={qualDisplay}
                    >
                      {qualDisplay}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-medium leading-none pl-[20px]">
                    Qualification
                  </span>
                </div>
              )}

              {/* Divider between Qual and Exp */}
              {hasQual && hasExp && (
                <div
                  className="w-px h-6 bg-slate-200/80 shrink-0 self-center"
                  aria-hidden="true"
                />
              )}

              {/* Experience Second (Right) */}
              {hasExp && (
                <div className="flex flex-col gap-[2px] min-w-0">
                  <div className="flex items-center gap-[4px]">
                    <Clock className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2]" />
                    <span className="font-bold text-[12.5px] sm:text-[13px] text-[#062B67] leading-none truncate">
                      {expDisplay}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-medium leading-none pl-[20px]">
                    Experience
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Footer: View Profile (Left) & Watch Intro (Right) */}
          <div className="flex items-center mt-auto pt-4 border-t border-slate-100 shrink-0 pb-1">
            {/* View Profile (Left) */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label={`View profile of ${teacher.name}`}
              className="flex-1 group flex items-center justify-center gap-2 cursor-pointer py-1 transition-opacity hover:opacity-80"
            >
              <div className="w-[28px] h-[28px] rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#155EEF] stroke-[2]" />
              </div>
              <span className="text-[13px] sm:text-[14.5px] font-bold text-[#062B67] whitespace-nowrap">
                View Profile
              </span>
            </button>

            <div className="w-px h-6 bg-slate-200 shrink-0" aria-hidden="true" />

            {/* Watch Intro (Right) */}
            <button
              type="button"
              onClick={() => videoId ? setIsVideoOpen(true) : undefined}
              aria-label={`Watch introduction of ${teacher.name}`}
              disabled={!videoId}
              className={`flex-1 group flex items-center justify-center gap-2 py-1 transition-opacity ${videoId ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-40'}`}
              title={!videoId ? "Intro video not available" : undefined}
            >
              <div className="w-[28px] h-[28px] rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0">
                <PlayCircle className={`w-4 h-4 ${videoId ? 'text-[#155EEF] stroke-[2]' : 'text-slate-400 stroke-[2]'}`} />
              </div>
              <span className={`text-[13px] sm:text-[14.5px] font-bold whitespace-nowrap ${videoId ? 'text-[#062B67]' : 'text-slate-500'}`}>
                Watch Intro
              </span>
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
