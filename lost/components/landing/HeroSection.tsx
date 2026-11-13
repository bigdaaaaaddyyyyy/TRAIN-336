"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SampleQuote {
  quote: string;
  author: string | null;
  feel: string;
  profession: string;
  level: string;
}

const SAMPLE_QUOTES: Record<string, SampleQuote> = {
  OVERWHELMED: {
    feel: "Overwhelmed",
    profession: "Software Engineer",
    level: "Mid-Level",
    quote:
      "You do not have to finish the entire cathedral today. Lay one true brick, breathe, and let the rest wait.",
    author: "Marcus Aurelius",
  },
  LOST_UNCERTAIN: {
    feel: "Lost / Uncertain",
    profession: "Entrepreneur",
    level: "Founder",
    quote:
      "Not all who wander are adrift. Often, uncertainty is simply the mind unlearning what no longer serves the journey.",
    author: "J.R.R. Tolkien",
  },
  UNMOTIVATED: {
    feel: "Unmotivated",
    profession: "Designer",
    level: "Senior",
    quote:
      "Inspiration is for amateurs. The rest of us just show up and get to work. Start small, and the feeling will follow.",
    author: "Chuck Close",
  },
  AMBITIOUS: {
    feel: "Ambitious",
    profession: "Healthcare / Resident",
    level: "Early Career",
    quote:
      "Small daily disciplines compounded over years create monumental transformations that luck can never replicate.",
    author: "James Clear",
  },
  TIRED: {
    feel: "Tired",
    profession: "Engineering Manager",
    level: "Lead",
    quote:
      "Rest is not a surrender; it is the prerequisite for clarity. Give yourself permission to pause.",
    author: null,
  },
};

const FEEL_OPTIONS = [
  { key: "OVERWHELMED", label: "Overwhelmed" },
  { key: "LOST_UNCERTAIN", label: "Lost / Uncertain" },
  { key: "UNMOTIVATED", label: "Unmotivated" },
  { key: "AMBITIOUS", label: "Ambitious" },
  { key: "TIRED", label: "Tired" },
];

export function HeroSection() {
  const [selectedFeel, setSelectedFeel] = useState("OVERWHELMED");
  const [secondsRemaining, setSecondsRemaining] = useState(384);

  // Simulated live 10-minute global countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const activeData = SAMPLE_QUOTES[selectedFeel];

  return (
    <div className="relative overflow-hidden bg-stone-50 text-stone-900 dark:bg-[#0c0d10] dark:text-stone-100 min-h-screen flex flex-col">  

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="text-base font-semibold tracking-wider">LOST</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 shadow-sm transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Value Proposition */}
          <div className="flex flex-col items-start lg:col-span-6 xl:col-span-6">
            
            {/* Tranquil Eyebrow Badge */}
            {/* Headline */}
            <h1 className="mt-5 text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-5xl dark:text-stone-50">
              Quiet perspective for your hardest work days.
            </h1>

            {/* Description */}
            <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-400">
              Generic quotes don&apos;t help when work feels heavy. LOST pairs you with grounded, relevant perspective tailored to your profession, career stage, and emotional state—refreshed in globally synchronized 10-minute intervals.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-medium text-stone-50 shadow-sm transition hover:bg-stone-800 active:scale-[0.99] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                Start Your Routine
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-stone-300/80 bg-white/60 px-5 py-3.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Trust and Tenet Markers */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-200/70 pt-6 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span>Strictly read-only flashcard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span>No social feeds or likes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span>Fixed 10-minute global cadence</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Flashcard Preview */}
          <div className="flex flex-col items-center justify-center lg:col-span-6 xl:col-span-6">
            <div className="w-full max-w-lg">
              
              {/* Product Card Container */}
              <div className="group relative rounded-2xl border border-stone-200/90 bg-white p-7 shadow-lg shadow-stone-200/30 transition-all dark:border-stone-800/80 dark:bg-stone-900/80 dark:shadow-none sm:p-9">
                
                {/* Flashcard Header / Global Cadence Bar */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-5 text-xs text-stone-500 dark:border-stone-800/80 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="font-medium tracking-wide uppercase">
                      Current Interval
                    </span>
                  </div>
                  <div className="font-mono text-xs text-stone-600 dark:text-stone-400">
                    Next in {formatCountdown(secondsRemaining)}
                  </div>
                </div>

                {/* Personalization Meta Chips */}
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {activeData.profession}
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {activeData.level}
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {activeData.feel}
                  </span>
                </div>

                {/* Quote Display Area */}
                <div className="my-8 min-h-[140px] flex flex-col justify-center">
                  <blockquote className="font-serif text-xl font-normal leading-relaxed text-stone-800 sm:text-2xl dark:text-stone-100">
                    &ldquo;{activeData.quote}&rdquo;
                  </blockquote>
                  
                  {activeData.author ? (
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium tracking-wide text-stone-500 dark:text-stone-400">
                      <span className="h-px w-4 bg-stone-300 dark:bg-stone-700" />
                      <span>{activeData.author}</span>
                    </div>
                  ) : (
                    <div className="mt-4 text-xs italic text-stone-400">
                      Unattributed
                    </div>
                  )}
                </div>

                {/* Interactive Demo Controller */}
                <div className="rounded-xl border border-stone-100 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-950/40">
                  <div className="mb-2 text-[11px] font-medium tracking-wide uppercase text-stone-500 dark:text-stone-400">
                    Try changing your emotional state:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FEEL_OPTIONS.map((item) => {
                      const isActive = selectedFeel === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedFeel(item.key)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                            isActive
                              ? "bg-stone-900 text-stone-50 shadow-xs dark:bg-stone-100 dark:text-stone-900"
                              : "bg-white text-stone-600 hover:bg-stone-200/60 dark:bg-stone-800/60 dark:text-stone-300 dark:hover:bg-stone-800"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Sub-Notice */}
                <div className="mt-4 text-center text-[11px] text-stone-400 dark:text-stone-500">
                  Read-only flashcard · Synced across sessions and devices
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Subtle Footer Note */}
      <footer className="relative z-10 border-t border-stone-200/50 py-6 text-center text-xs text-stone-400 dark:border-stone-800/50 dark:text-stone-500">
        LOST — Personalized, synchronized motivational messaging.
      </footer>
    </div>
  );
}

