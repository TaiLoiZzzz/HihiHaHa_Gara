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
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/advisor/work-orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách Lệnh Sửa Chữa
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tiếp Nhận Xe Mới & Lập Báo Giá</h1>
          <p className="text-xs sm:text-sm text-slate-600">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Car className="w-4 h-4 text-amber-500" />
              Thông Tin Chủ Xe & Phương Tiện
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Biển Số Xe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-mono font-bold tracking-wider placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                    placeholder="VD: 51K-888.88"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Tên Khách Hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-mono font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                    placeholder="0908888888"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Dòng Xe & Đời Xe
                </label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                  placeholder="Toyota Camry 2.5Q"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Số Km Hiện Tại (ODO)
                </label>
                <div className="relative">
                  <Gauge className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    value={odo}
                    onChange={(e) => setOdo(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-mono font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                    placeholder="42500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Nhiên Liệu Còn Lại (%)
                </label>
                <div className="relative">
                  <Fuel className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-mono font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                    placeholder="65"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Yêu Cầu & Triệu Chứng Của Khách Hàng
              </label>
              <textarea
                rows={3}
                value={customerRequests}
                onChange={(e) => setCustomerRequests(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                placeholder="Ghi nhận phản hồi về tiếng ồn, rung lắc, nhu cầu bảo dưỡng định kỳ..."
              />
            </div>
          </div>

          {/* Card 2: Hạng mục báo giá sơ bộ */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                Danh Mục Báo Giá Dự Kiến ({items.length} hạng mục)
              </h2>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                        item.type === "part"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {item.type === "part" ? "Phụ tùng" : "Nhân công"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">{item.name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{item.code}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="px-2.5 py-1 text-xs hover:bg-slate-100 font-bold text-slate-700"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="px-2.5 py-1 text-xs hover:bg-slate-100 font-bold text-slate-700"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right w-32">
                      <p className="text-sm font-extrabold font-mono text-amber-600">
                        {formatVND(item.unitPrice * item.quantity)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {formatVND(item.unitPrice)}/đv
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Xóa hạng mục"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add item form */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-500" /> Thêm nhanh hạng mục hoặc vật tư
              </p>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="Tên hạng mục hoặc phụ tùng"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as "part" | "labor")}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-mono font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 active:scale-95"
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Tóm Tắt Báo Giá Sơ Bộ</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Tổng phụ tùng ({items.filter((i) => i.type === "part").length}):</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatVND(
                    items
                      .filter((i) => i.type === "part")
                      .reduce((s, i) => s + i.unitPrice * i.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Tổng tiền công ({items.filter((i) => i.type === "labor").length}):</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatVND(
                    items
                      .filter((i) => i.type === "labor")
                      .reduce((s, i) => s + i.unitPrice * i.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Tạm tính (chưa VAT):</span>
                <span className="font-mono font-bold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Thuế VAT (8%):</span>
                <span className="font-mono font-bold text-slate-900">{formatVND(vat)}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-base text-slate-900">Tổng cộng:</span>
                <span className="text-2xl font-black font-mono text-amber-600">{formatVND(grandTotal)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1 text-amber-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Quy trình tiếp nhận 4S:
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Sau khi tạo lệnh, thông báo sẽ lập tức chuyển đến Quản Đốc Xưởng trên bảng Kanban để phân công khoang và thợ.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
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
