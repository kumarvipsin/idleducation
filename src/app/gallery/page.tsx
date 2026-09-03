'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getGalleryImages } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';

type GalleryImage = {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  category: string;
  className?: string;
};

/* Shared protection props to block right-click, drag, selection */
const imgProtectionProps = {
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  onDragStart: (e: React.DragEvent) => e.preventDefault(),
  draggable: false,
} as const;

function GalleryMasonryImage({ src, alt }: { src?: string; alt: string }) {
  const protectedClass = "w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105 block select-none pointer-events-none";
  const renderImg = () => {
    if (!src) {
      return <Image src="/idlbranch.png" alt={alt} width={800} height={600} className={protectedClass} />;
    }
    if ((src.startsWith('/') || src.startsWith('http')) && !src.includes('storage.googleapis.com')) {
      return <Image src={src} alt={alt} width={800} height={600} className={protectedClass} unoptimized={src.startsWith('http')} />;
    }
    return <GcsImage filePath={src} alt={alt} width={800} height={600} className={protectedClass} />;
  };
  return (
    <div className="relative" {...imgProtectionProps} style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}>
      {renderImg()}
      {/* Invisible overlay to block direct image interaction */}
      <div className="absolute inset-0 z-[1]" />
    </div>
  );
}

/* Lightbox-specific image renderer — no rounded corners, no hover effects, fully protected */
function LightboxImage({ src, alt }: { src?: string; alt: string }) {
  const imgClass = "max-w-full max-h-full object-contain select-none pointer-events-none";
  const renderImg = () => {
    if (!src) {
      return <Image src="/idlbranch.png" alt={alt} width={1600} height={1200} className={imgClass} />;
    }
    if ((src.startsWith('/') || src.startsWith('http')) && !src.includes('storage.googleapis.com')) {
      return <Image src={src} alt={alt} width={1600} height={1200} className={imgClass} unoptimized={src.startsWith('http')} />;
    }
    return <GcsImage filePath={src} alt={alt} width={1600} height={1200} className={imgClass} />;
  };
  return (
    <div className="relative" {...imgProtectionProps} style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}>
      {renderImg()}
      <div className="absolute inset-0 z-[1]" />
    </div>
  );
}

