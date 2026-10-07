"use client";

import React, { useState } from "react";
import { 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  ChevronRight,
  Database,
  Lock
} from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GraphRagAiModal } from "@/components/technician/graph-rag-ai-modal";
import { formatCurrencyVND } from "@/lib/utils";

interface SelectedPartInfo {
  part_code: string;
  part_name: string;
  unit_price: number;
}

export default function HomePage() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [appliedPart, setAppliedPart] = useState<SelectedPartInfo | null>(null);

  return (
    <div className="relative min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Grid Pattern & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl sticky top-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 font-bold shadow-amber-glow border border-amber-300/50">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg text-zinc-900 dark:text-zinc-100 font-sans">
                  HIHIHAHA<span className="text-amber-500">.AUTO</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                  4S SMART
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tight">
                Enterprise Garage Management & Knowledge Graph AI
              </p>
            </div>
          </div>

          {/* Navigation Items & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              <a href="#features" className="hover:text-amber-500 transition">Hạ Tầng Phân Tán</a>
              <a href="#ai-graph" className="hover:text-amber-500 transition">Graph-RAG AI</a>
              <a href="#workflow" className="hover:text-amber-500 transition">Quy Trình 13 Trạng Thái</a>
            </div>

            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <LiquidGlassButton
                size="sm"
                onClick={() => setIsAiModalOpen(true)}
                className="hidden sm:inline-flex"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                Mở AI Graph-RAG
              </LiquidGlassButton>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-8 animate-in fade-in duration-500">
          <Zap className="w-3.5 h-3.5" />
          <span>Sẵn Sàng Cho Production • Kiến Trúc Polyglot 4 CSDL</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-4xl mx-auto leading-[1.15]">
          Quản Trị Gara Thông Minh Với{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
            Graph-RAG AI
          </span>{" "}
          & Khóa Phân Tán
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Nền tảng kiểm soát kho 2 pha chống Race condition, loại bỏ 100% rủi ro Dual-write với Transactional Outbox, và chẩn đoán phụ tùng chính xác tuyệt đối không ảo giác.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <LiquidGlassButton
            size="lg"
            onClick={() => setIsAiModalOpen(true)}
            className="w-full sm:w-auto shadow-amber-glow"
          >
            <Sparkles className="w-5 h-5 text-zinc-950" />
            Trải Nghiệm AI Graph-RAG Ngay
            <ArrowRight className="w-4 h-4 ml-1 text-zinc-950" />
          </LiquidGlassButton>

          <a
            href="#features"
            className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition backdrop-blur-md"
          >
            Xem Kiến Trúc Đa CSDL
          </a>
        </div>

        {/* Notification khi 1-Click chọn phụ tùng từ AI */}
        {appliedPart && (
          <div className="mt-8 max-w-md mx-auto p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in zoom-in-95">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Đã nạp phụ tùng: {appliedPart.part_name} ({formatCurrencyVND(appliedPart.unit_price)})
            </span>
            <button
              onClick={() => setAppliedPart(null)}
              className="text-[11px] underline hover:opacity-80"
            >
              Xóa
            </button>
          </div>
        )}

      </section>

      {/* Feature Cards Grid (Chất Kỹ Thuật Doanh Nghiệp) */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Polyglot Persistence */}
          <div className="p-7 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Polyglot Persistence 4 DBMS
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Phân tách rạch ròi: PostgreSQL (ACID hóa đơn), MongoDB (Hồ sơ lệnh sửa chữa linh hoạt), Neo4j (Đồ thị phụ tùng tương thích), và Redis (Khóa phân tán & Cache).
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
              <span>Postgres 16</span> • <span>Mongo 7.0</span> • <span>Neo4j 5.x</span> • <span>Redis 7.2</span>
            </div>
          </div>

          {/* Card 2: Distributed Redlock & 2-Phase Inventory */}
          <div className="p-7 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Khóa Phân Tán Redis Redlock
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Khóa Mutex 5s nguyên tử bảo vệ kho khi khách hàng duyệt báo giá đồng thời. Kiểm soát kho 2 pha: lúc duyệt chỉ cấp phát, tiền về mới trừ vĩnh viễn.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 0% Bán khống âm kho
            </div>
          </div>

          {/* Card 3: AI Graph-RAG Zero-Hallucination */}
          <div className="p-7 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              AI Graph-RAG Chẩn Đoán Lỗi
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Không chém gió mã linh kiện ảo. Dùng truy vấn Cypher xác định trên Neo4j theo khung gầm Toyota/Lexus TNGA-K và đối soát trực tiếp số lượng tồn kho thực tế.
            </p>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Mở Modal Chẩn Đoán <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 HIHIHAHA AUTO. Hệ thống Quản trị Dịch vụ Ô tô Doanh nghiệp Thế hệ Mới.</p>
          <div className="flex items-center gap-4 font-mono">
            <span>REST API: v1</span>
            <span>•</span>
            <span>WebSocket: Socket.io</span>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </footer>

      {/* Modal Trợ lý AI Graph-RAG */}
      <GraphRagAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        vehicleModel="Toyota Camry 2.5Q"
        onApplyPart={(part) => setAppliedPart(part)}
      />

    </div>
  );
}
