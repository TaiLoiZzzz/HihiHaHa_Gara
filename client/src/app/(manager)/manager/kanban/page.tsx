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
import { GraphRagAiModal } from "@/components/technician/graph-rag-ai-modal";

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
    customerName: "Nguyễn Văn A",
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

export default function WorkshopKanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedCardId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStage: KanbanCard["stage"]) => {
    if (!draggedCardId) return;

    setCards((prev) =>
      prev.map((c) => {
        if (c.id === draggedCardId) {
          const updated = { ...c, stage: targetStage };
          if (targetStage === "completed") updated.progress = 100;
          return updated;
        }
        return c;
      })
    );

    const card = cards.find((c) => c.id === draggedCardId);
    toast.success(`Đã chuyển lệnh #${card?.orderCode} sang cột: ${COLUMNS.find((col) => col.key === targetStage)?.label}`);
    setDraggedCardId(null);
  };

  const handleAssignTech = (cardId: string, tech: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, technician: tech } : c))
    );
    toast.success(`Đã gán kỹ thuật viên phụ trách: ${tech}`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Điều Phối Khoang Xưởng (Kanban Realtime)</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Socket.io
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bảng điều phối 6 cột quy trình khép kín: Quản lý {cards.length} xe đang xử lý tại 4 khoang nâng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GraphRagAiModal />
          <Link
            href="/advisor/create-order"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Tiếp Nhận Xe Mới
          </Link>
        </div>
      </div>

      {/* Workshop Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Tổng xe trong xưởng</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-foreground">{cards.length} xe</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Đang nâng trên cầu</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-cyan-500">
            {cards.filter((c) => c.stage === "in_progress").length} xe
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Chờ nghiệm thu QC</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-orange-500">
            {cards.filter((c) => c.stage === "qc").length} xe
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground uppercase font-bold">Đã hoàn thành hôm nay</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-emerald-500">
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
              className={`rounded-2xl border bg-card/60 p-3 min-h-[550px] flex flex-col gap-3 transition-colors ${
                draggedCardId ? "border-dashed hover:border-amber-500/60" : ""
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-bold tracking-tight text-foreground">{col.label}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.countColor}`}>
                  {colCards.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {colCards.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed rounded-xl text-[11px] text-muted-foreground">
                    Kéo xe vào đây
                  </div>
                ) : (
                  colCards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id)}
                      className={`p-3.5 rounded-xl border bg-background shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-2.5 ${
                        card.priority === "urgent" ? "border-l-4 border-l-amber-500" : ""
                      }`}
                    >
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <Link
                            href={`/customer/orders/${card.orderCode}`}
                            className="text-[11px] font-mono font-bold text-amber-500 hover:underline block"
                          >
                            {card.orderCode}
                          </Link>
                          <p className="text-sm font-extrabold font-mono tracking-tight mt-0.5 text-foreground">
                            {card.plateNumber}
                          </p>
                        </div>
                        {card.priority === "urgent" && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-500">
                            Gấp
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">{card.carModel}</p>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                          <span>Tiến độ</span>
                          <span>{card.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
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
                      <div className="text-[11px] space-y-1 text-muted-foreground border-t pt-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <Wrench className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{card.bay}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="truncate font-medium text-foreground">{card.technician}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
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
                                handleDrop(COLUMNS[nextIdx].key);
                              }
                            }}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-amber-500"
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
