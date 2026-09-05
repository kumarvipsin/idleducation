'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { FormModalDialogContent } from '@/components/ui/form-modal-dialog';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Flame
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
        title: "Perfect! 🔥 Outstanding score!",
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
        title: "Good effort! You can beat this tomorrow. 💪",
        sub: "Consistent daily practice turns good scores into top ranks."
      };
    }
    return {
      title: "Good start! Keep practicing. 🔥",
      sub: "Every challenge makes you sharper. Review the explanations below to grow!"
    };
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const s = secs < 10 ? `0${secs}` : `${secs}`;
    return `00:${s}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <FormModalDialogContent
        maxWidthClass="max-w-[580px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
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
          <div className="p-5 sm:p-7 flex flex-col text-left space-y-5 overflow-y-auto min-h-0 pr-12 sm:pr-14 overscroll-contain">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-400 border border-blue-200/60 w-fit">
                <span>TODAY&apos;S CHALLENGE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">
                Select Your Class
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose your grade to get tailored daily questions in Mathematics, Science, and Reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {(['6', '7', '8', '9', '10'] as ClassLevel[]).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => startChallengeForClass(cls)}
                  className={cn(
                    "flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all text-left group cursor-pointer",
                    selectedClass === cls
                      ? "border-[#1F4FA3] bg-blue-50/70 dark:bg-blue-950/40 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#1F4FA3]/50 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1F4FA3]/10 text-[#1F4FA3] flex items-center justify-center font-extrabold text-xs">
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

            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-1">
              You can change your class anytime. Streaks and stats remain saved on this device.
            </p>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. ACTIVE QUIZ VIEW (5 Questions • 60s each)                        */}
        {/* =================================================================== */}
        {view === 'active_quiz' && currentQ && (
          <div className="flex flex-col h-full min-h-0 text-left">
            {/* Top Bar Header: Compact Quiz Header */}
            <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 pr-12 sm:pr-14">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-[#1F4FA3] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/40 shrink-0">
                      TODAY&apos;S CHALLENGE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 truncate">
                      Class {selectedClass} • {currentQ.subject}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Question {currentIndex + 1} of 5
                  </h2>
                </div>

                {/* 60s Countdown Timer Badge */}
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors shrink-0",
                    timeLeft <= 10
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                      : timeLeft <= 20
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                      : "bg-blue-50/80 text-[#1F4FA3] border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60"
                  )}
                  aria-label={`Time remaining: ${timeLeft} seconds`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-[2.5px] rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#1F4FA3] h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Question & Options Scrollable Body */}
            <div className="px-5 sm:px-6 py-5 sm:py-6 overflow-y-auto flex-1 min-h-0 space-y-5 overscroll-contain">
              {/* Question Text */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F4FA3] dark:text-blue-400">
                  QUESTION {currentIndex + 1}
                </p>
                <h3 className="text-[19px] sm:text-[23px] lg:text-[24px] font-bold text-slate-900 dark:text-white leading-[1.3] tracking-tight">
                  {currentQ.question}
                </h3>
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
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedOption(idx)}
                      className={cn(
                        "w-full min-h-[52px] sm:min-h-[56px] flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer group",
                        isSelected
                          ? "border-[#1F4FA3] bg-blue-50/80 dark:bg-blue-950/50 text-[#0B1F4B] dark:text-white shadow-xs ring-1 ring-[#1F4FA3]/30"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#1F4FA3]/40 hover:bg-slate-50/80"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                        <div
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                            isSelected
                              ? "bg-[#1F4FA3] text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-[#1F4FA3]"
                          )}
                        >
                          {letter}
                        </div>
                        <span className="text-[14px] sm:text-[15.5px] font-medium text-slate-800 dark:text-slate-200 leading-snug break-words">
                          {optionText}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "border-[#1F4FA3] bg-[#1F4FA3] text-white"
                            : "border-slate-300 dark:border-slate-700 group-hover:border-slate-400"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Controls: Pinned at bottom */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950 shrink-0">
              <div className="flex items-center gap-1.5">
                {selectedOption !== null ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Option selected</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Select an answer to proceed
                  </span>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className={cn(
                  "h-10 sm:h-10.5 px-5 sm:px-6 rounded-[8px] font-bold text-xs sm:text-sm transition-all border-none flex items-center gap-1.5 cursor-pointer shadow-xs",
                  selectedOption !== null
                    ? "bg-[#1F4FA3] hover:bg-[#163b7d] text-white hover:shadow-md active:scale-[0.99]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70"
                )}
              >
                <span>{currentIndex === 4 ? "SUBMIT CHALLENGE" : "NEXT QUESTION"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. RESULT VIEW                                                      */}
        {/* =================================================================== */}
        {(view === 'result' || view === 'already_completed') && challengeState && (
          <div className="flex flex-col h-full min-h-0 text-left overflow-y-auto overscroll-contain">
            <div className="p-5 sm:p-7 space-y-5 pr-12 sm:pr-14">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{view === 'already_completed' ? "Today's Challenge Completed" : "Challenge Complete!"}</span>
                </div>

                {/* Current Class Pill */}
                <button
                  type="button"
                  onClick={() => setView('class_select')}
                  className="text-[11px] font-bold text-[#1F4FA3] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Class {selectedClass} (Change)</span>
                </button>
              </div>

              {/* Score Hero Card with Circular Progress Ring */}
              {challengeState.lastScore && (
                <div className="bg-slate-50/80 dark:bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    {/* Left: Hero Score with Circular Progress Ring */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          {/* Background track circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            className="stroke-slate-200 dark:stroke-slate-800"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          {/* Active progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            className={cn(
                              "transition-all duration-700 ease-out",
                              challengeState.lastScore.score >= 4 
                                ? "stroke-[#1F4FA3]" 
                                : challengeState.lastScore.score >= 3 
                                ? "stroke-[#1F4FA3]" 
                                : "stroke-blue-500"
                            )}
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * (challengeState.lastScore.score / 5))}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        
                        {/* Centered Score */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-2xl sm:text-3xl font-black text-[#0B1F4B] dark:text-white leading-none tracking-tight">
                            {challengeState.lastScore.score}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-400 ml-0.5">
                            /5
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Today&apos;s Score</p>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#0B1F4B] dark:text-white leading-tight">
                          {challengeState.lastScore.score} of 5 Correct
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {Math.round((challengeState.lastScore.score / 5) * 100)}% Accuracy today
                        </p>
                      </div>
                    </div>

                    {/* Right: Quick Breakdown Pills */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <div className="text-left">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Correct</p>
                          <p className="text-xs font-extrabold text-emerald-600">{challengeState.lastScore.score}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 shadow-xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <div className="text-left">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Wrong</p>
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
                      <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 text-left">
                        <p className="text-sm font-extrabold text-[#0B1F4B] dark:text-white">
                          {feedback.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {feedback.sub}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Streak Banner */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/50 dark:from-amber-950/30 dark:to-slate-900 border border-amber-200/70 dark:border-amber-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-base shrink-0">
                    <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-amber-950 dark:text-amber-200 tracking-tight">
                      {challengeState.currentStreak} {challengeState.currentStreak === 1 ? 'DAY' : 'DAYS'} STREAK
                    </p>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-400 font-medium">
                      Come back tomorrow to keep your streak alive!
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">Best Streak</p>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
                    {challengeState.bestStreak} {challengeState.bestStreak === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
              </div>

              {/* Cumulative Progress Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">Challenges</p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {challengeState.challengesCompleted}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">Attempted</p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {challengeState.totalAttempted || 5}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight">Accuracy</p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {challengeState.totalAttempted > 0 
                      ? `${Math.round((challengeState.totalCorrect / challengeState.totalAttempted) * 100)}%` 
                      : '100%'}
                  </p>
                </div>
              </div>

              {/* Review Questions Accordion Toggle */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowReview(!showReview)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
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
                            "p-3.5 rounded-xl border text-xs space-y-2 text-left",
                            isCorrect 
                              ? "border-emerald-200/80 bg-emerald-50/40 dark:bg-emerald-950/20" 
                              : "border-rose-200/60 bg-rose-50/25 dark:bg-rose-950/20"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-extrabold text-[#0B1F4B] dark:text-white leading-snug">
                              {idx + 1}. {q.question}
                            </span>
                            {isCorrect ? (
                              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" /> Correct
                              </span>
                            ) : (
                              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                                {userChoice === -1 ? 'Skipped' : 'Incorrect'}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                            <p>
                              <strong className="text-slate-700 dark:text-slate-300">Correct Answer:</strong> {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                            </p>
                            {userChoice !== q.correctIndex && userChoice !== -1 && (
                              <p className="text-rose-600 dark:text-rose-400">
                                <strong>Your Answer:</strong> {String.fromCharCode(65 + userChoice)}. {q.options[userChoice]}
                              </p>
                            )}
                            <p className="text-slate-500 italic mt-1 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                              <strong className="not-italic text-slate-600 dark:text-slate-300">Explanation:</strong> {q.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Finish / Return Button */}
              <div className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full h-10 sm:h-11 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        )}
      </FormModalDialogContent>
    </Dialog>
  );
}
