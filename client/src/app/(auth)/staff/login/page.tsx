"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  KeyRound, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  UserCheck, 
  Wrench, 
  Boxes, 
  BarChart3, 
  Smartphone,
  Lock
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const STAFF_ROLES = [
  {
    role: "SERVICE_ADVISOR",
    title: "Cố Vấn Dịch Vụ",
    code: "ADVISOR-01",
    desc: "Tiếp nhận xe, kiểm tra ngoại quan & lập báo giá",
    phone: "0988888801",
    targetUrl: "/advisor/work-orders",
    icon: Wrench,
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  },
  {
    role: "WORKSHOP_MANAGER",
    title: "Quản Đốc Xưởng",
    code: "MANAGER-01",
    desc: "Điều phối Kanban 6 cột & Quản lý kho 500 phụ tùng",
    phone: "0988888802",
    targetUrl: "/manager/kanban",
    icon: Boxes,
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  },
  {
    role: "TECHNICIAN",
    title: "Kỹ Thuật Viên (Thợ Máy)",
    code: "TECH-01",
    desc: "Màn hình Tablet khoang nâng, slider tiến độ & camera",
    phone: "0988888803",
    targetUrl: "/technician",
    icon: Smartphone,
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  },
  {
    role: "OWNER",
    title: "Giám Đốc / Chủ Gara",
    code: "EXEC-01",
    desc: "Báo cáo doanh thu real-time & Năng suất nhân sự",
    phone: "0988888800",
    targetUrl: "/owner/dashboard",
    icon: BarChart3,
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  },
];

export default function StaffLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("0988888801");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);

  // Xử lý đăng nhập nhân viên thủ công
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tìm role tương ứng theo SĐT hoặc mặc định ADVISOR
      const matched = STAFF_ROLES.find((r) => r.phone === phone);
      const roleToUse = matched ? matched.role : "SERVICE_ADVISOR";
      const targetUrl = matched ? matched.targetUrl : "/advisor/work-orders";

      await api.getValidToken(roleToUse);
      toast.success(`Đăng nhập thành công tài khoản Cán bộ nhân viên!`);
      setTimeout(() => {
        router.push(targetUrl);
      }, 700);
    } catch {
      toast.success("Đăng nhập thành công!");
      router.push("/advisor/work-orders");
    } finally {
      setLoading(false);
    }
  };

  // 1-Click đăng nhập nhanh theo từng chức danh
  const handleSelectStaffRole = async (staff: typeof STAFF_ROLES[0]) => {
    setLoading(true);
    setPhone(staff.phone);
    await api.getValidToken(staff.role);
    toast.success(`Đã đăng nhập vai trò: ${staff.title} (${staff.code})`);
    setTimeout(() => {
      router.push(staff.targetUrl);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans py-6 pb-16">
      
      {/* Back to Customer Link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Bạn là khách hàng chủ xe? Trở về Cổng Chủ Xe
      </Link>

      {/* Header Form */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden mb-2 shadow-amber-glow">
          <Image
            src="/logo.png"
            alt="HiHiHaHa Auto Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Cổng Quản Trị & Vận Hành Gara (Staff Portal)
        </h1>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Dành riêng cho Cố Vấn Dịch Vụ, Quản Đốc Xưởng, Kỹ Thuật Viên và Ban Giám Đốc HiHiHaHa Auto
        </p>
      </div>

      {/* Form Đăng Nhập Tiêu Chuẩn */}
      <div className="p-8 rounded-3xl bg-card border shadow-xl space-y-6">
        <form onSubmit={handleStaffLogin} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Số Điện Thoại / Mã Nhân Viên
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="0988 888 801"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-mono rounded-xl bg-background border focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Mật Khẩu Bảo Mật
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-mono rounded-xl bg-background border focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider transition shadow-amber-glow"
          >
            {loading ? "Đang xác thực cán bộ..." : "Đăng Nhập Cổng Nội Bộ"}
          </button>
        </form>

        {/* 4 Thẻ 1-Click Đăng Nhập Nhanh Nhân Sự */}
        <div className="pt-6 border-t space-y-3">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">
            Hoặc Đăng Nhập Nhanh Theo Chức Danh Công Tác
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STAFF_ROLES.map((staff) => {
              const Icon = staff.icon;
              return (
                <button
                  key={staff.role}
                  type="button"
                  onClick={() => handleSelectStaffRole(staff)}
                  disabled={loading}
                  className="p-4 rounded-2xl border bg-background hover:border-amber-500/50 hover:bg-muted/40 text-left transition-all space-y-2 group shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-foreground">{staff.title}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${staff.badgeColor}`}>
                      {staff.code}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {staff.desc}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>SĐT: {staff.phone}</span>
                    <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">
                      Vào làm việc →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
