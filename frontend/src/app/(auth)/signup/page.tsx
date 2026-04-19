"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

function getFirebaseErrorMessage(error: unknown): string | null {
  if (error instanceof FirebaseError) {
    console.log("[Firebase Auth Error]", error.code, error.message);
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists. Try logging in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters long.";
      case "auth/cancelled-popup-request":
      case "auth/popup-closed-by-user":
        return null; // Handle silently
      case "auth/operation-not-allowed":
        return "Email/password sign-up is not enabled. Please contact support.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        return error.message;
    }
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred. Please try again.";
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [googleCancelled, setGoogleCancelled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signupWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGoogleCancelled(false);
    try {
      await signupWithEmail(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleCancelled(false);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      const msg = getFirebaseErrorMessage(err);
      if (msg) {
        setError(msg);
      } else {
        setGoogleCancelled(true);
        setTimeout(() => setGoogleCancelled(false), 3000);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-slate-400">Join SkyLink for a premium travel experience</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {googleCancelled && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl mb-6 text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <span>Login cancelled</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              required
              autoComplete="name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder:text-slate-600"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder:text-slate-600"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1 ml-1">Minimum 6 characters</p>
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-white font-semibold py-3 rounded-xl mt-4 shadow-lg shadow-blue-900/20"
          >
            {loading ? "Creating Account…" : "Sign Up"}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-slate-950 px-4 text-xs text-slate-500 uppercase tracking-widest">
            or continue with
          </span>
        </div>

        <button
          id="signup-google"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 transition text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </>
          )}
        </button>

        <p className="text-center mt-8 text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
