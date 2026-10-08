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
    { label: "Hướng Dẫn (Help)", href: "/help" },
  ];

  return (
    <header className="relative z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 px-4 sm:px-8 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 p-1 group-hover:scale-105 transition-transform shadow-xs">
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
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-slate-900 font-sans">
                HIHIHAHA<span className="text-amber-500"> AUTO</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                GARA 4S
              </span>
            </div>
            <p className="text-[11px] text-slate-500 tracking-tight hidden sm:block font-medium">
              Trung Tâm Chăm Sóc & Sửa Chữa Ô Tô Chuyên Nghiệp
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? "text-amber-600 font-bold"
                    : "hover:text-amber-600"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/staff/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-amber-600 hover:border-amber-400 hover:bg-amber-50/50 transition shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Cổng Nhân Viên
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-slate-950" />
            Đăng Nhập Chủ Xe
          </Link>
        </div>

      </div>
    </header>
  );
}
