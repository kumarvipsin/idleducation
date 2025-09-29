
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [activeTestimonial, setActiveTestimonial] = React.useState<TTopperTestimonial | null>(null);
  const [selectedForDialog, setSelectedForDialog] = React.useState<TTopperTestimonial | null>(null);

  React.useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setActiveTestimonial(testimonials[0]);
    }
  }, [testimonials]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedForDialog(null);
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-primary">Topper's </span> <span style={{ color: '#adb5bd' }}>Testimonials</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover how our top students achieved their goals. Watch their success stories and get inspired.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Main Video Player */}
            <div className="lg:col-span-2">
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelectedForDialog(activeTestimonial)}
                  className="w-full text-left group focus:outline-none"
                  disabled={!activeTestimonial}
                >
                  <Card className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                    {activeTestimonial && (
                      <>
                        <Image
                          src={`https://img.youtube.com/vi/${activeTestimonial.videoId}/hqdefault.jpg`}
                          alt={`Testimonial from ${activeTestimonial.studentName}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-20 h-20 text-white/80 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="font-bold text-white text-2xl">{activeTestimonial.studentName}</h3>
                          <p className="text-md text-white/90">{activeTestimonial.studentClass} | {activeTestimonial.studentPlace}</p>
                        </div>
                      </>
                    )}
                  </Card>
                </button>
              </DialogTrigger>
            </div>

            {/* Playlist */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-primary">More Toppers</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {testimonials.map((testimonial) => (
                  <button
                    key={testimonial.id}
                    onClick={() => setActiveTestimonial(testimonial)}
                    className={cn(
                      "w-full text-left p-2 rounded-lg transition-all duration-200 flex items-center gap-4 border-2",
                      activeTestimonial?.id === testimonial.id
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-transparent hover:bg-muted"
                    )}
                  >
                    <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0">
                       <Image
                          src={`https://img.youtube.com/vi/${testimonial.videoId}/mqdefault.jpg`}
                          alt={testimonial.studentName}
                          fill
                          className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground truncate">{testimonial.studentName}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.studentClass}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedForDialog && (
        <DialogContent className="max-w-4xl w-[90vw] p-0 border-0 rounded-xl overflow-hidden shadow-2xl bg-black aspect-video">
           <DialogHeader className="sr-only">
             <DialogTitle>Video: {selectedForDialog.studentName}'s Testimonial</DialogTitle>
             <DialogDescription>
                A video testimonial from {selectedForDialog.studentName}, a topper from {selectedForDialog.studentPlace}.
             </DialogDescription>
           </DialogHeader>
           <iframe
               className="w-full h-full"
               src={`https://www.youtube.com/embed/${selectedForDialog.videoId}?autoplay=1&rel=0`}
               title={`YouTube video player for ${selectedForDialog.studentName}'s testimonial`}
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowFullScreen
           ></iframe>
        </DialogContent>
      )}
    </Dialog>
  );
}
