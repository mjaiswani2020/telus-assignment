"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toastSlide } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
  error: <AlertTriangle className="h-4 w-4 text-error" />,
  warning: <AlertTriangle className="h-4 w-4 text-caution" />,
  info: <Info className="h-4 w-4 text-info" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              variants={toastSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={cn(
                "flex items-center gap-2.5 rounded-comfortable border bg-white px-4 py-3 shadow-lg",
                {
                  "border-[#A7F3D0]": t.type === "success",
                  "border-[#FECACA]": t.type === "error",
                  "border-[#FED7AA]": t.type === "warning",
                  "border-[#BFDBFE]": t.type === "info",
                }
              )}
            >
              {iconMap[t.type]}
              <p className="font-inter text-body-md text-ink">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-2 text-tertiary-text hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
