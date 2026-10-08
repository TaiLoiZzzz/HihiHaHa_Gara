"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Car,
  Smartphone,
  Mail,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Loader2,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Danh sách xe mẫu chuẩn hóa đã có trong cơ sở dữ liệu
const SAMPLE_CARS = [
  { plate: "51K-888.88", phone: "0912345678", name: "Minh Thảo", model: "Camry 2.5Q" },
  { plate: "51H-999.88", phone: "0797526990", name: "Minh Thảo", model: "Mercedes C200" },
  { plate: "30E-999.99", phone: "0907654321", name: "Lê Hoàng Cường", model: "Mercedes E300" },
  { plate: "51F-123.45", phone: "0901234567", name: "Trần Thị Bích", model: "Mazda CX-5" },
];

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("0912345678");
  const [licensePlate, setLicensePlate] = useState("51K-888.88");
  const [email, setEmail] = useState("");

  // Trạng thái nhận diện hồ sơ xe trong DB
  const [customerFound, setCustomerFound] = useState<boolean | null>(true);
  const [customerName, setCustomerName] = useState<string>("Minh Thảo");
  const [linkedEmailMasked, setLinkedEmailMasked] = useState<string | null>("t***6@gmail.com");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [sentEmailInfo, setSentEmailInfo] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Tự động kiểm tra hồ sơ khách hàng khi thay đổi biển số hoặc số điện thoại
  const checkCustomerProfile = useCallback(async (plate: string, phoneNumber: string) => {
    const cleanPlate = plate?.trim().toUpperCase().replace(/\s+/g, "");
    const cleanPhone = phoneNumber?.trim().replace(/\s+/g, "");

    if (!cleanPlate || !cleanPhone || cleanPhone.length < 9) {
      setCustomerFound(null);
      setLinkedEmailMasked(null);
      return;
    }

    setCheckingProfile(true);
    try {
      const res = await api.lookupCustomer(cleanPlate, cleanPhone);
      if (res.success && res.data?.found) {
        setCustomerFound(true);
        setCustomerName(res.data.full_name || "Chủ xe");
        if (res.data.has_email) {
          setLinkedEmailMasked(res.data.masked_email || "Gmail đã liên kết");
          setShowEmailInput(false);
        } else {
          setLinkedEmailMasked(null);
          setShowEmailInput(true);
        }
      } else {
        // Cặp Biển số & SĐT không khớp hoặc chưa từng có trong hệ thống Gara
        setCustomerFound(false);
        setCustomerName("");
        setLinkedEmailMasked(null);
        setShowEmailInput(false);
      }
    } catch (e) {
      setCustomerFound(false);
    } finally {
      setCheckingProfile(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkCustomerProfile(licensePlate, phone);
    }, 450);
    return () => clearTimeout(timer);
  }, [licensePlate, phone, checkCustomerProfile]);

  // Xử lý gửi mã OTP cho chủ xe
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPlate = licensePlate?.trim().toUpperCase().replace(/\s+/g, "");
    const cleanPhone = phone?.trim().replace(/\s+/g, "");

    if (!cleanPhone || !cleanPlate) {
      toast.error("Vui lòng nhập đầy đủ biển số xe và số điện thoại chủ xe!");
      return;
    }

    if (customerFound === false) {
      toast.error(
        `Không tìm thấy hồ sơ xe [${cleanPlate}] gắn với SĐT [${cleanPhone}] trong hệ thống gara. Vui lòng kiểm tra lại hoặc liên hệ Cố vấn dịch vụ!`,
        { duration: 5000 }
      );
      return;
    }

    if (showEmailInput && !email && !linkedEmailMasked) {
      toast.error("Hồ sơ xe chưa có Gmail: Vui lòng nhập địa chỉ Gmail để nhận mã OTP!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestOtp(cleanPhone, cleanPlate, email || undefined);
      if (res.require_email) {
        setShowEmailInput(true);
        toast.info(res.message || "Vui lòng nhập địa chỉ Gmail để nhận mã OTP!");
        return;
      }

      if (res.success) {
        setOtpSent(true);
        setSentEmailInfo(res.data?.email || res.data?.masked_email || email || "Gmail của bạn");
        toast.success(res.message || "Mã OTP đã được gửi đến Gmail của bạn!");
      } else {
        toast.error(res.message || res.error || "Không thể gửi mã OTP.");
      }
    } catch (err: any) {
      toast.error(err.message || "Không tìm thấy hồ sơ xe trong hệ thống gara.");
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

  const handleSelectSample = (sample: typeof SAMPLE_CARS[0]) => {
    setLicensePlate(sample.plate);
    setPhone(sample.phone);
    setShowEmailInput(false);
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
            
            {/* Input Biển Số Xe */}
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

            {/* Input Số Điện Thoại */}
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

            {/* Trạng thái đối soát dữ liệu với Database gara */}
            {checkingProfile ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Đang đối soát hồ sơ xe trong cơ sở dữ liệu gara...</span>
              </div>
            ) : customerFound === true ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Hồ sơ hợp lệ: {customerName}
                  </span>
                  {linkedEmailMasked && !showEmailInput && (
                    <button
                      type="button"
                      onClick={() => setShowEmailInput(true)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Đổi Gmail
                    </button>
                  )}
                </div>
                {linkedEmailMasked && !showEmailInput && (
                  <div className="text-[11px] text-emerald-700">
                    Mã OTP sẽ gửi về: <strong className="font-mono text-emerald-900">{linkedEmailMasked}</strong>
                  </div>
                )}
              </div>
            ) : customerFound === false ? (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1.5 animate-in fade-in duration-200">
                <div className="font-bold flex items-center gap-1.5 text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  Không tìm thấy hồ sơ xe trong hệ thống gara
                </div>
                <p className="text-[11px] text-red-600 leading-relaxed">
                  Biển số <strong className="font-mono text-red-900">{licensePlate}</strong> và SĐT <strong className="font-mono text-red-900">{phone}</strong> không khớp hoặc xe chưa từng được tiếp nhận tại xưởng.
                </p>
                <p className="text-[10px] text-red-500 italic">
                  * Xe cần được Cố vấn dịch vụ tạo lệnh tiếp nhận tại xưởng để khởi tạo tài khoản tra cứu.
                </p>
              </div>
            ) : null}

            {/* Ô nhập Email khi Cập nhật Gmail mới hoặc Hồ sơ chưa có Email */}
            {customerFound && showEmailInput && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>Cập Nhật Gmail Nhận OTP</span>
                  <span className="text-[10px] text-amber-600 font-semibold lowercase">
                    Lưu vào hồ sơ xe
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="VD: tailoi1606@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-semibold rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* Nút gửi OTP */}
            <button
              type="submit"
              disabled={loading || customerFound === false || checkingProfile}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi mã OTP..." : checkingProfile ? "Đang đối soát..." : "Gửi Mã Xác Thực OTP"}
            </button>

            {/* Gợi Ý Nhanh Các Xe Mẫu Có Sẵn Trong Database */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Chọn nhanh hồ sơ xe trong hệ thống để test:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {SAMPLE_CARS.map((c) => (
                  <button
                    key={c.plate}
                    type="button"
                    onClick={() => handleSelectSample(c)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition group text-[11px]"
                  >
                    <div className="font-mono font-bold text-slate-900 group-hover:text-amber-800">
                      {c.plate}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {c.phone} ({c.name})
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã gửi mã xác thực
                </span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[11px] font-bold underline hover:text-amber-700"
                >
                  Đổi thông tin
                </button>
              </div>
              <div className="space-y-1 text-slate-700">
                <div>Biển số: <strong className="text-slate-900 font-mono">{licensePlate}</strong></div>
                <div>SĐT: <strong className="text-slate-900 font-mono">{phone}</strong></div>
                <div>Hòm thư Gmail: <strong className="text-amber-800 font-mono">{sentEmailInfo || email}</strong></div>
              </div>
              <div className="p-2 bg-amber-100/70 rounded-lg text-[11px] text-amber-900 font-semibold border border-amber-300/60">
                💡 Mở hộp thư Gmail của bạn để lấy mã OTP 6 số. (Mã kiểm tra nhanh hệ thống: <span className="font-mono font-bold text-red-600 underline">123456</span>)
              </div>
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
                  placeholder="123456"
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
