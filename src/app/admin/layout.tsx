"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Sparkles,
  GraduationCap,
  Video,
  Palette,
  Briefcase,
  Cpu,
  Award,
  MessageSquareQuote,
  Mail,
  Share2,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Film,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; username?: string; email: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // If on login page, don't show the dashboard shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    fetch("/api/admin/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success && data?.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {
        // network or server error
      });
  }, [isLoginPage, router, pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      setShowLogoutModal(false);
      router.push("/admin/login");
      router.refresh();
    }
  };

  // Exact 14 navigational items + 15th Logout
  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, aliases: ["/admin"] },
    { label: "Profile / Hero", href: "/admin/profile", icon: User, aliases: ["/admin/hero"] },
    { label: "About Me", href: "/admin/about", icon: Sparkles },
    { label: "Education", href: "/admin/education", icon: GraduationCap },
    { label: "Video Projects", href: "/admin/videos", icon: Video },
    { label: "Graphic Designs", href: "/admin/designs", icon: Palette },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Skills & Tools", href: "/admin/skills", icon: Cpu },
    { label: "Experience", href: "/admin/experience", icon: Award },
    { label: "Testimonials / Reviews", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Contact Information", href: "/admin/contact", icon: Mail, aliases: ["/admin/enquiries"] },
    { label: "Social Media", href: "/admin/social", icon: Share2 },
    { label: "Website Settings", href: "/admin/settings", icon: Settings },
    { label: "Change Password", href: "/admin/change-password", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between border-b border-white/10 bg-dark-900 px-4 py-3 sticky top-0 z-30">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-electric-600 to-neon-orange text-white">
            <Film className="h-4 w-4" />
          </span>
          <span className="font-bold text-white text-sm">RANJITH KUMAR ADMIN</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-gray-400 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 flex-shrink-0 flex-col justify-between border-r border-white/10 bg-dark-900/95 backdrop-blur-xl p-4 transition-transform duration-200 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex`}
      >
        <div className="space-y-4">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-electric-600 to-neon-orange text-white shadow-md shadow-electric-600/30">
                <Film className="h-4 w-4" />
              </span>
              <div>
                <span className="text-sm font-black tracking-wider text-white block">RANJITH KUMAR</span>
                <span className="text-[10px] font-bold text-neon-orange uppercase tracking-wider block -mt-0.5">
                  Control Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Admin User Badge */}
          {adminUser && (
            <div className="rounded-xl border border-white/5 bg-dark-950/60 p-2.5 flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-electric-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {adminUser.name?.charAt(0) || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{adminUser.name}</div>
                <div className="text-[10px] text-gray-400 truncate">@{adminUser.username || "ranjithkumar"}</div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.aliases && item.aliases.includes(pathname));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-electric-600 to-purple-700 text-white shadow-md shadow-electric-600/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] text-gray-500 w-3">{index + 1}.</span>
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Live Website & Logout */}
        <div className="space-y-2 pt-4 border-t border-white/10 mt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-electric-400" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] text-gray-500">Open ↗</span>
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-[10px] text-gray-500 w-3">15.</span>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-dark-900 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Sign Out of Admin Suite?</h3>
            <p className="mt-1.5 text-xs text-gray-400">
              Are you sure you want to end your current administrative session?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
