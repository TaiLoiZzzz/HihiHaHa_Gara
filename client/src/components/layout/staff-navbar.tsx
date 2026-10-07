"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ClipboardList, 
  PlusCircle, 
  Kanban, 
  Boxes, 
  Smartphone, 
  BarChart3, 
  LogOut 
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface StaffNavbarProps {
  currentRoleTitle?: string;
  role?: "advisor" | "manager" | "technician" | "owner" | string;
}

const ROLE_TITLES: Record<string, string> = {
  advisor: "Cố Vấn Dịch Vụ",
  manager: "Quản Đốc Xưởng",
  technician: "Kỹ Thuật Viên",
  owner: "Chủ Doanh Nghiệp Gara",
};

export function StaffNavbar({ currentRoleTitle, role = "advisor" }: StaffNavbarProps) {
  const pathname = usePathname();
  const displayTitle = currentRoleTitle || ROLE_TITLES[role] || "Nhân Viên Vận Hành";

  const links = [
    { label: "Bảng Lệnh Sửa Chữa", href: "/advisor/work-orders", icon: ClipboardList },
    { label: "Tạo Lệnh Mới", href: "/advisor/create-order", icon: PlusCircle },
    { label: "Bảng Kanban", href: "/manager/kanban", icon: Kanban },
    { label: "Kho 500 Phụ Tùng", href: "/manager/inventory", icon: Boxes },
    { label: "Tablet Thợ", href: "/technician", icon: Smartphone },
    { label: "Doanh Thu", href: "/owner/dashboard", icon: BarChart3 },
  ];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Role */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0">
            <Image
              src="/logo.png"
              alt="HiHiHaHa Auto Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 font-sans">
                HIHIHAHA<span className="text-amber-500">.OPS</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {displayTitle}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">Khu Vực Quản Trị & Vận Hành Kỹ Thuật Gara</p>
          </div>
        </div>

        {/* Quick Nav Switches */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đổi Vai Trò
          </Link>
        </div>

      </div>
    </header>
  );
}
