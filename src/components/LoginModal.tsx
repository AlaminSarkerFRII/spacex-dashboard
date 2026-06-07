"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      if (ok) {
        onClose();
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="black">
              <path d="M12 2C8.5 2 6 5 6 8c0 4 4 8 6 12 2-4 6-8 6-12 0-3-2.5-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold leading-none">SpaceX</p>
            <p className="text-zinc-500 text-xs">Mission Control</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
        <p className="text-zinc-500 text-sm mb-6">
          Use the demo account to explore.
        </p>

        {/* Demo hint */}
        <div className="mb-5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3 text-xs text-blue-400 space-y-0.5">
          <p><span className="text-blue-300 font-medium">Email:</span> admin@gmail.com</p>
          <p><span className="text-blue-300 font-medium">Password:</span> admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-black text-sm font-semibold py-2.5 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
