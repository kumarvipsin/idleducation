'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { editAdminProfile } from '@/app/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/context/auth-context';
import { GcsImage } from '@/components/gcs-image';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required.'),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  user: UserProfile;
  onSuccess: (updatedUser: UserProfile) => void;
  onCancel?: () => void;
}

/**
 * Corporate edit form for updating the signed-in administrator's profile photo and contact fields.
 */
export function ProfileEditForm({ user, onSuccess, onCancel }: ProfileEditFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRemovePhoto(false);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.phone) formData.append('phone', data.phone);
      if (data.address) formData.append('address', data.address);
      if (photoFile) formData.append('photo', photoFile);
      if (removePhoto) formData.append('removePhoto', 'true');

      const result = await editAdminProfile(user.uid, formData);

      if (result.success && result.user) {
        toast({ title: 'Profile updated', description: 'Your administrator profile has been saved.' });
        onSuccess(result.user);
      } else {
        toast({ variant: 'destructive', title: 'Update failed', description: result.message || 'Unable to update profile.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = (user.name || user.email?.split('@')[0] || 'Admin').trim();
  const initials = displayName.charAt(0).toUpperCase() || 'A';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-[#E8EDF3]">
          <Avatar className="h-16 w-16 rounded-full border border-[#E8EDF3] shrink-0">
            {photoPreview ? (
              <AvatarImage src={photoPreview} alt={displayName} />
            ) : user.photoURL && !removePhoto ? (
              <GcsImage
                filePath={user.photoURL}
                alt={displayName}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-[#0B1B43] text-white text-lg font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => document.getElementById('photo-upload')?.click()}
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-md border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B1B43] text-xs font-medium shadow-none"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
              Change Photo
            </Button>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {((user.photoURL && !removePhoto) || photoPreview) && (
              <Button
                type="button"
                onClick={handleRemovePhoto}
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-md border-[#E8EDF3] bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-medium shadow-none"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#475569]">Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-9 rounded-md border-[#CBD5E1] bg-white text-sm text-[#0B1B43] focus-visible:ring-[#2563EB]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#475569]">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter phone number"
                    className="h-9 rounded-md border-[#CBD5E1] bg-white text-sm text-[#0B1B43] focus-visible:ring-[#2563EB]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#475569]">Primary Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter primary address"
                  className="h-9 rounded-md border-[#CBD5E1] bg-white text-sm text-[#0B1B43] focus-visible:ring-[#2563EB]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-[#E8EDF3]">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-md border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] text-sm font-medium shadow-none"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium shadow-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
