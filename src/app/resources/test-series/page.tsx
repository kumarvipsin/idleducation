'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Search, 
    CheckCircle2, 
    ArrowRight,
    GraduationCap,
    FileText,
    LayoutDashboard,
    PlayCircle,
    Book,
    X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const testPasses = [
  {
    title: "CUET UG Science Test Pass",
    validity: "3 Months",
    price: 599,
    originalPrice: 1499,
    discount: "60%",
    color: "blue",
    theme: {
      border: "border-blue-100",
      headerBg: "bg-white",
      contentBg: "bg-[#F0F7FF]",
      accent: "bg-[#3B82F6]",
      button: "bg-[#5B51D8] hover:bg-[#4A44B5]",
      badge: "bg-[#D9A54D]",
      mosaic: ["bg-blue-200", "bg-blue-400", "bg-blue-300", "bg-blue-50"]
    },
    features: [
      { icon: <GraduationCap className="w-4 h-4" />, label: "Subjects Covered:", value: "6+ major Subjects" },
      { icon: <FileText className="w-4 h-4" />, label: "No. of Tests:", value: "200+, Attempt all PYQs, Subject & Chapter Wise Tests." },
      { icon: <LayoutDashboard className="w-4 h-4" />, label: "Detailed Analysis:", value: "Overall Progress report, Detailed analysis." },
      { icon: <PlayCircle className="w-4 h-4" />, label: "Unlimited Re-Attempt:", value: "Unlimited Re-attempts to learn and improve from past mistakes." }
    ]
  },
  {
    title: "CUET UG Commerce Test Pass",
    validity: "3 Months",
    price: 599,
    originalPrice: 1499,
    discount: "60%",
    color: "orange",
    theme: {
      border: "border-orange-100",
      headerBg: "bg-white",
      contentBg: "bg-[#FFF9F0]",
      accent: "bg-[#F59E0B]",
      button: "bg-[#5B51D8] hover:bg-[#4A44B5]",
      badge: "bg-[#D9A54D]",
      mosaic: ["bg-orange-200", "bg-orange-400", "bg-orange-300", "bg-orange-50"]
    },
    features: [
      { icon: <GraduationCap className="w-4 h-4" />, label: "Subjects Covered:", value: "10+ major Subjects" },
      { icon: <FileText className="w-4 h-4" />, label: "No. of Tests:", value: "550+, Attempt all PYQs, Subject & Chapter Wise Tests." },
      { icon: <LayoutDashboard className="w-4 h-4" />, label: "Detailed Analysis:", value: "Overall Progress report, Detailed analysis." },
      { icon: <PlayCircle className="w-4 h-4" />, label: "Unlimited Re-Attempt:", value: "Unlimited Re-attempts to learn and improve from past mistakes." }
    ]
  },
  {
    title: "CUET UG Arts Test Pass",
    validity: "3 Months",
    price: 599,
    originalPrice: 1499,
    discount: "60%",
    color: "green",
    theme: {
      border: "border-green-100",
      headerBg: "bg-white",
      contentBg: "bg-[#F0FFF4]",
      accent: "bg-[#10B981]",
      button: "bg-[#5B51D8] hover:bg-[#4A44B5]",
      badge: "bg-[#D9A54D]",
      mosaic: ["bg-green-200", "bg-green-400", "bg-green-300", "bg-green-50"]
    },
    features: [
      { icon: <GraduationCap className="w-4 h-4" />, label: "Subjects Covered:", value: "6+ major Subjects" },
      { icon: <FileText className="w-4 h-4" />, label: "No. of Tests:", value: "200+, Attempt all PYQs, Subject & Chapter Wise Tests." },
      { icon: <LayoutDashboard className="w-4 h-4" />, label: "Detailed Analysis:", value: "Overall Progress report, Detailed analysis." },
      { icon: <PlayCircle className="w-4 h-4" />, label: "Unlimited Re-Attempt:", value: "Unlimited Re-attempts to learn and improve from past mistakes." }
    ]
  }
];

