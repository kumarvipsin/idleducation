'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';
import { ImageCropper } from '@/components/image-cropper';
import { editDirectorProfile, getDirectorProfile } from '@/app/actions/admin';
import { UserCircle } from 'lucide-react';

interface DirectorProfile {
    name: string;
    photoUrl: string;
}

export default function DirectorProfilePage() {
    const [profile, setProfile] = useState<DirectorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const result = await getDirectorProfile();
            if (result.success && result.data) {
                const data = result.data as DirectorProfile;
                setProfile(data);
                setName(data.name);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onImageCropped = (croppedImageFile: File) => {
        setCroppedPhoto(croppedImageFile);
        setPhotoPreview(URL.createObjectURL(croppedImageFile));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', name);
        if (croppedPhoto) {
            formData.append('photo', croppedPhoto);
        }

        const result = await editDirectorProfile(formData);

        if (result.success) {
            toast({ title: 'Success', description: 'Director profile updated successfully.' });
            if(result.data) {
                const data = result.data as DirectorProfile;
                setProfile(data);
                setName(data.name);
                setPhotoPreview(null);
                setCroppedPhoto(null);
            }
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsSubmitting(false);
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Director Profile</CardTitle>
                <CardDescription>Update the Founder & Managing Director's information for the About Us page.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-40 w-40 rounded-lg" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Director's Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo">Director's Photo</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-40 h-40 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                                    {photoPreview ? (
                                        <Image src={photoPreview} alt="New photo preview" width={160} height={160} className="object-cover" />
                                    ) : profile?.photoUrl ? (
                                        <GcsImage filePath={profile.photoUrl} alt="Current director photo" width={160} height={160} className="object-cover" />
                                    ) : (
                                        <UserCircle className="w-20 h-20 text-muted-foreground" />
                                    )}
                                </div>
                                <Input id="photo" type="file" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <p className="text-xs text-muted-foreground">Upload a new photo to replace the current one. Recommended aspect ratio is 1:1 (square).</p>
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                )}
                 <ImageCropper
                    isOpen={isCropperOpen}
                    onClose={() => setIsCropperOpen(false)}
                    imageSrc={photoPreview}
                    onImageCropped={onImageCropped}
                    aspectRatio={1}
                />
            </CardContent>
        </Card>
    );
}
    