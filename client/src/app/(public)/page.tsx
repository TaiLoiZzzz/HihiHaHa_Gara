"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  PhoneCall,
  Clock,
  Car,
  Calendar,
  Award,
  MapPin,
  Settings,
  Flame,
  Search
} from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { GraphRagAiModal } from "@/components/technician/graph-rag-ai-modal";
import { formatCurrencyVND } from "@/lib/utils";

export default function HomePage() {
  const [quickSymptom, setQuickSymptom] = useState("");

  const popularServices = [
    {
      title: "Bảo Dưỡng Định Kỳ Cấp Lớn",
      desc: "Thay dầu động cơ, lọc nhớt, vệ sinh họng nạp, kiểm tra 30 hạng mục an toàn theo tiêu chuẩn hãng.",
      price: "Từ 1.250.000 đ",
      tag: "Phổ biến nhất",
      time: "90 phút",
    },
    {
      title: "Bảo Dưỡng & Thay Má Phanh",
      desc: "Khắc phục triệt để tiếng kêu rít, láng đĩa phanh chống rung giật vô lăng, má phanh Ceramic Akebono.",
      price: "Từ 850.000 đ",
      tag: "An toàn",
      time: "60 phút",
    },
    {
      title: "Cân Mâm Bấm Chì & Chỉnh Thước Lái",
      desc: "Đo góc đặt bánh xe bằng máy laser 3D Hunter, cân bằng động triệt tiêu rung lắc ở tốc độ cao.",
      price: "Từ 450.000 đ",
      tag: "Độ chính xác cao",
      time: "45 phút",
    },
    {
      title: "Bảo Dưỡng Hệ Thống Điều Hòa",
      desc: "Hút nạp ga tự động, khử mùi diệt khuẩn ozon dàn lạnh, thay lọc gió cabin than hoạt tính kháng bụi mịn.",
      price: "Từ 650.000 đ",
      tag: "Không khí trong lành",
      time: "60 phút",
    },
    {
      title: "Chẩn Đoán Lỗi Động Cơ Chuyên Sâu",
      desc: "Đọc mã lỗi ECU chuyên hãng, kiểm tra áp suất nén buồng đốt, vệ sinh kim phun xăng điện tử bằng sóng siêu âm.",
      price: "Từ 350.000 đ",
      tag: "Trí tuệ nhân tạo",
      time: "45 phút",
    },
    {
      title: "Đồng Sơn & Phục Hồi Thân Vỏ",
      desc: "Phòng sơn sấy hấp tiêu chuẩn Italy, pha màu vi tính Dupont chính xác 100%, bảo hành bong tróc 2 năm.",
      price: "Báo giá theo vết",
      tag: "Thẩm mỹ cao",
      time: "1 - 2 ngày",
    },
  ];

  return (
    <div className="space-y-16 py-4 font-sans pb-20">
      
      {/* Hero Section Chuẩn Gara Sửa Xe Thực Tế */}
      <section className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-8 md:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Trung Tâm Dịch Vụ Kỹ Thuật Ô Tô 4S Đạt Chuẩn
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Chăm Sóc & Sửa Chữa Xe Ô Tô Với <span className="text-amber-500">Sự Minh Bạch Tuyệt Đối</span>
          </h1>

          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
            Xem báo giá chi tiết từng con ốc trước khi làm, theo dõi thợ thi công trực tiếp qua hình ảnh thực tế và thanh toán an toàn tiện lợi ngay trên điện thoại của bạn.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/services">
              <LiquidGlassButton size="lg" variant="primary">
                Xem Bảng Giá Dịch Vụ
                <ArrowRight className="w-4 h-4 ml-1.5 text-zinc-950" />
              </LiquidGlassButton>
            </Link>

            <GraphRagAiModal triggerLabel="Bác Sĩ Bắt Bệnh Xe Bằng AI" />
          </div>

          {/* Quick Stats Gara */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-800 text-xs">
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono text-amber-500">100%</p>
              <p className="text-zinc-400">Phụ tùng chính hãng OEM</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono text-amber-500">12 Tháng</p>
              <p className="text-zinc-400">Bảo hành linh kiện & dịch vụ</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono text-amber-500">4 Khoang</p>
              <p className="text-zinc-400">Cầu nâng thủy lực hiện đại</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono text-amber-500">4.9 ★</p>
              <p className="text-zinc-400">Đánh giá hài lòng khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Cam Kết Vàng Của Gara HiHiHaHa Auto */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Tại Sao Hơn 5.000 Chủ Xe Chọn Chúng Tôi?
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Trải nghiệm dịch vụ bảo dưỡng ô tô chuẩn mực, loại bỏ hoàn toàn nỗi lo bị vẽ bệnh hay đội giá
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl border bg-card hover:border-amber-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Báo Giá Điện Tử Rõ Ràng</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bạn nhận bảng giá có đầy đủ chi phí nhân công và giá phụ tùng kèm thuế VAT 8%. Chỉ thi công khi bạn bấm duyệt trên điện thoại.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:border-amber-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Xem Tiến Độ Trực Tiếp</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kỹ thuật viên cập nhật % hoàn thành theo từng bước. Ảnh chụp linh kiện hỏng trước và sau khi thay mới được gửi thẳng vào hồ sơ xe.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:border-amber-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Phụ Tùng Chuẩn Hãng</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cam kết 100% phụ tùng từ các thương hiệu hàng đầu: Toyota Genuine, Bosch, Denso, Akebono, Castrol, Motul với nguồn gốc rõ ràng.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:border-amber-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Bắt Bệnh Chuẩn Xác Bằng AI</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hệ thống trợ lý chẩn đoán thông minh đối chiếu triệu chứng xe với kho dữ liệu kỹ thuật, giúp tìm đúng lỗi và tiết kiệm chi phí sửa chữa.
            </p>
          </div>
        </div>
      </section>

      {/* Dịch Vụ Tiêu Biểu */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Dịch Vụ Chuyên Sâu
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Các Gói Dịch Vụ Bảo Dưỡng Nổi Bật
            </h2>
          </div>
          <Link
            href="/services"
            className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
          >
            Xem tất cả 24 dịch vụ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularServices.map((svc) => (
            <div
              key={svc.title}
              className="p-6 rounded-2xl border bg-card hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {svc.tag}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {svc.time}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground">{svc.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{svc.desc}</p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Chi phí dự kiến:</span>
                  <span className="text-sm font-bold font-mono text-amber-500">{svc.price}</span>
                </div>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl bg-muted hover:bg-amber-500 hover:text-black text-xs font-semibold transition-colors"
                >
                  Đặt Lịch
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Đặt Lịch & Cứu Hộ 24/7 */}
      <section className="rounded-3xl border bg-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            Cứu Hộ Ô Tô & Kéo Xe 24/7
          </div>
          <h3 className="text-xl md:text-2xl font-bold">
            Xe Bạn Bị Sự Cố Giữa Đường Hoặc Cần Bảo Dưỡng Gấp?
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Đội xe cứu hộ túc trực sẵn sàng hỗ trợ tại TP.HCM và các vùng lân cận. Liên hệ ngay để được phục vụ nhanh nhất!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="tel:0908888888"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            Hotline: 0908 888 888
          </a>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border bg-background hover:bg-muted font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Đặt Lịch Bảo Dưỡng
          </Link>
        </div>
      </section>

    </div>
  );
}
