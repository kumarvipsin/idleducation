
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useStoreAuth } from "@/context/store-auth-context";
import { useToast } from "@/hooks/use-toast";
import { updateStoreUserAddress, resetStoreUserPassword } from "@/app/actions/store-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StoreHeader } from "@/app/store/page";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Home, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
    const { user, loading, updateUser } = useStoreAuth();
    const [address, setAddress] = useState('');
    const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    
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

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmittingAddress(true);
        const result = await updateStoreUserAddress(user.id, address);
        if (result.success) {
            toast({ title: "Success", description: "Your address has been updated." });
            updateUser({ shippingAddress: address });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setIsSubmittingAddress(false);
    };

    const handlePasswordReset = async () => {
        if (!user || !newPassword) {
            toast({ variant: "destructive", title: "Error", description: "Please enter a new password."});
            return;
        };
        setIsSubmittingPassword(true);
        const result = await resetStoreUserPassword(user.id, newPassword);
        if (result.success) {
            toast({ title: "Success", description: "Your password has been reset successfully." });
            setIsResetPasswordOpen(false);
            setNewPassword('');
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setIsSubmittingPassword(false);
    }

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
        <>
            <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900">
                <StoreHeader searchTerm="" setSearchTerm={() => {}} />
                <div className="container mx-auto py-12 px-4 md:px-6">
                    <Card className="max-w-2xl mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">My Account</CardTitle>
                            <CardDescription>Manage your profile, shipping information, and security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             {/* Profile Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-primary"/> Profile Information</h3>
                                <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                                    <p><span className="font-semibold">Name:</span> {user.name}</p>
                                    <p><span className="font-semibold">Mobile:</span> {user.mobile}</p>
                                </div>
                            </div>
                             {/* Shipping Address */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><Home className="w-5 h-5 text-primary"/> Shipping Address</h3>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <Textarea
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your full shipping address..."
                                        className="min-h-[120px]"
                                        required
                                    />
                                    <Button type="submit" disabled={isSubmittingAddress}>
                                        {isSubmittingAddress ? 'Saving...' : 'Save Address'}
                                    </Button>
                                </form>
                            </div>

                            {/* Security */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><KeyRound className="w-5 h-5 text-primary"/> Security</h3>
                                <div className="p-4 border rounded-lg flex justify-between items-center bg-muted/50">
                                    <p className="font-medium">Password</p>
                                    <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Reset Password</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Reset Your Password</DialogTitle>
                                                <DialogDescription>
                                                    Enter a new password for your account.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">New Password</Label>
                                                    <Input
                                                        id="new-password"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
                                                <Button onClick={handlePasswordReset} disabled={isSubmittingPassword}>
                                                    {isSubmittingPassword ? "Saving..." : "Save Password"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
