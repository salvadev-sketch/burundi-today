"use client";

import { useState } from "react";
import { useAuthUser } from "@/lib/hooks/useAuthUser";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void; // parent refetches session / user profile
}

export default function AuthModal({ open, onClose, onAuthenticated }: AuthModalProps) {
  const { login, register, loginWithGoogle } = useAuthUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      onAuthenticated();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      onAuthenticated();
      onClose();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[380px] rounded-md bg-white p-8">
        <button
          className="absolute right-4 top-3.5 text-lg text-muted"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="font-display text-[22px] font-semibold text-ink">
          {isSignUp ? "Create your account" : "Sign in"}
        </h2>
        <p className="mb-5 mt-1.5 text-[13px] text-muted">
          {isSignUp
            ? "Join Burundi Today to comment, bookmark stories, and get notifications in your language."
            : "Sign in to comment, bookmark, and get notifications in your language."}
        </p>

        {error && (
          <div className="mb-3 rounded bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-3.5">
              <label className="mb-1.5 block text-xs font-semibold text-ink">Name</label>
              <input
                className="w-full rounded border border-line px-3 py-2.5 text-sm focus:border-teal focus:outline-none"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className="mb-3.5">
            <label className="mb-1.5 block text-xs font-semibold text-ink">Email</label>
            <input
              className="w-full rounded border border-line px-3 py-2.5 text-sm focus:border-teal focus:outline-none"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-xs font-semibold text-ink">Password</label>
            <input
              className="w-full rounded border border-line px-3 py-2.5 text-sm focus:border-teal focus:outline-none"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {!isSignUp && (
              <p className="mt-1.5 text-xs text-muted">
                Forgot your password? Contact an admin to have it reset.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-1.5 w-full rounded bg-teal py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11px] uppercase text-muted">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2 rounded border border-line py-2.5 text-sm font-semibold text-ink hover:bg-gray-50 disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
          </svg>
          {googleLoading ? "Please wait…" : "Continue with Google"}
        </button>

        <div className="mt-4 text-center text-xs text-muted">
          <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>{" "}
          <button
            className="font-semibold text-teal"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
