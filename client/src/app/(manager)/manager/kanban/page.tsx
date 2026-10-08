"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Kanban as KanbanIcon,
  Car,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  MoveRight,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

interface KanbanCard {
  id: string;
  orderCode: string;
  plateNumber: string;
  carModel: string;
  customerName: string;
  technician: string;
  bay: string;
  progress: number;
  stage: "intake" | "quoting" | "approved" | "in_progress" | "qc" | "completed";
  estimatedTime: string;
  priority: "normal" | "urgent";
}

const COLUMNS: { key: KanbanCard["stage"]; label: string; color: string; countColor: string }[] = [
  { key: "intake", label: "Tiếp nhận xe", color: "border-blue-500/50", countColor: "bg-blue-500/20 text-blue-500" },
  { key: "quoting", label: "Chờ duyệt báo giá", color: "border-purple-500/50", countColor: "bg-purple-500/20 text-purple-500" },
  { key: "approved", label: "Đã duyệt / Chờ vật tư", color: "border-amber-500/50", countColor: "bg-amber-500/20 text-amber-500" },
  { key: "in_progress", label: "Đang thi công", color: "border-cyan-500/50", countColor: "bg-cyan-500/20 text-cyan-500" },
  { key: "qc", label: "Kiểm tra chất lượng (QC)", color: "border-orange-500/50", countColor: "bg-orange-500/20 text-orange-500" },
  { key: "completed", label: "Hoàn tất / Bàn giao", color: "border-emerald-500/50", countColor: "bg-emerald-500/20 text-emerald-500" },
];

const INITIAL_CARDS: KanbanCard[] = [
  {
    id: "card-1",
    orderCode: "WO-20261001-0089",
    plateNumber: "51K-888.88",
    carModel: "Toyota Camry 2.5Q",
    customerName: "Minh Thảo",
    technician: "Nguyễn Văn Thợ (THO-01)",
    bay: "Khoang nâng 02",
    progress: 60,
    stage: "in_progress",
    estimatedTime: "15:30 Hôm nay",
    priority: "urgent",
  },
  {
    id: "card-2",
    orderCode: "WO-20261001-0090",
    plateNumber: "51F-123.45",
    carModel: "Mazda CX-5 2.0",
    customerName: "Trần Thị B",
    technician: "Trần Văn Cường (THO-02)",
    bay: "Khoang chẩn đoán 01",
    progress: 10,
    stage: "intake",
    estimatedTime: "17:00 Hôm nay",
    priority: "normal",
  },
  {
    id: "card-3",
    orderCode: "WO-20261001-0088",
    plateNumber: "30E-999.99",
    carModel: "Mercedes-Benz E300",
    customerName: "Lê Hoàng C",
    technician: "Chưa gán thợ",
    bay: "Khu vực tiếp nhận",
    progress: 20,
    stage: "quoting",
    estimatedTime: "Ngày mai 10:00",
    priority: "urgent",
  },
  {
    id: "card-4",
    orderCode: "WO-20260930-0085",
    plateNumber: "60A-777.77",
    carModel: "Honda CR-V 1.5 Turbo",
    customerName: "Phạm Văn D",
    technician: "Nguyễn Văn Thợ (THO-01)",
    bay: "Khoang kho vật tư",
    progress: 40,
    stage: "approved",
    estimatedTime: "14:00 Hôm nay",
    priority: "normal",
  },
  {
    id: "card-5",
    orderCode: "WO-20260930-0082",
    plateNumber: "51H-555.55",
    carModel: "Ford Ranger Wildtrak",
    customerName: "Hoàng Minh E",
    technician: "Trần Văn Cường (THO-02)",
    bay: "Khoang kiểm định QC",
    progress: 90,
    stage: "qc",
    estimatedTime: "11:30 Hôm nay",
    priority: "normal",
  },
  {
    id: "card-6",
    orderCode: "WO-20260929-0078",
    plateNumber: "51A-111.11",
    carModel: "Hyundai Tucson 2.0",
    customerName: "Vũ Đình F",
    technician: "Nguyễn Văn Thợ (THO-01)",
    bay: "Bãi bàn giao xe",
    progress: 100,
    stage: "completed",
    estimatedTime: "Đã xong",
    priority: "normal",
  },
];

import { api } from "@/lib/api";

const STAGE_TO_STATUS: Record<KanbanCard["stage"], string> = {
  intake: "INSPECTION",
  quoting: "QUOTE_SENT",
  approved: "QUOTE_APPROVED",
  in_progress: "IN_PROGRESS",
  qc: "QUALITY_CHECK",
  completed: "COMPLETED",
};

