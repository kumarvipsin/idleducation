"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared Form Modal Backdrop Overlay:
 * - Covers full viewport including the z-[60] sticky website header.
 * - Subtle dark tint + subtle blur, recognizable background.
 * - Layered at z-[100].
 */
export const FormModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
      className
    )}
    {...props}
  />
));
FormModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface FormModalDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  maxWidthClass?: string;
  hideCloseButton?: boolean;
}

/**
 * Shared Form Modal Container:
 * - Uses ONE shared layout and positioning system across all IDL form modals.
 * - Mathematically centered horizontally and vertically in the viewport.
 * - Safe 24-32px margins from all viewport edges; never touches or crosses viewport edges.
 * - Responsive max-height based on 100dvh with safe-area handling.
 * - Internal scroll only for modal body; header and footer remain visually pinned.
 * - STRICT CLOSE BEHAVIOR: Backdrop clicks do NOT close modal (onPointerDownOutside / onInteractOutside prevented).
 * - Modal closes ONLY via the explicit top-right 'X' button or explicit inside buttons.
 * - Smooth open (fade + subtle upward movement) and close (fade + subtle downward movement) animations.
 */
export const FormModalDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  FormModalDialogContentProps
>(
  (
    {
      className,
      children,
      maxWidthClass = "max-w-[800px]",
      hideCloseButton = false,
      onPointerDownOutside,
      onInteractOutside,
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => (
    <DialogPrimitive.Portal>
      <FormModalOverlay />
      {/* Viewport-aware Centering Flex Container: Guarantees 24-32px safe spacing from all edges */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 pointer-events-none overscroll-contain">
        <DialogPrimitive.Content
          ref={ref}
          // Prevent accidental backdrop closing: clicking outside MUST NOT dismiss the modal
          onPointerDownOutside={(e) => {
            e.preventDefault();
            onPointerDownOutside?.(e);
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
            onInteractOutside?.(e);
          }}
          onOpenAutoFocus={(e) => {
            // Prevent sudden jump to first field on open
            e.preventDefault();
            onOpenAutoFocus?.(e);
          }}
          className={cn(
            "pointer-events-auto relative w-[calc(100vw-1.5rem)] sm:w-[92vw] md:w-[88vw] shadow-2xl shadow-slate-950/20 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden flex flex-col",
            "max-h-[calc(100dvh-48px)] sm:max-h-[calc(100dvh-64px)] my-auto",
            // Controlled, consistent animations: subtle fade + small upward movement (open), subtle fade + small downward movement (close)
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 duration-200 ease-out",
            maxWidthClass,
            className
          )}
          {...props}
        >
          {children}
          {!hideCloseButton && (
            <DialogPrimitive.Close
              aria-label="Close modal"
              className="absolute right-3.5 sm:right-4 top-3.5 sm:top-4 w-8 h-8 rounded-lg flex items-center justify-center opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1F4FA3] focus:ring-offset-2 disabled:pointer-events-none z-30 cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
);
FormModalDialogContent.displayName = "FormModalDialogContent";
