'use client';

import { useEffect, useRef, useState } from 'react';
import { getAllExpertTeachers, addExpertTeacher, editExpertTeacher, deleteExpertTeacher, getSignedUrlForPdf } from '@/app/actions';
import type { TExpertTeacher } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Video, GraduationCap, Upload, X, Camera, Link2, Crop } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { PhotoCropModal } from '@/components/admission/photo-crop-modal';

function TeacherTableAvatar({ src, name, photoPosition }: { src?: string; name: string; photoPosition?: string }) {
  const [avatarSrc, setAvatarSrc] = useState<string>(src || '/director.png');

  useEffect(() => {
    let active = true;
    const raw = src || '/director.png';
    if (raw.includes('storage.googleapis.com') && !raw.includes('GoogleAccessId=')) {
      getSignedUrlForPdf(raw).then((res) => {
        if (active && res.success && res.url) {
          setAvatarSrc(res.url);
        }
      });
    } else {
      setAvatarSrc(raw);
    }
    return () => {
      active = false;
    };
  }, [src]);

  return (
    <Avatar className="h-10 w-10 border border-slate-200 overflow-hidden shadow-sm">
      <AvatarImage
        src={avatarSrc}
        alt={name}
        className="object-cover"
        style={photoPosition ? { objectPosition: photoPosition } : undefined}
      />
      <AvatarFallback><GraduationCap className="h-4 w-4 text-slate-400" /></AvatarFallback>
    </Avatar>
  );
}

function parseYouTubeInput(val: string): { videoId: string | null; isValid: boolean; normalizedUrl: string } {
  const trimmed = val.trim();
  if (!trimmed) {
    return { videoId: null, isValid: true, normalizedUrl: '' };
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { videoId: trimmed, isValid: true, normalizedUrl: `https://www.youtube.com/watch?v=${trimmed}` };
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return { videoId: match[1], isValid: true, normalizedUrl: `https://www.youtube.com/watch?v=${match[1]}` };
  }
  return { videoId: null, isValid: false, normalizedUrl: trimmed };
}

