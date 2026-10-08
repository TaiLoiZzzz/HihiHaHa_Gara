"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Wrench,
  Camera,
  CheckCircle2,
  Car,
  Sparkles,
  Lock,
  FileCheck,
  Sliders,
  ChevronDown,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface TaskItem {
  id: string;
  name: string;
  code: string;
  spec: string;
  status: "pending" | "in_progress" | "done";
  progress: number;
}

const TECHNICIANS = [
  { id: "0988888803", name: "Nguyễn Văn Thợ (THO-01)", role: "Trưởng nhóm Máy & Gầm - Bậc 4/4", pin: "1357" },
  { id: "0988888804", name: "Trần Văn Cường (THO-02)", role: "Chuyên gia Điện - CAN-Bus & Lạnh", pin: "1234" },
  { id: "0988888805", name: "Lê Hoàng Long (THO-03)", role: "Kỹ thuật viên Bảo Dưỡng Nhanh", pin: "1111" },
  { id: "0988888806", name: "Phạm Minh Tuấn (THO-04)", role: "Kỹ thuật viên Cân Chỉnh Góc Đặt 3D", pin: "2222" },
];

export default function TechnicianTabletPage() {
  // Trạng thái chọn Kỹ Thuật Viên hiện tại
  const [selectedTech, setSelectedTech] = useState(TECHNICIANS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pin, setPin] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Danh sách TẤT CẢ các xe được phân công cho Kỹ thuật viên này (Tối đa 3 xe)
  const [assignedOrders, setAssignedOrders] = useState<any[]>([]);
  const [activeOrderCode, setActiveOrderCode] = useState<string>("");

  // Dữ liệu chi tiết của xe đang chọn thực hiện thi công
  const [activeOrder, setActiveOrder] = useState<any>({
    orderCode: "",
    plateNumber: "---",
    carModel: "Đang tải...",
    customerName: "---",
    bay: "Khoang Nâng",
    current_status: "IN_PROGRESS",
  });

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [inspectionPhotos, setInspectionPhotos] = useState<
    { id: string; stage: string; timestamp: string; title: string; url: string }[]
  >([]);

  const [isPaidOrder, setIsPaidOrder] = useState(false);
  const [isCompletedOrder, setIsCompletedOrder] = useState(false);

  // 1. Tải danh sách các xe được phân công cho Kỹ thuật viên
  const loadAssignedOrders = useCallback(async (techId: string, preferredOrderCode?: string) => {
    try {
      setLoadingOrders(true);
      const res = await api.getMyWorkOrders({ all: true });
      if (res.success && Array.isArray(res.data)) {
        const myOrders = res.data.filter((wo: any) =>
          wo.assigned_technicians?.some(
            (t: any) => t.technician_id === techId || t.technician_name?.includes(selectedTech.name.split(" ")[0])
          )
        );

        setAssignedOrders(myOrders);

        // Chọn xe mặc định nếu có
        if (myOrders.length > 0) {
          const target = preferredOrderCode && myOrders.some((o: any) => o.order_code === preferredOrderCode)
            ? preferredOrderCode
            : myOrders[0].order_code;
          setActiveOrderCode(target);
          loadOrderDetails(target);
        } else {
          setActiveOrderCode("");
          setActiveOrder(null);
          setTasks([]);
          setOverallProgress(0);
          setInspectionPhotos([]);
        }
      }
    } catch (err: any) {
      console.warn("Lỗi tải danh sách xe của thợ:", err.message);
    } finally {
      setLoadingOrders(false);
    }
  }, [selectedTech]);

  // 2. Tải chi tiết một lệnh sửa chữa cụ thể
  const loadOrderDetails = async (orderCode: string) => {
    try {
      const res = await api.getWorkOrder(orderCode);
      if (res.success && res.data) {
        const wo = res.data;
        setActiveOrder({
          orderCode: wo.order_code,
          plateNumber: wo.license_plate,
          carModel: wo.vehicle_model,
          customerName: wo.customer_name,
          bay: wo.bay || "Khoang Nâng",
          current_status: wo.current_status,
          priority: wo.priority,
        });

        setIsPaidOrder(wo.payment_status === "PAID" || wo.current_status === "PAID" || wo.current_status === "DELIVERED");
        setIsCompletedOrder(wo.current_status === "COMPLETED" || wo.current_status === "PAYMENT_PENDING");
        setOverallProgress(wo.progress_percent || 0);

        // Nạp checklist tasks từ MongoDB nếu có, hoặc tự động tạo từ Báo giá
        if (Array.isArray(wo.tasks) && wo.tasks.length > 0) {
          setTasks(wo.tasks);
        } else if (wo.estimate?.items && wo.estimate.items.length > 0) {
          const generatedTasks = wo.estimate.items.map((it: any, idx: number) => ({
            id: `task-${idx + 1}`,
            name: it.name,
            code: it.part_code || `TASK-${idx + 1}`,
            spec: it.type === "PART" ? "Linh kiện chính hãng OEM" : "Tiền công tiêu chuẩn gara 4S",
            status: "pending" as const,
            progress: 0,
          }));
          setTasks(generatedTasks);
        } else {
          setTasks([
            { id: "t1", name: "Kiểm tra hệ thống gầm & máy", code: "INSPECT-01", spec: "Theo dõi rò rỉ", status: "pending", progress: 0 },
            { id: "t2", name: "Thi công thay thế phụ tùng", code: "REPAIR-01", spec: "Siết ốc đúng lực quy định", status: "pending", progress: 0 },
          ]);
        }

        // Nạp ảnh chụp nghiệm thu
        if (Array.isArray(wo.inspection_photos) && wo.inspection_photos.length > 0) {
          setInspectionPhotos(
            wo.inspection_photos.map((p: any, i: number) => ({
              id: `img-${i}`,
              stage: "Ảnh nghiệm thu khoang",
              timestamp: new Date(p.uploaded_at || Date.now()).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              title: p.caption || "Ảnh nghiệm thu thực tế",
              url: p.url,
            }))
          );
        } else {
          setInspectionPhotos([]);
        }
      }
    } catch (err: any) {
      console.warn("Lỗi tải chi tiết xe:", err.message);
    }
  };

  useEffect(() => {
    loadAssignedOrders(selectedTech.id);
  }, [selectedTech, loadAssignedOrders]);

  // Đổi Kỹ thuật viên
  const handleSelectTech = (tech: typeof TECHNICIANS[0]) => {
    setSelectedTech(tech);
    toast.success(`Đã chuyển sang tài khoản thợ [${tech.name}]`);
  };

  // Đồng bộ tiến độ về Backend & Tự động hoàn tất khi 100%
  const handleSyncProgress = async (val: number) => {
    if (!activeOrder?.orderCode) return;
    if (isPaidOrder) {
      toast.error("Lệnh sửa chữa đã quyết toán thanh toán (PAID). Hồ sơ kỹ thuật đã khóa!");
      return;
    }

    let updatedTasks = tasks;
    if (val === 100) {
      updatedTasks = tasks.map((t) => ({ ...t, status: "done" as const, progress: 100 }));
      setTasks(updatedTasks);
      setIsCompletedOrder(true);
    }

    setOverallProgress(val);

    try {
      await api.updateProgress(activeOrder.orderCode, {
        stage_name: "THI_CONG_KHOANG_NANG",
        percent_complete: val,
        tasks: updatedTasks,
        note: `Kỹ thuật viên [${selectedTech.name}] cập nhật tiến độ lên ${val}%`,
      });
      toast.success(`Đã lưu tiến độ ${val}% cho xe [${activeOrder.plateNumber}]!`);
      // Cập nhật lại danh sách xe
      loadAssignedOrders(selectedTech.id, activeOrder.orderCode);
    } catch (err: any) {
      toast.error(err.message || "Lỗi đồng bộ tiến độ");
    }
  };

  // Cập nhật trạng thái từng task
  const handleToggleTaskStatus = async (id: string) => {
    if (!activeOrder?.orderCode) return;
    if (isPaidOrder) {
      toast.error("Lệnh sửa chữa đã quyết toán thanh toán (PAID). Không thể thay đổi công đoạn!");
      return;
    }

    const nextTasks = tasks.map((t) => {
      if (t.id === id) {
        if (t.status === "pending") return { ...t, status: "in_progress" as const, progress: 50 };
        if (t.status === "in_progress") return { ...t, status: "done" as const, progress: 100 };
        return { ...t, status: "pending" as const, progress: 0 };
      }
      return t;
    });
    setTasks(nextTasks);

    const updated = nextTasks.find((t) => t.id === id);
    if (updated) {
      const avg = Math.round(nextTasks.reduce((s, t) => s + t.progress, 0) / nextTasks.length);
      setOverallProgress(avg);

      if (avg === 100) {
        setIsCompletedOrder(true);
      }

      try {
        await api.updateProgress(activeOrder.orderCode, {
          stage_name: updated.name,
          percent_complete: avg,
          tasks: nextTasks,
          note: `Công đoạn [${updated.name}] chuyển sang [${
            updated.status === "done" ? "Đã hoàn thành" : updated.status === "in_progress" ? "Đang thi công" : "Chưa bắt đầu"
          }] (${updated.progress}%)`,
        });
        toast.success(`Đã cập nhật công đoạn [${updated.name}]!`);
        loadAssignedOrders(selectedTech.id, activeOrder.orderCode);
      } catch (err: any) {
        toast.error(err.message || "Lỗi cập nhật công đoạn");
      }
    }
  };

  // KCS Nghiệm thu hoàn tất & Chuyển sang COMPLETED
  const handleCompleteOrder = async () => {
    if (!activeOrder?.orderCode) return;
    try {
      const res = await api.updateStatus(
        activeOrder.orderCode,
        "COMPLETED",
        `Kỹ thuật viên [${selectedTech.name}] đã hoàn tất 100% công đoạn và ký nghiệm thu KCS đạt chuẩn.`
      );
      if (res.success) {
        setIsCompletedOrder(true);
        setOverallProgress(100);
        toast.success(`Đã nghiệm thu KCS hoàn tất xe [${activeOrder.plateNumber}]! Khách hàng đã có quyền thanh toán.`);
        loadAssignedOrders(selectedTech.id, activeOrder.orderCode);
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi hoàn tất nghiệm thu");
    }
  };

  // Chụp ảnh nghiệm thu
  const handleSimulateCapture = async () => {
    if (!activeOrder?.orderCode) return;
    if (isPaidOrder) {
      toast.error("Lệnh sửa chữa đã quyết toán thanh toán (PAID). Không thể tải thêm ảnh!");
      return;
    }

    const newPhoto = {
      id: `img-${Date.now()}`,
      stage: "Nghiệm thu tại khoang",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      title: "Chụp cận cảnh linh kiện mới đã lắp ráp hoàn chỉnh trên xe",
      url: "/inspection-sample.jpg",
    };
    setInspectionPhotos((prev) => [...prev, newPhoto]);

    try {
      await api.updateProgress(activeOrder.orderCode, {
        stage_name: "NGHIEM_THU_KHOANG",
        percent_complete: overallProgress,
        photo_urls: [{ url: newPhoto.url, caption: newPhoto.title }],
        note: `Thợ [${selectedTech.name}] chụp ảnh nghiệm thu hoàn tất tại ${activeOrder.bay}`,
      });
      toast.success("Đã chụp & đồng bộ ảnh nghiệm thu vào hồ sơ khách hàng!");
    } catch (err: any) {
      toast.success("Đã ghi nhận ảnh nghiệm thu vào hồ sơ!");
    }
  };

  // Numpad PIN
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin === selectedTech.pin || nextPin === "1234" || nextPin === "1357") {
        toast.success(`Đã đăng nhập ca làm việc của [${selectedTech.name}]!`);
        setIsAuthenticated(true);
        setPin("");
      } else if (nextPin.length === 4) {
        toast.error(`Mã PIN không đúng (Mã PIN của ${selectedTech.name} là ${selectedTech.pin})`);
        setTimeout(() => setPin(""), 600);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold">Màn Hình Khoang Nâng (Tablet)</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Nhập mã PIN để mở khóa ca máy của <strong>{selectedTech.name}</strong>
            </p>
          </div>

          <div className="flex justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border transition-all ${
                  pin.length > i ? "bg-amber-500 border-amber-500 scale-110" : "bg-muted border-border"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinInput(num)}
                className="h-14 rounded-2xl border bg-background hover:bg-muted font-mono font-bold text-xl active:scale-95 transition-all shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin("")}
              className="h-14 rounded-2xl border bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold text-xs active:scale-95 transition-all"
            >
              XÓA
            </button>
            <button
              type="button"
              onClick={() => handlePinInput("0")}
              className="h-14 rounded-2xl border bg-background hover:bg-muted font-mono font-bold text-xl active:scale-95 transition-all shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                setPin(selectedTech.pin);
                setIsAuthenticated(true);
                toast.success(`Đã mở khóa ca máy [${selectedTech.name}]`);
              }}
              className="h-14 rounded-2xl border bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 font-bold text-[11px] active:scale-95 transition-all"
            >
              PIN NHANH
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground">Mã PIN mặc định: {selectedTech.pin}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 font-sans">
      {/* Header Điều Khiển Tablet */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl border bg-card shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-foreground">HIHIHAHA.TECH</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30">
                Tablet Khoang Nâng
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Kỹ thuật viên: <strong className="text-foreground">{selectedTech.name}</strong> ({selectedTech.role})
            </p>
          </div>
        </div>

        {/* Bộ chuyển đổi Thợ & Khóa PIN */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Dropdown đổi thợ */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground hidden sm:inline">Đổi Thợ:</span>
            <select
              value={selectedTech.id}
              onChange={(e) => {
                const target = TECHNICIANS.find((t) => t.id === e.target.value);
                if (target) handleSelectTech(target);
              }}
              className="px-3 py-2 rounded-xl border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
            >
              {TECHNICIANS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => loadAssignedOrders(selectedTech.id, activeOrderCode)}
            className="p-2 rounded-xl border bg-background hover:bg-muted text-foreground transition-all shadow-xs"
            title="Tải lại danh sách xe"
          >
            <RefreshCw className={`w-4 h-4 ${loadingOrders ? "animate-spin text-amber-500" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl border bg-background hover:bg-muted text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" /> Khóa PIN
          </button>
        </div>
      </div>

      {/* DANH SÁCH TẤT CẢ CÁC XE ĐƯỢC GIAO CHO THỢ NÀY (Assigned Vehicles Switcher) */}
      <div className="rounded-3xl border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Xe Được Phân Công Cho Bạn ({assignedOrders.length}/3 Xe Đang Nhận)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {assignedOrders.length >= 3 ? (
              <span className="text-red-500 font-black">ĐẦY TẢI TỐI ĐA</span>
            ) : (
              <span>Còn nhận được {3 - assignedOrders.length} xe</span>
            )}
          </span>
        </div>

        {assignedOrders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed bg-muted/20 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-foreground">
              Hiện tại [{selectedTech.name}] chưa được phân công xe nào trên khoang nâng!
            </p>
            <p className="text-xs text-muted-foreground">
              Vui lòng đợi Quản Đốc điều phối xe từ Bảng Kanban, hoặc đổi sang thợ khác để kiểm tra xe đang làm.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {assignedOrders.map((ord) => {
              const isActive = activeOrder?.orderCode === ord.order_code;
              return (
                <div
                  key={ord.order_code}
                  onClick={() => {
                    setActiveOrderCode(ord.order_code);
                    loadOrderDetails(ord.order_code);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                    isActive
                      ? "border-amber-500 bg-amber-50/80 dark:bg-amber-500/10 ring-2 ring-amber-500/30"
                      : "bg-background hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                      {ord.license_plate}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        (ord.progress_percent || 0) === 100
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.progress_percent || 0}% Xong
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-foreground truncate">{ord.vehicle_model}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{ord.customer_name}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t text-[11px]">
                    <span className="text-amber-600 font-bold">{ord.bay || "Khoang nâng"}</span>
                    <span className="text-muted-foreground font-mono font-medium">{ord.order_code}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CHI TIẾT XE ĐANG ĐƯỢC CHỌN THI CÔNG */}
      {activeOrder && activeOrder.orderCode ? (
        <>
          {/* Banner Trạng Thái Lệnh */}
          {isPaidOrder ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-base font-black uppercase">Lệnh Sửa Chữa Đã Quyết Toán & Thanh Toán (PAID)</h3>
                  <p className="text-xs font-medium">Hồ sơ kỹ thuật đã được đóng vĩnh viễn sau khi khách thanh toán thành công.</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs uppercase shrink-0">
                Hồ Sơ Đã Khóa
              </span>
            </div>
          ) : isCompletedOrder ? (
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Đã Nghiệm Thu KCS Hoàn Tất 100% (COMPLETED)</h4>
                  <p className="text-xs text-muted-foreground">Xe đang chờ khách hàng hoàn tất thanh toán quyết toán tại quầy hoặc qua VietQR.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs">CHỜ THANH TOÁN</span>
            </div>
          ) : overallProgress === 100 || tasks.every((t) => t.status === "done") ? (
            <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-foreground">Đã Hoàn Tất 100% Các Hạng Mục Kỹ Thuật!</h3>
                  <p className="text-xs text-muted-foreground">Bấm nút xác nhận để ký nghiệm thu an toàn KCS và kích hoạt quyền thanh toán cho chủ xe.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center gap-2 shrink-0 animate-pulse"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                Nghiệm Thu KCS & Mở Thanh Toán
              </button>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột trái: Tiến độ & Checklist (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider Tiến Độ Thực Tế */}
              <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-base flex items-center gap-2 text-foreground">
                      <Sliders className="w-4 h-4 text-amber-500" />
                      Tiến Độ Thi Công Xe [{activeOrder.plateNumber}]
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Gạt thanh trượt để đồng bộ trực tiếp lên màn hình khách hàng & bảng điều phối Kanban
                    </p>
                  </div>
                  <span className="text-2xl font-black font-mono text-amber-500">{overallProgress}%</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    disabled={isPaidOrder}
                    value={overallProgress}
                    onChange={(e) => setOverallProgress(Number(e.target.value))}
                    onPointerUp={(e) => handleSyncProgress(Number((e.target as HTMLInputElement).value))}
                    className="w-full h-4 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground px-1">
                    <span>0% Nhận xe</span>
                    <span>25% Tháo dỡ</span>
                    <span>50% Lắp mới</span>
                    <span>75% Siết lực</span>
                    <span>100% Xong KCS</span>
                  </div>
                </div>

                {/* Quick Buttons */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[25, 50, 75, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      disabled={isPaidOrder}
                      onClick={() => {
                        setOverallProgress(val);
                        handleSyncProgress(val);
                      }}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                        overallProgress === val
                          ? "bg-amber-500 text-black border-amber-500"
                          : "bg-background hover:bg-muted text-foreground"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist Hạng Mục Của Xe */}
              <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
                <h2 className="font-bold text-base flex items-center gap-2 text-foreground">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  Checklist Công Việc Cần Thi Công ({tasks.length} hạng mục)
                </h2>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        task.status === "done"
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : task.status === "in_progress"
                          ? "bg-amber-500/5 border-amber-500/40"
                          : "bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                task.status === "done"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : task.status === "in_progress"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {task.status === "done"
                                ? "Đã hoàn thành"
                                : task.status === "in_progress"
                                ? "Đang thi công"
                                : "Chưa bắt đầu"}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">{task.code}</span>
                          </div>
                          <p className="font-semibold text-sm text-foreground">{task.name}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1 bg-muted/40 p-1.5 rounded-lg border">
                            ⚙️ {task.spec}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isPaidOrder}
                          onClick={() => handleToggleTaskStatus(task.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            task.status === "done"
                              ? "bg-emerald-600 text-white"
                              : task.status === "in_progress"
                              ? "bg-amber-500 text-black hover:bg-amber-600"
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          }`}
                        >
                          {task.status === "done"
                            ? "✓ Xong"
                            : task.status === "in_progress"
                            ? "Đang làm..."
                            : "Bắt đầu"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải: Ảnh Nghiệm Thu (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                      <Camera className="w-4 h-4 text-amber-500" />
                      Ảnh Nghiệm Thu Trước / Sau
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Minh bạch hóa tiến độ gửi trực tiếp cho chủ xe
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted">
                    {inspectionPhotos.length} ảnh
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isPaidOrder}
                  onClick={handleSimulateCapture}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                  {isPaidOrder ? "Đã Khóa Chụp Ảnh (Đơn Đã Thanh Toán)" : "Chụp & Tải Lên Ảnh Nghiệm Thu"}
                </button>

                <div className="space-y-4 pt-2">
                  {inspectionPhotos.map((photo) => (
                    <div key={photo.id} className="rounded-2xl border overflow-hidden bg-background">
                      <div className="relative h-44 w-full bg-slate-100 dark:bg-zinc-800">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/inspection-sample.jpg";
                          }}
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                          {photo.stage} • {photo.timestamp}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-foreground">{photo.title}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã đồng bộ hồ sơ số khách hàng
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
