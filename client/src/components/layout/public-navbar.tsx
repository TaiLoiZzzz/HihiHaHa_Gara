"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, LogIn, LayoutDashboard, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

export function PublicNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Trang Chủ", href: "/" },
    { label: "Dịch Vụ & Bảng Giá", href: "/services" },
    { label: "Kiến Thức Ô Tô", href: "/blog" },
  ];

  return (
    <header className="relative z-30 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl sticky top-0 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 font-bold shadow-amber-glow border border-amber-300/50 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-base text-zinc-900 dark:text-zinc-100 font-sans">
                HIHIHAHA<span className="text-amber-500">.AUTO</span>
              </span>
              <span className="px-1 py-0.2 text-[9px] font-mono font-bold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                4S
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 tracking-tight hidden sm:block">
              Smart Workshop & Graph-RAG AI
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-amber-500 dark:text-amber-400 font-bold"
                    : "hover:text-amber-500 dark:hover:text-amber-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions: Theme Toggle & Login Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <LiquidGlassButton size="sm" variant="primary">
              <LogIn className="w-3.5 h-3.5 text-zinc-950" />
              Đăng Nhập Cổng Gara
            </LiquidGlassButton>
          </Link>
        </div>

      </div>
    </header>
  );
}
