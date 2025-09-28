'use client';

import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { editAdminProfile } from "@/app/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageCropper } from "@/components/image-cropper";
import { User, Mail, Phone, Home, Calendar, Droplets, Trash2, Upload } from "lucide-react";
import { UserProfile } from "@/context/auth-context";
import { GcsImage } from "@/components/gcs-image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.date().optional(),
  bloodGroup: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
    user: UserProfile;
    onSuccess: (updatedUser: UserProfile) => void;
}

export function ProfileEditForm({ user, onSuccess }: ProfileEditFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      dob: user.dob ? new Date(user.dob) : undefined,
      bloodGroup: user.bloodGroup || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemovePhoto(false);
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
  
  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setCroppedPhoto(null);
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    // Append form data
    Object.entries(data).forEach(([key, value]) => {
        if (value) {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else {
                 formData.append(key, value as string);
            }
        }
    });

    if (croppedPhoto) {
      formData.append('photo', croppedPhoto);
    }
    
    if (removePhoto) {
        formData.append('removePhoto', 'true');
    }

    const result = await editAdminProfile(user.uid, formData);

    if (result.success && result.user) {
        toast({ title: 'Success', description: 'Profile updated successfully.' });
        onSuccess(result.user);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
                {photoPreview ? <AvatarImage src={photoPreview} /> : 
                 (user.photoURL && !removePhoto) ? <GcsImage filePath={user.photoURL} alt={user.name || ''} fill className="rounded-full object-cover" /> :
                 <AvatarFallback className="text-3xl">{user.name?.charAt(0)}</AvatarFallback>
                }
            </Avatar>
            <div className="flex gap-2">
                 <Button type="button" onClick={() => document.getElementById('photo-upload')?.click()} variant="outline" size="sm"><Upload className="w-4 h-4 mr-2"/>Change Photo</Button>
                 <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                 {(user.photoURL || photoPreview) && <Button type="button" onClick={handleRemovePhoto} variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Remove</Button>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bloodGroup" render={({ field }) => ( <FormItem><FormLabel>Blood Group</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
          </div>
           <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
      <ImageCropper 
        isOpen={isCropperOpen} 
        onClose={() => setIsCropperOpen(false)} 
        imageSrc={photoPreview} 
        onImageCropped={onImageCropped} 
        aspectRatio={1}
      />
    </>
  );
}
