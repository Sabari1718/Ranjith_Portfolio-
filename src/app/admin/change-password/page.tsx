"use client";

import { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Password changed successfully! Keep your new password safe." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred while updating password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-neon-orange" />
          <span>Change Admin Password</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Update the master administrative password used to log in to this portfolio dashboard.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs font-semibold ${
            message.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Security Info Card */}
      <div className="rounded-2xl border border-electric-500/20 bg-electric-500/5 p-4 text-xs text-gray-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-electric-300">
          <ShieldCheck className="h-4 w-4 text-electric-400" />
          <span>Security Recommendations</span>
        </div>
        <p className="text-gray-400 leading-relaxed">
          Before deploying to a public domain, change the default password (<code className="text-neon-orange font-mono">ranjith@1718</code>) to a strong unique passphrase. Password updates are encrypted with 10 bcrypt salt rounds.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-dark-900/90 p-6 sm:p-7 space-y-5 shadow-xl">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Current Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter existing password"
              className="w-full rounded-xl border border-white/10 bg-dark-950 pl-10 pr-10 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-white/10 bg-dark-950 pl-10 pr-10 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Confirm New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-white/10 bg-dark-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-600 to-neon-orange px-6 py-3 text-sm font-bold text-white shadow-lg shadow-electric-600/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? "Updating Password..." : "Update Master Password"}</span>
        </button>
      </form>
    </div>
  );
}

