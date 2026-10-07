"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCode, CreditCard, ShieldCheck, Clock, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { toast } from "sonner";

interface Props {
  params: {
    order_code: string;
  };
}

export default function CustomerPaymentPage({ params }: Props) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const totalAmount = 2808000; // Số tiền chuẩn 2.808.000 VNĐ

  // Mô phỏng quẹt thanh toán thành công (Bắn webhook Outbox)
  const handleSimulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setPaid(true);
      setLoading(false);
      toast.success("Thanh toán 2.808.000 VNĐ thành công! Outbox Worker đã trừ kho vĩnh viễn và xuất hóa đơn VAT!");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans">
      
      {/* Back link */}
      <Link
        href={`/customer/orders/${params.order_code || "WO-20261001-0089"}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-500 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Quay lại xem chi tiết báo giá
      </Link>

      {/* Main Payment Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8 text-center">
        
        {/* Header Thanh Toán */}
        <div className="space-y-2">
          <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            CỔNG THANH TOÁN AN TOÀN VIETQR & VNPAY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Thanh Toán Lệnh Sửa Chữa
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Mã đơn hàng: <strong>{params.order_code || "WO-20261001-0089"}</strong> • Xe: <strong>51K-888.88</strong>
          </p>
        </div>

        {/* Số Tiền Cần Thanh Toán */}
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="text-xs text-zinc-500">Số tiền quyết toán cuối cùng (Đã bao gồm 8% VAT):</div>
          <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {formatCurrencyVND(totalAmount)}
          </div>
        </div>

        {!paid ? (
          <div className="space-y-6">
            {/* Giả lập VietQR Động */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-300 dark:border-zinc-700 max-w-xs mx-auto space-y-3">
              <div className="w-48 h-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center p-3 text-center border border-zinc-200 dark:border-zinc-800 relative group">
                <QrCode className="w-32 h-32 text-zinc-800 dark:text-zinc-200" />
                <div className="text-[10px] font-mono text-zinc-500 mt-2">
                  VIETQR ĐỘNG • VNPAY
                </div>
              </div>
              <div className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Hạn thanh toán: <strong>09:59</strong> (Khóa Idempotent 10p)
              </div>
            </div>

            {/* Thông tin chuyển khoản */}
            <div className="text-xs text-zinc-500 space-y-1">
              <div>Ngân hàng: <strong>Vietcombank (VCB)</strong> • Số tài khoản: <strong className="font-mono">9988-HIHIHAHA-AUTO</strong></div>
              <div>Nội dung chuyển khoản: <strong className="font-mono text-amber-600 dark:text-amber-400">{params.order_code || "WO-20261001-0089"}</strong></div>
            </div>

            {/* Nút Thanh Toán Sandbox Test */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <LiquidGlassButton
                size="lg"
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full sm:w-auto shadow-amber-glow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                    Đang Kết Nối Cổng VNPay...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-zinc-950" />
                    Mở Cổng VNPay Sandbox ({formatCurrencyVND(totalAmount)})
                  </>
                )}
              </LiquidGlassButton>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 space-y-4 animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Thanh Toán Hoàn Tất Thành Công!</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Hệ thống Transactional Outbox đã cập nhật trạng thái đơn sang <strong>COMPLETED</strong>, chính thức trừ kho vĩnh viễn 1 bộ má phanh và 1 lọc gió.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/customer"
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-amber-500 hover:text-zinc-950 transition inline-block"
              >
                Về Trang Quản Trị Xe
              </Link>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Giao dịch được bảo vệ bởi mã hóa HMAC-SHA512 & Khóa phân tán Redis 600s</span>
        </div>

      </div>

    </div>
  );
}