const ExpertTeacherForm = ({
  teacher,
  onSuccess,
}: {
  teacher?: TExpertTeacher | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(teacher?.photoUrl || teacher?.avatarUrl || null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>(teacher?.photoUrl || teacher?.avatarUrl || '');
  const [removePhoto, setRemovePhoto] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(teacher ? teacher.isActive !== false : true);
  const [videoUrl, setVideoUrl] = useState<string>(
    teacher?.videoUrl || (teacher?.videoId ? `https://www.youtube.com/watch?v=${teacher.videoId}` : '') || ''
  );
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Photo Crop Modal states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [activeCropImage, setActiveCropImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  useEffect(() => {
    const rawPhoto = teacher?.originalPhotoUrl || teacher?.photoUrl || teacher?.avatarUrl || '';
    setVideoUrl(teacher?.videoUrl || (teacher?.videoId ? `https://www.youtube.com/watch?v=${teacher.videoId}` : '') || '');
    setCurrentPhotoUrl(rawPhoto.split('?')[0]);
    setRemovePhoto(false);
    setIsActive(teacher ? teacher.isActive !== false : true);
    setCroppedFile(null);
    setIsCropOpen(false);
    setActiveCropImage(null);

    if (rawPhoto) {
      if (rawPhoto.includes('storage.googleapis.com') && !rawPhoto.includes('GoogleAccessId=')) {
        getSignedUrlForPdf(rawPhoto).then((res) => {
          if (res.success && res.url) {
            setPhotoPreview(res.url);
          } else {
            setPhotoPreview(rawPhoto);
          }
        });
      } else {
        setPhotoPreview(rawPhoto);
      }
    } else {
      setPhotoPreview(null);
    }
  }, [teacher]);

  const { videoId: previewVideoId, isValid: isVideoValid, normalizedUrl } = parseYouTubeInput(videoUrl);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isVideoValid) {
      toast({
        variant: 'destructive',
        title: 'Invalid YouTube URL',
        description: 'Please enter a valid YouTube video URL or leave the field blank.'
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set('isActive', String(isActive));
    formData.set('videoUrl', normalizedUrl);

    // If photo was interactively cropped, send the cropped file
    if (croppedFile) {
      formData.set('photo', croppedFile);
    } else if (!removePhoto && currentPhotoUrl && !photoInputRef.current?.files?.[0]) {
      // Send current photo URL (clean permanent path) so backend knows to preserve it
      formData.set('photoUrl', currentPhotoUrl.split('?')[0]);
    }

    if (removePhoto) {
      formData.set('removePhoto', 'true');
    }

    const result = teacher?.id && !teacher.id.startsWith('teacher-')
      ? await editExpertTeacher(teacher.id, formData)
      : await addExpertTeacher(formData);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Unsupported format",
          description: "Please upload a valid JPG, JPEG, PNG, or WebP image.",
        });
        e.target.value = "";
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Photo file size should be less than 10MB.",
        });
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setActiveCropImage(dataUrl);
        setIsCropOpen(true);
        setRemovePhoto(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleOpenCrop = () => {
    if (photoPreview) {
      setActiveCropImage(photoPreview);
      setIsCropOpen(true);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setCurrentPhotoUrl('');
    setCroppedFile(null);
    setActiveCropImage(null);
    setRemovePhoto(true);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[calc(90vh-140px)] pr-4">
        <div className="grid gap-4 py-3">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-semibold">Teacher Name *</Label>
            <Input id="name" name="name" defaultValue={teacher?.name} required className="col-span-3" placeholder="e.g., Amod Sharma" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="designation" className="text-right">Designation</Label>
            <Input id="designation" name="designation" defaultValue={teacher?.designation} className="col-span-3" placeholder="e.g., Head Academic Faculty" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right font-semibold">Subject *</Label>
            <Input id="subject" name="subject" defaultValue={teacher?.subject} required className="col-span-3" placeholder="e.g., Biology & Chemistry" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="examFocus" className="text-right">Exam Focus</Label>
            <Input id="examFocus" name="examFocus" defaultValue={teacher?.examFocus} className="col-span-3" placeholder="e.g., NEET & CBSE" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialization" className="text-right">Specialization Badge</Label>
            <Input id="specialization" name="specialization" defaultValue={teacher?.specialization} className="col-span-3" placeholder="e.g., BIOLOGY & CHEMISTRY · NEET & CBSE" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right">Experience</Label>
            <Input id="experience" name="experience" defaultValue={teacher?.experience} className="col-span-3" placeholder="e.g., 10+ Years Experience" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="qualification" className="text-right">Qualification</Label>
            <Input id="qualification" name="qualification" defaultValue={teacher?.qualification} className="col-span-3" placeholder="e.g., M.Sc. Chemistry" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortBio" className="text-right font-semibold">Short Bio (2-3 lines) *</Label>
            <Textarea id="shortBio" name="shortBio" defaultValue={teacher?.shortBio} required rows={3} className="col-span-3 text-xs leading-relaxed" placeholder="Concise, professional 2-3 line teaching profile..." />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teachingFocus" className="text-right">Teaching Approach</Label>
            <Input id="teachingFocus" name="teachingFocus" defaultValue={teacher?.teachingFocus} className="col-span-3" placeholder="e.g., Concept Clarity & Diagnostic Approach" />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="videoUrl" className="text-right pt-2 font-medium">YouTube Intro Video URL</Label>
            <div className="col-span-3 space-y-1.5">
              <Input
                id="videoUrl"
                name="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/watch?v=XXXXXXXX"
                className={!isVideoValid ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {!isVideoValid && (
                <p className="text-[12px] font-medium text-destructive">
                  Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...).
                </p>
              )}
              {isVideoValid && previewVideoId && (
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="relative w-16 h-10 rounded overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={`https://img.youtube.com/vi/${previewVideoId}/mqdefault.jpg`}
                      alt="YouTube preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Video className="w-3.5 h-3.5 text-white drop-shadow" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      Valid YouTube Video
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      ID: {previewVideoId}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoUrl('')}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
                    title="Remove video URL"
                  >
                    Clear
                  </Button>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">
                Paste YouTube watch, share, or short link. Leave blank to remove.
              </p>
            </div>
          </div>

          {/* ── Teacher Photo Upload & Adjust (Admission Form Style) ── */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2 font-medium">Teacher Photo</Label>
            <div className="col-span-3 space-y-3">

              {/* Photo Card Preview Frame (5:4 Aspect Ratio matching teacher cards) */}
              <div
                className="relative w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 group shadow-sm"
                style={{ aspectRatio: '5/4', maxHeight: 220 }}
              >
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Teacher photo preview"
                      className="w-full h-full object-cover transition-all duration-150"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/director.png';
                      }}
                    />
                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleOpenCrop}
                        className="h-8 text-xs gap-1.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        Adjust
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => photoInputRef.current?.click()}
                        className="h-8 text-xs gap-1.5 bg-white/90 text-slate-900 hover:bg-white font-semibold shadow cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Change
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="h-8 text-xs gap-1.5 bg-red-600 text-white hover:bg-red-700 font-semibold shadow cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none">
                      ✓ Photo Set
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Click to upload photo</p>
                      <p className="text-[11px] text-slate-400">Card Aspect Ratio (5 : 4) · Max 10 MB</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={photoInputRef}
                id="photo"
                name="photo"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Photo Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {photoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenCrop}
                    className="h-8 text-xs gap-1.5 font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Crop className="w-3.5 h-3.5 text-primary" />
                    Adjust Photo Position
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => photoInputRef.current?.click()}
                  className="h-8 text-xs gap-1.5 font-medium border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {photoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="h-8 text-xs gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </Button>
                )}
              </div>

              {/* Photo URL text input */}
              <div className="flex items-center gap-2 pt-1">
                <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  value={currentPhotoUrl}
                  className="h-8 text-xs"
                  placeholder="Or paste photo URL: /director.png or https://..."
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentPhotoUrl(val);
                    if (val.trim()) {
                      if (val.includes('storage.googleapis.com') && !val.includes('GoogleAccessId=')) {
                        getSignedUrlForPdf(val.trim()).then((res) => {
                          if (res.success && res.url) setPhotoPreview(res.url);
                          else setPhotoPreview(val.trim());
                        });
                      } else {
                        setPhotoPreview(val.trim());
                      }
                      setRemovePhoto(false);
                    } else {
                      setPhotoPreview(null);
                    }
                  }}
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Upload a teacher photo and click <strong>&quot;Adjust Photo Position&quot;</strong> to drag, zoom, and fit perfectly into the card frame.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profileUrl" className="text-right">Profile URL</Label>
            <Input id="profileUrl" name="profileUrl" defaultValue={teacher?.profileUrl || '/about'} className="col-span-3" placeholder="e.g., /about" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order" className="text-right">Display Order</Label>
            <Input id="order" name="order" type="number" defaultValue={teacher?.order ?? 1} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right font-medium">Active Status</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <span className="text-xs text-muted-foreground">{isActive ? 'Visible on homepage' : 'Hidden from homepage'}</span>
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : teacher ? 'Update Teacher' : 'Add Teacher'}
        </Button>
      </DialogFooter>

      {/* Interactive Photo Crop & Position Adjustment Modal (Admission Form Style) */}
      <PhotoCropModal
        isOpen={isCropOpen}
        imageSrc={activeCropImage}
        onClose={() => setIsCropOpen(false)}
        frameWidth={275}
        frameHeight={220}
        canvasExportWidth={550}
        canvasExportHeight={440}
        title="Adjust Teacher Photo"
        subtitle="Card frame (5 : 4 ratio) • Drag to center face & zoom"
        fileName="teacher-cropped-photo.jpg"
        onApplyCrop={(croppedDataUrl, fileBlob) => {
          setPhotoPreview(croppedDataUrl);
          setActiveCropImage(croppedDataUrl);
          setCroppedFile(fileBlob);
          setRemovePhoto(false);
          setIsCropOpen(false);
          toast({
            title: "Photo adjusted & set",
            description: "Teacher photograph position saved.",
          });
        }}
      />
    </form>
  );
};

