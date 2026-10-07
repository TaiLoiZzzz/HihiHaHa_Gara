"use client";

import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  History,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";
import { GraphRagAiModal } from "@/components/technician/graph-rag-ai-modal";

interface PartItem {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  stockQty: number;
  minQty: number;
  unit: string;
  price: number;
  location: string;
}

const SAMPLE_INVENTORY: PartItem[] = [
  {
    id: "p1",
    code: "OIL-0W20-CAS",
    name: "Dầu động cơ tổng hợp toàn phần Castrol EDGE 0W-20 (Can 4L)",
    category: "Dầu & Dung dịch",
    brand: "Castrol",
    stockQty: 42,
    minQty: 10,
    unit: "Can",
    price: 1200000,
    location: "Kệ A-01",
  },
  {
    id: "p2",
    code: "04152-YZZA6",
    name: "Lọc nhớt chính hãng Toyota Camry TNGA-K Cartridge",
    category: "Lọc & Bảo dưỡng",
    brand: "Toyota Genuine",
    stockQty: 48,
    minQty: 15,
    unit: "Cái",
    price: 250000,
    location: "Kệ B-04",
  },
  {
    id: "p3",
    code: "ACT-1222-AKE",
    name: "Má phanh trước Ceramic Akebono Ultra-Premium (TNGA-K)",
    category: "Hệ thống phanh",
    brand: "Akebono",
    stockQty: 14,
    minQty: 5,
    unit: "Bộ",
    price: 950000,
    location: "Kệ C-02",
  },
  {
    id: "p4",
    code: "DEN-IK20TT",
    name: "Bugi Iridium TT Denso High-Ignitability",
    category: "Đánh lửa & Động cơ",
    brand: "Denso",
    stockQty: 32,
    minQty: 8,
    unit: "Cái",
    price: 240000,
    location: "Kệ A-05",
  },
  {
    id: "p5",
    code: "BOS-CABIN-AP",
    name: "Lọc gió điều hòa kháng khuẩn than hoạt tính Bosch Aeristo",
    category: "Lọc & Bảo dưỡng",
    brand: "Bosch",
    stockQty: 22,
    minQty: 10,
    unit: "Cái",
    price: 320000,
    location: "Kệ B-02",
  },
  {
    id: "p6",
    code: "MOT-DOT4-500",
    name: "Dầu phanh chịu nhiệt cao Motul DOT 4 Brake Fluid (500ml)",
    category: "Dầu & Dung dịch",
    brand: "Motul",
    stockQty: 3,
    minQty: 10,
    unit: "Chai",
    price: 180000,
    location: "Kệ A-03",
  },
  {
    id: "p7",
    code: "MIC-235-45R18",
    name: "Lốp xe ô tô Michelin Primacy 4 ST 235/45R18 98W",
    category: "Lốp & Mâm",
    brand: "Michelin",
    stockQty: 2,
    minQty: 4,
    unit: "Cái",
    price: 3650000,
    location: "Khu Lốp Kho",
  },
  {
    id: "p8",
    code: "BAT-GS-DIN65",
    name: "Ắc quy khô miễn bảo dưỡng GS DIN65-LBN (12V-65Ah)",
    category: "Điện & Bình ắc quy",
    brand: "GS Battery",
    stockQty: 8,
    minQty: 4,
    unit: "Bình",
    price: 1850000,
    location: "Khu Điện Bình",
  },
];

