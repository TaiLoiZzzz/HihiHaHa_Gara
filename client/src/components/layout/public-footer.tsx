import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Shield, CheckCircle2 } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md pt-12 pb-8 px-6 text-zinc-600 dark:text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="HiHiHaHa Auto Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
              HIHIHAHA<span className="text-amber-500"> AUTO</span>
            </span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Tổ hợp dịch vụ chăm sóc, bảo dưỡng ô tô công nghệ cao chuẩn 4S. Ứng dụng AI chẩn đoán đồ thị tri thức, minh bạch báo giá và bảo toàn 100% linh kiện chính hãng.
          </p>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            Bảo hành điện tử toàn quốc 12 tháng
          </div>
        </div>

        {/* Cột 2: Dịch vụ mũi nhọn */}
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-sm">
            Dịch Vụ Tiêu Biểu
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/services" className="hover:text-amber-500 transition">Bảo dưỡng định kỳ Cấp lớn (40.000km)</Link></li>
            <li><Link href="/services" className="hover:text-amber-500 transition">Chẩn đoán lỗi động cơ bằng Graph-RAG AI</Link></li>
            <li><Link href="/services" className="hover:text-amber-500 transition">Thay thế má phanh gốm & Láng đĩa phanh</Link></li>
            <li><Link href="/services" className="hover:text-amber-500 transition">Vệ sinh buồng đốt & Kim phun Hydro</Link></li>
            <li><Link href="/services" className="hover:text-amber-500 transition">Cân chỉnh thước lái Laser 3D Hunter</Link></li>
          </ul>
        </div>

        {/* Cột 3: Kiến thức ô tô */}
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-sm">
            Cẩm Nang Kỹ Thuật
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link href="/blog/phanh-ceramic" className="hover:text-amber-500 transition">So sánh Má phanh Ceramic vs Bán kim loại</Link></li>
            <li><Link href="/blog/dau-nhot-0w20" className="hover:text-amber-500 transition">Tại sao xe đời mới bắt buộc dùng dầu 0W-20?</Link></li>
            <li><Link href="/blog/ai-chan-doan-loi" className="hover:text-amber-500 transition">Graph-RAG: AI cứu cánh cho thợ gara như thế nào?</Link></li>
            <li><Link href="/blog" className="hover:text-amber-500 transition">Dấu hiệu nhận biết bugi đánh lửa bị mòn</Link></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ & Giờ mở cửa */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-sm">
            Trụ Sở Xưởng Dịch Vụ
          </h4>
          <div className="flex items-start gap-2 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">1900 - HIHIHAHA (4444)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>support@hihihaha-auto.vn</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[10px] space-y-1">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200">Giờ Vận Hành Xưởng:</div>
            <div>Thứ 2 - Thứ 7: 07:30 - 18:00 (Hỗ trợ cứu hộ 24/7)</div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <p>© 2026 HIHIHAHA AUTO. Giữ toàn quyền sở hữu trí tuệ giải pháp.</p>
        <div className="flex items-center gap-4 text-zinc-500 font-mono">
          <span>Enterprise Multi-DBMS Architecture</span>
          <span>•</span>
          <span>Docker Swarm Ready</span>
        </div>
      </div>
    </footer>
  );
}