export default function AdminExpertTeachersPage() {
  const [teachers, setTeachers] = useState<TExpertTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TExpertTeacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<TExpertTeacher | null>(null);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    setLoading(true);
    const result = await getAllExpertTeachers();
    if (result.success && result.data) {
      setTeachers(result.data as TExpertTeacher[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingTeacher(null);
    fetchTeachers();
  };

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    const result = await deleteExpertTeacher(deletingTeacher.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchTeachers();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingTeacher(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog open={!!deletingTeacher} onOpenChange={(isOpen) => !isOpen && setDeletingTeacher(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Our Expert Teachers</CardTitle>
              <CardDescription>
                Add, edit, reorder, or update faculty profiles, credentials, bios, and YouTube video intros.
              </CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTeacher(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Teacher
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead className="w-16">Photo</TableHead>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Subject & Exam</TableHead>
                    <TableHead>Experience & Qualification</TableHead>
                    <TableHead className="w-20">Video</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher, index) => {
                    const photoSrc = teacher.photoUrl || teacher.avatarUrl || teacher.photo || '/director.png';
                    const hasVideo = Boolean(teacher.videoUrl || teacher.videoId || teacher.introVideo);
                    const isActive = teacher.isActive !== false;

                    return (
                      <TableRow key={teacher.id || index}>
                        <TableCell className="font-mono text-xs">{teacher.order ?? index + 1}</TableCell>
                        <TableCell>
                          <TeacherTableAvatar
                            src={photoSrc}
                            name={teacher.name}
                            photoPosition={teacher.photoPosition}
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-white">
                          <div>{teacher.name}</div>
                          {teacher.designation && (
                            <div className="text-xs text-muted-foreground font-normal">{teacher.designation}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                            {teacher.specialization || teacher.subject}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                          <div>{teacher.experience || '—'}</div>
                          <div className="text-[11px] text-muted-foreground">{teacher.qualification || ''}</div>
                        </TableCell>
                        <TableCell>
                          {hasVideo ? (
                            <Badge variant="secondary" className="text-[11px] flex items-center gap-1 w-fit">
                              <Video className="w-3 h-3 text-red-500" /> Yes
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs text-slate-400">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingTeacher(teacher);
                                setIsDialogOpen(true);
                              }}
                              title="Edit Teacher"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingTeacher(teacher)}
                              title="Delete Teacher"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? 'Edit Teacher Profile' : 'Add New Teacher'}</DialogTitle>
            <DialogDescription>
              Provide faculty credentials, short bio, subjects, exam focus, photo, and YouTube intro video.
            </DialogDescription>
          </DialogHeader>
          <ExpertTeacherForm teacher={editingTeacher} onSuccess={handleSuccess} />
        </DialogContent>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deletingTeacher?.name} from the Expert Teachers list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
