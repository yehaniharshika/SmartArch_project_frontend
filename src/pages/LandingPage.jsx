import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ScanLine,
  MessageSquare,
  Share2,
  Layers,
  Ruler,
  DoorOpen,
  Bot,
  CheckCircle2,
} from "lucide-react";

import hero01 from "../assets/hero-01.png";
import hero02 from "../assets/hero-02.png";

import PageWrapper from "../components/layout/PageWrapper.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";

const FEATURES = [
  {
    icon: ScanLine,
    title: "YOLOv8 Detection",
    desc: "State-of-the-art object detection identifies walls, doors, windows and rooms with high accuracy.",
  },
  {
    icon: Ruler,
    title: "Dimension Extraction",
    desc: "EasyOCR reads dimension annotations directly from your drawings and maps them to real-world measurements.",
  },
  {
    icon: Layers,
    title: "Area Calculation",
    desc: "Automatic floor area calculation per room and total — in m² and ft².",
  },
  {
    icon: Share2,
    title: "Instant Client Link",
    desc: "Generate a private shareable link for your client in one click — no login required for them.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Clients ask natural language questions about the floor plan and receive accurate, contextual answers.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Upload",
    desc: "Architect uploads PNG, JPG, or PDF floor plan.",
  },
  {
    n: "02",
    title: "Analyse",
    desc: "AI pipeline extracts all dimensions, labels, and areas in seconds.",
  },
  {
    n: "03",
    title: "Share",
    desc: "A unique client link is generated with a built-in chatbot.",
  },
  {
    n: "04",
    title: "Interact",
    desc: "Client asks questions and gets instant, accurate answers.",
  },
];

const SAMPLE_QUESTIONS = [
  "What is the width of the bathroom?",
  "What is the total floor area?",
  "How many windows does the living room have?",
  "Is the kitchen layout open-plan?",
  "What colour palette suits this layout?",
  "Is it good to put the bathroom door in the corner?",
];

// ── Animation variants ──────────────────────────────────────────────────────
// Reused across sections so entrance timing feels consistent site-wide.
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const stepsContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function LandingPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [hero01, hero02];

  // Auto switch images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper navTransparent>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-stone-900" />
        <div className="absolute inset-0 dot-grid opacity-10" />
        {/* Warm glow */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] bg-bronze-DEFAULT/10 rounded-full blur-[120px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-10 py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            className="space-y-8"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5
                            bg-white/5 border border-white/10 rounded-sm"
            >
              <span className="w-1.5 h-1.5 bg-bronze-light rounded-full animate-pulse-slow" />
              <span className="font-mono text-xs text-stone-300">
                AI-Powered Floor Plan Analysis
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-display text-display-xl text-arch-cream leading-[0.99]"
              style={{ fontFamily: "'Saira', sans-serif", fontWeight: "800" }}
            >
              Your floor plans,{" "}
              <em className="text-bronze-light not-italic">analysed</em>{" "}
              intelligently.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-lg text-stone-400 leading-relaxed max-w-md"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Upload any floor plan PNG, JPG or PDF. SmartArch extracts every
              dimension, detects rooms, doors and windows, then gives your
              client a private AI chatbot to explore the design.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/register"
                className="btn-primary bg-bronze-DEFAULT hover:bg-bronze-dark
             text-white border-0 px-8 py-3.5 text-lg
             rounded-md hover:rounded-full transition-all duration-300"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Start analysing
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                className="btn-secondary border-white/20 text-stone-300
                                           hover:bg-white/5 hover:border-white/30"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Sign in
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {["YOLOv8", "EasyOCR", "GPT-4o", "PyMuPDF"].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 font-mono text-xs text-stone-500"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  <CheckCircle2 size={11} className="text-bronze-light" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Mock UI Preview (Updated with Image Switcher) */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          >
            <div className="relative bg-white/5 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
              {/* Fake window chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                {["bg-red-400", "bg-amber-400", "bg-emerald-400"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 ${c} rounded-full opacity-60`}
                    />
                  ),
                )}
              </div>

              {/* Mock content */}
              <div className="p-4 space-y-4">
                {/* Image Switcher with Effect */}
                <div className="relative rounded-md overflow-hidden border border-white/10 bg-stone-950 aspect-[16/10] group">
                  {/* Title using Saira font */}
                  <div className="absolute top-5 left-5 z-20">
                    <h3
                      className="text-3xl text-white tracking-tight drop-shadow-lg"
                      style={{ fontFamily: "'Saira', sans-serif" }}
                    >
                      Smart Analysis
                    </h3>
                    <p
                      className="text-stone-300 text-sm mt-1"
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    ></p>
                  </div>

                  <AnimatePresence>
                    <motion.img
                      key={currentImage}
                      src={images[currentImage]}
                      alt={`Hero Preview ${currentImage + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </AnimatePresence>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

                  {/* Bottom Indicator Dots */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {[0, 1].map((i) => (
                      <motion.div
                        key={i}
                        className="rounded-full bg-white"
                        animate={{
                          width: currentImage === i ? 16 : 8,
                          height: 8,
                          opacity: currentImage === i ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* How it works, Features, Sample Questions, CTA ... (unchanged) */}

      {/* How it works  */}
      <section id="how" className="py-28 bg-arch-cream">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionHeader
              eyebrow="How it works"
              title="Four steps from upload to insight."
              center
              style={{ fontFamily: "'Saira', sans-serif" }}
            />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-0"
            variants={stepsContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col items-center text-center p-6 group"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-12 w-1/2 h-px bg-stone-400" />
                )}
                <motion.div
                  className="w-12 h-12 bg-stone-900 rounded-sm flex items-center justify-center mb-5
                                group-hover:bg-bronze-DEFAULT transition-colors duration-300 relative z-10"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span
                    className="font-display text-arch-cream text-xl"
                    style={{ fontFamily: "'Saira', sans-serif" }}
                  >
                    {step.n}
                  </span>
                </motion.div>
                <h3
                  className="text-2xl text-stone-900 mb-2"
                  style={{
                    fontFamily: "'Saira', sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[16px] text-stone-600 leading-relaxed"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features, Sample Questions, CTA sections remain unchanged as in your code */}
    </PageWrapper>
  );
}