"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { Heart, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import confetti from "canvas-confetti";

export default function TruthKissGame() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const outcomes = [
    { type: "truth", text: "Truth: What was our first date like?" },
    { type: "kiss", text: "Kiss: A virtual embrace!" },
    { type: "truth", text: "Truth: When did you first know?" },
    { type: "kiss", text: "Kiss: Infinite love!" },
    { type: "truth", text: "Truth: What's your favorite memory?" },
    { type: "kiss", text: "Kiss: Sealed with devotion!" },
    { type: "truth", text: "Truth: What do you love most?" },
    { type: "kiss", text: "Kiss: Forever yours!" },
  ];

  const SEGMENT_ANGLE = 360 / outcomes.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Pick a random winner index
    const winningIndex = Math.floor(Math.random() * outcomes.length);

    // Calculate rotation to land on the winner
    // We want the winner segment to be at the top (0 degrees or 270 degrees depending on css)
    // Assuming standard 0 is right, pointer is at top (270/-90).
    // Let's say pointer is at top.
    // To land, we need: TotalRotation = (FullSpins * 360) - (Index * SegmentAngle)
    // Adding some random offset inside the segment to be realistic
    const extraSpins = 5;
    const randomOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE - 2); // Stay within segment
    const targetRotation =
      360 * extraSpins + (360 - winningIndex * SEGMENT_ANGLE) + randomOffset;

    gsap.to(wheelRef.current, {
      rotation: targetRotation,
      duration: 4,
      ease: "power4.out",
      onComplete: () => {
        setSpinning(false);
        setResult(outcomes[winningIndex].text);

        // Victory effects
        const color =
          outcomes[winningIndex].type === "kiss" ? "#c10157" : "#8bd5c4";
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [color, "#ffffff"],
        });
      },
    });
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4e0b37] to-[#c10157] rounded-t-3xl" />

          <div className="flex flex-col items-center text-center gap-8 relative z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-[#c10157]/20 border border-[#c10157]/50 shadow-[0_0_30px_rgba(193,1,87,0.3)]">
                <Heart className="w-12 h-12 text-[#c10157]" />
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-[#f2f8fc] tracking-tight text-glow"
                style={{ fontFamily: "Walkway, sans-serif" }}
              >
                Truth Kiss
              </h1>
              <p className="text-white/60 max-w-md">
                Spin the digital wheel of destiny. Let fate decide whether you
                share a truth or receive a kiss.
              </p>
            </div>

            <div className="py-8 flex flex-col items-center gap-12">
              <div className="relative">
                {/* Pointer */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-8 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  <div className="w-full h-full bg-[#f2f8fc] border-4 border-[#05141f] rotate-45 transform origin-center" />
                </div>

                {/* Wheel Container */}
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[0_0_50px_rgba(193,1,87,0.2)]">
                  <div
                    ref={wheelRef}
                    className="w-full h-full rounded-full relative overflow-hidden"
                    style={{
                      background: `conic-gradient(
                        #c10157 0deg 45deg,
                        #4e0b37 45deg 90deg,
                        #c10157 90deg 135deg,
                        #4e0b37 135deg 180deg,
                        #c10157 180deg 225deg,
                        #4e0b37 225deg 270deg,
                        #c10157 270deg 315deg,
                        #4e0b37 315deg 360deg
                      )`,
                    }}
                  >
                    {/* Segments Text/Icons - Positioned relative to center */}
                    {outcomes.map((item, i) => (
                      <div
                        key={i}
                        className="absolute w-full h-full top-0 left-0 flex justify-center pt-4"
                        style={{ transform: `rotate(${i * 45 + 22.5}deg)` }}
                      >
                        <span className="text-white/90 font-bold text-xs uppercase tracking-wider transform -translate-y-1">
                          {item.type}
                        </span>
                      </div>
                    ))}

                    {/* Center Cap */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#05141f] rounded-full border-4 border-[#c10157] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(193,1,87,0.5)]">
                      <Sparkles className="w-5 h-5 text-[#c10157]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-24 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="bg-[#c10157]/20 border border-[#c10157]/50 rounded-2xl p-6 max-w-md relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine" />
                      <p className="text-[#f2f8fc] font-bold text-xl md:text-2xl text-glow">
                        {result}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="instruction"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/40 italic"
                    >
                      {spinning ? "Fate is spinning..." : "Ready to play?"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                onClick={spin}
                disabled={spinning}
                className="bg-gradient-to-r from-[#4e0b37] to-[#c10157] hover:from-[#5e1347] hover:to-[#d11167] text-white px-12 py-8 text-xl rounded-full shadow-[0_0_30px_rgba(193,1,87,0.3)] hover:shadow-[0_0_50px_rgba(193,1,87,0.5)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {spinning ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" /> Spinning...
                  </span>
                ) : (
                  "Spin the Wheel"
                )}
              </Button>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8bd5c4] opacity-40">
              Digital Sanctuary Protocol
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
