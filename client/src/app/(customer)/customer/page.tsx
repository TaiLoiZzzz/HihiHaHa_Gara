"use client";

import React from "react";
import Link from "next/link";
import { Car, Award, Calendar, FileText, ChevronRight, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Profile Xe & Hạng VIP */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">
            <Car className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Toyota Camry 2.5Q (2022)
              </h1>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                51K-888.88
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>Chủ sở hữu: <strong>Minh Thảo</strong></span>
              <span>•</span>
              <span>Số khung VIN: <span className="font-mono">VN123456789</span></span>
              <span>•</span>
              <span>ODO: <strong>38.450 km</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <Award className="w-8 h-8 text-amber-500" />
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Hạng Thành Viên</div>
            <div className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">VIP GOLD (Ưu đãi 5% Công)</div>
          </div>
        </div>
      </div>

      {/* Banner Lệnh Sửa Chữa Đang Chờ Phê Duyệt (Active WorkOrder) */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/40 shadow-amber-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-amber-500 text-zinc-950">
              CẦN DUYỆT BÁO GIÁ
            </span>
            <span className="text-xs font-mono font-bold text-zinc-500">
              Mã: WO-20261001-0089
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Báo Giá Bảo Dưỡng 40.000km & Thay Má Phanh Trước
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Cố vấn dịch vụ Quang Tùng đã gửi báo giá nhúng VAT 8%. Tổng chi phí dự toán: <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{formatCurrencyVND(2808000)}</strong>.
          </p>
        </div>

        <Link href="/customer/orders/WO-20261001-0089">
          <LiquidGlassButton size="md">
            Xem & Ký Duyệt Báo Giá
            <ArrowRight className="w-4 h-4 ml-1 text-zinc-950" />
          </LiquidGlassButton>
        </Link>
      </div>

      {/* Sổ Bảo Dưỡng Điện Tử (Electronic Maintenance Ledger) */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Sổ Bảo Dưỡng Trọn Đời (Gắn Liền Theo Xe)
            </h3>
            <p className="text-xs text-zinc-500">
              Lịch sử các lần làm dịch vụ tại trung tâm, có thể chuyển nhượng toàn vẹn khi bán xe.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Đã Xác Thực Chuẩn 4S
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">WO-20260415-0042</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">HOÀN TẤT</span>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Bảo dưỡng Cấp 30.000km: Thay dầu 0W-20, lọc dầu, vệ sinh hệ thống phanh.
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-sm text-zinc-800 dark:text-zinc-200">{formatCurrencyVND(1650000)}</div>
              <div className="text-[11px] text-zinc-400">15/04/2026</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">WO-20251010-0019</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">HOÀN TẤT</span>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Bảo dưỡng Cấp 20.000km: Cân mâm bấm chì 4 bánh, thay lọc gió điều hòa than hoạt tính.
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-sm text-zinc-800 dark:text-zinc-200">{formatCurrencyVND(1120000)}</div>
              <div className="text-[11px] text-zinc-400">10/10/2025</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
