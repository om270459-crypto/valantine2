"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Sparkles, ArrowLeft, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SoulBondGame() {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<{
    id: number;
    text: string;
    color: string;
  } | null>(null);

  // Rhythm constants
  const BPM = 60;
  const BEAT_INTERVAL = 60000 / BPM; // 1000ms

  const handleClick = () => {
    const now = Date.now();
    // Check timing relative to the beat
    // The beat happens at multiples of BEAT_INTERVAL
    // We want to be close to a multiple
    const offset = now % BEAT_INTERVAL;
    const diff = Math.min(offset, BEAT_INTERVAL - offset);

    let text = "";
    let color = "";
    let points = 0;

    // Window: +/- 150ms for Perfect, 300ms for Good
    if (diff < 150) {
      text = "Perfect!";
      color = "#8bd5c4"; // Cyan
      points = 10 + combo;
      setCombo((c) => c + 1);
    } else if (diff < 300) {
      text = "Good";
      color = "#f2f8fc"; // White
      points = 5;
      setCombo(0); // Reset combo on non-perfect? Or keep? Let's keep combo only on perfect for challenge
    } else {
      text = "Miss";
      color = "#c10157"; // Red
      points = 0;
      setCombo(0);
    }

    setScore((s) => s + points);
    setFeedback({ id: now, text, color });

    // Auto-clear feedback after animation
    setTimeout(() => {
      setFeedback((prev) => (prev?.id === now ? null : prev));
    }, 800);
  };

  const resetGame = () => {
    setScore(0);
    setCombo(0);
    setFeedback(null);
  };

  const getLevel = () => {
    if (score >= 500) return "Eternal Bond";
    if (score >= 250) return "Deep Connection";
    if (score >= 100) return "Growing Bond";
    if (score >= 50) return "First Spark";
    return "Beginning";
  };

  return (
    <div className="min-h-screen pt-40 pb-12 px-6 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/games">
          <a className="inline-flex items-center gap-2 text-[#8bd5c4] hover:text-[#f2f8fc] transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">
              Back to Games
            </span>
          </a>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2a3294] to-[#4ba4dc] rounded-t-3xl" />

          <div className="flex flex-col items-center text-center gap-8 relative z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-[#4ba4dc]/20 border border-[#4ba4dc]/50 shadow-[0_0_30px_rgba(75,164,220,0.3)]">
                <Sparkles className="w-12 h-12 text-[#4ba4dc]" />
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-[#f2f8fc] tracking-tight text-glow-cyan"
                style={{ fontFamily: "Walkway, sans-serif" }}
              >
                Soul Bond
              </h1>
              <p className="text-white/60 max-w-md">
                Feel the rhythm of our synchronized hearts. Click when the guide
                circle matches the center heart!
              </p>
            </div>

            <div className="flex items-center gap-12 text-white/60 bg-black/20 p-4 rounded-2xl border border-white/5">
              <div className="text-center w-24">
                <p className="text-3xl font-bold text-[#4ba4dc] text-glow-cyan">
                  {score}
                </p>
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Sync Score
                </p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center w-24">
                <p className="text-3xl font-bold text-[#8bd5c4]">{combo}x</p>
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Combo
                </p>
              </div>
            </div>

            <div className="py-12 relative flex items-center justify-center h-64 w-64">
              {/* Feedback Text */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-20 font-bold text-2xl tracking-widest uppercase"
                    style={{
                      color: feedback.color,
                      textShadow: `0 0 20px ${feedback.color}`,
                    }}
                  >
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Core Heart Button */}
              <div className="relative z-10">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClick}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2a3294] to-[#4ba4dc] flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(75,164,220,0.4)] hover:shadow-[0_0_70px_rgba(75,164,220,0.6)] transition-shadow border-4 border-[#8bd5c4]/30"
                >
                  <Heart className="w-14 h-14 text-white fill-white/20" />
                </motion.div>
              </div>

              {/* Rhythm Guide Circle */}
              {/* This circle scales down from 2 to 1 repeatedly every 1000ms */}
              <motion.div
                animate={{ scale: [1.8, 1], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="absolute w-32 h-32 rounded-full border-2 border-[#8bd5c4] pointer-events-none"
              />

              {/* Background visualizer pulse */}
              <motion.div
                animate={{ scale: [1, 1.2], opacity: [0.2, 0] }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
                className="absolute w-32 h-32 rounded-full bg-[#4ba4dc] pointer-events-none -z-10"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-6 w-full max-w-sm border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[#8bd5c4] font-bold text-lg">{getLevel()}</p>
                <span className="text-xs text-white/40">
                  {Math.min(score, 500)} / 500
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#4ba4dc] to-[#8bd5c4] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((score / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            <Button
              onClick={resetGame}
              variant="outline"
              className="border-white/20 text-[#f2f8fc] hover:bg-white/10 bg-transparent rounded-full px-8"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Rhythm
            </Button>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8bd5c4] opacity-40">
              Digital Sanctuary Protocol
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
