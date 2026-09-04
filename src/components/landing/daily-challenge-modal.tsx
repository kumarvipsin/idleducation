'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  GraduationCap, 
  Flame, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { 
  ChallengeQuestion, 
  ClassLevel, 
  getDailyQuestionsForClass 
} from '@/lib/daily-challenge-data';
import { 
  DailyChallengeState, 
  getDailyChallengeState, 
  saveSelectedClass, 
  recordChallengeCompletion, 
  getTodayDateString 
} from '@/lib/daily-challenge-storage';
import { cn } from '@/lib/utils';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalView = 'class_select' | 'active_quiz' | 'result' | 'already_completed';

export function DailyChallengeModal({ isOpen, onOpenChange }: DailyChallengeModalProps) {
  const [view, setView] = useState<ModalView>('class_select');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('8');
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [challengeState, setChallengeState] = useState<DailyChallengeState | null>(null);
  const [showReview, setShowReview] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or reload storage state whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerActive(false);
      return;
    }

    const state = getDailyChallengeState();
    setChallengeState(state);
    setShowReview(false);

    const todayStr = getTodayDateString();
    const isCompletedToday = state.lastCompletedDate === todayStr && !!state.lastScore;

    if (isCompletedToday) {
      setSelectedClass(state.lastScore?.classLevel || state.selectedClass || '8');
      const loadedQuestions = getDailyQuestionsForClass(state.lastScore?.classLevel || state.selectedClass || '8', todayStr);
      setQuestions(loadedQuestions);
      setUserAnswers(state.lastScore?.userAnswers || []);
      setView('already_completed');
    } else if (state.selectedClass) {
      setSelectedClass(state.selectedClass);
      startChallengeForClass(state.selectedClass);
    } else {
      setView('class_select');
    }
  }, [isOpen]);

  // Start challenge for selected class
  const startChallengeForClass = (classLvl: ClassLevel) => {
    setSelectedClass(classLvl);
    saveSelectedClass(classLvl);
    const loadedQuestions = getDailyQuestionsForClass(classLvl);
    setQuestions(loadedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setTimeLeft(60);
    setView('active_quiz');
    setTimerActive(true);
  };

  // Timer countdown hook
  useEffect(() => {
    if (view !== 'active_quiz' || !timerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired for this question: auto-record as skipped/wrong and advance
          handleTimeExpired();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, timerActive, currentIndex, selectedOption, userAnswers, questions]);

  // Handle time expiry (marked as -1 = unanswered)
  const handleTimeExpired = useCallback(() => {
    const nextAnswers = [...userAnswers, selectedOption !== null ? selectedOption : -1];
    setUserAnswers(nextAnswers);

    if (currentIndex < 4 && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(60);
    } else {
      // Finished all 5 questions
      completeChallenge(nextAnswers);
    }
  }, [userAnswers, selectedOption, currentIndex, questions]);

  // Next question button clicked
  const handleNextQuestion = () => {
    const chosen = selectedOption !== null ? selectedOption : -1;
    const nextAnswers = [...userAnswers, chosen];
    setUserAnswers(nextAnswers);

    if (currentIndex < 4 && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(60);
    } else {
      completeChallenge(nextAnswers);
    }
  };

  // Calculate score and finish
  const completeChallenge = (finalAnswers: number[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);

    let score = 0;
    questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    const updatedState = recordChallengeCompletion(score, 5, selectedClass, finalAnswers);
    setChallengeState(updatedState);
    setView('result');
  };

  const currentQ = questions[currentIndex];

  // Motivational message helper
  const getMotivationalMessage = (score: number) => {
    if (score === 5) {
      return {
        title: "Perfect! 🔥 Amazing work!",
        sub: "You scored full marks on today's challenge. Your concepts are sharp!"
      };
    }
    if (score === 4) {
      return {
        title: "Great job! Keep pushing!",
        sub: "4 out of 5 is a strong score. You are well on track for mastery."
      };
    }
    if (score === 3) {
      return {
        title: "Good effort! You can beat this tomorrow.",
        sub: "Consistent daily practice turns good scores into top ranks."
      };
    }
    return {
      title: "Keep practicing. Tomorrow is another chance!",
      sub: "Review the explanations below to turn mistakes into strengths."
    };
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const s = secs < 10 ? `0${secs}` : `${secs}`;
    return `00:${s}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[95vw] sm:w-full sm:max-w-[560px] p-0 rounded-2xl md:rounded-3xl border border-[#D5DDEA] dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Accessible Dialog Title & Description for Screen Readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>Today&apos;s Challenge - Class {selectedClass}</DialogTitle>
          <DialogDescription>Daily 60-second interactive student challenge</DialogDescription>
        </DialogHeader>

        {/* =================================================================== */}
        {/* 1. CLASS SELECTION VIEW                                             */}
        {/* =================================================================== */}
        {view === 'class_select' && (
          <div className="p-6 sm:p-8 flex flex-col text-left space-y-6 overflow-y-auto">
            <div className="p-0 text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-400 border border-blue-200/60 w-fit">
                <span>🎯 TODAY&apos;S CHALLENGE</span>
              </div>
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">
                Select Your Class
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose your grade to get tailored daily questions in Mathematics, Science, and Reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(['6', '7', '8', '9', '10'] as ClassLevel[]).map((cls) => (
                <button
                  key={cls}
                  onClick={() => startChallengeForClass(cls)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all text-left group cursor-pointer",
                    selectedClass === cls
                      ? "border-[#1F4FA3] bg-blue-50/70 dark:bg-blue-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#1F4FA3]/50 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1F4FA3]/10 text-[#1F4FA3] flex items-center justify-center font-extrabold text-sm">
                      {cls}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-[#0B1F4B] dark:text-white">Class {cls}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Class {cls} Syllabus &amp; Logic</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1F4FA3] transition-colors" />
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-2">
              You can change your class anytime. Your streaks and stats will stay saved on this device.
            </p>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. ACTIVE QUIZ VIEW (5 Questions • 60s each)                        */}
        {/* =================================================================== */}
        {view === 'active_quiz' && currentQ && (
          <div className="flex flex-col h-full text-left">
            {/* Top Bar Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40 shrink-0">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4FA3] bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                    Class {selectedClass}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    Question {currentIndex + 1} of 5
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  Subject: {currentQ.subject}
                </span>
              </div>

              {/* 60s Countdown Timer */}
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold border transition-colors",
                timeLeft <= 10
                  ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                  : timeLeft <= 20
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-blue-50 text-[#1F4FA3] border-blue-200/80"
              )}>
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question & Options Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-5">
              {/* Question Text */}
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-bold text-[#0B1F4B] dark:text-white leading-snug">
                  {currentQ.question}
                </p>
              </div>

              {/* 4 MCQ Options */}
              <div className="space-y-2.5 pt-1" role="radiogroup" aria-label="Question Options">
                {currentQ.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOption(idx)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer group",
                        isSelected
                          ? "border-[#1F4FA3] bg-blue-50/80 dark:bg-blue-950/40 text-[#0B1F4B] dark:text-white shadow-sm ring-1 ring-[#1F4FA3]/30"
                          : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                          isSelected
                            ? "bg-[#1F4FA3] text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200"
                        )}>
                          {letter}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-normal break-words">
                          {optionText}
                        </span>
                      </div>

                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2",
                        isSelected
                          ? "border-[#1F4FA3] bg-[#1F4FA3] text-white"
                          : "border-slate-300 dark:border-slate-700"
                      )}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950 shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedOption !== null ? "Option selected" : "Select an answer to proceed"}
              </span>

              <Button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className={cn(
                  "h-10 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all border-none flex items-center gap-1.5",
                  selectedOption !== null
                    ? "bg-[#1F4FA3] hover:bg-[#163b7d] text-white shadow-sm"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                <span>{currentIndex === 4 ? "SUBMIT CHALLENGE" : "NEXT"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. RESULT VIEW                                                      */}
        {/* =================================================================== */}
        {(view === 'result' || view === 'already_completed') && challengeState && (
          <div className="flex flex-col h-full text-left overflow-y-auto">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{view === 'already_completed' ? "Today's Challenge Completed" : "Challenge Complete!"}</span>
                </div>

                {/* Current Class Pill */}
                <button
                  onClick={() => setView('class_select')}
                  className="text-[11px] font-bold text-[#1F4FA3] hover:underline flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Class {selectedClass} (Change)</span>
                </button>
              </div>

              {/* Score Display Card */}
              {challengeState.lastScore && (
                <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-5 rounded-2xl border border-blue-100 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Score</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl sm:text-4xl font-black text-[#0B1F4B] dark:text-white">
                          {challengeState.lastScore.score}
                        </span>
                        <span className="text-lg font-bold text-slate-400">/ 5</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Correct</p>
                          <p className="text-xs font-extrabold text-emerald-600">{challengeState.lastScore.score}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 shadow-xs">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Wrong</p>
                          <p className="text-xs font-extrabold text-rose-500">
                            {5 - challengeState.lastScore.score}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motivational Feedback */}
                  {(() => {
                    const feedback = getMotivationalMessage(challengeState.lastScore.score);
                    return (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <p className="text-sm font-extrabold text-[#0B1F4B] dark:text-white">
                          {feedback.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {feedback.sub}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Streak Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50/90 to-amber-50/60 dark:from-orange-950/30 dark:to-slate-900 border border-orange-200/70 dark:border-orange-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-lg">
                    🔥
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold text-orange-950 dark:text-orange-300">
                      {challengeState.currentStreak} DAY STREAK
                    </p>
                    <p className="text-[11px] text-orange-700 dark:text-orange-400 font-medium">
                      Come back tomorrow to keep your streak!
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Best Streak</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white">{challengeState.bestStreak} Days</p>
                </div>
              </div>

              {/* Cumulative Progress Summary */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Challenges</p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {challengeState.challengesCompleted}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Solved</p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {challengeState.totalCorrect}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {challengeState.totalAttempted > 0 
                      ? `${Math.round((challengeState.totalCorrect / challengeState.totalAttempted) * 100)}%` 
                      : '100%'}
                  </p>
                </div>
              </div>

              {/* Review Questions Accordion Toggle */}
              <div className="pt-1">
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1F4FA3]" />
                    <span>Review All 5 Questions &amp; Answers</span>
                  </span>
                  {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showReview && (
                  <div className="mt-3 space-y-3 pt-1">
                    {questions.map((q, idx) => {
                      const userChoice = challengeState.lastScore?.userAnswers[idx] ?? -1;
                      const isCorrect = userChoice === q.correctIndex;

                      return (
                        <div 
                          key={q.id || idx}
                          className={cn(
                            "p-3.5 rounded-xl border text-xs space-y-2",
                            isCorrect 
                              ? "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20" 
                              : "border-slate-200 bg-white dark:bg-slate-900"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-extrabold text-[#0B1F4B] dark:text-white leading-snug">
                              {idx + 1}. {q.question}
                            </span>
                            {isCorrect ? (
                              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Correct
                              </span>
                            ) : (
                              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                                {userChoice === -1 ? 'Skipped' : 'Wrong'}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                            <p>
                              <strong className="text-slate-700 dark:text-slate-300">Correct Answer:</strong> {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                            </p>
                            {userChoice !== q.correctIndex && userChoice !== -1 && (
                              <p className="text-rose-600">
                                <strong>Your Choice:</strong> {String.fromCharCode(65 + userChoice)}. {q.options[userChoice]}
                              </p>
                            )}
                            <p className="text-slate-500 italic mt-1">
                              <strong>Why:</strong> {q.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Finish / Return Button */}
              <div className="pt-3">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full h-11 rounded-xl bg-[#1F4FA3] hover:bg-[#163b7d] text-white font-bold text-sm shadow-sm transition-all border-none"
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
