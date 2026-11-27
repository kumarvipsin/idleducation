'use client';

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PayFeeCard } from "@/components/pay-fee-card";

export default function PayFeePage() {
  const cardRef = useRef<HTMLDivElement>(null);

  // On small screens, dock floating widgets in the open right space beside the footer Follow IDL row so they never overlap links or card inputs.
  const syncFloatingWidgets = useCallback(() => {
    if (typeof window === "undefined") return;
    const waBtn = document.getElementById("whatsapp-floating-btn");
    const aiBtn = document.getElementById("idl-ai-floating-btn");
    const resetInline = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("position");
      el.style.removeProperty("top");
      el.style.removeProperty("right");
      el.style.removeProperty("bottom");
    };

    if (window.innerWidth >= 768) {
      resetInline(waBtn);
      resetInline(aiBtn);
      return;
    }

    const footerEl = document.querySelector("footer");
    const socialAnchor = footerEl?.querySelector("[data-footer-social-slot]") as HTMLElement | null;
    const anchorEl = socialAnchor || footerEl;
    if (!anchorEl) return;

    const r = anchorEl.getBoundingClientRect();
    const targetTop = Math.round(window.scrollY + r.bottom - (socialAnchor ? 48 : 88));

    if (waBtn) {
      waBtn.style.position = "absolute";
      waBtn.style.top = `${targetTop}px`;
      waBtn.style.right = "16px";
      waBtn.style.bottom = "auto";
    }
    if (aiBtn) {
      aiBtn.style.position = "absolute";
      aiBtn.style.top = `${targetTop + 10}px`;
      aiBtn.style.right = "74px";
      aiBtn.style.bottom = "auto";
    }
  }, []);

  useEffect(() => {
    syncFloatingWidgets();
    const rafId = window.requestAnimationFrame(syncFloatingWidgets);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncFloatingWidgets)
        : null;
    const footerEl = document.querySelector("footer");
    if (resizeObserver && cardRef.current) resizeObserver.observe(cardRef.current);
    if (resizeObserver && footerEl) resizeObserver.observe(footerEl);

    const mutationObserver = new MutationObserver(syncFloatingWidgets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", syncFloatingWidgets);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", syncFloatingWidgets);
      [document.getElementById("whatsapp-floating-btn"), document.getElementById("idl-ai-floating-btn")].forEach(
        (el) => {
          if (!el) return;
          el.style.removeProperty("position");
          el.style.removeProperty("top");
          el.style.removeProperty("right");
          el.style.removeProperty("bottom");
        }
      );
    };
  }, [syncFloatingWidgets]);

  return (
    <div className="bg-white dark:bg-background antialiased">
      {/* CENTERED PAY STUDENT FEE PORTAL CARD */}
      <section className="relative overflow-hidden py-6 sm:py-8 lg:py-12 lg:min-h-[calc(100vh-360px)] bg-gradient-to-b from-[#FFFFFF] via-[#F9FBFE] via-65% to-[#FFFFFF] dark:from-[#070C18] dark:to-background flex items-start justify-center">
        {/* Centered Subtle Pale-Blue Ambient Wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 46% 58% at 50% 50%, rgba(219, 234, 254, 0.34) 0%, rgba(239, 246, 255, 0.14) 48%, transparent 72%)",
          }}
        />

        {/* Restrained Centered Low-Opacity Dot Grid Texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#0B1F4B0a_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#ffffff09_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_64%_68%_at_50%_50%,#000_34%,transparent_90%)] opacity-50"
        />

        <div className="w-full md:container mx-auto px-4 md:px-6 relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={syncFloatingWidgets}
            className="w-full max-w-[520px] sm:max-w-[540px] mx-auto relative"
          >
            <div
              ref={cardRef}
              data-pay-fee-card
              className="relative rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#DCE7F6] dark:border-slate-800/85 shadow-none overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3.5 bg-gradient-to-b from-[#F8FBFF]/80 to-white/95 dark:from-slate-900 dark:to-slate-900 border-b border-[#EBF2FC] dark:border-slate-800/75 text-left">
                <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.018em] text-[#0B1F4B] dark:text-white leading-snug">
                  Pay Student Fee
                </h1>
                <p className="mt-1 text-[12.5px] sm:text-[13.5px] font-medium text-[#526789] dark:text-slate-400 leading-relaxed">
                  Enter details to verify &amp; pay fee.
                </p>
              </div>

              {/* Card Body */}
              <div className="px-5 sm:px-7 pt-3.5 sm:pt-5 pb-5 sm:pb-6">
                <PayFeeCard embedded />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
