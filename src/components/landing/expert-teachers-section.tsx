'use client';

import React, { useEffect, useState, useCallback } from "react";
import { CarouselApi } from "@/components/ui/carousel";
import type { TExpertTeacher } from "@/app/actions/types";
import {
  EducatorsHeader,
  EducatorsCarousel,
} from "./educators";

// Re-export educator subcomponents for direct usage and customization
export * from "./educators";

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION COMPONENT: Meet Our Educators
───────────────────────────────────────────────────────────── */
export function ExpertTeachersSection({ teachers }: { teachers?: TExpertTeacher[] }) {
  const [loading, setLoading] = useState(!teachers);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (teachers) setLoading(false);
  }, [teachers]);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
  }, [api]);

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  const teacherList = teachers && teachers.length > 0 ? teachers : [];

  return (
    <section
      id="expert-teachers"
      className="relative w-full py-10 sm:py-12 md:py-16 bg-[#FAFBFE] overflow-hidden"
    >
      {/* Subtle decorative background ambient glow */}
      <div
        className="absolute top-12 left-0 w-[300px] h-[300px] rounded-full bg-[#E8EEFF]/40 blur-[100px] pointer-events-none -translate-x-1/3"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-8 right-0 w-[280px] h-[280px] rounded-full bg-[#E8EEFF]/35 blur-[100px] pointer-events-none translate-x-1/4"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1280px]">
        {/* ── 1. HEADER ELEMENT ── */}
        <EducatorsHeader
          titlePrefix="Meet Our "
          titleHighlight="Educators"
          showNavigation={false}
        />

        {/* ── 2. CAROUSEL & CARDS ELEMENT ── */}
        <EducatorsCarousel
          teachers={teacherList}
          loading={loading}
          setApi={setApi}
          api={api}
          current={current}
          count={count}
          scrollTo={scrollTo}
        />

        {/* ── 3. VIEW ALL LINK ── */}
        <div className="flex justify-center mt-4 sm:mt-5">
          <span className="text-[14px] sm:text-[15px] font-bold text-[#062B67] cursor-default select-none tracking-tight">
            View All Educators →
          </span>
        </div>
      </div>
    </section>
  );
}
