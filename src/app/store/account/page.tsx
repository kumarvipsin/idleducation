
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useStoreAuth } from "@/context/store-auth-context";
import { useToast } from "@/hooks/use-toast";
import { updateStoreUserAddress } from "@/app/actions/store-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StoreHeader } from "@/app/store/page";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
    const { user, loading, updateUser } = useStoreAuth();
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/store/auth');
        }
        if (user) {
            setAddress(user.shippingAddress || '');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        const result = await updateStoreUserAddress(user.id, address);
        if (result.success) {
            toast({ title: "Success", description: "Your address has been updated." });
            updateUser({ shippingAddress: address });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setIsSubmitting(false);
    };

    if (loading || !user) {
        return (
            <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900">
                <Skeleton className="h-12 w-full" />
                <div className="container mx-auto py-12 px-4 md:px-6">
                    <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900">
            <StoreHeader searchTerm="" setSearchTerm={() => {}} />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <Card className="max-w-2xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle>My Account</CardTitle>
                        <CardDescription>Manage your profile and shipping information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Name: <span className="font-normal">{user.name}</span></p>
                                <p className="text-sm font-medium">Mobile: <span className="font-normal">{user.mobile}</span></p>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium">Shipping Address</label>
                                <Textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full shipping address..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Address'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
