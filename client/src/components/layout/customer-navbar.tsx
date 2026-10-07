"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, ArrowLeft, Car, FileText, CreditCard } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function CustomerNavbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl sticky top-0 z-30 px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <Link href="/customer" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="HiHiHaHa Auto Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 font-sans">
                Cổng Khách Hàng <span className="text-amber-500 font-mono text-xs">51K-888.88</span>
              </span>
              <p className="text-[10px] text-zinc-500">Chủ xe: Minh Thảo • Hạng VIP Gold</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng Xuất
          </Link>
        </div>

      </div>
    </header>
  );
}
