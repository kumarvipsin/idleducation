"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared Video Modal Backdrop Overlay:
 * - Covers full viewport including the sticky header and floating widgets (layered at z-[100]).
 * - Moderate dark translucent overlay (bg-slate-950/60 on mobile, bg-slate-950/50 on desktop).
 * - Subtle backdrop blur (2px) ensuring the underlying page remains recognizable.
 */
export const VideoModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-slate-950/60 sm:bg-slate-950/50 backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
      className
    )}
    {...props}
  />
));
VideoModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface VideoModalDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  hideCloseButton?: boolean;
}

/**
 * Shared Video Modal Container:
 * - Dedicated IDL media viewer shell for Topper Stories and Video Testimonials.
 * - Viewport-aware centering with safe 24-40px margins and safe-area-inset support.
 * - STRICT CLOSE BEHAVIOR: Backdrop clicks do NOT close modal (onPointerDownOutside / onInteractOutside blocked).
 * - Closes ONLY via the explicit top-right X button.
 * - Preserves native media aspect ratio without distortion or cropping.
 * - Smooth 180-220ms open transition (fade + subtle scale).
 */
export const VideoModalDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  VideoModalDialogContentProps
>(
  (
    {
      className,
      children,
      hideCloseButton = false,
      onPointerDownOutside,
      onInteractOutside,
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => (
    <DialogPrimitive.Portal>
      <VideoModalOverlay />
      {/* Viewport-aware Centering Container with safe margins & safe-area insets */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-3.5 sm:p-5 md:p-6 lg:p-8 pointer-events-none overscroll-contain pt-[max(0.875rem,env(safe-area-inset-top))] pb-[max(0.875rem,env(safe-area-inset-bottom))] pl-[max(0.875rem,env(safe-area-inset-left))] pr-[max(0.875rem,env(safe-area-inset-right))]">
        <DialogPrimitive.Content
          ref={ref}
          // STRICT CLOSE BEHAVIOR: Backdrop clicks/taps MUST NOT close the viewer
          onPointerDownOutside={(e) => {
            e.preventDefault();
            onPointerDownOutside?.(e);
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
            onInteractOutside?.(e);
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            onOpenAutoFocus?.(e);
          }}
          className={cn(
            "pointer-events-auto relative shadow-2xl shadow-black/80 rounded-2xl sm:rounded-3xl ring-1 ring-white/15 bg-black overflow-hidden flex flex-col my-auto border-0",
            // Controlled, consistent animations: 180-220ms subtle fade + slight scale
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:zoom-out-[0.98] duration-200 ease-out",
            className
          )}
          {...props}
        >
          {children}
          {!hideCloseButton && (
            <DialogPrimitive.Close
              aria-label="Close video viewer"
              className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white/90 hover:text-white ring-1 ring-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95 z-30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X className="h-4 w-4 stroke-[2.2]" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
);
VideoModalDialogContent.displayName = "VideoModalDialogContent";