export default function TestSeriesPage() {
    const [selectedClass, setSelectedClass] = useState("all");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen w-full bg-[#FBFBFE] dark:bg-slate-950 relative">
            <div className="container mx-auto py-6 md:py-10 px-4 md:px-6 max-w-7xl relative z-10">
                
                {/* Filtration Section - Premium Institutional Style */}
                <div className="mb-12">
                    <Card className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-none">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                {/* Class Filter Cell */}
                                <div className="md:col-span-3">
                                    <div className="relative group h-full">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                                            <GraduationCap className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                                            <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0">
                                                <SelectValue placeholder="Target Exam" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-xs font-bold">All Exams</SelectItem>
                                                <SelectItem value="class-10" className="text-xs font-bold">Class 10</SelectItem>
                                                <SelectItem value="class-12" className="text-xs font-bold">Class 12</SelectItem>
                                                <SelectItem value="cuet" className="text-xs font-bold">CUET UG</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Subject Filter Cell */}
                                <div className="md:col-span-3">
                                    <div className="relative group h-full">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                                            <Book className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                            <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0">
                                                <SelectValue placeholder="Stream / Subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-xs font-bold">All Streams</SelectItem>
                                                <SelectItem value="science" className="text-xs font-bold">Science</SelectItem>
                                                <SelectItem value="commerce" className="text-xs font-bold">Commerce</SelectItem>
                                                <SelectItem value="arts" className="text-xs font-bold">Arts</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Search Filter Cell */}
                                <div className="md:col-span-4">
                                    <div className="relative group h-full">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input 
                                            placeholder="Search Mock Tests..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                        />
                                        {searchTerm && (
                                            <button 
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Clear Button Cell */}
                                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => { setSelectedClass("all"); setSelectedSubject("all"); setSearchTerm(""); }}
                                        className="w-full h-14 border-0 rounded-none font-black text-[10px] tracking-widest uppercase hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
                                    >
                                        <X className="mr-2 h-3.5 w-3.5" />
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid of Passes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {testPasses.map((pass, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "group relative flex flex-col rounded-2xl overflow-hidden border shadow-xl transition-all duration-500 hover:-translate-y-2",
                                pass.theme.border
                            )}
                        >
                            {/* Card Top / Header */}
                            <div className="p-6 pb-5 space-y-5 bg-white relative z-10">
                                <div className="flex justify-between items-start">
                                    {/* Mosaic Icon */}
                                    <div className="grid grid-cols-2 gap-0.5 w-11 h-11 rounded-lg overflow-hidden rotate-3 group-hover:rotate-6 transition-transform shadow-sm">
                                        {pass.theme.mosaic.map((bg, idx) => (
                                            <div key={idx} className={cn("w-full h-full opacity-80", bg)} />
                                        ))}
                                    </div>
                                    <Badge className={cn("text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border-none text-white", pass.theme.badge)}>
                                        {pass.validity}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight text-left pr-4">
                                        {pass.title}
                                    </h3>
                                    <div className="flex items-baseline gap-2.5 pt-1">
                                        <span className="text-2xl font-black text-[#5B51D8]">₹{pass.price}</span>
                                        <span className="text-sm font-bold text-slate-300 line-through">₹{pass.originalPrice}</span>
                                        <span className="text-sm font-black text-emerald-500">{pass.discount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Divider */}
                            <div className="relative h-px w-full bg-slate-100 flex items-center justify-center">
                                <div className="absolute left-0 w-4 h-4 bg-[#FBFBFE] dark:bg-slate-950 rounded-full -translate-x-1/2 border-r border-slate-100" />
                                <div className="absolute right-0 w-4 h-4 bg-[#FBFBFE] dark:bg-slate-950 rounded-full translate-x-1/2 border-l border-slate-100" />
                                <div className="w-full border-t border-dashed border-slate-200 mx-4" />
                            </div>

                            {/* Features Area */}
                            <div className={cn("p-6 pt-8 pb-24 flex-grow space-y-6 relative z-10", pass.theme.contentBg)}>
                                {pass.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${fIdx * 0.1}s` }}>
                                        <div className="mt-0.5 p-1.5 bg-white rounded-lg text-slate-400 shadow-sm shrink-0 border border-slate-100">
                                            {React.cloneElement(feature.icon as React.ReactElement, { className: "w-3.5 h-3.5" })}
                                        </div>
                                        <div className="text-left leading-[1.4] space-y-0.5">
                                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{feature.label}</p>
                                            <p className="text-[11.5px] font-medium text-slate-500 tracking-tight">{feature.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Button Layer */}
                            <div className={cn("absolute bottom-8 left-0 right-0 px-6 z-20", pass.theme.contentBg)}>
                                <Button className={cn("w-full h-12 rounded-xl font-black text-[13px] text-white uppercase tracking-[0.15em] shadow-lg shadow-[#5B51D8]/20 transition-all active:scale-95", pass.theme.button)}>
                                    Get Pass
                                </Button>
                            </div>

                            {/* Scalloped Bottom Edge */}
                            <div className="absolute bottom-0 left-0 right-0 h-3 flex overflow-hidden z-10">
                                {Array.from({ length: 25 }).map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className="w-4 h-4 rounded-full -mt-2 shrink-0 bg-[#FBFBFE] dark:bg-slate-950 border border-slate-100/50" 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Verification Badges */}
                <div className="pt-10 text-center animate-fade-in-up">
                    <Separator className="max-w-md mx-auto opacity-40 mb-10" />
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { label: "NTA Pattern", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                            { label: "Faculty Curated", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                            { label: "Real-time Score", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-[10px] font-black tracking-widest text-slate-900 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
