"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Car, FileText, CreditCard, HelpCircle } from "lucide-react";
import { getCurrentUser, clearSession, UserSession, api } from "@/lib/api";
import { toast } from "sonner";

export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeOrderCode, setActiveOrderCode] = useState<string>("WO-20261001-0089");
  const [plateNumber, setPlateNumber] = useState<string>("51K-888.88");

  useEffect(() => {
    const curUser = getCurrentUser();
    setUser(curUser);
    if (curUser?.license_plate) {
      setPlateNumber(curUser.license_plate);
    }

    // Tự động lấy Lệnh sửa chữa mới nhất của chính chủ xe này
    api.getMyWorkOrders().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const firstOrder = res.data[0];
        setActiveOrderCode(firstOrder.order_code);
        if (firstOrder.license_plate) {
          setPlateNumber(firstOrder.license_plate);
        }
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success("Đã đăng xuất khỏi cổng khách hàng");
    router.push("/login");
  };

  const navLinks = [
    { label: "Hồ Sơ Xe", href: "/customer", icon: Car },
    { label: "Lệnh Đang Sửa", href: `/customer/orders/${activeOrderCode}`, icon: FileText },
    { label: "Thanh Toán QR", href: `/customer/payment/${activeOrderCode}`, icon: CreditCard },
    { label: "Hướng Dẫn", href: "/help/customer", icon: HelpCircle },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Customer Info */}
        <div className="flex items-center gap-3">
          <Link href="/customer" className="flex items-center gap-3">
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
                  CỔNG CHỦ XE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {plateNumber || user?.license_plate || "51K-888.88"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {user?.full_name ? `Chủ xe: ${user.full_name}` : "Chủ xe: Minh Thảo"} • Hạng VIP Gold
              </p>
            </div>
          </Link>
        </div>

        {/* Customer Navigation Links */}
        <nav className="hidden sm:flex items-center gap-2 text-xs font-bold">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/customer" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 transition shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>
        </div>

      </div>
    </header>
  );
}
export default CustomerNavbar;
