"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface ProfileModalProps {
  onClose: () => void;
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  function handleLogout() {
    logout();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-72 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header banner */}
        <div className="h-16 bg-gradient-to-r from-zinc-800 to-zinc-700 relative" />

        {/* Avatar overlapping the banner */}
        <div className="px-5 pb-5">
          <div className="-mt-8 mb-3">
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold ring-4 ring-zinc-900">
              {initials}
            </div>
          </div>

          <h3 className="text-white font-semibold text-base leading-tight">{user.name}</h3>
          <p className="text-zinc-400 text-sm mt-0.5">{user.email}</p>

          {/* Details */}
          <div className="mt-4 space-y-2">
            <DetailRow label="Role" value={user.role} />
            <DetailRow label="Member since" value={user.since} />
            <DetailRow label="Account type" value="Demo" />
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Actions */}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium py-2 hover:bg-red-500/20 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs font-medium text-zinc-300">{value}</span>
    </div>
  );
}
