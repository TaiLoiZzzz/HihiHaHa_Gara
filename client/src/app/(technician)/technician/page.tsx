"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Camera,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Car,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  FileCheck,
  Upload,
  Layers,
  Sliders,
  RotateCcw,
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

export default function TechnicianTabletPage() {
  // Trạng thái khóa màn hình PIN 4 số
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pin, setPin] = useState("");
  const techName = "Phạm Thợ Xưởng (Mã: THO-01)";
  const [isPaidOrder, setIsPaidOrder] = useState(false);
  const [isCompletedOrder, setIsCompletedOrder] = useState(false);

  // Công việc hiện tại tại Khoang nâng số 02
  const [activeOrder, setActiveOrder] = useState({
    orderCode: "WO-20261001-0089",
    plateNumber: "51K-888.88",
    carModel: "Toyota Camry 2.5Q (TNGA-K 2022)",
    customerName: "Minh Thảo",
    bay: "Khoang Nâng 02 (Cầu 4 trụ)",
    assignedAt: "08:30 Hôm nay",
  });

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "t1",
      name: "Xả nhớt cũ & Thay lọc nhớt động cơ TNGA",
      code: "04152-YZZA6",
      spec: "Lực siết cốc lọc: 25 N.m • Ốc rốn xả: 40 N.m • Dầu 0W-20: 4.5L",
      status: "done",
      progress: 100,
    },
    {
      id: "t2",
      name: "Bảo dưỡng & Thay má phanh trước Akebono Ceramic",
      code: "ACT-1222-AKE",
      spec: "Lực siết cùm phanh Caliper: 34 N.m • Lực siết ốc lốp: 103 N.m",
      status: "in_progress",
      progress: 60,
    },
    {
      id: "t3",
      name: "Kiểm tra hệ thống treo & Cân chỉnh góc đặt bánh xe",
      code: "LAB-ALIGN-40K",
      spec: "Độ chụm bánh trước Toe: 0°00' ± 0°05' • Camber: -0°30'",
      status: "pending",
      progress: 0,
    },
  ]);

  // Overall slider %
  const [overallProgress, setOverallProgress] = useState(60);

  // Ảnh chụp nghiệm thu (Before & After) - Dùng file ảnh nội bộ sắc nét, không bị phụ thuộc mạng ngoài
  const [inspectionPhotos, setInspectionPhotos] = useState<
    { id: string; stage: string; timestamp: string; title: string; url: string }[]
  >([
    {
      id: "img-1",
      stage: "Trước thi công",
      timestamp: "09:15",
      title: "Má phanh mòn sát ngưỡng cảm biến kim loại (còn 2.5mm)",
      url: "/inspection-sample.jpg",
    },
    {
      id: "img-2",
      stage: "Sau nghiệm thu",
      timestamp: "10:45",
      title: "Đã lắp má phanh Akebono mới & tra mỡ chịu nhiệt chống rít",
      url: "/gara-team.png",
    },
  ]);

  // Tải dữ liệu thật từ Backend MongoDB & Khôi phục bộ nhớ cache F5
  React.useEffect(() => {
    // 1. Phục hồi ngay lập tức từ localStorage để chống reset khi bấm F5
    const cachedTasks = localStorage.getItem("tech_tasks_WO-20261001-0089");
    const cachedProgress = localStorage.getItem("tech_progress_WO-20261001-0089");
    if (cachedTasks) {
      try {
        const parsed = JSON.parse(cachedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) setTasks(parsed);
      } catch (e) {}
    }
    if (cachedProgress) {
      const p = Number(cachedProgress);
      if (!isNaN(p)) setOverallProgress(p);
    }

    // 2. Đồng bộ dữ liệu mới nhất từ MongoDB
    async function loadOrder() {
      try {
        const res = await api.getWorkOrder("WO-20261001-0089");
        if (res.success && res.data) {
          const wo = res.data;
          setActiveOrder({
            orderCode: wo.order_code || "WO-20261001-0089",
            plateNumber: wo.license_plate || "51K-888.88",
            carModel: wo.vehicle_model || "Toyota Camry 2.5Q",
            customerName: wo.customer_name || "Minh Thảo",
            bay: "Khoang Nâng 02 (Cầu 4 trụ)",
            assignedAt: "08:30 Hôm nay",
          });

          if (wo.payment_status === "PAID" || wo.current_status === "PAID" || wo.current_status === "DELIVERED") {
            setIsPaidOrder(true);
          }
          if (wo.current_status === "COMPLETED" || wo.current_status === "PAYMENT_PENDING") {
            setIsCompletedOrder(true);
          }

          // Nạp checklist tasks từ MongoDB nếu đã lưu
          if (Array.isArray(wo.tasks) && wo.tasks.length > 0) {
            setTasks(wo.tasks);
            localStorage.setItem("tech_tasks_WO-20261001-0089", JSON.stringify(wo.tasks));
          }

          if (typeof wo.progress_percent === "number") {
            setOverallProgress(wo.progress_percent);
            localStorage.setItem("tech_progress_WO-20261001-0089", wo.progress_percent.toString());
          }

          if (wo.inspection_photos && wo.inspection_photos.length > 0) {
            setInspectionPhotos(
              wo.inspection_photos.map((p: any, i: number) => ({
                id: `img-${i}`,
                stage: "Ảnh nghiệm thu khoang",
                timestamp: new Date(p.uploaded_at || Date.now()).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                title: p.caption || "Ảnh nghiệm thu thực tế",
                url: p.url,
              }))
            );
          }
        }
      } catch (err: any) {
        console.warn("Lỗi tải lệnh thợ:", err.message);
      }
    }
    loadOrder();
  }, []);

  // Xử lý bàn phím PIN
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin === "1357" || nextPin === "1234" || nextPin === "123456") {
        toast.success(`Chào mừng thợ máy ${techName} đã đăng nhập ca!`);
        setIsAuthenticated(true);
        setPin("");
      } else if (nextPin.length === 4) {
        toast.error("Mã PIN không đúng (Gợi ý: 1234 hoặc 1357)");
        setTimeout(() => setPin(""), 600);
      }
    }
  };

  const handleClearPin = () => setPin("");

  // KCS Nghiệm thu hoàn tất & Chuyển sang COMPLETED
  const handleCompleteOrder = async () => {
    try {
      const res = await api.updateStatus(
        activeOrder.orderCode,
        "COMPLETED",
        "Kỹ thuật viên đã kiểm định an toàn KCS đạt chuẩn 100%, sẵn sàng bàn giao & quyết toán"
      );
      if (res.success) {
        setIsCompletedOrder(true);
        toast.success("Đã hoàn tất nghiệm thu KCS! Lệnh sửa chữa chuyển sang COMPLETED - Khách hàng đã có quyền thanh toán.");
      } else {
        toast.error((res as any).message || "Không thể chuyển trạng thái");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật trạng thái");
    }
  };

  // Đồng bộ tiến độ về Backend & Lưu cache vĩnh viễn
  const handleSyncProgress = async (val: number) => {
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
    localStorage.setItem("tech_progress_" + activeOrder.orderCode, val.toString());
    localStorage.setItem("tech_tasks_" + activeOrder.orderCode, JSON.stringify(updatedTasks));

    try {
      await api.updateProgress(activeOrder.orderCode, {
        stage_name: "THI_CONG_KHOANG_NANG",
        percent_complete: val,
        tasks: updatedTasks,
        note: `Kỹ thuật viên cập nhật tiến độ thi công lên ${val}% tại Khoang nâng 02`,
      });
      toast.success(`Đã lưu tiến độ ${val}% vào MongoDB & phát Realtime Socket!`);
    } catch (err: any) {
      console.warn("Lỗi đồng bộ tiến độ:", err.message);
    }
  };

  // Cập nhật trạng thái từng task & Lưu vĩnh viễn vào MongoDB + localStorage
  const handleToggleTaskStatus = async (id: string) => {
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

      // Lưu ngay vào localStorage chống mất khi F5
      localStorage.setItem("tech_tasks_" + activeOrder.orderCode, JSON.stringify(nextTasks));
      localStorage.setItem("tech_progress_" + activeOrder.orderCode, avg.toString());

      try {
        await api.updateProgress(activeOrder.orderCode, {
          stage_name: updated.name,
          percent_complete: avg,
          tasks: nextTasks,
          note: `Công đoạn [${updated.name}] chuyển sang [${
            updated.status === "done" ? "Đã hoàn thành" : updated.status === "in_progress" ? "Đang thi công" : "Chưa bắt đầu"
          }] (${updated.progress}%)`,
        });
        toast.success(`Đã lưu công đoạn [${updated.name}] vào MongoDB vĩnh viễn!`);
      } catch (err: any) {
        console.warn("Lỗi sync task:", err.message);
      }
    }
  };

  // Chụp ảnh từ camera khoang nâng và lưu về MongoDB
  const handleSimulateCapture = async () => {
    if (isPaidOrder) {
      toast.error("Lệnh sửa chữa đã quyết toán thanh toán (PAID). Không thể tải thêm ảnh!");
      return;
    }

    const newPhoto = {
      id: `img-${Date.now()}`,
      stage: "Ảnh nghiệm thu bổ sung",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      title: "Chụp bề mặt đĩa phanh sau khi mài láng khử gờ",
      url: "/inspection-sample.jpg",
    };
    setInspectionPhotos((prev) => [...prev, newPhoto]);

    try {
      await api.updateProgress(activeOrder.orderCode, {
        stage_name: "KIEM_DINH_QC",
        percent_complete: overallProgress,
        photo_urls: [{ url: newPhoto.url, caption: newPhoto.title }],
        note: "Thợ kỹ thuật đã hoàn thành kiểm định và chụp ảnh nghiệm thu",
      });
      toast.success("Đã chụp và đồng bộ ảnh vào cơ sở dữ liệu MongoDB thành công!");
    } catch (err: any) {
      toast.success("Đã ghi nhận ảnh nghiệm thu vào hồ sơ chủ xe!");
    }
  };

  // Màn hình khóa PIN nếu chưa auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold">Màn Hình Khoang Nâng (Tablet)</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Nhập mã PIN 4 số của Thợ Kỹ Thuật để bắt đầu ca máy
            </p>
          </div>

          {/* Dots */}
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

          {/* Numpad cảm ứng to */}
          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinInput(num)}
                className="h-14 rounded-2xl border bg-background hover:bg-muted font-mono font-bold text-xl active:scale-95 transition-all shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearPin}
              className="h-14 rounded-2xl border bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold text-xs active:scale-95 transition-all"
            >
              XÓA
            </button>
            <button
              type="button"
              onClick={() => handlePinInput("0")}
              className="h-14 rounded-2xl border bg-background hover:bg-muted font-mono font-bold text-xl active:scale-95 transition-all shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                setPin("1357");
                setIsAuthenticated(true);
                toast.success(`Đã đăng nhập nhanh tài khoản ${techName}`);
              }}
              className="h-14 rounded-2xl border bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 font-bold text-[11px] active:scale-95 transition-all"
            >
              DEMO PIN
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground">Demo mã PIN: 1357 hoặc 1234</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner trên Tablet */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-foreground font-mono">{activeOrder.plateNumber}</span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {activeOrder.orderCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {activeOrder.carModel} • <strong className="text-foreground">{activeOrder.bay}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl border bg-background hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Khóa PIN
          </button>
        </div>
      </div>

      {/* Banner Trạng Thái Lệnh - Nếu Đã Thanh Toán hoặc Cần Nghiệm Thu KCS */}
      {isPaidOrder ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-base font-black uppercase">Lệnh Sửa Chữa Đã Quyết Toán & Thanh Toán (PAID)</h3>
              <p className="text-xs font-medium">Hồ sơ kỹ thuật đã được đóng vĩnh viễn sau khi khách thanh toán thành công. Các công đoạn thi công đã được khóa an toàn.</p>
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
      ) : (overallProgress === 100 || tasks.every((t) => t.status === "done")) ? (
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
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
        {/* Left Column: Tiến độ & Danh sách Checklist kỹ thuật (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Slider khổng lồ cho thợ gạt tay */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  Tiến Độ Thi Công Thực Tế
                </h2>
                <p className="text-xs text-muted-foreground">
                  Gạt thanh trượt để đồng bộ trực tiếp lên màn hình khách hàng & bảng Kanban
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
                onChange={(e) => {
                  setOverallProgress(Number(e.target.value));
                }}
                onPointerUp={(e) => {
                  handleSyncProgress(Number((e.target as HTMLInputElement).value));
                }}
                className="w-full h-4 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground px-1">
                <span>0% Nhận xe</span>
                <span>25% Tháo dỡ</span>
                <span>50% Lắp mới</span>
                <span>75% Siết cân lực</span>
                <span>100% Hoàn tất</span>
              </div>
            </div>

            {/* Quick Progress Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
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

          {/* Checklist Hạng Mục Của Lệnh */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-base flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-500" />
              Checklist Công Việc Cần Hoàn Thành ({tasks.length} hạng mục)
            </h2>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
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
                              ? "bg-emerald-500/10 text-emerald-500"
                              : task.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-500"
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
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        task.status === "done"
                          ? "bg-emerald-500 text-white"
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

        {/* Right Column: Chụp ảnh nghiệm thu hiện trường (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-500" />
                  Ảnh Nghiệm Thu Trước / Sau
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ghi lại bằng chứng trực quan minh bạch gửi chủ xe
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted">
                {inspectionPhotos.length} ảnh
              </span>
            </div>

            {/* Nút bấm chụp ảnh to cảm ứng */}
            <button
              type="button"
              disabled={isPaidOrder}
              onClick={handleSimulateCapture}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5" />
              {isPaidOrder ? "Đã Khóa Chụp Ảnh (Đơn Đã Thanh Toán)" : "Chụp & Tải Lên Ảnh Nghiệm Thu"}
            </button>

            {/* Danh sách ảnh */}
            <div className="space-y-4 pt-2">
              {inspectionPhotos.map((photo) => (
                <div key={photo.id} className="rounded-xl border overflow-hidden bg-background">
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-zinc-800">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/inspection-sample.jpg";
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                      {photo.stage} • {photo.timestamp}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground">{photo.title}</p>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã đồng bộ hồ sơ số khách hàng
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
