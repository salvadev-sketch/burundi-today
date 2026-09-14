"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { apiUrl } from "@/lib/api";
import type { UserRole } from "@/lib/types";

export interface AppUserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  language: string;
}

interface AuthUserState {
  profile: AppUserProfile | null;
  isSignedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  /** Convenience fetch wrapper that attaches a fresh Firebase ID token.
   * The Firebase SDK handles token refresh internally, so unlike the old
   * JWT version, this never needs a manual refresh-and-retry step. */
  authedFetch: (input: string, init?: RequestInit) => Promise<Response>;
}

const AuthUserContext = createContext<AuthUserState | null>(null);

/** Calls the backend to create/update the Mongo profile for the currently
 * signed-in Firebase user, and returns it. This is the only place a User
 * document gets created — every sign-in and sign-up path routes through
 * here right after Firebase confirms the identity. */
async function syncProfile(firebaseUser: FirebaseUser): Promise<AppUserProfile> {
  const token = await firebaseUser.getIdToken();
  const res = await fetch(apiUrl("/api/auth/sync"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: firebaseUser.displayName || undefined,
      avatarUrl: firebaseUser.photoURL || undefined,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to sync profile");
  }
  return data.user as AppUserProfile;
}

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase's own onAuthStateChanged is the single source of truth for
  // "who's signed in" — it fires on mount with the restored session (if
  // any), and again on every sign-in/sign-out, so there's no manual
  // refresh-token bookkeeping needed the way the old JWT version required.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const syncedProfile = await syncProfile(firebaseUser);
        setProfile(syncedProfile);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    setProfile(await syncProfile(credential.user));
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    setProfile(await syncProfile(credential.user));
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    setProfile(await syncProfile(credential.user));
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    setProfile(null);
  }, []);

  const authedFetch = useCallback(async (input: string, init: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(init.headers);
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      headers.set("Authorization", `Bearer ${await currentUser.getIdToken()}`);
    }
    // Every call site in this app that sends a body passes a raw JSON
    // string without setting Content-Type — without it, the backend's
    // express.json() middleware won't parse the body at all.
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(apiUrl(input), { ...init, headers });
  }, []);

  return (
    <AuthUserContext.Provider
      value={{ profile, isSignedIn: !!profile, loading, login, register, loginWithGoogle, logout, authedFetch }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser(): AuthUserState {
  const ctx = useContext(AuthUserContext);
  if (!ctx) {
    throw new Error("useAuthUser must be used within an AuthUserProvider");
  }
  return ctx;
}
