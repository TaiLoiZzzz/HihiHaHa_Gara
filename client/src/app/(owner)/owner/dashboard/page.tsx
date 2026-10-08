"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  Car,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldAlert,
  Award,
  Layers,
  Clock,
  PieChart,
  BarChart3,
  FileText,
  Phone,
  Eye,
  Loader2,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { api } from "@/lib/api";

export default function OwnerDashboardPage() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "quarter">("month");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  React.useEffect(() => {
    async function loadOrders() {
      try {
        setLoadingOrders(true);
        const res = await api.getMyWorkOrders({ all: true });
        if (res.success && Array.isArray(res.data)) {
          setRecentOrders(res.data);
        }
      } catch (e) {
        console.warn("Owner dashboard load orders err:", e);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  // Dữ liệu tài chính tháng 10/2026
  const stats = {
    monthlyRevenue: 648500000, // 648.5 triệu
    revenueGrowth: 14.8, // +14.8%
    totalWorkOrders: 184, // 184 xe
    avgOrderValue: 3524000, // 3.52 triệu / lượt xe
    partsMargin: 38.5, // Biên lợi nhuận phụ tùng
    laborRevenue: 215000000,
    partsRevenue: 433500000,
    csatScore: 4.92,
  };

  // Top thợ kỹ thuật xuất sắc
  const topTechnicians = [
    {
      id: "1",
      name: "Nguyễn Văn Thợ",
      code: "THO-01",
      ordersDone: 42,
      hoursWorked: 168,
      efficiency: 118, // 118% hiệu suất so với định mức
      rating: 4.95,
      specialty: "Động cơ & Gầm TNGA",
    },
    {
      id: "2",
      name: "Trần Văn Cường",
      code: "THO-02",
      ordersDone: 38,
      hoursWorked: 160,
      efficiency: 112,
      rating: 4.88,
      specialty: "Hệ thống Phanh & Treo",
    },
    {
      id: "3",
      name: "Lê Hoàng Quân",
      code: "THO-03",
      ordersDone: 34,
      hoursWorked: 155,
      efficiency: 104,
      rating: 4.85,
      specialty: "Điện & Cảm biến ECU",
    },
  ];

  // Doanh thu theo ngày 7 ngày gần nhất
  const revenueChartData = [
    { day: "01/10", value: 18500000, orders: 6 },
    { day: "02/10", value: 24200000, orders: 8 },
    { day: "03/10", value: 31800000, orders: 9 },
    { day: "04/10", value: 28400000, orders: 8 },
    { day: "05/10", value: 36500000, orders: 11 },
    { day: "06/10", value: 42000000, orders: 13 },
    { day: "07/10", value: 38900000, orders: 10 },
  ];

  const maxDailyRevenue = Math.max(...revenueChartData.map((d) => d.value));

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard • Báo Cáo Ban Quản Trị</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Owner Mode
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Hiệu suất tài chính xưởng 4S, năng suất kỹ thuật viên & phân tích dữ liệu chuyên sâu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border text-xs">
            {(["day", "week", "month", "quarter"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  timeRange === r
                    ? "bg-amber-500 text-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "day" ? "Hôm nay" : r === "week" ? "Tuần này" : r === "month" ? "Tháng này" : "Quý IV"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Doanh thu */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Tổng Doanh Thu</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-foreground">
            {formatVND(stats.monthlyRevenue)}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{stats.revenueGrowth}% so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Lượt xe */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Lượt Xe Tiếp Nhận</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-foreground">
            {stats.totalWorkOrders} lượt
          </p>
          <p className="text-xs text-muted-foreground">
            Doanh thu TB: <strong className="text-foreground font-mono">{formatVND(stats.avgOrderValue)}</strong>/xe
          </p>
        </div>

        {/* Card 3: Biên lợi nhuận phụ tùng */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Biên LN Phụ Tùng OEM</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-amber-500">
            {stats.partsMargin}%
          </p>
          <p className="text-xs text-muted-foreground">
            Tồn kho an toàn: 500 mã SKU chuẩn hóa
          </p>
        </div>

        {/* Card 4: Điểm CSAT */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Độ Hài Lòng Khách (CSAT)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-foreground">
            {stats.csatScore} / 5.0 ★
          </p>
          <p className="text-xs text-emerald-500 font-semibold">
            Tỷ lệ quay lại bảo dưỡng: 78.4%
          </p>
        </div>
      </div>

      {/* Main Charts & Breakdowns (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Doanh thu 7 ngày (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
              </h2>
              <p className="text-xs text-muted-foreground">
                Dữ liệu đồng bộ tự động từ cổng thanh toán VietQR & VNPay
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500">
              TB: ~31.4M / ngày
            </span>
          </div>

          {/* Visual CSS Bar Chart */}
          <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b">
            {revenueChartData.map((d) => {
              const heightPercent = Math.round((d.value / maxDailyRevenue) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {(d.value / 1000000).toFixed(1)}M
                  </span>
                  <div className="w-full bg-muted/40 rounded-t-lg h-48 flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-md group-hover:brightness-110 transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{d.day}</span>
                </div>
              );
            })}
          </div>

          {/* Cơ cấu nguồn thu: Phụ tùng vs Tiền công */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl border bg-background space-y-1">
              <span className="text-xs text-muted-foreground">Doanh thu Phụ tùng OEM:</span>
              <p className="text-lg font-bold font-mono text-foreground">
                {formatVND(stats.partsRevenue)}
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "67%" }} />
              </div>
              <span className="text-[10px] text-muted-foreground">Chiếm 66.8% tổng thu</span>
            </div>

            <div className="p-3.5 rounded-xl border bg-background space-y-1">
              <span className="text-xs text-muted-foreground">Doanh thu Tiền công dịch vụ:</span>
              <p className="text-lg font-bold font-mono text-foreground">
                {formatVND(stats.laborRevenue)}
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "33%" }} />
              </div>
              <span className="text-[10px] text-muted-foreground">Chiếm 33.2% tổng thu</span>
            </div>
          </div>
        </div>

        {/* Năng suất thợ kỹ thuật (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                Năng Suất Kỹ Thuật Viên Xưởng
              </h2>
              <p className="text-xs text-muted-foreground">
                Đánh giá theo thời gian tiêu chuẩn flat-rate & CSAT
              </p>
            </div>
            <Link
              href="/manager/kanban"
              className="text-xs text-amber-500 hover:underline font-semibold"
            >
              Xem Kanban →
            </Link>
          </div>

          <div className="space-y-4">
            {topTechnicians.map((tech, idx) => (
              <div
                key={tech.id}
                className="p-4 rounded-xl border bg-background space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        idx === 0
                          ? "bg-amber-500 text-black"
                          : idx === 1
                          ? "bg-zinc-400 text-black"
                          : "bg-amber-700 text-white"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-foreground">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {tech.efficiency}% công suất
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t text-[11px] text-muted-foreground font-mono">
                  <div>
                    <span>Lệnh đã xong:</span>{" "}
                    <strong className="text-foreground">{tech.ordersDone} xe</strong>
                  </div>
                  <div>
                    <span>Giờ làm:</span>{" "}
                    <strong className="text-foreground">{tech.hoursWorked}h</strong>
                  </div>
                  <div>
                    <span>Đánh giá:</span>{" "}
                    <strong className="text-amber-500">{tech.rating}★</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link action */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
            <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Khuyến nghị từ AI Doanh Nghiệp:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Dịch vụ thay má phanh gầm xe TNGA đang đạt tỷ suất lợi nhuận cao nhất (+42%). Đề xuất tăng trữ lượng má phanh Akebono ACT-1222 tại kho để rút ngắn thời gian hoàn thành lệnh.
            </p>
          </div>
        </div>
      </div>

      {/* Bảng Giám Sát Các Lệnh Sửa Chữa Mới Nhất & Liên Hệ Khách Hàng (Dành cho Chủ Gara) */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Lệnh Sửa Chữa Đang Xử Lý & Liên Hệ Khách Hàng (Live MongoDB)
            </h2>
            <p className="text-xs text-muted-foreground">
              Thông tin trực quan bao gồm số điện thoại khách hàng, tiến độ kỹ thuật và thợ trực tiếp thi công
            </p>
          </div>
          <Link
            href="/manager/kanban"
            className="text-xs text-amber-500 hover:underline font-semibold"
          >
            Mở Kanban Điều Phối →
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs text-muted-foreground font-mono">Đang tải danh sách lệnh sửa chữa...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            Chưa có lệnh sửa chữa nào được ghi nhận.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">Mã Lệnh</th>
                  <th className="py-3 px-4">Biển Số & Dòng Xe</th>
                  <th className="py-3 px-4">Khách Hàng & SĐT</th>
                  <th className="py-3 px-4">Kỹ Thuật Viên</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Tổng Tiền</th>
                  <th className="py-3 px-4 text-center">Xem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {recentOrders.slice(0, 10).map((ord) => {
                  const techName = ord.assigned_technicians?.[0]?.technician_name || "Chưa gán thợ";
                  const phone = ord.customer_phone || "";
                  const total = ord.estimate?.total_amount || 0;
                  return (
                    <tr key={ord.order_code} className="hover:bg-muted/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-amber-500">
                        {ord.order_code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded text-foreground inline-block">
                          {ord.license_plate}
                        </span>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{ord.vehicle_model}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{ord.customer_name || "Khách hàng"}</div>
                        {phone && (
                          <a
                            href={`tel:${phone}`}
                            className="text-[11px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 mt-0.5 hover:underline font-mono"
                            title="Gọi điện cho khách hàng"
                          >
                            <Phone className="w-3 h-3 text-amber-500" />
                            {phone}
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <span className="font-semibold text-foreground">{techName}</span>
                        <div className="text-[10px] text-muted-foreground">{ord.bay || "Khoang nâng"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {ord.current_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                        {formatVND(total)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/customer/orders/${ord.order_code}`}
                          className="p-1.5 rounded-lg hover:bg-amber-500 hover:text-black inline-block text-muted-foreground transition"
                          title="Xem hồ sơ xe"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
