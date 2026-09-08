'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseYouTubeUrl } from '@/lib/youtube';

interface CleanVideoPlayerProps {
  url: string;
  title?: string;
  onClose?: () => void;
  className?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    const remMins = mins % 60;
    return `${hrs}:${remMins < 10 ? '0' : ''}${remMins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function CleanVideoPlayer({
  url,
  title,
  onClose,
  className,
}: CleanVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Parse YouTube video & playlist IDs
  const parsed = parseYouTubeUrl(url);
  const videoId = parsed.videoId || '';
  const playlistId = parsed.playlistId || '';

  // Extract fallback embed URL
  const fallbackEmbedUrl = parsed.embedUrl || (videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url);

  // Auto-hide controls after inactivity
  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2800);
  }, []);

  // Fullscreen toggle with mobile landscape auto-rotate
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFs) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }

        // Auto-rotate device orientation to landscape
        try {
          if (screen.orientation && typeof (screen.orientation as any).lock === 'function') {
            await (screen.orientation as any).lock('landscape');
          } else if ((screen as any).lockOrientation) {
            (screen as any).lockOrientation('landscape');
          } else if ((screen as any).mozLockOrientation) {
            (screen as any).mozLockOrientation('landscape');
          }
        } catch (e) {
          // Orientation lock might be disabled on some desktop browsers
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }

        // Unlock orientation back to normal
        try {
          if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
            (screen.orientation as any).unlock();
          } else if ((screen as any).unlockOrientation) {
            (screen as any).unlockOrientation();
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Listen to fullscreen changes to sync state & unlock orientation on exit
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
      if (!isFs) {
        try {
          if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
            (screen.orientation as any).unlock();
          }
        } catch (e) {}
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  // Initialize YouTube IFrame Player
  useEffect(() => {
    if (!videoId && !playlistId) {
      setApiFailed(true);
      return;
    }

    let isMounted = true;
    let fallbackTimeout = setTimeout(() => {
      if (isMounted && !isReady) {
        // Fallback to iframe if API takes longer than 4s
        setApiFailed(true);
      }
    }, 4000);

    const initPlayer = () => {
      if (!iframeContainerRef.current || !window.YT || !window.YT.Player) return;

      try {
        const playerElement = document.createElement('div');
        playerElement.id = `yt-player-${Math.random().toString(36).substring(7)}`;
        iframeContainerRef.current.innerHTML = '';
        iframeContainerRef.current.appendChild(playerElement);

        playerRef.current = new window.YT.Player(playerElement.id, {
          videoId: videoId || undefined,
          playerVars: {
            autoplay: 1,
            controls: 0,          // Removes YouTube's control bar, "More videos", & YouTube logo!
            rel: 0,               // No unrelated videos
            modestbranding: 1,    // Removes YouTube logo
            iv_load_policy: 3,    // No annotations
            fs: 0,                // Handled by custom button with auto-rotate
            disablekb: 1,         // Handled by our keyboard listener
            playsinline: 1,       // Prevent iOS native fullscreen take-over
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            ...(playlistId ? { listType: 'playlist', list: playlistId } : {}),
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              clearTimeout(fallbackTimeout);
              try {
                event.target.playVideo();
                const dur = event.target.getDuration();
                if (dur && dur > 0) setDuration(dur);
                if (event.target.isMuted()) setIsMuted(true);
              } catch (e) {}
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // 1: Playing, 2: Paused, 3: Buffering, 0: Ended
              if (event.data === 1) {
                setIsPlaying(true);
                setIsBuffering(false);
                const dur = event.target.getDuration();
                if (dur && dur > 0) setDuration(dur);
              } else if (event.data === 2) {
                setIsPlaying(false);
                setIsBuffering(false);
              } else if (event.data === 3) {
                setIsBuffering(true);
              } else if (event.data === 0) {
                setIsPlaying(false);
                setIsBuffering(false);
              }
            },
            onError: () => {
              if (isMounted) setApiFailed(true);
            },
          },
        });
      } catch (err) {
        console.error('Failed to create YouTube player:', err);
        if (isMounted) setApiFailed(true);
      }
    };

    // Load YouTube API script if not loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) initPlayer();
      };

      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [videoId, playlistId]);

  // Update progress bar tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      interval = setInterval(() => {
        try {
          const cur = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (typeof cur === 'number') setCurrentTime(cur);
          if (typeof dur === 'number' && dur > 0) setDuration(dur);
        } catch (e) {}
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Player action triggers
  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      triggerShowControls();
    } catch (err) {}
  };

  const handleSeek = (newTime: number) => {
    if (!playerRef.current) return;
    try {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
      triggerShowControls();
    } catch (err) {}
  };

  const handleSkip = (seconds: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!playerRef.current) return;
    try {
      const cur = playerRef.current.getCurrentTime() || currentTime;
      const target = Math.max(0, Math.min(duration, cur + seconds));
      handleSeek(target);
    } catch (err) {}
  };

  const handleToggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
      triggerShowControls();
    } catch (err) {}
  };

  // Keyboard controls (Space, Left, Right, F, M, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSkip(10);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleSkip, toggleFullscreen, handleToggleMute]);

  // If YouTube API fails (blocked or offline), render ultra-clean fallback iframe
  if (apiFailed) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-full aspect-video bg-black overflow-hidden select-none",
          className
        )}
      >
        <iframe
          src={`${fallbackEmbedUrl}${fallbackEmbedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
          title={title || "Video Player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-black/70 hover:bg-black/95 text-white ring-1 ring-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-all"
            aria-label="Close video"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    );
  }

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerShowControls}
      onTouchStart={triggerShowControls}
      onClick={handleTogglePlay}
      className={cn(
        "relative w-full h-full aspect-video bg-black overflow-hidden select-none group/player cursor-pointer",
        isFullscreen && "fixed inset-0 z-[99999] w-screen h-screen max-w-none max-h-none rounded-none aspect-auto",
        className
      )}
    >
      {/* ── 1. YouTube Iframe Layer (pointer-events-none prevents YouTube from showing "More videos" & logo on hover) ── */}
      <div
        ref={iframeContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none bg-black overflow-hidden flex items-center justify-center"
      />

      {/* ── 2. Loading Buffer Indicator ── */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white shadow-xl ring-1 ring-white/20 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        </div>
      )}

      {/* ── 3. Big Center Play Indicator (when paused) ── */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 pointer-events-none">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/75 backdrop-blur-md flex items-center justify-center text-white shadow-2xl ring-1 ring-white/30 transition-transform transform scale-100 hover:scale-110">
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* ── 4. Top Header with Close Button Only (Ultra-Clean, NO extra text) ── */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 z-40 flex items-center justify-end p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent transition-opacity duration-300 pointer-events-auto",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/95 text-white/90 hover:text-white ring-1 ring-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Close video"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* ── 5. Bottom Ultra-Clean Controls Bar (Only Play, Seek, Time, Bada/Chhota) ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute bottom-0 inset-x-0 z-40 flex flex-col justify-end px-3 sm:px-4 pb-2.5 sm:pb-3 pt-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 pointer-events-auto cursor-default",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Scrubber Progress Bar */}
        <div
          className="relative w-full h-3 sm:h-4 flex items-center cursor-pointer group/progress mb-1.5 sm:mb-2"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            handleSeek(Math.max(0, Math.min(duration, clickPos * duration)));
          }}
        >
          {/* Progress Track Background */}
          <div className="w-full h-1 sm:h-1.5 bg-white/25 rounded-full overflow-hidden transition-all group-hover/progress:h-2">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scrubber Handle Thumb */}
          <div
            className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white shadow-md transition-transform transform -translate-x-1/2 scale-0 group-hover/progress:scale-100"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2 text-white">
          {/* Left Actions: Play/Pause, Rewind, Fast Forward, Time, Mute */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current ml-0.5" />
              )}
            </button>

            {/* -10s Rewind */}
            <button
              type="button"
              onClick={(e) => handleSkip(-10, e)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* +10s Fast Forward */}
            <button
              type="button"
              onClick={(e) => handleSkip(10, e)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Fast forward 10 seconds"
              aria-label="Fast forward 10 seconds"
            >
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Mute / Volume */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Time Stamp (e.g. 02:29 / 09:48) */}
            <div className="text-[11px] sm:text-xs font-mono font-medium text-white/85 ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Action: Bada / Chhota (Fullscreen & Auto-Rotate to Landscape) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-8.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold text-[11px] sm:text-xs transition-all backdrop-blur-sm cursor-pointer shadow-sm"
              title={isFullscreen ? "Minimize (Chhota)" : "Full Size & Auto Rotate (Bada)"}
              aria-label={isFullscreen ? "Minimize video" : "Full size and auto rotate video"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chhota</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Size</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
