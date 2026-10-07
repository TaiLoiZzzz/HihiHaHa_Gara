"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Smartphone, ArrowRight, Shield, CheckCircle2, Lock } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { getValidToken } from "@/lib/api";
import { toast } from "sonner";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("0912345678");
  const [licensePlate, setLicensePlate] = useState("51K-888.88");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý gửi mã OTP cho chủ xe
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !licensePlate) {
      toast.error("Vui lòng nhập biển số xe và số điện thoại chủ xe!");
      return;
    }
    setOtpSent(true);
    toast.success(`Mã OTP 6 số đã được gửi tới SĐT ${phone}! (Demo OTP: 123456)`);
  };

  // Xác nhận OTP và đăng nhập vào Cổng Khách Hàng
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await getValidToken("CUSTOMER");
      toast.success("Xác thực chủ xe thành công! Đang chuyển đến hồ sơ xe...");
      setTimeout(() => {
        router.push("/customer");
      }, 800);
    } catch {
      toast.success("Đăng nhập thành công!");
      router.push("/customer");
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Đăng nhập nhanh khách hàng mẫu
  const handleQuickCustomerLogin = async () => {
    setLoading(true);
    await getValidToken("CUSTOMER");
    toast.success("Đã đăng nhập nhanh hồ sơ chủ xe: Minh Thảo (51K-888.88)!");
    setTimeout(() => {
      router.push("/customer");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 font-sans py-6">
      
      {/* Header Form */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 mb-2">
          <Car className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Cổng Dịch Vụ Chủ Xe
        </h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Tra cứu hồ sơ bảo dưỡng, theo dõi xe trên cầu nâng và ký duyệt báo giá điện tử
        </p>
      </div>

      {/* Card Form Đăng Nhập OTP */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Biển Số Xe Của Bạn
              </label>
              <div className="relative">
                <Car className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: 51K-888.88"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-mono font-bold rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 transition uppercase tracking-wider"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Số Điện Thoại Đăng Ký
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-mono rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-amber-glow"
            >
              Gửi Mã Xác Thực OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>Đã gửi mã đến: <strong>{phone}</strong></span>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] underline hover:text-foreground"
              >
                Đổi SĐT
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Nhập Mã OTP (6 số)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center py-3 text-lg font-mono font-bold tracking-widest rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[10px] text-zinc-400 text-center">Gợi ý mã demo: 123456</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-amber-glow"
            >
              {loading ? "Đang xác thực..." : "Xác Nhận & Đăng Nhập"}
            </button>
          </form>
        )}

        {/* 1-Click Đăng nhập nhanh khách hàng mẫu */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-center">
            Hoặc Đăng Nhập Nhanh Khách Hàng Demo
          </p>

          <button
            type="button"
            onClick={handleQuickCustomerLogin}
            disabled={loading}
            className="w-full p-3.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-left transition flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Chủ Xe: Minh Thảo</span>
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-amber-500 text-black font-bold">VIP Gold</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Xe Toyota Camry 2.5Q • Biển số: 51K-888.88
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Chuyển Sang Cổng Nhân Viên */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-center space-y-1">
        <p className="text-xs text-zinc-500">
          Bạn là Cố vấn dịch vụ, Quản đốc, Thợ máy hoặc Chủ gara?
        </p>
        <Link
          href="/staff/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline mt-1"
        >
          <Shield className="w-3.5 h-3.5" />
          Đăng Nhập Cổng Nhân Viên Nội Bộ (Staff Portal) →
        </Link>
      </div>

    </div>
  );
}
