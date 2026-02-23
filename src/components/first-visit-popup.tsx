
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, Send, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAccessAttempt } from "@/app/actions/access";
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
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="pointer-events-auto w-full max-w-[340px] rounded-[2.5rem] border border-white/40 bg-white/20 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-6 relative overflow-hidden"
      >
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-5">
            <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                    <h2 className="text-lg font-black tracking-tighter text-primary uppercase leading-tight">Access Website</h2>
                    <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] leading-tight">
                        One-Time Registration
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-40 hover:opacity-100" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <p className="text-left text-muted-foreground text-[10px] font-bold leading-relaxed opacity-80">
                Register with your phone number to access the full website without interruption.
            </p>

            <AnimatePresence mode="wait">
                {step === 'phone' ? (
                    <motion.div 
                        key="phone-step"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</Label>
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Phone size={14} />
                                </div>
                                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">+91</span>
                                <Input 
                                    id="phone" 
                                    placeholder="Enter 10 digits" 
                                    className="pl-15 h-10 bg-white/40 border-white/20 rounded-xl font-black text-xs transition-all focus:ring-4 focus:ring-primary/10" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                        </div>
                        <Button 
                            onClick={handleSendOtp} 
                            className="w-full h-10 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] shadow-lg shadow-primary/10 group bg-primary hover:bg-primary/90 text-white"
                        >
                            Get Access Code
                            <Send className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="otp-step"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="otp" className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Verification Code</Label>
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Lock size={14} />
                                </div>
                                <Input 
                                    id="otp" 
                                    placeholder="4-digit code" 
                                    className="pl-9 h-10 bg-white/40 border-white/20 rounded-xl font-black text-center tracking-[0.4em] text-xs transition-all focus:ring-4 focus:ring-primary/10" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button 
                                onClick={handleVerify} 
                                disabled={isVerifying}
                                className="w-full h-10 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white"
                            >
                                {isVerifying ? "Verifying..." : "Verify & Enter"}
                                <CheckCircle2 className="ml-2 w-3.5 h-3.5" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => setStep('phone')} 
                                className="h-8 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-transparent"
                            >
                                Change Number
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="pt-3 border-t border-white/20 text-center">
                <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    Secure Registration • IDL Cloud
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
