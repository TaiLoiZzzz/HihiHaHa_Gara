"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Network,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Car,
  Tag,
  Layers,
  Wrench,
  Sparkles,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";
import { GraphRagAiModal } from "@/components/technician/graph-rag-ai-modal";

interface EstimateItem {
  id: string;
  name: string;
  code: string;
  type: "part" | "labor";
  quantity: number;
  unitPrice: number;
  isOemSubstitute?: boolean;
}

interface CompatiblePart {
  partCode: string;
  partName: string;
  brand: string;
  platform: string;
  sharedModels: string[];
  inStock: number;
  price: number;
  confidence: number;
}

export default function EditOrderEstimatePage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = (params.order_code as string) || "WO-20261001-0089";

  // State báo giá hiện tại của WO-20261001-0089 (Khớp giá 2,808,000 VND từ backend/báo cáo)
  const [items, setItems] = useState<EstimateItem[]>([
    {
      id: "item-1",
      name: "Dầu động cơ tổng hợp toàn phần Castrol EDGE 0W-20 (4L)",
      code: "OIL-0W20-CAS",
      type: "part",
      quantity: 1,
      unitPrice: 1200000,
    },
    {
      id: "item-2",
      name: "Lọc nhớt chính hãng Toyota Camry TNGA",
      code: "04152-YZZA6",
      type: "part",
      quantity: 1,
      unitPrice: 250000,
    },
    {
      id: "item-3",
      name: "Má phanh trước Ceramic Akebono Ultra-Premium",
      code: "ACT-1222-AKE",
      type: "part",
      quantity: 1,
      unitPrice: 950000,
    },
    {
      id: "item-4",
      name: "Công thay dầu động cơ, lọc nhớt & dưỡng má phanh",
      code: "LAB-SVC-OIL-BRK",
      type: "labor",
      quantity: 1,
      unitPrice: 200000,
    },
  ]);

  // Neo4j Cypher Tra cứu phụ tùng dùng chung
  const [cypherQuery, setCypherQuery] = useState(
    "MATCH (c:CarModel {name: 'Camry 2.5Q'})-[:USES_PLATFORM]->(p:Platform)-[:COMPATIBLE_WITH]->(part:Part) RETURN part, p.name"
  );
  const [isSearchingNeo4j, setIsSearchingNeo4j] = useState(false);
  const [compatibleParts, setCompatibleParts] = useState<CompatiblePart[]>([
    {
      partCode: "ACT-1222-AKE",
      partName: "Má phanh trước Ceramic Akebono (Dùng chung nền tảng TNGA-K)",
      brand: "Akebono Japan",
      platform: "TNGA-K",
      sharedModels: ["Camry 2.5Q (2020-2025)", "RAV4 2.5L", "Lexus ES250", "Highlander 2.5"],
      inStock: 14,
      price: 950000,
      confidence: 100,
    },
    {
      partCode: "04152-YZZA6",
      partName: "Lọc dầu động cơ Toyota/Lexus Cartridge Type",
      brand: "Toyota Genuine",
      platform: "Dynamic Force Engine Family",
      sharedModels: ["Camry A25A-FKS", "RAV4", "Avalon", "Lexus NX250"],
      inStock: 48,
      price: 250000,
      confidence: 100,
    },
    {
      partCode: "DEN-IK20TT",
      partName: "Bugi Iridium TT Denso High-Ignitability",
      brand: "Denso",
      platform: "Universal 14mm Hex",
      sharedModels: ["Camry", "Corolla Cross", "RAV4", "Lexus ES"],
      inStock: 32,
      price: 240000,
      confidence: 96,
    },
    {
      partCode: "BOS-CABIN-AP",
      partName: "Lọc gió điều hòa kháng khuẩn than hoạt tính Bosch Aeristo",
      brand: "Bosch Germany",
      platform: "TNGA Cabin Standard",
      sharedModels: ["Camry", "Corolla Altis", "RAV4", "Harrier"],
      inStock: 22,
      price: 320000,
      confidence: 98,
    },
  ]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const vat = Math.round(subtotal * 0.08); // 8% VAT
  const grandTotal = subtotal + vat;

  const handleUpdateQty = (id: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const next = Math.max(1, item.quantity + delta);
          return { ...item, quantity: next };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.info("Đã xóa hạng mục khỏi báo giá");
  };

  const handleApplyNeo4jPart = (part: CompatiblePart) => {
    // Check if already in items
    if (items.some((i) => i.code === part.partCode)) {
      toast.warning(`Phụ tùng ${part.partCode} đã có trong báo giá!`);
      return;
    }

    const newItem: EstimateItem = {
      id: `item-${Date.now()}`,
      name: part.partName,
      code: part.partCode,
      type: "part",
      quantity: 1,
      unitPrice: part.price,
      isOemSubstitute: true,
    };

    setItems([...items, newItem]);
    toast.success(`Đã thêm ${part.partCode} qua gợi ý Neo4j Graph!`);
  };

  const handleSimulateNeo4jRun = () => {
    setIsSearchingNeo4j(true);
    setTimeout(() => {
      setIsSearchingNeo4j(false);
      toast.success("Neo4j Cypher Graph Engine: 4 quan hệ nền tảng TNGA-K đã được nạp thành công!");
    }, 600);
  };

  const handleSaveOrder = () => {
    toast.success(`Đã lưu cập nhật báo giá Lệnh #${orderCode}! (Tổng: ${formatVND(grandTotal)})`);
    setTimeout(() => {
      router.push("/advisor/work-orders");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/advisor/work-orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách Lệnh Sửa Chữa
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Chỉnh Sửa Báo Giá #{orderCode}</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Đang tiếp nhận
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Xe: Toyota Camry 2.5Q (Biển số: 51K-888.88) • Chủ xe: Nguyễn Văn A (0908888888)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GraphRagAiModal />
          <button
            onClick={handleSaveOrder}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Lưu & Cập Nhật
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bảng chi tiết báo giá (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Danh Mục Chi Phí & Nhân Công
                </h2>
                <p className="text-xs text-muted-foreground">
                  Điều chỉnh số lượng, đơn giá và kiểm tra thuế VAT 8%
                </p>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-muted">
                {items.length} hạng mục
              </span>
            </div>

            <div className="divide-y border rounded-xl overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-4 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === "part"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {item.type === "part" ? "Phụ tùng" : "Tiền công"}
                      </span>
                      {item.isOemSubstitute && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-500 flex items-center gap-1">
                          <Network className="w-3 h-3" /> Neo4j OEM
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{item.code}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {/* Qty */}
                    <div className="flex items-center border rounded-lg overflow-hidden bg-muted/40">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="px-2 py-1 text-xs hover:bg-muted font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="px-2 py-1 text-xs hover:bg-muted font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[110px]">
                      <p className="text-sm font-bold font-mono text-amber-500">
                        {formatVND(item.unitPrice * item.quantity)}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {formatVND(item.unitPrice)}/đv
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Xóa hạng mục"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="p-4 rounded-xl bg-muted/30 border space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tiền phụ tùng:</span>
                <span className="font-mono text-foreground">
                  {formatVND(
                    items
                      .filter((i) => i.type === "part")
                      .reduce((s, i) => s + i.unitPrice * i.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tiền công thợ:</span>
                <span className="font-mono text-foreground">
                  {formatVND(
                    items
                      .filter((i) => i.type === "labor")
                      .reduce((s, i) => s + i.unitPrice * i.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính (chưa VAT):</span>
                <span className="font-mono text-foreground">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Thuế VAT (8% theo NĐ 44/2023):</span>
                <span className="font-mono text-foreground">{formatVND(vat)}</span>
              </div>
              <div className="border-t pt-2.5 flex justify-between items-baseline font-bold">
                <span className="text-base">Tổng giá trị báo giá:</span>
                <span className="text-2xl font-mono text-amber-500 font-extrabold">
                  {formatVND(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Neo4j Cypher Graph Engine - Tra cứu phụ tùng dùng chung (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Neo4j Cypher Knowledge Graph</h3>
                  <p className="text-xs text-muted-foreground">Tra cứu phụ tùng liên nền tảng TNGA-K</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold">
                Port 17687 Bolt
              </span>
            </div>

            {/* Cypher Query Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground block">
                Cypher Query Real-Time:
              </label>
              <div className="relative font-mono text-xs bg-zinc-950 text-emerald-400 p-3 rounded-xl border border-zinc-800 leading-relaxed overflow-x-auto">
                <p>{cypherQuery}</p>
              </div>
              <button
                type="button"
                onClick={handleSimulateNeo4jRun}
                disabled={isSearchingNeo4j}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                {isSearchingNeo4j ? "Đang truy vấn Graph Database..." : "Thực thi truy vấn Cypher"}
              </button>
            </div>

            {/* Gợi ý tương thích cross-model */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Phụ tùng tương thích trên nền tảng ({compatibleParts.length} gợi ý)
              </p>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {compatibleParts.map((part) => (
                  <div
                    key={part.partCode}
                    className="p-3.5 rounded-xl border bg-background hover:border-purple-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-foreground">{part.partName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-purple-500 font-semibold">
                            {part.partCode}
                          </span>
                          <span className="text-[10px] text-muted-foreground">• {part.brand}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-500 whitespace-nowrap">
                        {formatVND(part.price)}
                      </span>
                    </div>

                    {/* Shared vehicle badges */}
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-medium">Xe tương thích chung:</p>
                      <div className="flex flex-wrap gap-1">
                        {part.sharedModels.map((m) => (
                          <span
                            key={m}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground border"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t text-xs">
                      <span className="text-emerald-500 font-medium text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tồn kho: {part.inStock} cái
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApplyNeo4jPart(part)}
                        className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Thêm vào báo giá
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
