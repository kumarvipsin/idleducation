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
      className="relative w-full pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12 bg-white overflow-hidden"
    >
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
      </div>
    </section>
  );
}