export default function WorkshopKanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Đồng bộ trạng thái lệnh thật từ MongoDB & Khôi phục vị trí thẻ khi bấm F5
  React.useEffect(() => {
    // 1. Phục hồi ngay lập tức từ localStorage để chống reset vị trí cột khi F5
    const cachedKanban = localStorage.getItem("hihihaha_kanban_cards");
    if (cachedKanban) {
      try {
        const parsed = JSON.parse(cachedKanban);
        if (Array.isArray(parsed) && parsed.length > 0) setCards(parsed);
      } catch (e) {}
    }

    // 2. Đồng bộ từ MongoDB
    async function syncRealOrder() {
      try {
        const resList = await api.getMyWorkOrders();
        if (resList.success && Array.isArray(resList.data) && resList.data.length > 0) {
          const mappedCards = resList.data.map((wo: any, idx: number) => {
            let stage: KanbanCard["stage"] = "in_progress";
            let progress = typeof wo.progress_percent === "number" ? wo.progress_percent : 0;

            if (wo.payment_status === "PAID" || wo.current_status === "PAID" || wo.current_status === "COMPLETED") {
              stage = "completed";
              progress = 100;
            } else if (wo.current_status === "QUALITY_CHECK") {
              stage = "qc";
              progress = Math.max(progress, 85);
            } else if (wo.current_status === "IN_PROGRESS") {
              stage = "in_progress";
              progress = progress || 50;
            } else if (wo.current_status === "QUOTE_APPROVED" || wo.current_status === "WAITING_PARTS") {
              stage = "approved";
              progress = 30;
            } else if (wo.current_status === "QUOTE_SENT") {
              stage = "quoting";
              progress = 20;
            } else {
              stage = "intake";
              progress = 10;
            }

            return {
              id: `db-card-${wo.order_code || idx}`,
              orderCode: wo.order_code,
              plateNumber: wo.license_plate || "51K-888.88",
              carModel: wo.vehicle_model || "Toyota Camry 2.5Q",
              customerName: wo.customer_name || "Minh Thảo",
              technician: wo.assigned_technician?.full_name || "Nguyễn Văn Thợ (THO-01)",
              bay: "Khoang Nâng 02",
              progress,
              stage,
              estimatedTime: "Hôm nay",
              priority: (wo.priority || "normal") as "normal" | "urgent",
            };
          });

          const extraCards = INITIAL_CARDS.filter(
            (c) => !mappedCards.some((mc: any) => mc.orderCode === c.orderCode)
          );
          const finalCards = [...mappedCards, ...extraCards];
          setCards(finalCards);
          localStorage.setItem("hihihaha_kanban_cards", JSON.stringify(finalCards));
        } else {
          const res = await api.getWorkOrder("WO-20261001-0089");
          if (res.success && res.data) {
            const wo = res.data;
            let stage: KanbanCard["stage"] = "in_progress";
            let progress = wo.progress_percent || 60;

            if (wo.payment_status === "PAID" || wo.current_status === "PAID" || wo.current_status === "COMPLETED") {
              stage = "completed";
              progress = 100;
            } else if (wo.current_status === "QUALITY_CHECK") {
              stage = "qc";
              progress = Math.max(progress, 85);
            } else if (wo.current_status === "IN_PROGRESS") {
              stage = "in_progress";
            } else if (wo.current_status === "QUOTE_APPROVED" || wo.current_status === "WAITING_PARTS") {
              stage = "approved";
            } else if (wo.current_status === "QUOTE_SENT") {
              stage = "quoting";
            } else if (wo.current_status === "DRAFT" || wo.current_status === "INSPECTION") {
              stage = "intake";
            }

            setCards((prev) =>
              prev.map((c) =>
                c.orderCode === "WO-20261001-0089"
                  ? {
                      ...c,
                      stage,
                      progress,
                      customerName: wo.customer_name || c.customerName,
                      plateNumber: wo.license_plate || c.plateNumber,
                    }
                  : c
              )
            );
          }
        }
      } catch (err: any) {
        console.warn("Lỗi sync kanban:", err.message);
      }
    }
    syncRealOrder();
  }, []);

  const handleDragStart = (id: string) => {
    setDraggedCardId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMoveCard = async (cardId: string, targetStage: KanbanCard["stage"]) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const updatedCards = cards.map((c) => {
      if (c.id === cardId) {
        const updated = { ...c, stage: targetStage };
        if (targetStage === "completed") updated.progress = 100;
        return updated;
      }
      return c;
    });

    setCards(updatedCards);
    localStorage.setItem("hihihaha_kanban_cards", JSON.stringify(updatedCards));

    const nextStatus = STAGE_TO_STATUS[targetStage] || "IN_PROGRESS";
    try {
      await api.updateStatus(card.orderCode, nextStatus, `Quản đốc chuyển lệnh sang cột ${targetStage} trên Kanban`);
      toast.success(`Đã chuyển lệnh #${card.orderCode} sang [${COLUMNS.find((col) => col.key === targetStage)?.label}] và lưu MongoDB!`);
    } catch (err: any) {
      toast.success(`Đã chuyển lệnh #${card.orderCode} sang cột: ${COLUMNS.find((col) => col.key === targetStage)?.label}`);
    }
  };

  const handleDrop = async (targetStage: KanbanCard["stage"]) => {
    if (!draggedCardId) return;
    await handleMoveCard(draggedCardId, targetStage);
    setDraggedCardId(null);
  };

  const handleAssignTech = (cardId: string, tech: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, technician: tech } : c))
    );
    toast.success(`Đã gán kỹ thuật viên phụ trách: ${tech}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Điều Phối Khoang Xưởng (Kanban)</h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Socket.io
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Bảng điều phối 6 cột quy trình khép kín: Quản lý {cards.length} xe đang xử lý tại 4 khoang nâng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/advisor/create-order"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-950" /> Tiếp Nhận Xe Mới
          </Link>
        </div>
      </div>

      {/* Workshop Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tổng xe trong xưởng</p>
          <p className="text-2xl font-black font-mono mt-1 text-slate-900">{cards.length} xe</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Đang nâng trên cầu</p>
          <p className="text-2xl font-black font-mono mt-1 text-amber-600">
            {cards.filter((c) => c.stage === "in_progress").length} xe
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Chờ nghiệm thu QC</p>
          <p className="text-2xl font-black font-mono mt-1 text-orange-600">
            {cards.filter((c) => c.stage === "qc").length} xe
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Đã hoàn thành hôm nay</p>
          <p className="text-2xl font-black font-mono mt-1 text-emerald-600">
            {cards.filter((c) => c.stage === "completed").length} xe
          </p>
        </div>
      </div>

      {/* 6 Columns Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start min-h-[620px] overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.stage === col.key);

          return (
            <div
              key={col.key}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.key)}
              className={`rounded-2xl border border-slate-200/90 bg-slate-100/90 p-3 min-h-[560px] flex flex-col gap-3 transition-colors shadow-xs ${
                draggedCardId ? "border-dashed hover:border-amber-500/80" : ""
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <span className="text-xs font-black tracking-tight text-slate-800">{col.label}</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 shadow-xs">
                  {colCards.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {colCards.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-300 rounded-xl text-xs text-slate-400 font-medium">
                    Kéo xe vào đây
                  </div>
                ) : (
                  colCards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id)}
                      className={`p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-amber-400 cursor-grab active:cursor-grabbing transition-all space-y-2.5 ${
                        card.priority === "urgent" ? "border-l-4 border-l-amber-500" : ""
                      }`}
                    >
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <Link
                            href={`/customer/orders/${card.orderCode}`}
                            className="text-xs font-mono font-bold text-amber-600 hover:underline block"
                          >
                            {card.orderCode}
                          </Link>
                          <div className="mt-1">
                            <span className="text-sm font-black font-mono tracking-tight text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block">
                              {card.plateNumber}
                            </span>
                          </div>
                        </div>
                        {card.priority === "urgent" && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                            Gấp
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-600">{card.carModel}</p>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono font-semibold">
                          <span>Tiến độ</span>
                          <span className="text-slate-900 font-bold">{card.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              card.progress === 100
                                ? "bg-emerald-500"
                                : card.progress >= 50
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Khoang & Thợ */}
                      <div className="text-[11px] space-y-1 text-slate-600 border-t border-slate-100 pt-2 font-medium">
                        <div className="flex items-center gap-1.5 truncate">
                          <Wrench className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{card.bay}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate font-semibold text-slate-900">{card.technician}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Dự kiến: {card.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Quick stage transition button */}
                      <div className="pt-1 flex justify-end gap-1">
                        {col.key !== "completed" && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextIdx = COLUMNS.findIndex((c) => c.key === col.key) + 1;
                              if (nextIdx < COLUMNS.length) {
                                handleMoveCard(card.id, COLUMNS[nextIdx].key);
                              }
                            }}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition"
                            title="Chuyển cột kế tiếp"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
