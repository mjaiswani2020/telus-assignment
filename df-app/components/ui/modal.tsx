"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeBackdrop, slideInRight } from "@/lib/animations";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  position?: "center" | "right";
}

export function Modal({
  open,
  onClose,
  children,
  title,
  className,
  position = "center",
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            variants={fadeBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          {position === "right" ? (
            <motion.div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl overflow-y-auto",
                className
              )}
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between border-b border-level-2 px-6 py-4">
                {title && (
                  <h2 className="font-literata text-title-lg text-ink">{title}</h2>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto rounded-standard p-1.5 text-tertiary-text hover:bg-level-1 hover:text-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <motion.div
                className={cn(
                  "relative w-full max-w-lg rounded-featured bg-white p-6 shadow-xl",
                  className
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              >
                <div className="flex items-center justify-between mb-4">
                  {title && (
                    <h2 className="font-literata text-title-lg text-ink">{title}</h2>
                  )}
                  <button
                    onClick={onClose}
                    className="ml-auto rounded-standard p-1.5 text-tertiary-text hover:bg-level-1 hover:text-ink transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {children}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