export default function WorkshopInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<PartItem[]>(SAMPLE_INVENTORY);

  // Modal Phiếu kiểm kê kho ST-YYYYMMDD-XX
  const [showStockCheckModal, setShowStockCheckModal] = useState(false);
  const [selectedItemForAudit, setSelectedItemForAudit] = useState<PartItem | null>(null);
  const [actualQty, setActualQty] = useState<number>(0);
  const [auditReason, setAuditReason] = useState("Kiểm kê định kỳ tháng 10");

  const categories = ["all", "Dầu & Dung dịch", "Lọc & Bảo dưỡng", "Hệ thống phanh", "Đánh lửa & Động cơ", "Lốp & Mâm", "Điện & Bình ắc quy"];

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleOpenAudit = (item: PartItem) => {
    setSelectedItemForAudit(item);
    setActualQty(item.stockQty);
    setShowStockCheckModal(true);
  };

  const handleConfirmStockAudit = () => {
    if (!selectedItemForAudit) return;

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const voucherCode = `ST-${todayStr}-01`;

    const variance = actualQty - selectedItemForAudit.stockQty;

    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItemForAudit.id ? { ...i, stockQty: actualQty } : i
      )
    );

    toast.success(
      `Đã phát hành Phiếu Kiểm Kê ${voucherCode}! Đã cập nhật tồn thực tế: ${actualQty} ${selectedItemForAudit.unit} (Độ lệch: ${
        variance > 0 ? `+${variance}` : variance
      })`
    );
    setShowStockCheckModal(false);
    setSelectedItemForAudit(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Kho Phụ Tùng OEM (500 Mã Vạch)</h1>
          <p className="text-sm text-muted-foreground">
            Hệ thống quản lý vật tư phụ tùng chính hãng, kiểm soát định mức tối thiểu & phát hành phiếu kiểm kê ST
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GraphRagAiModal />
          <button
            onClick={() => {
              toast.info("Đang kết nối xuất dữ liệu tồn kho 500 linh kiện dạng file Excel...");
            }}
            className="px-3.5 py-2 rounded-xl border bg-background hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Xuất Báo Cáo Tồn
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Tổng danh mục SKU</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-foreground">500 mã</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Chuẩn hóa cơ sở dữ liệu OEM</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Tổng giá trị lưu kho</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-amber-500">1.482.000.000 đ</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Tồn kho an toàn</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Cảnh báo chạm ngưỡng đỏ</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-red-500">
            {items.filter((i) => i.stockQty <= i.minQty).length} mã
          </p>
          <p className="text-[11px] text-red-500/80 mt-0.5">Cần đặt hàng nhà cung cấp</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Lượt kiểm kê trong tháng</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-blue-500">12 phiếu ST</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Độ khớp sổ sách: 99.4%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã phụ tùng, tên hoặc thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-amber-500 text-black"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              }`}
            >
              {cat === "all" ? "Tất cả danh mục" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Mã Phụ Tùng</th>
                <th className="py-3 px-4">Tên Sản Phẩm & Nhãn Hiệu</th>
                <th className="py-3 px-4">Phân Loại</th>
                <th className="py-3 px-4">Vị Trí Kệ</th>
                <th className="py-3 px-4 text-center">Tồn Kho</th>
                <th className="py-3 px-4 text-right">Đơn Giá Bán</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map((item) => {
                const isLowStock = item.stockQty <= item.minQty;
                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-amber-500">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground text-xs">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.brand}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-muted text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-xs ${
                            isLowStock ? "text-red-500" : "text-emerald-500"
                          }`}
                        >
                          {item.stockQty} {item.unit}
                        </span>
                        {isLowStock && (
                          <span
                            className="p-0.5 rounded bg-red-500/10 text-red-500"
                            title={`Tồn thấp hơn mức tối thiểu (${item.minQty} ${item.unit})`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-xs">
                      {formatVND(item.price)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenAudit(item)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" /> Kiểm Kê
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Check Modal (Phiếu kiểm kê ST-YYYYMMDD-XX) */}
      {showStockCheckModal && selectedItemForAudit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-amber-500" />
                  Lập Phiếu Kiểm Kê Kho ST
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mã phụ tùng: <span className="font-mono font-bold text-foreground">{selectedItemForAudit.code}</span>
                </p>
              </div>
              <button
                onClick={() => setShowStockCheckModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-foreground text-sm">{selectedItemForAudit.name}</p>
                <p className="text-muted-foreground mt-0.5">Vị trí lưu kho: {selectedItemForAudit.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tồn sổ sách hệ thống:</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {selectedItemForAudit.stockQty} {selectedItemForAudit.unit}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Đơn giá niêm yết:</span>
                  <span className="font-mono font-bold text-sm text-amber-500">
                    {formatVND(selectedItemForAudit.price)}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-foreground">
                  Số lượng đếm thực tế (Physical Count):
                </label>
                <input
                  type="number"
                  min="0"
                  value={actualQty}
                  onChange={(e) => setActualQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border bg-background font-mono font-bold text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Variance info */}
              <div className="p-2.5 rounded-lg border text-[11px] flex items-center justify-between">
                <span>Chênh lệch (Variance):</span>
                <span
                  className={`font-mono font-bold ${
                    actualQty - selectedItemForAudit.stockQty === 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {actualQty - selectedItemForAudit.stockQty > 0
                    ? `+${actualQty - selectedItemForAudit.stockQty}`
                    : actualQty - selectedItemForAudit.stockQty}{" "}
                  {selectedItemForAudit.unit}
                </span>
              </div>

              <div>
                <label className="font-bold block mb-1 text-foreground">Lý do điều chỉnh / Ghi chú:</label>
                <textarea
                  rows={2}
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStockCheckModal(false)}
                className="flex-1 py-2 rounded-xl border bg-background hover:bg-muted font-semibold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmStockAudit}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Cân Bằng & Xuất Phiếu ST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
