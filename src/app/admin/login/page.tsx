"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Invalid username or password. Please try again.");
      }
    } catch {
      setError("An unexpected network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-electric-600/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-neon-orange/15 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-dark-900/90 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/80">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-electric-600 to-neon-orange text-white shadow-lg shadow-electric-600/40 group-hover:scale-105 transition-transform">
                <Film className="h-6 w-6" />
              </span>
            </Link>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Studio Admin Portal
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Secure management dashboard for Ranjith Kumar&apos;s portfolio
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-400 animate-fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-dark-950 pl-10 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500 transition-all"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 via-purple-600 to-neon-orange px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin Suite"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              ← Return to Ranjith Kumar Creative Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
