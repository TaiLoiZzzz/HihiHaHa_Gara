"use client";

import React, { useState } from "react";
import { Sparkles, Bot, AlertTriangle, CheckCircle2, Wrench, X, RefreshCw, Layers } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { formatCurrencyVND } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface RecommendedPart {
  part_code: string;
  part_name: string;
  category: string;
  subsystem: string;
  shared_platform: string;
  unit_price: number;
  unit: string;
  stock_quantity: number;
  available_quantity: number;
  location_rack: string;
  is_in_stock: boolean;
  confidence_score: number;
}

interface DiagnosisResponse {
  success: boolean;
  vehicle_model: string;
  symptoms_input: string;
  confidence_overall: string;
  explanation: string;
  recommended_parts: RecommendedPart[];
  estimated_labor_cost: number;
  suggested_action: string;
}

interface GraphRagAiModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  vehicleModel?: string;
  onApplyPart?: (part: RecommendedPart, laborCost: number) => void;
  triggerLabel?: string;
}

export function GraphRagAiModal({
  isOpen,
  onClose,
  vehicleModel = "Toyota Camry 2.5Q",
  onApplyPart,
  triggerLabel = "Trợ Lý AI Graph-RAG",
}: GraphRagAiModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [symptoms, setSymptoms] = useState("Đạp phanh nghe tiếng rít kim loại ken két ở 2 bánh trước");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResponse | null>(null);

  const isControlled = typeof isOpen === "boolean";
  const showModal = isControlled ? isOpen : internalOpen;

  const handleClose = () => {
    if (onClose) onClose();
    if (!isControlled) setInternalOpen(false);
  };

  if (!showModal) {
    if (isControlled) return null;
    return (
      <button
        type="button"
        onClick={() => setInternalOpen(true)}
        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/25 hover:from-amber-500/25 hover:to-amber-500/35 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
        {triggerLabel}
      </button>
    );
  }

  const handleDiagnose = async () => {
    if (!symptoms.trim()) {
      toast.error("Vui lòng nhập mô tả triệu chứng hư hỏng của xe");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchApi<{ success: boolean; data: DiagnosisResponse }>("/ai/diagnose", {
        method: "POST",
        body: JSON.stringify({
          vehicle_model: vehicleModel,
          symptoms: symptoms.trim(),
          max_recommendations: 5,
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("AI Graph-RAG đã đối soát thành công 100% phụ tùng từ Neo4j & Kho!");
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Lỗi khi gọi chẩn đoán AI Graph-RAG";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 transition-all">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 text-amber-500 dark:text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Trợ Lý AI Chẩn Đoán Graph-RAG
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Zero-Hallucination
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Đối soát đồ thị liên kết Neo4j & Xác thực tồn kho thực tế MongoDB
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Triệu chứng */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Phương tiện: <span className="text-amber-600 dark:text-amber-400">{vehicleModel}</span>
            </span>
            <span className="text-zinc-400">Hỗ trợ mô tả tiếng Việt tự nhiên</span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Nhập triệu chứng xe (Ví dụ: Đạp phanh kêu ken két, máy rung khi dừng đèn đỏ...)"
              className="w-full p-3.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition resize-none font-sans"
            />
          </div>

          <div className="flex justify-end">
            <LiquidGlassButton
              size="md"
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                  Đang quét Đồ thị Tri thức Neo4j...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  Phân Tích AI Graph-RAG
                </>
              )}
            </LiquidGlassButton>
          </div>
        </div>

        {/* Kết quả phân tích */}
        {result && (
          <div className="mt-6 space-y-5 animate-in slide-in-from-bottom-3 duration-300">
            {/* Hộp giải thích AI */}
            <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 text-xs leading-relaxed space-y-2">
              <div className="flex items-center justify-between font-semibold text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Báo cáo Chẩn đoán Kỹ thuật
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[11px]">
                  Độ tin cậy: {result.confidence_overall}
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">{result.explanation}</p>
              <div className="pt-1 font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                Đề xuất xử lý: {result.suggested_action}
              </div>
            </div>

            {/* Danh sách phụ tùng gợi ý Grounded */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Phụ tùng tương thích xác thực từ Kho ({result.recommended_parts.length})
              </h4>

              <div className="space-y-2.5">
                {result.recommended_parts.map((part) => (
                  <div
                    key={part.part_code}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 hover:border-amber-500/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                          {part.part_code}
                        </span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {part.part_name}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Cụm: <strong className="text-zinc-700 dark:text-zinc-300">{part.subsystem}</strong></span>
                        <span>Khung gầm: <strong className="text-amber-600 dark:text-amber-400">{part.shared_platform}</strong></span>
                        <span>Kệ kho: <strong className="text-zinc-700 dark:text-zinc-300">{part.location_rack}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                          {formatCurrencyVND(part.unit_price)}
                        </div>
                        <div className="text-[11px] flex items-center gap-1 justify-end">
                          {part.is_in_stock ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Khả dụng: {part.available_quantity} {part.unit}
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Hết hàng (Cần đặt)
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onApplyPart) {
                            onApplyPart(part, result.estimated_labor_cost);
                          }
                          toast.success(`Đã chọn phụ tùng ${part.part_code} vào Lệnh sửa chữa!`);
                          handleClose();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-400 dark:hover:text-zinc-950 transition"
                      >
                        1-Click Chọn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
