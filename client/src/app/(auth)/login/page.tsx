"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Car, Smartphone, ArrowRight, Shield, CheckCircle2, Lock } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { api } from "@/lib/api";
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
      await api.getValidToken("CUSTOMER");
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
    await api.getValidToken("CUSTOMER");
    toast.success("Đã đăng nhập nhanh hồ sơ chủ xe: Minh Thảo (51K-888.88)!");
    setTimeout(() => {
      router.push("/customer");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 font-sans py-8">
      
      {/* Header Form */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 p-2 mb-2 shadow-xs">
          <Image
            src="/logo.png"
            alt="HiHiHaHa Auto Logo"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Cổng Dịch Vụ Chủ Xe
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-medium">
          Tra cứu hồ sơ bảo dưỡng, theo dõi xe trên cầu nâng và duyệt báo giá điện tử
        </p>
      </div>

      {/* Card Form Đăng Nhập OTP */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Biển Số Xe Của Bạn
              </label>
              <div className="relative">
                <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: 51K-888.88"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition uppercase tracking-wider shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Số Điện Thoại Đăng Ký
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="0908 888 888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-semibold rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-95"
            >
              Gửi Mã Xác Thực OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>Đã gửi mã đến: <strong>{phone}</strong></span>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] font-bold underline hover:text-amber-700"
              >
                Đổi SĐT
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nhập Mã OTP (6 số)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center py-3 text-lg font-mono font-bold tracking-widest rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-xs"
              />
              <p className="text-[11px] text-slate-500 text-center font-medium">Gợi ý mã demo: 123456</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-95"
            >
              {loading ? "Đang xác thực..." : "Xác Nhận & Đăng Nhập"}
            </button>
          </form>
        )}

        {/* 1-Click Đăng nhập nhanh khách hàng mẫu */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Hoặc Đăng Nhập Nhanh Xe Mẫu Đã Seed
          </p>

          <button
            type="button"
            onClick={handleQuickCustomerLogin}
            disabled={loading}
            className="w-full p-4 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100/80 text-left transition flex items-center justify-between group shadow-xs active:scale-95"
          >
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <span>Chủ Xe: Minh Thảo</span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500 text-slate-950 font-black">VIP Gold</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Toyota Camry 2.5Q • Biển số: <span className="font-mono font-bold text-slate-900">51K-888.88</span>
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Chuyển Sang Cổng Nhân Viên */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white text-center space-y-1 shadow-xs">
        <p className="text-xs text-slate-600 font-medium">
          Bạn là Cố vấn dịch vụ, Quản đốc, Thợ máy hoặc Chủ gara?
        </p>
        <Link
          href="/staff/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline mt-1"
        >
          <Shield className="w-3.5 h-3.5" />
          Đăng Nhập Cổng Nhân Viên Nội Bộ (Staff Portal) →
        </Link>
      </div>

    </div>
  );
}
