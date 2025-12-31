
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getExamCategories } from "@/app/actions/data";
import type { TExamCategory } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";

async function getOpenSchoolPrograms() {
    const result = await getExamCategories();
    if (result.success && result.data) {
        return (result.data as TExamCategory[]).filter(cat => cat.group === 'open-school');
    }
    return [];
}

export default async function NewWorkPage() {
  const programs = await getOpenSchoolPrograms();

  return (
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-12 flex flex-col items-center justify-center min-h-screen">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Open School Programs</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Flexible and accessible education for everyone.
                </p>
            </div>
            {programs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((program) => (
                         <Link key={program.id} href={program.href} className="block">
                            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up flex flex-col h-full group">
                              <div className="relative w-full aspect-video">
                                {program.imageUrl ? (
                                    <GcsImage 
                                      filePath={program.imageUrl}
                                      alt={program.name}
                                      fill
                                      className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        <Home className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                )}
                              </div>
                              <CardHeader>
                                <CardTitle>{program.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">
                                    Learn more about our {program.name} program.
                                </p>
                              </CardContent>
                               <div className="p-4 pt-0">
                                <Button variant="link" className="p-0">
                                    Explore Program <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                         </Link>
                    ))}
                </div>
            ) : (
                <Card className="w-full max-w-lg animate-fade-in-up shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>
                            Stay tuned for exciting new content!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            Content for this section will be available soon.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
