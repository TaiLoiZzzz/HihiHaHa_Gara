"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  User,
  Phone,
  Gauge,
  ClipboardList,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  Wrench,
  Package,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";
import { GraphRagAiModal } from "@/components/technician/graph-rag-ai-modal";

interface OrderItem {
  id: string;
  name: string;
  code: string;
  type: "part" | "labor";
  quantity: number;
  unitPrice: number;
}

export default function CreateOrderPage() {
  const router = useRouter();

  // Form states
  const [plateNumber, setPlateNumber] = useState("51K-888.88");
  const [customerName, setCustomerName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("0908888888");
  const [carModel, setCarModel] = useState("Toyota Camry 2.5Q (2022)");
  const [odo, setOdo] = useState("42500");
  const [fuelLevel, setFuelLevel] = useState("65");
  const [customerRequests, setCustomerRequests] = useState(
    "Bảo dưỡng cấp 40.000km, phanh có tiếng kêu nhẹ khi rà gấp, thay dầu tổng hợp cao cấp."
  );

  // Initial estimate items
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Dầu động cơ tổng hợp toàn phần Castrol EDGE 0W-20 (4L)",
      code: "OIL-0W20-CAS",
      type: "part",
      quantity: 1,
      unitPrice: 1200000,
    },
    {
      id: "2",
      name: "Lọc nhớt chính hãng Toyota Camry TNGA",
      code: "04152-YZZA6",
      type: "part",
      quantity: 1,
      unitPrice: 250000,
    },
    {
      id: "3",
      name: "Công bảo dưỡng định kỳ & kiểm tra phanh 4 bánh",
      code: "LAB-MAINT-40K",
      type: "labor",
      quantity: 1,
      unitPrice: 650000,
    },
  ]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemCode, setNewItemCode] = useState("");
  const [newItemType, setNewItemType] = useState<"part" | "labor">("part");
  const [newItemPrice, setNewItemPrice] = useState(350000);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const vat = Math.round(subtotal * 0.08); // VAT 8%
  const grandTotal = subtotal + vat;

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast.error("Vui lòng nhập tên hạng mục!");
      return;
    }
    const newItem: OrderItem = {
      id: Date.now().toString(),
      name: newItemName,
      code: newItemCode || `CUSTOM-${Date.now().toString().slice(-4)}`,
      type: newItemType,
      quantity: 1,
      unitPrice: Number(newItemPrice) || 0,
    };
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemCode("");
    toast.success("Đã thêm hạng mục vào báo giá sơ bộ!");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !customerName || !phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const newOrderCode = `WO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    toast.success(`Tạo thành công Lệnh Sửa Chữa #${newOrderCode}!`);
    setTimeout(() => {
      router.push("/advisor/work-orders");
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/advisor/work-orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách Lệnh Sửa Chữa
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Tiếp Nhận Xe Mới & Lập Báo Giá</h1>
          <p className="text-sm text-muted-foreground">
            Lập phiếu tiếp nhận xe dịch vụ 4S, ghi nhận tình trạng ngoại quan và báo giá sơ bộ ban đầu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GraphRagAiModal />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Thông tin xe & Khách hàng */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Thông tin xe & khách */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-500" />
              Thông Tin Chủ Xe & Phương Tiện
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Biển Số Xe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-background text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="VD: 51K-888.88"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Tên Khách Hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0908888888"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Dòng Xe & Đời Xe
                </label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Toyota Camry 2.5Q"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Số Km Hiện Tại (ODO)
                </label>
                <div className="relative">
                  <Gauge className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="number"
                    value={odo}
                    onChange={(e) => setOdo(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="42500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Nhiên Liệu Còn Lại (%)
                </label>
                <div className="relative">
                  <Fuel className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="65"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                Yêu Cầu & Triệu Chứng Của Khách Hàng
              </label>
              <textarea
                rows={3}
                value={customerRequests}
                onChange={(e) => setCustomerRequests(e.target.value)}
                className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ghi nhận phản hồi về tiếng ồn, rung lắc, nhu cầu bảo dưỡng định kỳ..."
              />
            </div>
          </div>

          {/* Card 2: Hạng mục báo giá sơ bộ */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                Danh Mục Báo Giá Dự Kiến ({items.length} hạng mục)
              </h2>
            </div>

            {/* List */}
            <div className="divide-y border rounded-xl overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 bg-background">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                        item.type === "part"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {item.type === "part" ? "Phụ tùng" : "Nhân công"}
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-snug">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.code}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg overflow-hidden bg-muted/40">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="px-2 py-0.5 text-xs hover:bg-muted font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="px-2 py-0.5 text-xs hover:bg-muted font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right w-28">
                      <p className="text-sm font-bold font-mono text-amber-500">
                        {formatVND(item.unitPrice * item.quantity)}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {formatVND(item.unitPrice)}/đv
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add item form */}
            <div className="p-4 rounded-xl border border-dashed bg-muted/20 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm nhanh hạng mục hoặc vật tư
              </p>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="Tên hạng mục hoặc phụ tùng"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border bg-background text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as "part" | "labor")}
                    className="w-full px-2 py-1.5 rounded-lg border bg-background text-xs"
                  >
                    <option value="part">Phụ tùng</option>
                    <option value="labor">Nhân công</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="number"
                    placeholder="Đơn giá (VNĐ)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border bg-background text-xs font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Tóm tắt chi phí & Nút xác nhận */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-base font-semibold">Tóm Tắt Báo Giá Sơ Bộ</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tổng phụ tùng ({items.filter((i) => i.type === "part").length}):</span>
                <span className="font-mono text-foreground">
                  {formatVND(
                    items
                      .filter((i) => i.type === "part")
                      .reduce((s, i) => s + i.unitPrice * i.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tổng tiền công ({items.filter((i) => i.type === "labor").length}):</span>
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
                <span>Thuế VAT (8%):</span>
                <span className="font-mono text-foreground">{formatVND(vat)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between items-baseline font-bold">
                <span className="text-base">Tổng cộng:</span>
                <span className="text-xl font-mono text-amber-500">{formatVND(grandTotal)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quy trình tiếp nhận 4S:
              </p>
              <p>Sau khi tạo lệnh, thông báo sẽ lập tức chuyển đến Quản Đốc Xưởng trên bảng Kanban để phân công khoang và thợ.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Tạo Lệnh Sửa Chữa (Work Order)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
