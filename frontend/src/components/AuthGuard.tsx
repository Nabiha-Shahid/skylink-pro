"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

// Define paths that unauthenticated users are allowed to see
const publicPaths = ["/login", "/register", "/"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading, no user, AND they are NOT on a public route, redirect to login.
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"></div>
          <p className="mt-4 text-slate-400 font-medium tracking-wide">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If no user and trying to view a protected page, render nothing to avoid content flashes while redirecting
  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  // Render the page if the user is logged in, OR if they are on a safe public path
  return <>{children}</>;
}