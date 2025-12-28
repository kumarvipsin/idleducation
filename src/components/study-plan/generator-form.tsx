"use client";

import { generatePersonalizedStudyPlan, type PersonalizedStudyPlanOutput } from "@/ai/flows/personalized-study-plan-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  gradeLevel: z.string().min(1, { message: "Please select a grade level." }),
  subjects: z.string().min(3, { message: "Please list at least one subject." }),
  examGoals: z.string().min(10, { message: "Please describe your goals in more detail." }),
  availableTime: z.string().min(3, { message: "Please specify your available time." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function GeneratorForm() {
  const [isPending, startTransition] = useTransition();
  const [studyPlan, setStudyPlan] = useState<PersonalizedStudyPlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevel: "",
      subjects: "",
      examGoals: "",
      availableTime: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      setStudyPlan(null);
      try {
        const result = await generatePersonalizedStudyPlan({
          ...values,
          gradeLevel: parseInt(values.gradeLevel, 10),
          subjects: values.subjects.split(',').map(s => s.trim()),
        });
        setStudyPlan(result);
      } catch (error) {
        console.error("Failed to generate study plan:", error);
        toast({
          title: "Error",
          description: "Could not generate a study plan. Please try again later.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade or exam type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 9 }, (_, i) => i + 4).map((grade) => (
                            <SelectItem key={grade} value={String(grade)}>
                              Class {grade}
                            </SelectItem>
                          ))}
                           <SelectItem value="13">SSC Exam</SelectItem>
                           <SelectItem value="14">RRB Exam</SelectItem>
                           <SelectItem value="15">Delhi Police Exam</SelectItem>
                           <SelectItem value="16">NIOS Board</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Study Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 hours per day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects or Topics</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Algebra, Physics, Indian History" {...field} />
                    </FormControl>
                     <p className="text-sm text-muted-foreground">Separate subjects with a comma.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Score 90%+ in final exams, clear the SSC CGL cutoff"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Study Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {studyPlan && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="text-accent"/>
                    Your Personalized Study Plan
                </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <p>{studyPlan.studyPlan}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
