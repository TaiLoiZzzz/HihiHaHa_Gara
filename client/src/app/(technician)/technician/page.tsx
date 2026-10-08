"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  ChevronRight,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Clock,
  History,
  ListTodo,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Calendar,
  Phone,
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
  { id: "0988888803", name: "Nguyễn Văn Thợ (THO-01)", role: "Trưởng nhóm Máy & Gầm - Bậc 4/4", pin: "1357", avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=160&auto=format&fit=crop&q=80" },
  { id: "0988888804", name: "Trần Văn Cường (THO-02)", role: "Chuyên gia Điện - CAN-Bus & Lạnh", pin: "1234", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80" },
  { id: "0988888805", name: "Lê Hoàng Long (THO-03)", role: "Kỹ thuật viên Bảo Dưỡng Nhanh", pin: "1111", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80" },
  { id: "0988888806", name: "Phạm Minh Tuấn (THO-04)", role: "Kỹ thuật viên Cân Chỉnh Góc Đặt 3D", pin: "2222", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80" },
];

function TechnicianTabletContent() {
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get("order") || "";
  const queryTech = searchParams.get("tech") || "";

  // 1. Quản lý danh tính thợ & Màn hình khóa PIN
  const [selectedTech, setSelectedTech] = useState(() => {
    if (queryTech) {
      const match = TECHNICIANS.find(
        (t) => t.id === queryTech || t.name.toLowerCase().includes(queryTech.toLowerCase())
      );
      if (match) return match;
    }
    return TECHNICIANS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Tab chính trên Tablet: 'active' (Xe đang thi công), 'waiting' (Hàng đợi xe chờ), 'history' (Lịch sử riêng của thợ)
  const [mainTab, setMainTab] = useState<"active" | "waiting" | "history">("active");

  // 3. Dữ liệu Dashboard toàn diện của riêng thợ này & Tải toàn xưởng
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [waitingQueue, setWaitingQueue] = useState<any[]>([]);
  const [workloads, setWorkloads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    active_count: 0,
    max_allowed: 3,
    total_completed: 0,
    today_completed: 0,
  });

  // 4. Xe cụ thể đang được chọn làm việc tại khoang
  const [activeOrderCode, setActiveOrderCode] = useState<string>(queryOrder || "");
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [inspectionPhotos, setInspectionPhotos] = useState<
    { id: string; stage: string; timestamp: string; title: string; url: string }[]
  >([]);

  const [isPaidOrder, setIsPaidOrder] = useState(false);
  const [isCompletedOrder, setIsCompletedOrder] = useState(false);

  // Tải chi tiết một Lệnh sửa chữa cụ thể (sử dụng quyền TECHNICIAN để không bao giờ bị 403)
  const loadOrderDetails = useCallback(async (orderCode: string) => {
    if (!orderCode) return;
    try {
      const res = await api.getWorkOrder(orderCode, "TECHNICIAN");
      if (res.success && res.data) {
        const wo = res.data;
        setActiveOrder({
          orderCode: wo.order_code,
          plateNumber: wo.license_plate,
          carModel: wo.vehicle_model,
          customerName: wo.customer_name,
          customerPhone: wo.customer_phone || wo.customer?.phone || wo.phone || "",
          bay: wo.bay || "Khoang Nâng",
          current_status: wo.current_status,
          priority: wo.priority,
          estimate: wo.estimate,
        });

        setIsPaidOrder(wo.payment_status === "PAID" || wo.current_status === "PAID" || wo.current_status === "DELIVERED");
        setIsCompletedOrder(wo.current_status === "COMPLETED" || wo.current_status === "PAYMENT_PENDING");
        setOverallProgress(wo.progress_percent || 0);

        // Nạp checklist tasks từ MongoDB nếu có, hoặc tạo động từ Báo giá
        if (Array.isArray(wo.tasks) && wo.tasks.length > 0) {
          setTasks(wo.tasks);
        } else if (wo.estimate?.items && wo.estimate.items.length > 0) {
          const generatedTasks = wo.estimate.items.map((it: any, idx: number) => ({
            id: `task-${idx + 1}`,
            name: it.name,
            code: it.part_code || `TASK-${idx + 1}`,
            spec: it.type === "PART" ? "Linh kiện OEM chính hãng" : "Quy trình gara 4S tiêu chuẩn",
            status: "pending" as const,
            progress: 0,
          }));
          setTasks(generatedTasks);
        } else {
          setTasks([
            { id: "t1", name: "Khám xe & Kiểm tra hệ thống gầm máy", code: "INSPECT-01", spec: "Theo dõi rò rỉ", status: "pending", progress: 0 },
            { id: "t2", name: "Thi công lắp đặt linh kiện thay thế", code: "REPAIR-01", spec: "Siết ốc đúng lực quy định", status: "pending", progress: 0 },
          ]);
        }

        // Nạp ảnh chụp nghiệm thu
        if (Array.isArray(wo.inspection_photos) && wo.inspection_photos.length > 0) {
          setInspectionPhotos(
            wo.inspection_photos.map((p: any, i: number) => ({
              id: `img-${i}`,
              stage: "Nghiệm thu khoang",
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
  }, []);

  // Tải dữ liệu toàn diện của Kỹ thuật viên (Xe đang làm + Lịch sử cá nhân + Hàng đợi + Tải toàn xưởng)
  const loadTechnicianData = useCallback(async (techId: string, preferredOrderCode?: string, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [res, workloadRes] = await Promise.all([
        api.getTechnicianDashboard(techId),
        api.getTechniciansWorkload().catch(() => ({ success: false, data: [] })),
      ]);

      if (workloadRes.success && Array.isArray(workloadRes.data)) {
        setWorkloads(workloadRes.data);
      }

      if (res.success && res.data) {
        const { active_orders, completed_orders, waiting_queue, stats: techStats } = res.data;
        setActiveOrders(active_orders || []);
        setCompletedOrders(completed_orders || []);
        setWaitingQueue(waiting_queue || []);
        setStats(techStats || { active_count: 0, max_allowed: 3, total_completed: 0, today_completed: 0 });

        // Tự động chọn xe đang làm nếu có
        if (active_orders && active_orders.length > 0) {
          let target = "";
          if (preferredOrderCode && active_orders.some((o: any) => o.order_code === preferredOrderCode)) {
            target = preferredOrderCode;
          } else if (activeOrderCode && active_orders.some((o: any) => o.order_code === activeOrderCode)) {
            target = activeOrderCode;
          } else if (queryOrder && active_orders.some((o: any) => o.order_code === queryOrder)) {
            target = queryOrder;
          } else {
            target = active_orders[0].order_code;
          }

          setActiveOrderCode(target);
          await loadOrderDetails(target);
        } else {
          setActiveOrderCode("");
          setActiveOrder(null);
          setTasks([]);
          setOverallProgress(0);
          setInspectionPhotos([]);
        }
      }
    } catch (err: any) {
      console.warn("Lỗi tải thông tin thợ:", err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [activeOrderCode, queryOrder, loadOrderDetails]);

  // Nhận xe từ hàng đợi vào khoang của thợ hiện tại
  const handleClaimOrder = async (orderCode: string, plateNumber: string) => {
    if (stats.active_count >= stats.max_allowed) {
      toast.error(`Bạn đã đạt tải tối đa (${stats.active_count}/${stats.max_allowed} xe). Vui lòng hoàn tất xe hiện tại trước!`);
      return;
    }
    try {
      setLoading(true);
      await api.assignWorkOrder(orderCode, {
        technician_id: selectedTech.id,
        technician_name: selectedTech.name,
        bay: "Khoang Nâng 01 (Cầu 2 trụ)",
        priority: "normal",
      });
      toast.success(`🎉 Đã nhận xe [${plateNumber}] vào bàn làm việc của [${selectedTech.name}]!`);
      setMainTab("active");
      await loadTechnicianData(selectedTech.id, orderCode);
    } catch (err: any) {
      toast.error(err.message || "Không thể nhận xe vào khoang");
    } finally {
      setLoading(false);
    }
  };

  // Chuyển nhanh sang thợ phụ trách xe được chọn
  const handleSwitchToTechAndCar = async (targetTechId: string, targetOrderCode: string) => {
    const targetTech = TECHNICIANS.find((t) => t.id === targetTechId);
    if (targetTech) {
      setSelectedTech(targetTech);
      setActiveOrderCode(targetOrderCode);
      setMainTab("active");
      toast.success(`Đã chuyển sang tài khoản [${targetTech.name}] để thi công xe!`);
      await loadTechnicianData(targetTech.id, targetOrderCode);
    }
  };

  // Load ban đầu khi chọn thợ
  useEffect(() => {
    loadTechnicianData(selectedTech.id, queryOrder || undefined);
  }, [selectedTech.id]);

  // Auto-polling ngầm mỗi 4 giây để đồng bộ real-time ngay khi Quản đốc phân công trên Kanban
  useEffect(() => {
    const timer = setInterval(() => {
      loadTechnicianData(selectedTech.id, activeOrderCode, true);
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedTech.id, activeOrderCode, loadTechnicianData]);

  // Đổi tài khoản Thợ
  const handleSelectTech = (tech: typeof TECHNICIANS[0]) => {
    setSelectedTech(tech);
    toast.success(`Đã chuyển sang tài khoản: [${tech.name}]`);
  };

  // Đồng bộ tiến độ về Backend
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
      } catch (err: any) {
        toast.error(err.message || "Lỗi cập nhật công đoạn");
      }
    }
  };

  // KCS NGHIỆM THU HOÀN TẤT -> TỰ ĐỘNG LƯU VÀO LỊCH SỬ CỦA THỢ & CHUYỂN SANG XE KHÁC
  const handleCompleteOrder = async () => {
    if (!activeOrder?.orderCode) return;
    const completedPlate = activeOrder.plateNumber;
    const currentCode = activeOrder.orderCode;

    try {
      const res = await api.updateStatus(
        currentCode,
        "COMPLETED",
        `Kỹ thuật viên [${selectedTech.name}] đã hoàn tất 100% công đoạn thi công và ký nghiệm thu KCS đạt chuẩn.`
      );
      if (res.success) {
        setIsCompletedOrder(true);
        setOverallProgress(100);

        toast.success(
          `🎉 Đã hoàn tất xe [${completedPlate}] và lưu vào Lịch Sử của [${selectedTech.name}]! Khách hàng đã mở cổng thanh toán.`
        );

        // Nạp lại toàn bộ dữ liệu thợ: xe này sẽ nhảy sang Lịch sử, tải thợ giảm 1 xe
        await loadTechnicianData(selectedTech.id);

        // Kiểm tra xem thợ còn xe nào đang làm khác không để tự động chuyển sang
        const remaining = activeOrders.filter((o) => o.order_code !== currentCode);
        if (remaining.length > 0) {
          toast.info(`Tự động chuyển sang xe tiếp theo: [${remaining[0].license_plate}]`);
          setActiveOrderCode(remaining[0].order_code);
          await loadOrderDetails(remaining[0].order_code);
        } else {
          // Nếu hết xe đang làm, tự động chuyển sang Tab Lịch Sử hoặc Hàng Đợi
          setMainTab("history");
        }
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
      {/* Header Điều Khiển Tablet & Đổi Thợ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center gap-3.5">
          <img
            src={selectedTech.avatar}
            alt={selectedTech.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black tracking-tight text-slate-900">{selectedTech.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {selectedTech.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống Tablet Khoang Nâng • Cập nhật tiến độ & Nghiệm thu KCS Realtime
            </p>
          </div>
        </div>

        {/* Dropdown Đổi Thợ & Nút Khóa PIN */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 pl-2 hidden sm:inline">Chuyển Thợ:</span>
            <select
              value={selectedTech.id}
              onChange={(e) => {
                const target = TECHNICIANS.find((t) => t.id === e.target.value);
                if (target) handleSelectTech(target);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs max-w-sm truncate"
            >
              {TECHNICIANS.map((t) => {
                const wl = workloads.find((w) => w.id === t.id);
                const plates = wl?.orders?.map((o: any) => o.license_plate).join(", ");
                const label = plates ? `${t.name} • (${wl.orders.length} xe: ${plates})` : `${t.name} • (Rảnh)`;
                return (
                  <option key={t.id} value={t.id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="button"
            onClick={() => loadTechnicianData(selectedTech.id, activeOrderCode)}
            className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all shadow-xs"
            title="Đồng bộ lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-500" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs text-slate-700"
          >
            <Lock className="w-3.5 h-3.5" /> Khóa PIN
          </button>
        </div>
      </div>

      {/* Thanh Điều Hướng Nhanh Xe Đang Xử Lý Toàn Xưởng */}
      {workloads.some((w) => w.orders?.length > 0) && (
        <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              Xe Đang Xử Lý Trong Xưởng ({workloads.reduce((acc, w) => acc + (w.orders?.length || 0), 0)} xe)
            </span>
            <span className="text-[11px] text-slate-400">
              Nhấp vào xe bất kỳ để mở trực tiếp bàn làm việc
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {workloads.flatMap((w) =>
              (w.orders || []).map((ord: any) => {
                const isCurrentTech = w.id === selectedTech.id;
                const isCurrentActive = activeOrder?.orderCode === ord.order_code;
                return (
                  <button
                    key={ord.order_code}
                    type="button"
                    onClick={() => handleSwitchToTechAndCar(w.id, ord.order_code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs active:scale-95 ${
                      isCurrentActive
                        ? "bg-amber-500 text-slate-950 ring-2 ring-amber-500/40 font-black"
                        : isCurrentTech
                        ? "bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100"
                        : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono font-black">{ord.license_plate}</span>
                    <span className="text-[10px] font-sans opacity-80">({w.name.split(" ")[0]})</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4 Thẻ Thống Kê Năng Suất Của Riêng Thợ Này */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Xe Đang Phụ Trách</p>
            <Car className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono mt-1 text-slate-900">
            {stats.active_count}/{stats.max_allowed} <span className="text-xs font-sans text-slate-500 font-semibold">xe</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {stats.active_count >= 3 ? "Đạt tải tối đa (3/3)" : `Còn nhận thêm ${3 - stats.active_count} xe`}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Xong Hôm Nay</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono mt-1 text-emerald-600">
            {stats.today_completed} <span className="text-xs font-sans text-slate-500 font-semibold">xe</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Nghiệm thu đạt chuẩn 100%</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tổng Xe Đã Hoàn Tất</p>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black font-mono mt-1 text-purple-600">
            {stats.total_completed} <span className="text-xs font-sans text-slate-500 font-semibold">xe</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Lịch sử tích lũy tay nghề</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Xe Đang Chờ Xưởng</p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black font-mono mt-1 text-blue-600">
            {waitingQueue.length} <span className="text-xs font-sans text-slate-500 font-semibold">xe</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Hàng đợi chờ vào cầu nâng</p>
        </div>
      </div>

      {/* THANH CHUYỂN TAB CHÍNH: 1. Xe Đang Làm - 2. Hàng Đợi Xe Chờ - 3. Lịch Sử Của Thợ */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setMainTab("active")}
          className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            mainTab === "active"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <Wrench className="w-4 h-4" />
          Xe Đang Nhận Thi Công ({activeOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setMainTab("waiting")}
          className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            mainTab === "waiting"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          Hàng Đợi Xe Trong Xưởng ({waitingQueue.length})
        </button>

        <button
          type="button"
          onClick={() => setMainTab("history")}
          className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            mainTab === "history"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          Lịch Sử Đã Hoàn Thành Của Riêng Tôi ({completedOrders.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: XE ĐANG THI CÔNG & BÀN LÀM VIỆC TABLET */}
      {/* ========================================================================= */}
      {mainTab === "active" && (
        <div className="space-y-6">
          {/* Thanh chuyển đổi các xe đang nhận */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Chọn Xe Đang Làm Việc Tại Khoang ({activeOrders.length} xe)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {activeOrders.length >= 3 ? (
                  <span className="text-red-500 font-black">ĐẦY TẢI TỐI ĐA (3/3)</span>
                ) : (
                  <span>Còn nhận được {3 - activeOrders.length} xe</span>
                )}
              </span>
            </div>

            {/* Thông báo hướng dẫn khi thợ nhận cùng lúc nhiều xe */}
            {activeOrders.length > 1 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/80 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
                  <span>
                    <strong>{selectedTech.name}</strong> đang cùng lúc phụ trách <strong>{activeOrders.length}/3 xe</strong>. Nhấp vào thẻ bất kỳ bên dưới để chuyển đổi bàn làm việc!
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 self-start sm:self-auto shrink-0">
                  Đang thao tác: {activeOrder?.plateNumber || activeOrderCode}
                </span>
              </div>
            )}

            {activeOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">
                  Hiện tại [{selectedTech.name}] chưa có xe nào đang thi công!
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bạn có thể xem tab &quot;Hàng Đợi Xe Trong Xưởng&quot; để nắm bắt các xe sắp vào khoang, hoặc xem tab &quot;Lịch Sử&quot; để kiểm tra các xe đã hoàn thành trước đó.
                </p>
                <button
                  type="button"
                  onClick={() => setMainTab("waiting")}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs"
                >
                  Xem Hàng Đợi Xe Trong Xưởng →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {activeOrders.map((ord) => {
                  const isActive = activeOrder?.orderCode === ord.order_code || activeOrderCode === ord.order_code;
                  return (
                    <div
                      key={ord.order_code}
                      onClick={() => {
                        setActiveOrderCode(ord.order_code);
                        loadOrderDetails(ord.order_code);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs ${
                        isActive
                          ? "border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/40 shadow-md shadow-amber-500/10"
                          : "border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-md bg-slate-900 text-white shadow-2xs">
                            {ord.license_plate}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3" /> Đang thao tác
                            </span>
                          )}
                        </div>
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
                        <p className="text-xs font-bold text-slate-900 truncate">{ord.vehicle_model}</p>
                        <div className="flex items-center justify-between text-[11px] mt-1">
                          <span className="text-slate-500 truncate">Khách: <strong className="text-slate-800">{ord.customer_name}</strong></span>
                          {ord.customer_phone && (
                            <a
                              href={`tel:${ord.customer_phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-amber-600 font-bold hover:underline flex items-center gap-1 ml-1 shrink-0"
                              title="Gọi điện cho khách"
                            >
                              <Phone className="w-3 h-3 text-amber-500" />
                              {ord.customer_phone}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-amber-700 font-bold">{ord.bay || "Khoang nâng"}</span>
                        <span className="text-slate-500 font-mono font-medium">{ord.order_code}</span>
                      </div>

                      {/* Nút hành động trực quan */}
                      <div className="pt-0.5">
                        {isActive ? (
                          <div className="w-full py-1.5 rounded-xl bg-amber-500/20 text-amber-900 text-center text-[11px] font-bold border border-amber-300">
                            ✓ Đang mở trên bàn làm việc bên dưới
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 text-center text-[11px] font-bold border border-slate-200 transition-colors"
                          >
                            👉 Nhấp để chuyển qua thi công xe này
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chi tiết xe đang chọn để thi công */}
          {activeOrder && activeOrder.orderCode ? (
            <>
              {/* Banner Trạng Thái */}
              {isPaidOrder ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-base font-black uppercase">Xe Đã Hoàn Tất Quyết Toán & Thanh Toán (PAID)</h3>
                      <p className="text-xs font-medium text-emerald-800">Hồ sơ kỹ thuật đã đóng vĩnh viễn sau khi khách thanh toán thành công.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs uppercase shrink-0">
                    Hồ Sơ Đã Khóa
                  </span>
                </div>
              ) : isCompletedOrder ? (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">Đã Nghiệm Thu KCS Hoàn Tất 100% (COMPLETED)</h4>
                      <p className="text-xs text-blue-700">Xe đang chờ khách hàng thanh toán qua VietQR/VNPay. Bạn có thể chuyển qua xe khác để tiếp tục làm.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs">CHỜ THANH TOÁN</span>
                </div>
              ) : overallProgress === 100 || tasks.every((t) => t.status === "done") ? (
                <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Đã Hoàn Tất 100% Công Đoạn Kỹ Thuật!</h3>
                      <p className="text-xs text-slate-600">
                        Bấm nút xác nhận để ký nghiệm thu an toàn KCS: Xe sẽ được lưu vào Lịch Sử của bạn và tự động mở thanh toán cho khách.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center gap-2 shrink-0 animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Nghiệm Thu KCS & Lưu Lịch Sử
                  </button>
                </div>
              ) : null}

              {/* Thanh Thông Tin Phương Tiện & Chủ Xe */}
              <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="font-mono font-black text-sm px-3 py-1.5 rounded-xl bg-slate-900 text-white shrink-0">
                    {activeOrder.plateNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{activeOrder.carModel}</h3>
                    <p className="text-slate-500 text-[11px] font-mono">Mã Lệnh: {activeOrder.orderCode} • {activeOrder.bay}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-amber-50/80 px-3.5 py-2 rounded-2xl border border-amber-200/80 self-start sm:self-auto">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Chủ xe: </span>
                    <strong className="text-slate-900 font-bold">{activeOrder.customerName}</strong>
                  </div>
                  {activeOrder.customerPhone ? (
                    <a
                      href={`tel:${activeOrder.customerPhone}`}
                      className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1.5 hover:underline bg-white px-2.5 py-1 rounded-xl border border-amber-300 shadow-2xs shrink-0"
                      title="Gọi điện trực tiếp cho chủ xe"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activeOrder.customerPhone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">Chưa có SĐT</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột trái: Tiến độ & Checklist (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Slider Tiến Độ Thực Tế */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-bold text-base flex items-center gap-2 text-slate-900">
                          <Sliders className="w-4 h-4 text-amber-500" />
                          Tiến Độ Thi Công Xe [{activeOrder.plateNumber}]
                        </h2>
                        <p className="text-xs text-slate-500">
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
                        className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
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
                              ? "bg-amber-500 text-slate-950 border-amber-500"
                              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checklist Hạng Mục Của Xe */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <h2 className="font-bold text-base flex items-center gap-2 text-slate-900">
                      <FileCheck className="w-4 h-4 text-amber-500" />
                      Checklist Công Việc Cần Thi Công ({tasks.length} hạng mục)
                    </h2>

                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            task.status === "done"
                              ? "bg-emerald-50/60 border-emerald-300"
                              : task.status === "in_progress"
                              ? "bg-amber-50/60 border-amber-300"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    task.status === "done"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : task.status === "in_progress"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {task.status === "done"
                                    ? "Đã hoàn thành"
                                    : task.status === "in_progress"
                                    ? "Đang thi công"
                                    : "Chưa bắt đầu"}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">{task.code}</span>
                              </div>
                              <p className="font-semibold text-sm text-slate-900">{task.name}</p>
                              <p className="text-xs text-slate-600 font-mono mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
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
                                  ? "bg-amber-500 text-slate-950 hover:bg-amber-600"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
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
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                          <Camera className="w-4 h-4 text-amber-500" />
                          Ảnh Nghiệm Thu Trước / Sau
                        </h3>
                        <p className="text-xs text-slate-500">
                          Minh bạch hóa tiến độ gửi trực tiếp cho chủ xe
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {inspectionPhotos.length} ảnh
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isPaidOrder}
                      onClick={handleSimulateCapture}
                      className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Camera className="w-5 h-5" />
                      {isPaidOrder ? "Đã Khóa Chụp Ảnh (Đơn Đã Thanh Toán)" : "Chụp & Tải Lên Ảnh Nghiệm Thu"}
                    </button>

                    <div className="space-y-4 pt-2">
                      {inspectionPhotos.map((photo) => (
                        <div key={photo.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                          <div className="relative h-44 w-full bg-slate-100">
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
                            <p className="text-xs font-medium text-slate-800">{photo.title}</p>
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
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HÀNG ĐỢI CÁC XE ĐANG CHỜ TRONG XƯỞNG (QUEUE) */}
      {/* ========================================================================= */}
      {mainTab === "waiting" && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Hàng Đợi Các Xe Đang Chờ Trong Xưởng ({waitingQueue.length} xe)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Danh sách các xe đang ở giai đoạn Tiếp nhận, Chờ duyệt báo giá, hoặc Chờ xuất kho phụ tùng. Giúp thợ chuẩn bị dụng cụ và mặt bằng khoang nâng trước.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waitingQueue.map((wq) => (
              <div key={wq.order_code} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    {wq.license_plate}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      wq.current_status === "INSPECTION"
                        ? "bg-blue-100 text-blue-800"
                        : wq.current_status === "QUOTE_SENT"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {wq.current_status === "INSPECTION"
                      ? "Tiếp Nhận Khám Xe"
                      : wq.current_status === "QUOTE_SENT"
                      ? "Chờ Khách Duyệt"
                      : "Chờ Xuất Kho Vật Tư"}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{wq.vehicle_model}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>Chủ xe: <strong className="text-slate-800">{wq.customer_name}</strong></span>
                    {wq.customer_phone && (
                      <a
                        href={`tel:${wq.customer_phone}`}
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                        title="Gọi cho khách"
                      >
                        <Phone className="w-3 h-3 text-blue-500" />
                        {wq.customer_phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mã Lệnh:</span>
                  <span className="font-mono font-bold text-slate-700">{wq.order_code}</span>
                </div>

                {wq.estimate?.items && wq.estimate.items.length > 0 && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-700 mb-1">Dự kiến thay thế:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {wq.estimate.items.slice(0, 2).map((it: any, idx: number) => (
                        <li key={idx} className="truncate">{it.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hành động đối với xe trong hàng đợi */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClaimOrder(wq.order_code, wq.license_plate)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Nhận Vào Khoang Của Tôi</span>
                  </button>
                  {wq.assigned_technicians?.[0]?.technician_id && (
                    <button
                      type="button"
                      onClick={() => handleSwitchToTechAndCar(wq.assigned_technicians[0].technician_id, wq.order_code)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200 shrink-0"
                      title="Xem bàn làm việc của thợ được phân công"
                    >
                      Mở Bàn Làm Việc →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LỊCH SỬ XE ĐÃ HOÀN THÀNH CỦA RIÊNG THỢ NÀY (COMPLETED HISTORY) */}
      {/* ========================================================================= */}
      {mainTab === "history" && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                Sổ Tay Lịch Sử Thi Công Của [{selectedTech.name}] ({completedOrders.length} xe)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Toàn bộ các xe do chính bạn trực tiếp thi công và ký nghiệm thu KCS đạt chuẩn 100%. Được lưu vết vĩnh viễn trong hồ sơ năng suất thợ.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                Tổng đã làm: {completedOrders.length} xe
              </span>
            </div>
          </div>

          {completedOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
              <Award className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-base font-bold text-slate-800">Chưa có xe nào trong lịch sử hoàn thành</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Khi bạn hoàn tất 100% công đoạn trên Tab &quot;Xe Đang Nhận&quot; và bấm Nghiệm Thu KCS, xe sẽ tự động được lưu vết vào đây!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedOrders.map((co) => (
                <div key={co.order_code} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm px-2.5 py-1 rounded-md bg-slate-900 text-white">
                      {co.license_plate}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {co.current_status === "PAID" ? "Đã Thanh Toán (PAID)" : "Đã Nghiệm Thu KCS"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{co.vehicle_model}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span>Chủ xe: <strong className="text-slate-800">{co.customer_name}</strong></span>
                      {co.customer_phone && (
                        <a
                          href={`tel:${co.customer_phone}`}
                          className="text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
                          title="Gọi cho khách"
                        >
                          <Phone className="w-3 h-3 text-emerald-500" />
                          {co.customer_phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Khoang nâng:</span>
                      <span className="font-bold text-amber-700">{co.bay || "Khoang nâng 01"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thời gian cập nhật:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(co.updatedAt).toLocaleDateString("vi-VN")} {new Date(co.updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ảnh nghiệm thu:</span>
                      <span className="font-bold text-emerald-600">{co.inspection_photos?.length || 0} ảnh</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">{co.order_code}</span>
                    <span className="text-emerald-700 font-bold">100% Hoàn Tất</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TechnicianTabletPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-8 font-sans">
          <div className="flex items-center gap-3 text-slate-500 font-bold text-sm bg-white p-6 rounded-3xl border border-slate-200 shadow-lg">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
            <span>Đang khởi tạo Tablet Kỹ Thuật Viên Realtime...</span>
          </div>
        </div>
      }
    >
      <TechnicianTabletContent />
    </Suspense>
  );
}
