'use client';
import { SelectionsChart } from "@/components/selections-chart";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Star, Trophy, Users } from "lucide-react";
import { getExcellenceResults } from "@/app/actions";
import type { TExcellenceResult } from "@/app/actions/types";
import { useState, useEffect } from "react";
import { GcsImage } from "@/components/gcs-image";
import { Skeleton } from "@/components/ui/skeleton";

export default function AchievementsPage() {
  const [results, setResults] = useState<TExcellenceResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const res = await getExcellenceResults();
      if (res.success && res.data) {
        setResults(res.data as TExcellenceResult[]);
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  const statCards = [
    { title: "Years of Excellence", value: "8+", icon: <Star className="h-6 w-6 text-yellow-500" /> },
    { title: "Successful Students", value: "5000+", icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: "Top Rankings", value: "100+", icon: <Trophy className="h-6 w-6 text-green-500" /> },
    { title: "Awards Won", value: "25+", icon: <Award className="h-6 w-6 text-red-500" /> },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
            Our Achievements
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-semibold">
            Celebrating the milestones and successes of our students and institution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-4 flex justify-center">{stat.icon}</div>
            <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
            <p className="text-muted-foreground">{stat.title}</p>
          </Card>
        ))}
      </div>
      
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Selections Over the Years</CardTitle>
        </CardHeader>
        <CardContent>
          <SelectionsChart />
        </CardContent>
      </Card>

      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Excellence{' '}
            <span className="relative inline-block">
                <span className="relative z-10">Results</span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 z-0"></span>
            </span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            A glimpse into the outstanding performance of our students across various exams.
          </p>
        </div>
        
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                    <Card key={result.id} className="overflow-hidden group">
                        <div className="relative aspect-video">
                            <GcsImage filePath={result.imageUrl} alt={result.categoryName} fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
                        </div>
                         <CardFooter className="p-4 bg-muted/50">
                            <p className="font-semibold text-center w-full">{result.categoryName}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
