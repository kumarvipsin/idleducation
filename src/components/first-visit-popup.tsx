
'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, Send, Smartphone, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAccessAttempt } from "@/app/actions/access";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function FirstVisitPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user has already verified access in this browser
    const isVerified = localStorage.getItem('idl_access_verified');
    if (!isVerified) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone",
        description: "Please enter a 10-digit mobile number.",
      });
      return;
    }

    // Simulate OTP generation
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(code);
    
    toast({
      title: "OTP Sent!",
      description: `Your temporary access code is: ${code}`,
    });
    
    setStep('otp');
  };

  const handleVerify = async () => {
    if (otp !== simulatedOtp) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "The OTP you entered is incorrect. Please try again.",
      });
      // Log failed attempt
      logAccessAttempt(phone, otp, false);
      return;
    }

    setIsVerifying(true);
    
    // Log successful registration
    const result = await logAccessAttempt(phone, otp, true);
    
    if (result.success) {
      localStorage.setItem('idl_access_verified', 'true');
      toast({
        title: "Welcome to IDL!",
        description: "Access granted. You can now explore the full website.",
      });
      setIsOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong on our end. Please try again.",
      });
    }
    
    setIsVerifying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[400px] rounded-2xl border-2 border-primary/10 shadow-2xl p-0 overflow-hidden"
      >
        <div className="bg-primary p-6 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                    <Smartphone className="w-8 h-8 text-white" />
                </div>
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight text-white">Unlock Full Access</DialogTitle>
                    <DialogDescription className="text-white/80 text-[11px] font-bold uppercase tracking-[0.15em] leading-tight mt-1">
                        One-Time Registration Required
                    </DialogDescription>
                </DialogHeader>
            </div>
        </div>

        <div className="p-8 space-y-6 bg-white dark:bg-slate-900">
            <p className="text-center text-muted-foreground text-xs font-bold leading-relaxed">
                Register now with your phone number to access the full website without interruption.
            </p>

            <AnimatePresence mode="wait">
                {step === 'phone' ? (
                    <motion.div 
                        key="phone-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Number</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Phone size={16} />
                                </div>
                                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91</span>
                                <Input 
                                    id="phone" 
                                    placeholder="Enter 10 digits" 
                                    className="pl-16 h-12 bg-muted/30 border-primary/10 rounded-xl font-bold" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                        </div>
                        <Button 
                            onClick={handleSendOtp} 
                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 group"
                        >
                            Get Access Code
                            <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="otp-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Code</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Lock size={16} />
                                </div>
                                <Input 
                                    id="otp" 
                                    placeholder="Enter 4-digit code" 
                                    className="pl-10 h-12 bg-muted/30 border-primary/10 rounded-xl font-bold text-center tracking-[0.5em]" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button 
                                onClick={handleVerify} 
                                disabled={isVerifying}
                                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                            >
                                {isVerifying ? "Verifying..." : "Verify & Enter Site"}
                                <CheckCircle2 className="ml-2 w-4 h-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => setStep('phone')} 
                                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
                            >
                                Change Phone Number
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        <div className="p-4 bg-muted/30 text-center border-t">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Safe & Secure Registration Powered by IDL Cloud
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
