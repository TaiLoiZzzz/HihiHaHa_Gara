"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardList, PlusCircle, Search, Filter, Eye, Edit3, CheckCircle2, Clock, Car } from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

const SAMPLE_ORDERS = [
  {
    order_code: "WO-20261001-0089",
    plate: "51K-888.88",
    car: "Toyota Camry 2.5Q",
    customer: "Minh Thảo",
    status: "QUOTE_SENT",
    statusText: "Đã gửi báo giá (Chờ khách duyệt)",
    statusColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    totalAmount: 2808000,
    advisor: "Trần Cố Vấn",
    created_at: "01/10/2026 08:30"
  },
  {
    order_code: "WO-20261001-0090",
    plate: "30A-999.11",
    car: "Lexus ES250",
    customer: "Vũ Hoàng",
    status: "IN_PROGRESS",
    statusText: "Đang thi công trong khoang",
    statusColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    totalAmount: 4500000,
    advisor: "Trần Cố Vấn",
    created_at: "01/10/2026 09:15"
  },
  {
    order_code: "WO-20261001-0091",
    plate: "51H-123.45",
    car: "Mazda CX-5",
    customer: "Đặng Nam",
    status: "COMPLETED",
    statusText: "Đã hoàn tất & Đã thanh toán",
    statusColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    totalAmount: 1850000,
    advisor: "Trần Cố Vấn",
    created_at: "01/10/2026 07:45"
  }
];

export default function AdvisorWorkOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = SAMPLE_ORDERS.filter(o => 
    o.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-amber-500" />
            Quản Lý Danh Sách Lệnh Sửa Chữa
          </h1>
          <p className="text-xs text-zinc-500">
            Theo dõi tiến trình, lập dự toán và điều phối xe ra vào xưởng dịch vụ
          </p>
        </div>

        <Link href="/advisor/create-order">
          <LiquidGlassButton size="md">
            <PlusCircle className="w-4 h-4 text-zinc-950" />
            Tiếp Nhận Xe Mới
          </LiquidGlassButton>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã lệnh, biển số, tên khách..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Tổng số lệnh: <strong>{filteredOrders.length}</strong></span>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase font-mono text-[11px]">
              <th className="pb-3 font-semibold">Mã Lệnh</th>
              <th className="pb-3 font-semibold">Phương Tiện / Biển Số</th>
              <th className="pb-3 font-semibold">Chủ Xe</th>
              <th className="pb-3 font-semibold">Trạng Thái (FSM)</th>
              <th className="pb-3 font-semibold text-right">Tổng Tiền (8% VAT)</th>
              <th className="pb-3 font-semibold text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {filteredOrders.map((order) => (
              <tr key={order.order_code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition">
                <td className="py-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {order.order_code}
                </td>
                <td className="py-4">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200">{order.car}</div>
                  <div className="font-mono text-zinc-500 font-semibold">{order.plate}</div>
                </td>
                <td className="py-4 font-medium text-zinc-700 dark:text-zinc-300">
                  {order.customer}
                </td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${order.statusColor}`}>
                    {order.statusText}
                  </span>
                </td>
                <td className="py-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrencyVND(order.totalAmount)}
                </td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/advisor/orders/${order.order_code}/edit`}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
                      title="Chỉnh sửa & Tra cứu Neo4j"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/customer/orders/${order.order_code}`}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
                      title="Xem giao diện khách"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
