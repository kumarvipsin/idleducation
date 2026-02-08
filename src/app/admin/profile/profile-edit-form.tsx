'use client';

import { useRef, useState, useEffect, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { editAdminProfile } from "@/app/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Home, Calendar as CalendarIcon, Droplets, Trash2, Upload } from "lucide-react";
import { UserProfile } from "@/context/auth-context";
import { GcsImage } from "@/components/gcs-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, getDaysInMonth } from "date-fns";

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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export function ProfileEditForm({ user, onSuccess }: ProfileEditFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  // Manual DOB state
  const [dobState, setDobState] = useState({
    day: user.dob ? new Date(user.dob).getDate().toString() : '',
    month: user.dob ? months[new Date(user.dob).getMonth()] : '',
    year: user.dob ? new Date(user.dob).getFullYear().toString() : ''
  });

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

  // Sync manual selections to form state
  useEffect(() => {
    if (dobState.day && dobState.month && dobState.year) {
      const monthIndex = months.indexOf(dobState.month);
      const date = new Date(parseInt(dobState.year), monthIndex, parseInt(dobState.day));
      form.setValue('dob', date, { shouldValidate: true });
    }
  }, [dobState, form]);

  // Calculate available days for selected month/year
  const daysInMonth = useMemo(() => {
    if (dobState.year && dobState.month) {
      const monthIndex = months.indexOf(dobState.month);
      return getDaysInMonth(new Date(parseInt(dobState.year), monthIndex));
    }
    return 31;
  }, [dobState.month, dobState.year]);

  const availableDays = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemovePhoto(false);
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setPhotoFile(null);
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
        if (value) {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else {
                 formData.append(key, value as string);
            }
        }
    });

    if (photoFile) {
      formData.append('photo', photoFile);
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
              {photoPreview ? (
                <AvatarImage src={photoPreview} />
              ) : user.photoURL && !removePhoto ? (
                <GcsImage
                  filePath={user.photoURL}
                  alt={user.name || ''}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-3xl">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              )}
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
              
              <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                      <Select 
                        value={dobState.day} 
                        onValueChange={(val) => setDobState(prev => ({ ...prev, day: val }))}
                      >
                          <SelectTrigger className="h-10">
                              <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                              {availableDays.map(day => (
                                  <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>

                      <Select 
                        value={dobState.month} 
                        onValueChange={(val) => setDobState(prev => ({ ...prev, month: val }))}
                      >
                          <SelectTrigger className="h-10">
                              <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                              {months.map(month => (
                                  <SelectItem key={month} value={month}>{month}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>

                      <Select 
                        value={dobState.year} 
                        onValueChange={(val) => setDobState(prev => ({ ...prev, year: val }))}
                      >
                          <SelectTrigger className="h-10">
                              <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                              {years.map(year => (
                                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <FormMessage />
              </FormItem>

              <FormField control={form.control} name="bloodGroup" render={({ field }) => ( <FormItem><FormLabel>Blood Group</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
          </div>
           <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </>
  );
}
