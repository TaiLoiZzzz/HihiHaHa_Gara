"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  ClipboardList, 
  PlusCircle, 
  Kanban, 
  Boxes, 
  Smartphone, 
  BarChart3, 
  LogOut,
  User,
  Shield
} from "lucide-react";
import { getCurrentUser, clearSession, UserSession } from "@/lib/api";
import { toast } from "sonner";

interface StaffNavbarProps {
  currentRoleTitle?: string;
  role?: "advisor" | "manager" | "technician" | "owner" | string;
}

export function StaffNavbar({ currentRoleTitle, role }: StaffNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Xác định vai trò từ đường dẫn URL nếu không truyền prop
  const currentRole = role || (
    pathname.startsWith("/advisor") ? "advisor" :
    pathname.startsWith("/manager") ? "manager" :
    pathname.startsWith("/technician") ? "technician" :
    pathname.startsWith("/owner") ? "owner" : "advisor"
  );

  // Phân chia menu chức năng RIÊNG BIỆT 100% cho từng vai trò
  const roleConfigs = {
    advisor: {
      brandSub: "ADVISOR",
      badgeTitle: "Cố Vấn Dịch Vụ",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
      links: [
        { label: "Bảng Lệnh Sửa Chữa", href: "/advisor/work-orders", icon: ClipboardList },
        { label: "Tiếp Nhận & Báo Giá Mới", href: "/advisor/create-order", icon: PlusCircle },
      ],
    },
    manager: {
      brandSub: "MANAGER",
      badgeTitle: "Quản Đốc Xưởng",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
      links: [
        { label: "Điều Phối Kanban 6 Cột", href: "/manager/kanban", icon: Kanban },
        { label: "Kho 500 Phụ Tùng OEM", href: "/manager/inventory", icon: Boxes },
      ],
    },
    technician: {
      brandSub: "TECH",
      badgeTitle: "Kỹ Thuật Viên Xưởng",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      links: [
        { label: "Màn Hình Tablet Khoang Nâng", href: "/technician", icon: Smartphone },
      ],
    },
    owner: {
      brandSub: "EXECUTIVE",
      badgeTitle: "Giám Đốc Gara",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
      links: [
        { label: "Báo Cáo Doanh Thu & Năng Suất", href: "/owner/dashboard", icon: BarChart3 },
      ],
    },
  };

  const currentConfig = roleConfigs[currentRole as keyof typeof roleConfigs] || roleConfigs.advisor;

  const handleLogout = () => {
    clearSession();
    toast.success("Đã đăng xuất khỏi cổng nội bộ");
    router.push("/staff/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Khu Vực Chức Năng Riêng */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
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
              <span className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
                HIHIHAHA<span className="text-amber-500">.{currentConfig.brandSub}</span>
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border ${currentConfig.badgeClass}`}>
                {currentRoleTitle || currentConfig.badgeTitle}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {user ? `Cán bộ: ${user.full_name} (${user.phone_number})` : "Khu Vực Phân Quyền Vận Hành"}
            </p>
          </div>
        </div>

        {/* Các Chức Năng DÀNH RIÊNG Cho Vai Trò Hiện Tại */}
        <nav className="flex items-center gap-2 text-xs font-bold">
          {currentConfig.links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Thông Tin Người Dùng & Nút Đăng Xuất */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 transition shadow-xs"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>
        </div>

      </div>
    </header>
  );
}
export default StaffNavbar;
