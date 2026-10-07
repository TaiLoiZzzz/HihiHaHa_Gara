"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, User, Shield, PhoneCall } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

export function PublicNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Trang Chủ", href: "/" },
    { label: "Dịch Vụ & Bảng Giá", href: "/services" },
    { label: "Cẩm Nang Xe Ô Tô", href: "/blog" },
  ];

  return (
    <header className="relative z-30 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl sticky top-0 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="HiHiHaHa Auto Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-base text-zinc-900 dark:text-zinc-100 font-sans">
                HIHIHAHA<span className="text-amber-500"> AUTO</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                GARA 4S
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 tracking-tight hidden sm:block">
              Trung Tâm Chăm Sóc & Sửa Chữa Ô Tô Chuyên Nghiệp
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

        {/* Actions: Hotline, Portal Switch, Theme Toggle & Login Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/staff/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Cổng Nhân Viên
          </Link>

          <Link href="/login">
            <LiquidGlassButton size="sm" variant="primary">
              <User className="w-3.5 h-3.5 text-zinc-950" />
              Đăng Nhập Chủ Xe
            </LiquidGlassButton>
          </Link>
        </div>

      </div>
    </header>
  );
}
