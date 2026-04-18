"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckSquare, TrendingUp, Download } from "lucide-react";
import { fadeSlideUp } from "@/lib/animations";

type LoginMode = "annotator" | "admin";

const features = [
  {
    title: "Annotation Campaigns",
    description: "Manage rounds of pairwise, ranking, and safety evaluation",
    icon: CheckSquare,
  },
  {
    title: "Quality Analytics",
    description:
      "Track inter-annotator agreement and gold accuracy in real time",
    icon: TrendingUp,
  },
  {
    title: "Data Export",
    description: "Ship alignment datasets in any format with full audit trails",
    icon: Download,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("annotator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push(mode === "admin" ? "/dashboard" : "/annotate");
  };

  const toggleMode = () => {
    setMode((m) => (m === "annotator" ? "admin" : "annotator"));
  };

  return (
    <div className="flex h-screen bg-off-white">
      {/* ─── Left Panel: Form ─── */}
      <div className="flex w-[580px] shrink-0 flex-col items-center justify-center px-20 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-8"
          initial="hidden"
          animate="visible"
          variants={fadeSlideUp}
        >
          {/* Brand header */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-comfortable bg-deep-teal">
                <span className="font-inter text-[13px] font-bold tracking-[0.05em] text-white">
                  DF
                </span>
              </div>
              <span className="font-inter text-[15px] font-semibold tracking-[0.08em] text-ink">
                DATAFORGE
              </span>
              <AnimatePresence mode="wait">
                {mode === "annotator" && (
                  <motion.span
                    key="badge"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-tight border-[1.5px] border-deep-teal px-2 py-0.5 font-inter text-[10px] font-semibold uppercase tracking-[0.08em] text-deep-teal"
                  >
                    Annotator
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="font-literata text-headline-md text-ink">
                Sign in
              </h1>
              <AnimatePresence mode="wait">
                <motion.p
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="font-inter text-body-md text-secondary-text"
                >
                  {mode === "annotator"
                    ? "Enter your credentials to continue"
                    : "Admin console access"}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-start gap-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={isLoading}
              icon={
                isLoading ? (
                  <Loader2 className="h-[18px] w-[18px] animate-spin" />
                ) : undefined
              }
            >
              {isLoading ? "Signing in..." : "Log in"}
            </Button>

            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="font-inter text-[13px] tracking-[0.25px] text-deep-teal transition-colors hover:underline disabled:text-tertiary-text"
            >
              {mode === "annotator"
                ? "Log in as Admin instead"
                : "Log in as Annotator instead"}
            </button>
          </div>
        </motion.form>
      </div>

      {/* ─── Right Panel: Branded ─── */}
      <div className="flex flex-1 flex-col justify-center gap-12 bg-deep-teal px-18 py-20">
        {/* Hero text */}
        <div className="flex flex-col gap-4">
          <h2 className="font-literata text-display-lg text-off-white">
            Build better AI through human feedback
          </h2>
          <p className="font-inter text-body-lg text-white/65">
            Manage annotation campaigns, track quality metrics, and ship
            alignment data at scale.
          </p>
        </div>

        {/* Spectral gradient line */}
        <div
          className="h-0.5 w-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #8B5CF6, #5B83F6, #14B8A6, #22C55E, #F59E0B, #EF4444, #8B5CF6)",
          }}
        />

        {/* Feature list */}
        <div className="flex flex-col gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3.5">
              <feature.icon className="mt-0.5 h-5 w-5 shrink-0 text-white/45" />
              <div className="flex flex-col gap-0.5">
                <span className="font-inter text-[14px] font-medium text-off-white">
                  {feature.title}
                </span>
                <span className="font-inter text-[13px] text-white/55">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
