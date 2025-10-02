
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Download, Languages, ShoppingCart } from "lucide-react";
import type { TSubject } from "@/app/actions/types";

export function NcertChapterList({ resources }: { resources: TSubject | null }) {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();
  
  const contents = (
    <div>
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setContentsLang(contentsLang === 'en' ? 'hi' : 'en')}
            className="rounded-full bg-background/50 border"
        >
            <Languages className="w-5 h-5" />
            <span className="sr-only">Toggle Language</span>
        </Button>
      </div>
      <div className="space-y-4 md:space-y-6">
        {resources?.chapters?.map((chapter, chapterIndex) => (
            <Card key={chapterIndex} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 group">
                <span className="font-medium text-sm md:text-base text-foreground/90 mb-2 md:mb-0">{chapter.name}</span>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                    <Link href="#">View and Download NCERT Solutions</Link>
                    </Button>
                    <Button asChild variant="secondary" size="sm" className="w-full md:w-auto">
                    <Link href="#">
                        <ShoppingCart className="w-4 h-4 mr-1"/>View and CART Important Question
                    </Link>
                    </Button>
                </div>
                </div>
            </Card>
        ))}
        </div>
    </div>
  );

  const primumNotes = (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Important Questions</h2>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setNotesLang(notesLang === 'en' ? 'hi' : 'en')}
                className="rounded-full bg-background/50 border"
            >
                <Languages className="w-5 h-5" />
                <span className="sr-only">Toggle Language</span>
            </Button>
        </div>
        <div className="space-y-2">
          {resources?.chapters?.map((chapter, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-3 flex items-center justify-between">
                <p className="font-medium text-xs md:text-sm flex-1 pr-2">{chapter.name}</p>
                <div className="flex items-center gap-1 md:gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="#">View</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="#"><ShoppingCart className="w-4 h-4 mr-1"/>CART</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
  
  return (
    <>
      {isMobile ? (
        <Tabs defaultValue="contents" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg">
            <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-md">Important Questions</TabsTrigger>
          </TabsList>
          <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
          <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setContentsLang(contentsLang === 'en' ? 'hi' : 'en')}
                  className="rounded-full bg-background/50 border"
              >
                  <Languages className="w-5 h-5" />
                  <span className="sr-only">Toggle Language</span>
              </Button>
            </div>
            {contents}
          </div>
          <div className="lg:col-span-1">
            {primumNotes}
          </div>
        </div>
      )}
    </>
  );
}
