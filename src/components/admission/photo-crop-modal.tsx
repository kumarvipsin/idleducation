"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Check, 
  Crop as CropIcon, 
  RotateCcw,
  Move,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string, fileBlob: File) => void;
}

// Passport aspect ratio 3.5 : 4.5
const FRAME_WIDTH = 210;
const FRAME_HEIGHT = 270;
// 300 DPI standard digital passport resolution
const CANVAS_EXPORT_WIDTH = 420;
const CANVAS_EXPORT_HEIGHT = 540;

export function PhotoCropModal({
  isOpen,
  imageSrc,
  onClose,
  onApplyCrop,
}: PhotoCropModalProps) {
  const [scale, setScale] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Drag & Pinch zoom pointer tracking
  const [isDragging, setIsDragging] = useState(false);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const lastPinchDistRef = useRef<number | null>(null);

  // Load and decode the image source
  useEffect(() => {
    if (!isOpen || !imageSrc) {
      activePointersRef.current.clear();
      lastPinchDistRef.current = null;
      setIsDragging(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    setExportError(null);
    setScale(1.0);
    setOffset({ x: 0, y: 0 });
    setRotation(0);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setNaturalSize({
        w: img.naturalWidth || img.width,
        h: img.naturalHeight || img.height,
      });
      setIsLoading(false);
    };
    img.onerror = () => {
      setLoadError("Unable to load this photo. Please choose another image.");
      setIsLoading(false);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Clean up pointer capture states on close
  useEffect(() => {
    if (!isOpen) {
      activePointersRef.current.clear();
      lastPinchDistRef.current = null;
      setIsDragging(false);
    }
  }, [isOpen]);

  // Calculate Base Rendered Dimensions so the image strictly covers the 210x270 crop frame
  const { baseW, baseH, maxOffsetX, maxOffsetY } = useMemo(() => {
    if (!naturalSize || naturalSize.w <= 0 || naturalSize.h <= 0) {
      return { baseW: FRAME_WIDTH, baseH: FRAME_HEIGHT, maxOffsetX: 0, maxOffsetY: 0 };
    }

    const isRotated90 = rotation % 180 !== 0;
    const effW = isRotated90 ? naturalSize.h : naturalSize.w;
    const effH = isRotated90 ? naturalSize.w : naturalSize.h;

    // Minimum scale required so that effective width >= 210 and effective height >= 270
    const coverScale = Math.max(FRAME_WIDTH / effW, FRAME_HEIGHT / effH);
    const bW = naturalSize.w * coverScale;
    const bH = naturalSize.h * coverScale;

    // Rendered size at current scale & rotation
    const curW = (isRotated90 ? bH : bW) * scale;
    const curH = (isRotated90 ? bW : bH) * scale;

    const mX = Math.max(0, (curW - FRAME_WIDTH) / 2);
    const mY = Math.max(0, (curH - FRAME_HEIGHT) / 2);

    return {
      baseW: bW,
      baseH: bH,
      maxOffsetX: mX,
      maxOffsetY: mY,
    };
  }, [naturalSize, rotation, scale]);

  // Ensure current offset never reveals blank space outside the crop frame
  const clampedOffset = useMemo(() => {
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y)),
    };
  }, [offset, maxOffsetX, maxOffsetY]);

  // Keep offset state within boundaries when scale or rotation changes
  useEffect(() => {
    setOffset((prev) => ({
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, prev.x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, prev.y)),
    }));
  }, [maxOffsetX, maxOffsetY]);

  // Unified Pointer Event Handlers for Dragging inside Crop Frame
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLoading || !!loadError || e.button !== 0) return;
    e.preventDefault();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsDragging(true);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: clampedOffset.x,
      startY: clampedOffset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(e.pointerId)) return;
    e.preventDefault();

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Multi-touch pinch zoom
    if (activePointersRef.current.size === 2) {
      const points = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      if (lastPinchDistRef.current !== null) {
        const delta = dist - lastPinchDistRef.current;
        setScale((prev) => Math.min(3.0, Math.max(1.0, parseFloat((prev + delta * 0.008).toFixed(2)))));
      }
      lastPinchDistRef.current = dist;
    } else if (activePointersRef.current.size === 1 && isDragging) {
      // Single pointer pan
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newX = dragStartRef.current.startX + dx;
      const newY = dragStartRef.current.startY + dy;

      setOffset({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }

    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      lastPinchDistRef.current = null;
    }
    if (activePointersRef.current.size === 0) {
      setIsDragging(false);
    }
  };

  // Mouse wheel zoom inside crop frame
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setScale((prev) => Math.min(3.0, Math.max(1.0, parseFloat((prev + delta).toFixed(2)))));
  };

  // Reset to initial centered & 100% cover position
  const handleReset = () => {
    setScale(1.0);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setExportError(null);
  };

  // Real Canvas Crop & High-Resolution Export (Passport 3.5 : 4.5)
  const handleConfirmCrop = async () => {
    if (!imageSrc || !imgRef.current || isProcessing || isLoading || !!loadError) return;

    setIsProcessing(true);
    setExportError(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_EXPORT_WIDTH;
      canvas.height = CANVAS_EXPORT_HEIGHT;
      const ctx = canvas.getContext("2d", { willReadFrequently: false });
      if (!ctx) {
        throw new Error("Could not initialize 2D canvas context");
      }

      // Crisp solid background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, CANVAS_EXPORT_WIDTH, CANVAS_EXPORT_HEIGHT);

      ctx.save();
      // Move context to exact canvas center
      ctx.translate(CANVAS_EXPORT_WIDTH / 2, CANVAS_EXPORT_HEIGHT / 2);

      // Multiplier from visual frame to high-res canvas (420 / 210 = 2)
      const multiplier = CANVAS_EXPORT_WIDTH / FRAME_WIDTH;
      ctx.translate(clampedOffset.x * multiplier, clampedOffset.y * multiplier);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      const drawW = baseW * multiplier;
      const drawH = baseH * multiplier;
      ctx.drawImage(imgRef.current, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.95);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
      );

      if (!blob) {
        throw new Error("Failed to generate cropped image blob");
      }

      const file = new File([blob], "student-passport-photo.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      onApplyCrop(croppedDataUrl, file);
    } catch (err) {
      console.error("Failed to crop photo:", err);
      setExportError("Unable to process cropped photo. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Dimmed backdrop at z-[240] */}
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-[240] bg-slate-950/70 backdrop-blur-[2px] transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-150 pointer-events-auto"
        />

        {/* Modal Container: Flex Centering wrapper at z-[250] */}
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-5 pointer-events-none overscroll-contain">
          <DialogPrimitive.Content
            onPointerDownOutside={(e) => {
              // Prevent accidental backdrop dismissal during dragging
              e.preventDefault();
            }}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="pointer-events-auto relative w-full max-w-[460px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150"
          >
            {/* HEADER */}
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#102A68]/10 dark:bg-blue-400/10 text-[#102A68] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <CropIcon className="w-4 h-4" />
                </div>
                <div>
                  <DialogPrimitive.Title className="text-[15px] sm:text-[16px] font-bold text-[#18233A] dark:text-white leading-none">
                    Adjust Photo
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Standard 3.5 × 4.5 cm passport frame
                  </DialogPrimitive.Description>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer pointer-events-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MAIN CROP CANVAS AREA */}
            <div className="p-4 sm:p-5 flex flex-col items-center justify-center bg-slate-100/80 dark:bg-slate-950/70">
              {/* Passport-size crop frame (210px x 270px -> strictly 3.5 : 4.5 ratio) */}
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                style={{ width: `${FRAME_WIDTH}px`, height: `${FRAME_HEIGHT}px`, touchAction: "none" }}
                className={cn(
                  "relative overflow-hidden rounded-xl border-2 border-[#102A68] dark:border-blue-400 bg-slate-950 shadow-xl select-none",
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                title="Drag to reposition photo, scroll/pinch to zoom"
              >
                {isLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="text-[11px] font-medium">Loading photo...</span>
                  </div>
                ) : loadError ? (
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center gap-2 text-rose-400">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <span className="text-[11px] font-medium leading-relaxed">{loadError}</span>
                  </div>
                ) : (
                  <>
                    {/* Live Movable & Zoomable Image */}
                    <img
                      src={imageSrc}
                      alt="Croppable student preview"
                      draggable={false}
                      className="absolute top-1/2 left-1/2 origin-center max-w-none pointer-events-none select-none"
                      style={{
                        width: `${baseW}px`,
                        height: `${baseH}px`,
                        transform: `translate(-50%, -50%) translate(${clampedOffset.x}px, ${clampedOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
                        transition: isDragging ? "none" : "transform 0.05s ease-out",
                      }}
                    />

                    {/* Passport Guidelines Overlay */}
                    <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-lg">
                      {/* Face placement oval */}
                      <div className="absolute top-[14%] left-[20%] w-[60%] h-[62%] border border-dashed border-white/85 rounded-[50%] shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
                      {/* Eye level line */}
                      <div className="absolute top-[38%] left-[22%] right-[22%] border-b border-white/40" />
                      {/* Chin line */}
                      <div className="absolute bottom-[20%] left-[30%] right-[30%] border-b border-white/40" />
                    </div>

                    {/* Helper Floating Badge */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-xs text-white text-[9px] font-semibold px-2.5 py-0.5 rounded-full pointer-events-none flex items-center gap-1 shadow-md">
                      <Move className="w-2.5 h-2.5" />
                      <span>Drag to Center Face</span>
                    </div>
                  </>
                )}
              </div>

              {exportError && (
                <p className="text-[11px] font-semibold text-rose-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {exportError}
                </p>
              )}

              {/* CROP CONTROLS PANEL */}
              <div className="w-full mt-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                {/* Zoom Slider + Minus/Plus Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isLoading || !!loadError}
                    onClick={() => setScale((s) => Math.max(1.0, +(s - 0.1).toFixed(2)))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#102A68] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer pointer-events-auto"
                    title="Zoom Out"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.05"
                    disabled={isLoading || !!loadError}
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1 accent-[#102A68] dark:accent-blue-400 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer disabled:opacity-40 pointer-events-auto"
                    aria-label="Zoom photo"
                  />

                  <button
                    type="button"
                    disabled={isLoading || !!loadError}
                    onClick={() => setScale((s) => Math.min(3.0, +(s + 0.1).toFixed(2)))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#102A68] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer pointer-events-auto"
                    title="Zoom In"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 w-9 text-right font-mono">
                    {Math.round(scale * 100)}%
                  </span>
                </div>

                {/* Rotation & Reset Row */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[12px]">
                  <button
                    type="button"
                    disabled={isLoading || !!loadError}
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="h-7 px-2 text-slate-600 dark:text-slate-300 hover:text-[#102A68] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md flex items-center gap-1 font-medium transition-colors disabled:opacity-40 cursor-pointer pointer-events-auto"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate 90°</span>
                    {rotation > 0 && <span className="text-[10px] text-slate-400 font-mono">({rotation}°)</span>}
                  </button>

                  <button
                    type="button"
                    disabled={isLoading || !!loadError}
                    onClick={handleReset}
                    className="h-7 px-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md flex items-center gap-1 font-medium transition-colors disabled:opacity-40 cursor-pointer pointer-events-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="rounded-xl h-9 sm:h-10 px-4 text-[13px] font-semibold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer pointer-events-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isLoading || !!loadError || isProcessing}
                onClick={handleConfirmCrop}
                className="rounded-xl h-9 sm:h-10 px-5 text-[13px] font-bold bg-[#102A68] hover:bg-[#102A68]/90 text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 pointer-events-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Use Photo</span>
                  </>
                )}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
