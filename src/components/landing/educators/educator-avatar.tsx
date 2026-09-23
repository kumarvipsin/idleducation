'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSignedUrlForPdf } from "@/app/actions";

/* ─────────────────────────────────────────────────────────────
   TEACHER AVATAR IMAGE
───────────────────────────────────────────────────────────── */
export function TeacherAvatarImage({
  src,
  alt,
  photoPosition,
}: {
  src?: string;
  alt: string;
  photoPosition?: string;
}) {
  const [imgSrc, setImgSrc] = useState<string>(src || "");

  useEffect(() => {
    let active = true;
    const raw = src || "";
    if (raw.includes("storage.googleapis.com") && !raw.includes("GoogleAccessId=")) {
      getSignedUrlForPdf(raw).then((res) => {
        if (active && res.success && res.url) setImgSrc(res.url);
      });
    } else {
      setImgSrc(raw);
    }
    return () => {
      active = false;
    };
  }, [src]);

  const isGcs = imgSrc.includes("storage.googleapis.com") || imgSrc.includes("GoogleAccessId=");

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 33vw"
      className="object-cover object-top transition-transform duration-300 ease-out group-hover/card:scale-[1.025]"
      style={photoPosition ? { objectPosition: photoPosition } : undefined}
      unoptimized={isGcs}
      onError={() => setImgSrc("")}
    />
  );
}
