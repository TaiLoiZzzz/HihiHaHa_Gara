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
  Mail,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
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
  const [loading, setLoading] = useState(false);

  // Form states - Mặc định dữ liệu thực tế
  const [plateNumber, setPlateNumber] = useState("51K-888.88");
  const [customerName, setCustomerName] = useState("Minh Thảo");
  const [phone, setPhone] = useState("0912345678");
  const [customerEmail, setCustomerEmail] = useState("tailoi1606@gmail.com");
  const [carModel, setCarModel] = useState("Toyota Camry 2.5Q (2022)");
  const [odo, setOdo] = useState("42500");
  const [fuelLevel, setFuelLevel] = useState("65");
  const [customerRequests, setCustomerRequests] = useState(
    "Bảo dưỡng định kỳ 40.000km, kiểm tra phanh trước phát tiếng kêu, thay dầu nhớt và lọc nhớt chính hãng."
  );

  // Tự động nhận diện chủ xe khi nhập biển số
  const handlePlateChange = (plate: string) => {
    const upper = plate.toUpperCase();
    setPlateNumber(upper);
    if (upper.includes("51K-888.88") || upper.includes("88888")) {
      setCustomerName("Minh Thảo");
      setPhone("0912345678");
      setCustomerEmail("tailoi1606@gmail.com");
      setCarModel("Toyota Camry 2.5Q (2022)");
    }
  };

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

  // Áp dụng toàn bộ chẩn đoán AI vào bảng báo giá
  const handleApplyAiDiagnosis = (
    parts: any[],
    laborCost: number,
    explanation: string,
    suggestedAction: string
  ) => {
    const newItems: OrderItem[] = [];

    // 1. Phụ tùng đề xuất
    parts.forEach((p, idx) => {
      const exists = items.some((it) => it.code === p.part_code);
      if (!exists) {
        newItems.push({
          id: `ai-part-${Date.now()}-${idx}`,
          name: p.part_name,
          code: p.part_code,
          type: "part",
          quantity: 1,
          unitPrice: Number(p.unit_price) || 0,
        });
      }
    });

    // 2. Tiền công thợ
    if (laborCost > 0) {
      newItems.push({
        id: `ai-labor-${Date.now()}`,
        name: suggestedAction ? `Công: ${suggestedAction}` : "Công bảo dưỡng & thay thế linh kiện theo AI",
        code: `LAB-AI-${Date.now().toString().slice(-4)}`,
        type: "labor",
        quantity: 1,
        unitPrice: laborCost,
      });
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      toast.success(`Đã tự động nạp ${newItems.length} hạng mục (phụ tùng + tiền công) vào Báo giá!`);
    } else {
      toast.info("Các hạng mục này đã có sẵn trong bảng báo giá.");
    }
  };

  // Áp dụng 1 phụ tùng đơn lẻ
  const handleApplySinglePart = (part: any, laborCost: number) => {
    const exists = items.some((it) => it.code === part.part_code);
    if (exists) {
      toast.info(`Phụ tùng [${part.part_code}] đã có trong bảng báo giá.`);
      return;
    }
    const newItem: OrderItem = {
      id: `ai-part-${Date.now()}`,
      name: part.part_name,
      code: part.part_code,
      type: "part",
      quantity: 1,
      unitPrice: Number(part.unit_price) || 0,
    };
    setItems((prev) => [...prev, newItem]);
    toast.success(`Đã thêm phụ tùng ${part.part_name} vào báo giá!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !customerName || !phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.createWorkOrder({
        license_plate: plateNumber,
        customer_phone: phone,
        customer_name: customerName,
        customer_email: customerEmail,
        vehicle_model: carModel,
        items: items.map((it) => ({
          name: it.name,
          part_code: it.code,
          type: it.type === "labor" ? "LABOR" : "PART",
          quantity: it.quantity,
          unit_price: it.unitPrice,
        })),
      });

      if (res.success && res.data) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("hihihaha_kanban_cards");
        }
        toast.success(`Khởi tạo thành công Lệnh #${res.data.order_code}! Xe đã vào Cột 1 (Tiếp nhận xe) trên bảng Kanban.`);
        setTimeout(() => {
          router.push("/advisor/work-orders");
        }, 800);
      } else {
        toast.error("Không thể lưu Lệnh sửa chữa lên hệ thống.");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi lưu dữ liệu Lệnh sửa chữa vào MongoDB.");
    } finally {
      setLoading(false);
    }
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
          <GraphRagAiModal
            vehicleModel={carModel}
            initialSymptoms={customerRequests}
            onApplyAll={handleApplyAiDiagnosis}
            onApplyPart={handleApplySinglePart}
            triggerLabel="⚡ AI Chẩn Đoán & Tự Động Lập Báo Giá"
          />
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
                    onChange={(e) => handlePlateChange(e.target.value)}
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center justify-between">
                  <span>Email Khách Hàng (Gmail) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-amber-600 font-semibold lowercase">Tự động kích hoạt tài khoản</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition"
                    placeholder="khachhang@gmail.com"
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

            {/* Banner Thông báo tự động kích hoạt tài khoản */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-900">
                  Tự động kích hoạt tài khoản Cổng Khách Hàng
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Khi Cố vấn lưu Lệnh, hệ thống sẽ tự động tạo hồ sơ khách hàng và gửi email xác nhận tiếp nhận xe qua Gmail. Khách hàng về nhà chỉ cần mở trang đăng nhập bằng <strong>Biển số xe</strong> và <strong>Số điện thoại</strong> là có thể theo dõi xe ngay.
                </p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                Danh Mục Báo Giá Dự Kiến ({items.length} hạng mục)
              </h2>
              <GraphRagAiModal
                vehicleModel={carModel}
                initialSymptoms={customerRequests}
                onApplyAll={handleApplyAiDiagnosis}
                onApplyPart={handleApplySinglePart}
                triggerLabel="✨ Gợi Ý Phụ Tùng Bằng AI"
              />
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
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Đang Khởi Tạo..." : "Tạo Lệnh Sửa Chữa (Work Order)"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
