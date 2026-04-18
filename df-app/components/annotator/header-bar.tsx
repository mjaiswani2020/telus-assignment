"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function HeaderBar() {
  const router = useRouter();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between bg-deep-teal px-6">
      {/* Left: branding */}
      <Link href="/annotate" className="flex items-center gap-3">
        <span className="font-inter text-[15px] font-bold tracking-[0.08em] text-white">
          <span className="opacity-70">DF</span>{"  "}DATAFORGE
        </span>
        <span className="rounded-tight border border-white/50 px-2 py-0.5 font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-white">
          ANNOTATOR
        </span>
      </Link>

      {/* Right: profile */}
      <div className="flex items-center gap-3">
        <Link
          href="/annotate/profile"
          className="rounded-standard border border-white/50 px-3 py-1.5 font-inter text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          My Profile
        </Link>
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-opacity hover:bg-white/30"
          >
            <span className="font-inter text-[13px] font-medium text-white">M</span>
          </button>
          {avatarOpen && (
            <div className="absolute right-0 mt-1 w-40 rounded-comfortable border border-level-2 bg-white py-1 shadow-lg z-50">
              <button
                onClick={() => { setAvatarOpen(false); router.push("/login"); }}
                className="flex w-full items-center gap-2.5 px-3 py-2 font-inter text-[13px] text-ink hover:bg-level-1 transition-colors"
              >
                <LogOut className="h-4 w-4 text-tertiary-text" />
                Sign Out
              </button>
            </div>
          )}
        </div>
        <span className="font-inter text-[14px] text-white">Marcus T.</span>
      </div>
    </header>
  );
}
