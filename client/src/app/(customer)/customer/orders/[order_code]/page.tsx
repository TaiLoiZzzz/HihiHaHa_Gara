"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  Circle, 
  Clock, 
  CreditCard, 
  Camera, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { toast } from "sonner";

interface Props {
  params: {
    order_code: string;
  };
}

export default function WorkOrderDetailPage({ params }: Props) {
  // Dữ liệu mẫu khớp 100% với Seed MongoDB chuẩn SRS (2.808.000 VNĐ)
  const [items, setItems] = useState([
    {
      part_code: "17801-0H050",
      name: "Lọc gió động cơ Camry 2.5",
      type: "PART",
      quantity: 1,
      unit_price: 280000,
      selected: true,
      category: "Bảo dưỡng định kỳ",
    },
    {
      part_code: "04465-06100",
      name: "Bộ má phanh trước Toyota Camry",
      type: "PART",
      quantity: 1,
      unit_price: 1850000,
      selected: true,
      category: "Hệ thống phanh",
    },
    {
      part_code: "GAT-SIL-CAMRY",
      name: "Bộ gạt mưa silicon Camry (Khuyến nghị thêm)",
      type: "PART",
      quantity: 1,
      unit_price: 350000,
      selected: false, // Ban đầu khách chưa chọn
      category: "Phụ tùng ngoại thất",
    },
    {
      part_code: "LABOR-CLEAN-INTAKE",
      name: "Công thợ: Vệ sinh họng nạp & bướm ga",
      type: "LABOR",
      quantity: 1,
      unit_price: 300000,
      selected: true,
      category: "Tiền công kỹ thuật",
    },
    {
      part_code: "LABOR-BRAKE-REPLACE",
      name: "Công thợ: Thay má phanh & bảo dưỡng cùm phanh",
      type: "LABOR",
      quantity: 1,
      unit_price: 170000,
      selected: true,
      category: "Tiền công kỹ thuật",
    }
  ]);

  const [approved, setApproved] = useState(false);

  // Toggle chọn từng hạng mục báo giá
  const toggleItem = (part_code: string) => {
    if (approved) return;
    setItems((prev) =>
      prev.map((item) =>
        item.part_code === part_code ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Tính toán tài chính thời gian thực theo đúng công thức SRS
  const selectedItems = items.filter((i) => i.selected);
  const pretaxAmount = selectedItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const vatAmount = Math.round(pretaxAmount * 0.08); // VAT 8%
  const totalAmount = pretaxAmount + vatAmount;

  // Xử lý ký duyệt điện tử
  const handleApprove = () => {
    setApproved(true);
    toast.success("Ký duyệt báo giá thành công! Lệnh đã chuyển trạng thái và khóa giữ phụ tùng trong kho!");
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner Lệnh Sửa Chữa */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {params.order_code || "WO-20261001-0089"}
            </h1>
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              approved
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            }`}>
              {approved ? "KHÁCH ĐÃ PHÊ DUYỆT" : "CHỜ PHÊ DUYỆT (QUOTE_SENT)"}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Phương tiện: <strong>Toyota Camry 2.5Q</strong> • Biển số: <strong className="font-mono">51K-888.88</strong> • Cố vấn: <strong>Quang Tùng</strong>
          </p>
        </div>

        {approved && (
          <Link href={`/customer/payment/${params.order_code || "WO-20261001-0089"}`}>
            <LiquidGlassButton size="md" variant="primary">
              <CreditCard className="w-4 h-4 text-zinc-950" />
              Thanh Toán Ngay ({formatCurrencyVND(totalAmount)})
            </LiquidGlassButton>
          </Link>
        )}
      </div>

      {/* Bảng Báo Giá Động Từng Phần (Granular Approval) */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Chi Tiết Báo Giá Động (Thuế VAT 8%)
            </h3>
            <p className="text-xs text-zinc-500">
              Bạn có quyền tích chọn hoặc bỏ chọn từng phụ tùng/công việc theo nhu cầu thực tế.
            </p>
          </div>
          <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
            Đã chọn: {selectedItems.length}/{items.length} mục
          </div>
        </div>

        {/* Danh sách hạng mục */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
          {items.map((item) => (
            <div
              key={item.part_code}
              onClick={() => toggleItem(item.part_code)}
              className={`py-4 px-3 flex items-center justify-between cursor-pointer rounded-xl transition ${
                item.selected
                  ? "bg-amber-500/5 dark:bg-amber-400/5"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="text-amber-500">
                  {item.selected ? (
                    <CheckCircle2 className="w-5 h-5 fill-amber-500 text-zinc-950 dark:text-zinc-900" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      {item.type === "PART" ? "Phụ tùng OEM" : "Tiền công"}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    Mã: {item.part_code} • Số lượng: {item.quantity}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {formatCurrencyVND(item.unit_price * item.quantity)}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {item.selected ? "Đã duyệt làm" : "Chưa chọn"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bảng Quyết Toán Tài Chính */}
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-2.5 text-xs">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Tổng chi phí trước thuế (Pre-tax):</span>
            <span className="font-mono font-bold">{formatCurrencyVND(pretaxAmount)}</span>
          </div>
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Thuế giá trị gia tăng (VAT 8% chuẩn quy định):</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              +{formatCurrencyVND(vatAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <span>TỔNG THANH TOÁN DỰ TOÁN:</span>
            <span className="text-xl text-amber-600 dark:text-amber-400 font-mono font-black">
              {formatCurrencyVND(totalAmount)}
            </span>
          </div>
        </div>

        {/* Nút Ký Duyệt Báo Giá */}
        {!approved ? (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Ký duyệt sẽ kích hoạt khóa giữ kho phụ tùng bằng Redis Redlock 5s</span>
            </div>
            <LiquidGlassButton
              size="lg"
              onClick={handleApprove}
              className="w-full sm:w-auto shadow-amber-glow"
            >
              Ký Duyệt Báo Giá Điện Tử ({formatCurrencyVND(totalAmount)})
              <ArrowRight className="w-4 h-4 ml-1 text-zinc-950" />
            </LiquidGlassButton>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Bạn đã ký duyệt báo giá thành công. Kỹ thuật viên khoang máy đang tiến hành thi công lắp ráp!</span>
          </div>
        )}

      </div>

      {/* Tiến Độ Thi Công Realtime (Socket.io) & Ảnh Nghiệm Thu Camera */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Tiến Độ Thi Công Thời Gian Thực & Ảnh Giám Định
            </h3>
            <p className="text-xs text-zinc-500">
              Theo dõi trực tiếp từ camera khoang cầu nâng của thợ xưởng.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Live Socket.io
          </span>
        </div>

        {/* Timeline các bước */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1. Tiếp Nhận Xe
            </div>
            <div className="text-[11px] opacity-80">Hoàn tất kiểm tra 30 điểm</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2. Ký Báo Giá
            </div>
            <div className="text-[11px] opacity-80">Khách hàng đã ký online</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 space-y-1 animate-pulse">
            <div className="font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 3. Đang Thi Công
            </div>
            <div className="text-[11px] opacity-80">Thay má phanh trước (60%)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 space-y-1">
            <div className="font-bold">4. Nghiệm Thu KCS</div>
            <div className="text-[11px]">Chạy thử & Rửa xe bàn giao</div>
          </div>
        </div>

        {/* Khung Ảnh Nghiệm Thu Chụp Từ Tablet */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Ảnh chụp giám định linh kiện khoang nâng:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2">
              <div className="w-full h-40 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono">
                [ẢNH CẬN CẢNH MÁ PHANH CŨ MÒN XƯỚC ĐĨA]
              </div>
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                1. Tình trạng má phanh cũ trước khi tháo
              </div>
              <p className="text-[11px] text-zinc-500">Chụp lúc 08:35 bởi Thợ Phạm Văn Tiến</p>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2">
              <div className="w-full h-40 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono">
                [ẢNH MÁ PHANH TOYOTA MỚI NGUYÊN HỘP ĐÃ LẮP VÀO CÙM]
              </div>
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                2. Linh kiện mới nguyên tem sau khi thay thế
              </div>
              <p className="text-[11px] text-zinc-500">Chụp lúc 09:15 bởi Thợ Phạm Văn Tiến</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
