"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, Shield, Menu, X, ArrowRight } from "lucide-react";

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Trang Chủ", href: "/" },
    { label: "Dịch Vụ & Bảng Giá", href: "/services" },
    { label: "Cẩm Nang Xe Ô Tô", href: "/blog" },
  ];

  return (
    <header className="relative z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 px-3 sm:px-6 lg:px-8 py-3 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-amber-200/60 p-1 group-hover:scale-105 transition-transform shadow-xs">
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
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-slate-900">
                HIHIHAHA<span className="text-amber-500"> AUTO</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                GARA 4S
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 tracking-tight hidden sm:block font-medium">
              Trung Tâm Chăm Sóc & Sửa Chữa Ô Tô Chuyên Nghiệp
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600">
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

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/staff/login"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-amber-600 hover:border-amber-400 hover:bg-amber-50/50 transition shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Cổng Nhân Viên
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-slate-950" />
            Đăng Nhập Chủ Xe
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login"
            className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-black"
          >
            Chủ Xe
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden pt-3 pb-2 border-t border-slate-200 mt-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold text-center flex items-center justify-center gap-1 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              Đăng Nhập Chủ Xe
            </Link>

            <Link
              href="/staff/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold text-center flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              Cổng Nhân Viên
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
