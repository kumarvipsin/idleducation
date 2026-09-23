
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getCollection, addHeroSlide, editHeroSlide, deleteHeroSlide, getSignedUrlForPdf } from '@/app/actions';
import type { THeroSlide } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon, Upload, Monitor, Smartphone, Crop } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';
import { Textarea } from '@/components/ui/textarea';
import { PhotoCropModal } from '@/components/admission/photo-crop-modal';
import { cn } from '@/lib/utils';

const HeroSlideForm = ({
  slide,
  onSuccess,
}: {
  slide?: THeroSlide | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [desktopFileName, setDesktopFileName] = useState<string | null>(null);
  const [mobileFileName, setMobileFileName] = useState<string | null>(null);

  // Zoom & Crop states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<'desktop' | 'mobile'>('desktop');
  const [mobileCropRatio, setMobileCropRatio] = useState<'4:5' | '9:16' | '16:9'>('4:5');
  const [activeCropImage, setActiveCropImage] = useState<string | null>(null);
  const [croppedDesktopFile, setCroppedDesktopFile] = useState<File | null>(null);
  const [croppedMobileFile, setCroppedMobileFile] = useState<File | null>(null);

  const cropConfig = useMemo(() => {
    if (cropTarget === 'desktop') {
      return {
        frameWidth: 480,
        frameHeight: 200,
        canvasExportWidth: 1920,
        canvasExportHeight: 800,
        title: "Adjust Desktop Banner",
        subtitle: "Desktop Banner (Landscape 16:6.7) • Zoom in/out and drag to frame",
        fileName: "desktop-banner.jpg",
      };
    }
    if (mobileCropRatio === '9:16') {
      return {
        frameWidth: 216,
        frameHeight: 384,
        canvasExportWidth: 1080,
        canvasExportHeight: 1920,
        title: "Adjust Mobile Banner (9:16 Story)",
        subtitle: "Vertical Mobile Banner (Tall 9:16) • Zoom in/out and drag to frame",
        fileName: "mobile-banner.jpg",
      };
    }
    if (mobileCropRatio === '16:9') {
      return {
        frameWidth: 360,
        frameHeight: 202,
        canvasExportWidth: 1280,
        canvasExportHeight: 720,
        title: "Adjust Mobile Banner (16:9)",
        subtitle: "Horizontal Mobile Banner (16:9) • Zoom in/out and drag to frame",
        fileName: "mobile-banner.jpg",
      };
    }
    // Default: 4:5 Vertical Portrait
    return {
      frameWidth: 280,
      frameHeight: 350,
      canvasExportWidth: 1080,
      canvasExportHeight: 1350,
      title: "Adjust Mobile Vertical Banner (4:5)",
      subtitle: "Mobile Vertical Banner (Portrait 4:5 / 1080×1350) • Zoom in/out and drag to frame",
      fileName: "mobile-banner.jpg",
    };
  }, [cropTarget, mobileCropRatio]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    // If an image was interactively adjusted/cropped, apply the cropped file
    if (croppedDesktopFile) {
      formData.set('image', croppedDesktopFile);
    }
    if (croppedMobileFile) {
      formData.set('mobileImage', croppedMobileFile);
    }

    const apiCall = slide
      ? editHeroSlide(slide.id, formData)
      : addHeroSlide(formData);

    const result = await apiCall;

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  const handleDesktopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setDesktopPreview(dataUrl);
        setDesktopFileName(file.name);
        setActiveCropImage(dataUrl);
        setCropTarget('desktop');
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setMobilePreview(dataUrl);
        setMobileFileName(file.name);
        setActiveCropImage(dataUrl);
        setCropTarget('mobile');
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCrop = async (target: 'desktop' | 'mobile') => {
    setCropTarget(target);
    if (target === 'desktop') {
      if (desktopPreview) {
        setActiveCropImage(desktopPreview);
        setIsCropOpen(true);
      } else if (slide?.imageUrl) {
        setActiveCropImage(`/api/image-proxy?path=${encodeURIComponent(slide.imageUrl)}`);
        setIsCropOpen(true);
      }
    } else {
      if (mobilePreview) {
        setActiveCropImage(mobilePreview);
        setIsCropOpen(true);
      } else if (slide?.mobileImageUrl) {
        setActiveCropImage(`/api/image-proxy?path=${encodeURIComponent(slide.mobileImageUrl)}`);
        setIsCropOpen(true);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ScrollArea className="max-h-[68vh] pr-3">
          <div className="flex flex-col gap-4 py-1">
            {/* Top Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="title" className="text-xs font-bold text-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input id="title" name="title" defaultValue={slide?.title} placeholder="e.g. NEET 2026-27 Prep" required className="h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="order" className="text-xs font-bold text-foreground">
                  Display Order
                </Label>
                <Input id="order" name="order" type="number" defaultValue={slide?.order ?? 1} className="h-9" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="buttonText" className="text-xs font-bold text-foreground">
                  Button Text (Optional)
                </Label>
                <Input id="buttonText" name="buttonText" defaultValue={slide?.buttonText} placeholder="e.g. Enroll Now" className="h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="buttonLink" className="text-xs font-bold text-foreground">
                  Button Link (Optional)
                </Label>
                <Input id="buttonLink" name="buttonLink" defaultValue={slide?.buttonLink} placeholder="/admission" className="h-9" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs font-bold text-foreground">
                Description (Optional)
              </Label>
              <Textarea id="description" name="description" defaultValue={slide?.description} rows={2} placeholder="Short subtitle or description..." className="resize-none text-xs" />
            </div>

            {/* ══════════ IMAGE UPLOADS: DESKTOP & MOBILE SIDE BY SIDE ══════════ */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Slide Images (Desktop & Mobile)
                </span>
                <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Crop className="w-3.5 h-3.5" /> Zoom & Crop Supported
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. DESKTOP IMAGE CARD */}
                <div className="flex flex-col gap-2 p-3 rounded-xl border-2 border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                      <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Desktop Image <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-semibold">
                      Landscape (16:6.7)
                    </span>
                  </div>

                  {/* Clickable Image Box */}
                  <label
                    htmlFor="image"
                    className="relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-blue-400/80 dark:border-blue-700 bg-white dark:bg-slate-900 hover:bg-blue-50/60 dark:hover:bg-blue-950/50 cursor-pointer overflow-hidden transition-all group shadow-2xs"
                  >
                    {desktopPreview ? (
                      <>
                        <Image src={desktopPreview} alt="Desktop Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                          <Upload className="w-4 h-4" /> Change Image
                        </div>
                      </>
                    ) : slide?.imageUrl ? (
                      <>
                        <GcsImage filePath={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                          <Upload className="w-4 h-4" /> Change Image
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center mb-1 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
                          Choose Desktop Image
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Click here or browse below
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Direct file input button & Crop Button */}
                  <div className="space-y-1.5">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      onChange={handleDesktopFileChange}
                      accept="image/*"
                      required={!slide && !croppedDesktopFile}
                      className="cursor-pointer file:cursor-pointer text-xs h-8 file:py-0.5 file:px-2.5 file:rounded-md file:bg-blue-600 file:text-white file:border-0 hover:file:bg-blue-700"
                    />

                    <div className="flex items-center justify-between gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenCrop('desktop')}
                        disabled={!desktopPreview && !slide?.imageUrl}
                        className="h-7 text-xs border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold gap-1 px-2.5"
                      >
                        <Crop className="w-3.5 h-3.5 text-blue-600" />
                        Zoom & Crop
                      </Button>

                      {desktopFileName && (
                        <p className="text-[10.5px] text-blue-600 dark:text-blue-400 font-medium truncate flex-1 text-right">
                          ✓ {desktopFileName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. MOBILE IMAGE CARD */}
                <div className="flex flex-col gap-2 p-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Mobile Image
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold">
                      Vertical / Portrait
                    </span>
                  </div>

                  {/* Aspect Ratio Selector for Mobile Crop */}
                  <div className="flex items-center gap-1.5 py-0.5">
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">Crop Ratio:</span>
                    <button
                      type="button"
                      onClick={() => setMobileCropRatio('4:5')}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border transition-colors",
                        mobileCropRatio === '4:5'
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50"
                      )}
                    >
                      4:5 Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileCropRatio('9:16')}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border transition-colors",
                        mobileCropRatio === '9:16'
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50"
                      )}
                    >
                      9:16 Tall
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileCropRatio('16:9')}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border transition-colors",
                        mobileCropRatio === '16:9'
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50"
                      )}
                    >
                      16:9 Wide
                    </button>
                  </div>

                  {/* Clickable Image Box - Supports Vertical Display without cropping */}
                  <label
                    htmlFor="mobileImage"
                    className="relative flex flex-col items-center justify-center w-full h-44 sm:h-48 rounded-lg border-2 border-dashed border-emerald-400/80 dark:border-emerald-700 bg-white dark:bg-slate-900 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/50 cursor-pointer overflow-hidden transition-all group shadow-2xs"
                  >
                    {mobilePreview ? (
                      <>
                        <Image src={mobilePreview} alt="Mobile Preview" fill className="object-contain p-1.5" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                          <Upload className="w-4 h-4" /> Change Image
                        </div>
                      </>
                    ) : slide?.mobileImageUrl ? (
                      <>
                        <GcsImage filePath={slide.mobileImageUrl} alt={slide.title + " (Mobile)"} fill className="object-contain p-1.5" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                          <Upload className="w-4 h-4" /> Change Image
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center mb-1 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                          Choose Mobile Vertical Image
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Vertical / Portrait (4:5, 3:4, 9:16)
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Direct file input button & Crop Button */}
                  <div className="space-y-1.5">
                    <Input
                      id="mobileImage"
                      name="mobileImage"
                      type="file"
                      onChange={handleMobileFileChange}
                      accept="image/*"
                      className="cursor-pointer file:cursor-pointer text-xs h-8 file:py-0.5 file:px-2.5 file:rounded-md file:bg-emerald-600 file:text-white file:border-0 hover:file:bg-emerald-700"
                    />

                    <div className="flex items-center justify-between gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenCrop('mobile')}
                        disabled={!mobilePreview && !slide?.mobileImageUrl}
                        className="h-7 text-xs border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold gap-1 px-2.5"
                      >
                        <Crop className="w-3.5 h-3.5 text-emerald-600" />
                        Zoom & Crop
                      </Button>

                      {mobileFileName && (
                        <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex-1 text-right">
                          ✓ {mobileFileName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-2 border-t flex flex-row items-center justify-end gap-2">
          <Button type="submit" disabled={isSubmitting} className="bg-[#0B1F4B] hover:bg-[#142B63] text-white font-bold px-6">
            {isSubmitting ? 'Saving Slide...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>

      {/* Interactive Photo Crop & Position / Zoom Adjustment Modal */}
      <PhotoCropModal
        isOpen={isCropOpen}
        imageSrc={activeCropImage}
        onClose={() => setIsCropOpen(false)}
        frameWidth={cropConfig.frameWidth}
        frameHeight={cropConfig.frameHeight}
        canvasExportWidth={cropConfig.canvasExportWidth}
        canvasExportHeight={cropConfig.canvasExportHeight}
        title={cropConfig.title}
        subtitle={cropConfig.subtitle}
        fileName={cropConfig.fileName}
        showFaceGuide={false}
        minScale={1.0}
        maxScale={4.0}
        onApplyCrop={(croppedDataUrl, fileBlob) => {
          if (cropTarget === 'desktop') {
            setDesktopPreview(croppedDataUrl);
            setCroppedDesktopFile(fileBlob);
            setDesktopFileName(`Adjusted Desktop (${Math.round(fileBlob.size / 1024)} KB)`);
          } else {
            setMobilePreview(croppedDataUrl);
            setCroppedMobileFile(fileBlob);
            setMobileFileName(`Adjusted Mobile (${Math.round(fileBlob.size / 1024)} KB)`);
          }
          setIsCropOpen(false);
          toast({
            title: "Image Adjusted & Cropped",
            description: `${cropTarget === 'desktop' ? 'Desktop' : 'Mobile'} banner crop applied successfully.`,
          });
        }}
      />
    </>
  );
};

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<THeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<THeroSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<THeroSlide | null>(null);
  const { toast } = useToast();

  const fetchSlides = async () => {
    setLoading(true);
    const result = await getCollection('heroSlides');
    if (result.success && result.data) {
      setSlides(result.data as THeroSlide[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingSlide(null);
    fetchSlides();
  };

  const handleDelete = async () => {
    if (!deletingSlide) return;
    const result = await deleteHeroSlide(deletingSlide.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchSlides();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingSlide(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <AlertDialog open={!!deletingSlide} onOpenChange={(isOpen) => !isOpen && setDeletingSlide(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Hero Slides</CardTitle>
              <CardDescription>Add, edit, or delete desktop and mobile slides for the homepage hero section.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSlide(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Slide
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Desktop Image</TableHead>
                    <TableHead>Mobile Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-14 w-28 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-14 w-20 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    slides.sort((a,b) => a.order - b.order).map((slide) => (
                      <TableRow key={slide.id}>
                        <TableCell>
                          <div className="w-28 h-14 rounded-md flex items-center justify-center bg-muted overflow-hidden border">
                            {slide.imageUrl ? <GcsImage filePath={slide.imageUrl} alt={slide.title} width={112} height={56} className="object-cover w-full h-full" /> : <ImageIcon className="w-4 h-4 text-muted-foreground"/>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {slide.mobileImageUrl ? (
                            <div className="w-20 h-14 rounded-md flex items-center justify-center bg-muted overflow-hidden border">
                              <GcsImage filePath={slide.mobileImageUrl} alt={slide.title + " (Mobile)"} width={80} height={56} className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Desktop image fallback</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{slide.title}</TableCell>
                        <TableCell>{slide.order}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingSlide(slide); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingSlide(slide)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
         <DialogContent className="sm:max-w-3xl max-h-[94vh] overflow-hidden flex flex-col p-6">
          <DialogHeader className="pb-2">
            <DialogTitle>{editingSlide ? 'Edit' : 'Add'} Hero Slide</DialogTitle>
            <DialogDescription>
              {editingSlide ? 'Update the desktop and mobile images for this slide.' : 'Create a new slide with separate desktop and mobile images.'}
            </DialogDescription>
          </DialogHeader>
          <HeroSlideForm slide={editingSlide} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the slide: <span className="font-semibold">{deletingSlide?.title}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
