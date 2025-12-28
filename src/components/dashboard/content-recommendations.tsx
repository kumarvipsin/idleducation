"use client";

import { recommendContent, type ContentRecommenderOutput } from "@/ai/flows/content-recommender";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";

export default function ContentRecommendations() {
  const [isPending, startTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<ContentRecommenderOutput | null>(null);
  const { toast } = useToast();

  const handleGetRecommendation = () => {
    startTransition(async () => {
      try {
        const result = await recommendContent({
          studyHistory: "Studied Algebra (10 hours, 75% score), Physics (15 hours, 85% score), and Modern History (5 hours, 60% score).",
          currentCurriculum: "Preparing for SSC CGL Tier 2, focusing on Quantitative Abilities and English Language.",
        });
        setRecommendation(result);
      } catch (error) {
        console.error("Failed to get recommendation:", error);
        toast({
          title: "Error",
          description: "Could not fetch recommendations. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="text-accent" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions for what to study next based on your
          progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {isPending ? (
          <div className="flex items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recommendation ? (
          <div className="prose prose-sm text-card-foreground">
            <p>{recommendation.recommendedMaterials}</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-muted-foreground">
              Click the button to generate your personalized content recommendations.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetRecommendation} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Recommend Content"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
