'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, Send, CheckCircle2, X, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAccessAttempt } from "@/app/actions/access";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

    // Listener for manual opening
    const handleOpen = () => {
        setStep('phone');
        setPhone('');
        setOtp('');
        setIsOpen(true);
    };
    window.addEventListener('open-registration-popup', handleOpen);
    return () => window.removeEventListener('open-registration-popup', handleOpen);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="pointer-events-auto w-full max-w-[425px] rounded-2xl border border-white/40 bg-white/30 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] p-4 md:p-5 relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-black tracking-tight text-primary uppercase leading-none">Access Website</h2>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">One-Time Registration</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:bg-black/5" onClick={() => setIsOpen(false)}>
                    <X className="h-3 w-3 opacity-40" />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="wait">
                    {step === 'phone' ? (
                        <motion.div 
                            key="phone-step"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col gap-3"
                        >
                            <p className="text-[10px] font-bold text-muted-foreground leading-snug">
                                Enter your phone number to access the full website without interruption.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1 group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                                        <Phone size={12} />
                                    </div>
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">+91</span>
                                    <Input 
                                        id="phone" 
                                        placeholder="Mobile Number" 
                                        className="pl-14 h-9 bg-white/50 border-white/20 rounded-lg font-black text-xs transition-all focus:ring-2 focus:ring-primary/10" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                </div>
                                <Button 
                                    onClick={handleSendOtp} 
                                    className="h-9 px-4 rounded-lg font-black uppercase tracking-widest text-[9px] shadow-sm bg-primary hover:bg-primary/90 text-white shrink-0"
                                >
                                    Get Code
                                    <Send className="ml-1.5 w-3 h-3" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="otp-step"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col gap-3"
                        >
                            <p className="text-[10px] font-bold text-muted-foreground leading-snug">
                                Please enter the 4-digit temporary access code sent to your device.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1 group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                                        <Lock size={12} />
                                    </div>
                                    <Input 
                                        id="otp" 
                                        placeholder="4-digit OTP" 
                                        className="pl-9 h-9 bg-white/50 border-white/20 rounded-lg font-black text-xs tracking-[0.3em] transition-all focus:ring-2 focus:ring-primary/10" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    />
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setStep('phone')} 
                                        className="h-9 px-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary rounded-lg"
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        onClick={handleVerify} 
                                        disabled={isVerifying}
                                        className="h-9 px-4 rounded-lg font-black uppercase tracking-widest text-[9px] shadow-sm bg-primary hover:bg-primary/90 text-white"
                                    >
                                        {isVerifying ? "..." : "Verify"}
                                        <CheckCircle2 className="ml-1.5 w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/20 text-center">
                <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                    IDL Cloud • Secure Node Verified
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