function GalleryPageContent() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  // Interactive Lightbox Zoom & Rotation States
  const [zoomScale, setZoomScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Pan/Drag states
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const result = await getGalleryImages();
      if (result.success && result.data) {
        setImages(result.data as GalleryImage[]);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);
  
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const galleryCategories = ['All', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

  const filteredImages = images.filter(image =>
    (selectedCategory === 'All' || image.category === selectedCategory) &&
    (image.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setZoomScale(1);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
    setShowControls(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setZoomScale(1);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  // Auto-hide controls after inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  // Mouse drag handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  }, [zoomScale, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch drag handlers for mobile panning
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoomScale <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
  }, [zoomScale, panOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Scroll-to-zoom on the lightbox
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    resetControlsTimer();
    setZoomScale(prev => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      return Math.min(Math.max(prev + delta, 0.5), 4);
    });
  }, [resetControlsTimer]);

  // Reset pan when zoom returns to 1
  useEffect(() => {
    if (zoomScale <= 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoomScale]);

  const isZoomed = zoomScale > 1;

  // Block keyboard shortcuts for saving/printing/screenshot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S, Ctrl+Shift+S, Ctrl+P, PrintScreen, Ctrl+Shift+I (DevTools)
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 's' || e.key === 'S')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);
  
  return (
    <div 
      className="relative bg-white dark:bg-background pb-20 min-h-screen" 
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' } as React.CSSProperties}
    >
      
      {/* Header Container */}
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-2">

        {/* Compact Search & Category Row (Matching IDL Blog) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-border/40 pb-4 mb-8">
          
          {/* Category Filter Pills */}
          <div className="overflow-x-auto pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-4 whitespace-nowrap">
              {galleryCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "relative px-0.5 pb-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer bg-transparent border-none outline-none shadow-none",
                    selectedCategory === category 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {category}
                  {selectedCategory === category && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal Expandable Search Icon (Identical to IDL Blog) */}
          <div className="relative flex items-center justify-end shrink-0">
            <div 
              className={cn(
                "flex items-center transition-all duration-300 ease-in-out rounded-full bg-transparent border-none shadow-none outline-none overflow-hidden",
                isSearchOpen || searchTerm ? "w-56 sm:w-64 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80" : "w-9 h-9 justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shrink-0 p-1 cursor-pointer border-none outline-none shadow-none focus:outline-none focus:ring-0"
                aria-label="Search gallery"
              >
                <Search className="h-4 w-4" />
              </button>
              
              {(isSearchOpen || searchTerm) && (
                <Input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => { if (!searchTerm) setIsSearchOpen(false); }}
                  className="flex-1 border-0 shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs placeholder:text-muted-foreground/70 bg-transparent h-8 px-2"
                  autoFocus
                />
              )}

              {searchTerm && (
                <button 
                  onClick={() => { setSearchTerm(''); setIsSearchOpen(false); }} 
                  className="text-muted-foreground hover:text-foreground shrink-0 p-1 cursor-pointer border-none outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
        
      {/* Main Gallery Masonry Grid */}
      <main className="container mx-auto px-4 md:px-6">
          <Dialog open={!!selectedImage} onOpenChange={(open) => !open && handleCloseModal()}>
              {loading ? (
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                      {[...Array(8)].map((_, i) => <Skeleton key={i} className="w-full h-64 rounded-2xl break-inside-avoid mb-4" />)}
                  </div>
              ) : filteredImages.length > 0 ? (
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                      {filteredImages.map((image, index) => (
                          <div 
                              key={image.id || index}
                              onClick={() => handleOpenModal(image)}
                              className="break-inside-avoid mb-4 group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
                          >
                              <GalleryMasonryImage
                                  src={image.imageUrl}
                                  alt={image.alt || image.title}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 px-3 pt-5 pb-2">
                                  <span className="text-white/90 text-[10px] font-medium truncate leading-tight block">{image.title || image.category}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border my-6">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/40 mb-2" />
                      <h3 className="text-base font-bold text-foreground">No Gallery Images Found</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                          No images match your search for &quot;{searchTerm}&quot; in &quot;{selectedCategory}&quot;.
                      </p>
                      <Button 
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
                        variant="outline" 
                        className="mt-4 rounded-full text-xs font-bold h-9"
                      >
                        Reset Filters
                      </Button>
                  </div>
              )}

              {/* Immersive Fullscreen Lightbox — No extra margins, only image + controls */}
              <DialogContent 
                className="fixed inset-0 !max-w-none !w-screen !h-screen !rounded-none !p-0 !m-0 !translate-x-0 !translate-y-0 !top-0 !left-0 border-none bg-black/95 backdrop-blur-2xl shadow-none [&>button]:hidden data-[state=open]:!slide-in-from-bottom-0"
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                  {selectedImage && (
                      <div 
                        className="relative w-full h-full flex items-center justify-center overflow-hidden"
                        onMouseMove={() => resetControlsTimer()}
                        onTouchStart={() => resetControlsTimer()}
                      >
                          
                          {/* Floating Zoom & Control Toolbar — auto-hides */}
                          <div 
                            className={cn(
                              "fixed top-4 right-4 z-[100] flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-white/10 shadow-2xl transition-all duration-300",
                              showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                            )}
                          >
                            <button 
                              onClick={() => { setZoomScale(prev => Math.min(prev + 0.25, 4)); resetControlsTimer(); }}
                              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              title="Zoom In"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setZoomScale(prev => Math.max(prev - 0.25, 0.5)); resetControlsTimer(); }}
                              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              title="Zoom Out"
                            >
                              <ZoomOut className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setRotation(prev => (prev + 90) % 360); resetControlsTimer(); }}
                              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              title="Rotate"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setZoomScale(1); setRotation(0); setPanOffset({ x: 0, y: 0 }); resetControlsTimer(); }}
                              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              title="Reset"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-white/20 mx-0.5" />
                            <button 
                              onClick={handleCloseModal}
                              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              title="Close"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Zoom level indicator — bottom-left, subtle */}
                          <div 
                            className={cn(
                              "fixed bottom-4 left-4 z-[100] flex items-center gap-2 bg-black/50 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 transition-all duration-300",
                              showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                            )}
                          >
                            <span className="text-white/60 text-[11px] font-medium">{Math.round(zoomScale * 100)}%</span>
                            {isZoomed && (
                              <span className="flex items-center gap-1 text-white/40 text-[10px]">
                                <Move className="w-3 h-3" /> Drag to pan
                              </span>
                            )}
                          </div>

                          <DialogHeader className="sr-only">
                              <DialogTitle>{selectedImage.title}</DialogTitle>
                              <DialogDescription>
                                  View full size image of {selectedImage.title} from the {selectedImage.category} collection.
                              </DialogDescription>
                          </DialogHeader>

                          {/* Draggable + Zoomable Image Canvas */}
                          <div 
                            className={cn(
                              "w-full h-full flex items-center justify-center",
                              isZoomed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
                            )}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onWheel={handleWheel}
                          >
                              <div 
                                className="flex items-center justify-center"
                                style={{ 
                                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale}) rotate(${rotation}deg)`,
                                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                                  willChange: 'transform',
                                }}
                              >
                                <LightboxImage 
                                    src={selectedImage.imageUrl} 
                                    alt={selectedImage.alt || selectedImage.title} 
                                />
                              </div>
                          </div>

                      </div>
                  )}
              </DialogContent>
          </Dialog>
      </main>
    </div>
  );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-12 px-4 text-center">Loading Gallery...</div>}>
            <GalleryPageContent />
        </Suspense>
    );
}