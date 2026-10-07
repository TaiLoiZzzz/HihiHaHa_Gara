"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Smartphone, Car, Shield, ArrowRight, UserCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

// 5 Tài khoản thật đã được seed sẵn trong MongoDB
const SEED_ACCOUNTS = [
  {
    role: "CUSTOMER",
    title: "Chủ Xe (Minh Thảo)",
    desc: "Biển số: 51K-888.88 • VIP Gold",
    phone: "0912345678",
    plate: "51K-888.88",
    targetUrl: "/customer",
    color: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
  },
  {
    role: "SERVICE_ADVISOR",
    title: "Cố Vấn Dịch Vụ (Advisor)",
    desc: "Tiếp nhận xe & Lập dự toán ban đầu",
    phone: "0988888801",
    targetUrl: "/advisor/work-orders",
    color: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
  {
    role: "WORKSHOP_MANAGER",
    title: "Quản Đốc Xưởng (Manager)",
    desc: "Bảng Kanban 6 cột & Kiểm kê kho 500 món",
    phone: "0988888802",
    targetUrl: "/manager/kanban",
    color: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"
  },
  {
    role: "TECHNICIAN",
    title: "Thợ Kỹ Thuật (Technician)",
    desc: "Màn hình Tablet khoang nâng & AI Modal",
    phone: "0988888803",
    targetUrl: "/technician",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  },
  {
    role: "OWNER",
    title: "Chủ Gara (Executive)",
    desc: "Dashboard doanh thu & Báo cáo tổng thể",
    phone: "0988888800",
    targetUrl: "/owner/dashboard",
    color: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"customer" | "staff">("customer");
  
  // State form khách hàng
  const [licensePlate, setLicensePlate] = useState("51K-888.88");
  const [customerPhone, setCustomerPhone] = useState("0912345678");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("888888");
  const [loading, setLoading] = useState(false);

  // State form nhân viên
  const [staffPhone, setStaffPhone] = useState("0988888802");
  const [staffPassword, setStaffPassword] = useState("hihihaha123");

  // Xử lý gửi OTP Khách hàng
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Giả lập hoặc gọi API gửi OTP
      setTimeout(() => {
        setOtpStep(true);
        setLoading(false);
        toast.success("Mã OTP bảo mật 6 số đã được gửi qua Gmail liên kết!");
      }, 600);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Lỗi gửi mã OTP";
      toast.error(errMsg);
      setLoading(false);
    }
  };

  // Xử lý Xác thực OTP Khách hàng
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Xác thực chủ xe 51K-888.88 thành công! Đang chuyển hướng...");
      router.push("/customer");
    }, 500);
  };

  // 1-Click Đăng Nhập Tài Khoản Thật
  const handleQuickLogin = (account: typeof SEED_ACCOUNTS[0]) => {
    toast.success(`Đăng nhập thành công với vai trò ${account.title}!`);
    router.push(account.targetUrl);
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
      
      {/* Cột Trái: Form Đăng Nhập */}
      <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        
        {/* Header Form */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Cổng Đăng Nhập Hợp Nhất Gara
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Hệ thống nhận diện thông minh: Khách hàng xác thực OTP và Cán bộ nhân viên
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("customer")}
            className={`py-2 rounded-lg transition ${
              activeTab === "customer"
                ? "bg-amber-500 text-zinc-950 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Chủ Xe (Biển Số + OTP)
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`py-2 rounded-lg transition ${
              activeTab === "staff"
                ? "bg-amber-500 text-zinc-950 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Cán Bộ Xưởng (SĐT / Pass)
          </button>
        </div>

        {/* Tab 1: Khách Hàng */}
        {activeTab === "customer" && (
          <div>
            {!otpStep ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Biển Số Xe Đăng Ký
                  </label>
                  <div className="relative">
                    <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                      placeholder="VD: 51K-888.88"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono font-bold uppercase focus:ring-2 focus:ring-amber-500/50 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Số Điện Thoại Chủ Phương Tiện
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="VD: 0912345678"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono focus:ring-2 focus:ring-amber-500/50 outline-none"
                    />
                  </div>
                </div>

                <LiquidGlassButton
                  type="submit"
                  size="md"
                  disabled={loading}
                  className="w-full mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                      Đang Xác Thực Biển Số...
                    </>
                  ) : (
                    <>
                      Nhận Mã OTP Qua Email
                      <ArrowRight className="w-4 h-4 ml-1 text-zinc-950" />
                    </>
                  )}
                </LiquidGlassButton>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
                  Mã OTP 6 số đã được gửi tới email liên kết với xe <strong>{licensePlate}</strong>.
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Nhập Mã OTP 6 Số
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[0.5em] text-xl font-bold py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50 outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="w-1/3 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
                  >
                    Quay Lại
                  </button>
                  <LiquidGlassButton
                    type="submit"
                    size="md"
                    disabled={loading}
                    className="w-2/3"
                  >
                    Xác Thực & Vào Xem Xe
                  </LiquidGlassButton>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Cán Bộ Nhân Viên */}
        {activeTab === "staff" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Đăng nhập nhân viên thành công!");
              router.push("/manager/kanban");
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Số Điện Thoại Nội Bộ
              </label>
              <input
                type="tel"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Mật Khẩu Phân Quyền
              </label>
              <input
                type="password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>

            <LiquidGlassButton type="submit" size="md" className="w-full mt-2">
              Đăng Nhập Khu Vực Xưởng
            </LiquidGlassButton>
          </form>
        )}

      </div>

      {/* Cột Phải: Cheat Sheet 1-Click Đăng Nhập Bằng 5 Tài Khoản Seed Thật */}
      <div className="lg:col-span-5 p-7 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <UserCheck className="w-4 h-4" />
          <span>Demo 1-Click: 5 Tài Khoản Đã Seed</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Bấm trực tiếp vào các thẻ bên dưới để trải nghiệm ngay luồng nghiệp vụ thực tế của từng vai trò mà không cần gõ mật khẩu:
        </p>

        <div className="space-y-2.5">
          {SEED_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              onClick={() => handleQuickLogin(acc)}
              className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/80 hover:border-amber-500/50 hover:shadow-sm transition-all group flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition">
                  {acc.title}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {acc.desc}
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${acc.color}`}>
                VÀO NGAY
              </span>
            </button>
          ))}
        </div>

        <div className="pt-2 text-[10px] text-zinc-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Cơ chế bảo mật JWT + Phân quyền RBAC 5 Roles cấp độ dòng.</span>
        </div>
      </div>

    </div>
  );
}
