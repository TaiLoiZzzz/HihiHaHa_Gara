"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Car, Smartphone, Shield, Lock, ArrowLeft, KeyRound } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý gửi mã OTP cho chủ xe
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !licensePlate) {
      toast.error("Vui lòng nhập đầy đủ biển số xe và số điện thoại chủ xe!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestOtp(phone, licensePlate);
      if (res.success) {
        setOtpSent(true);
        toast.success(res.message || `Mã OTP đã được gửi đến phương thức xác thực của bạn!`);
      } else {
        toast.error(res.error || "Không tìm thấy hồ sơ xe hoặc số điện thoại chưa đúng.");
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối đến máy chủ xác thực.");
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận OTP và lưu session chính thức
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số mã OTP!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, licensePlate, otpCode);
      if (res.success && res.data) {
        toast.success(`Xác thực thành công! Xin chào ${res.data.user?.full_name || "Quý khách"}`);
        setTimeout(() => {
          router.push("/customer");
        }, 500);
      } else {
        toast.error(res.error || "Mã OTP không chính xác hoặc đã hết hạn.");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi xác thực mã OTP.");
    } finally {
      setLoading(false);
    }
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
                  placeholder="VD: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-semibold rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang gửi yêu cầu..." : "Gửi Mã Xác Thực OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <span className="text-slate-600">Biển số: <strong>{licensePlate}</strong></span>
                <span className="block text-slate-600">SĐT: <strong>{phone}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] font-bold underline hover:text-amber-700"
              >
                Nhập lại
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nhập Mã OTP (6 số)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center py-3 text-lg font-mono font-bold tracking-widest rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang xác thực..." : "Xác Nhận & Đăng Nhập"}
            </button>
          </form>
        )}

      </div>

      {/* Chuyển Sang Cổng Nhân Viên */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white text-center space-y-1 shadow-xs">
        <p className="text-xs text-slate-600 font-medium">
          Bạn là Cố vấn dịch vụ, Quản đốc, Thợ máy hoặc Ban Giám Đốc?
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
