"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Check,
  Search,
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const [quickSymptom, setQuickSymptom] = useState("");
  const [quickPlate, setQuickPlate] = useState("");

  const popularServices = [
    {
      title: "Bảo Dưỡng Định Kỳ Cấp Lớn",
      desc: "Thay dầu động cơ Castrol EDGE 0W-20, thay lọc nhớt, vệ sinh họng nạp, kiểm tra 30 hạng mục an toàn theo tiêu chuẩn hãng.",
      price: "1.250.000 đ",
      tag: "Phổ biến nhất",
      time: "90 phút",
      warranty: "6 tháng / 10.000km",
    },
    {
      title: "Bảo Dưỡng & Thay Má Phanh",
      desc: "Khắc phục triệt để tiếng kêu rít, láng đĩa phanh chống rung giật vô lăng, lắp đặt má phanh gốm Ceramic Akebono cao cấp.",
      price: "850.000 đ",
      tag: "An toàn tối đa",
      time: "60 phút",
      warranty: "12 tháng / 20.000km",
    },
    {
      title: "Cân Mâm Bấm Chì & Chỉnh Thước Lái",
      desc: "Đo góc đặt bánh xe bằng công nghệ cảm biến Laser 3D Hunter, cân bằng động triệt tiêu rung lắc vô lăng ở dải tốc độ cao.",
      price: "450.000 đ",
      tag: "Độ chính xác cao",
      time: "45 phút",
      warranty: "Cân chỉnh chuẩn hãng",
    },
    {
      title: "Bảo Dưỡng Hệ Thống Điều Hòa",
      desc: "Hút nạp gas tự động R134a/R1234yf, khử mùi diệt khuẩn ozon dàn lạnh, thay lọc gió cabin than hoạt tính kháng bụi mịn PM2.5.",
      price: "650.000 đ",
      tag: "Không khí sạch",
      time: "60 phút",
      warranty: "Kiểm tra rò rỉ gas",
    },
    {
      title: "Chẩn Đoán Lỗi Động Cơ Chuyên Sâu",
      desc: "Đọc mã lỗi ECU chuyên hãng, kiểm tra áp suất buồng đốt, vệ sinh kim phun xăng điện tử và bugi Iridium bằng sóng siêu âm.",
      price: "350.000 đ",
      tag: "Công nghệ AI",
      time: "45 phút",
      warranty: "Báo cáo lỗi chi tiết",
    },
    {
      title: "Đồng Sơn & Phục Hồi Thân Vỏ",
      desc: "Phòng sơn sấy hấp hồng ngoại chuẩn Italy, pha màu vi tính Dupont chính xác 100%, đánh bóng phủ bóng bảo vệ bề mặt sơn.",
      price: "Báo giá theo vết",
      tag: "Thẩm mỹ cao",
      time: "1 - 2 ngày",
      warranty: "Bảo hành sơn 2 năm",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-4 pb-20 font-sans">
      
      {/* 1. HERO SECTION - SHOWROOM 4S SANG TRỌNG (TRẮNG - VÀNG - ĐEN THAN) */}
      <section className="relative rounded-3xl border border-slate-200/90 bg-gradient-to-br from-amber-50/60 via-white to-slate-50/80 p-8 sm:p-12 lg:p-14 shadow-sm overflow-hidden">
        {/* Decorative accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Cột Trái: Tiêu đề & Cam kết */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              TRUNG TÂM DỊCH VỤ Ô TÔ CHUẨN 4S QUỐC TẾ
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Chăm Sóc & Sửa Chữa Xe Với{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">
                Sự Minh Bạch Tuyệt Đối
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
              Xem chi tiết báo giá từng con ốc trước khi thợ thi công, duyệt báo giá điện tử trên điện thoại, theo dõi trực tiếp hình ảnh thợ thay linh kiện qua ảnh chụp và thanh toán mã QR bảo mật chuẩn ngân hàng.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/25 transition-all transform active:scale-95"
              >
                Xem Bảng Giá & Đặt Lịch
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-xs transition-all transform active:scale-95"
              >
                Tra Cứu Hồ Sơ Xe Của Bạn
              </Link>
            </div>

            {/* 4 Chỉ số vàng */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div className="space-y-1">
                <p className="text-2xl font-black font-mono text-amber-600">100%</p>
                <p className="text-xs font-semibold text-slate-700">Phụ tùng chính hãng</p>
                <p className="text-[11px] text-slate-500">Nguồn gốc OEM rõ ràng</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black font-mono text-amber-600">12 Tháng</p>
                <p className="text-xs font-semibold text-slate-700">Bảo hành linh kiện</p>
                <p className="text-[11px] text-slate-500">Toàn quốc điện tử</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black font-mono text-amber-600">4 Khoang</p>
                <p className="text-xs font-semibold text-slate-700">Cầu nâng thủy lực</p>
                <p className="text-[11px] text-slate-500">Xưởng 4S tiêu chuẩn</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black font-mono text-amber-600">4.9 ★</p>
                <p className="text-xs font-semibold text-slate-700">Hài lòng khách hàng</p>
                <p className="text-[11px] text-slate-500">Hơn 5.000 lượt phục vụ</p>
              </div>
            </div>
          </div>

          {/* Cột Phải: Showcase Đội Ngũ Kỹ Thuật Viên & Trung Tâm Dịch Vụ 4S Hiện Đại */}
          <div className="lg:col-span-5 relative">
            {/* Vầng sáng vàng sang trọng phía sau */}
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-400/25 via-amber-300/35 to-amber-500/25 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />

            <div className="relative rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 space-y-5">
              
              {/* Header Showcase với Logo & Trạng Thái Hoạt Động Xưởng */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 p-1.5 shadow-xs flex items-center justify-center shrink-0">
                    <Image
                      src="/logo.png"
                      alt="Logo HiHiHaHa Auto"
                      width={44}
                      height={44}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">HIHIHAHA AUTO</h3>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[11px] font-bold text-amber-600">TRUNG TÂM DỊCH VỤ 4S CHUYÊN SÂU</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  4/4 Cầu Nâng Sẵn Sàng
                </span>
              </div>

              {/* Khung Ảnh Đội Ngũ Kỹ Thuật Viên Chuyên Nghiệp Kèm Badges Nổi */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-md group/img">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src="/gara-team.png"
                    alt="Đội ngũ kỹ thuật viên HiHiHaHa Gara"
                    fill
                    className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                    priority
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />
                </div>

                {/* Floating Badge Trên Ảnh (Góc Trên Trái) */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Kỹ Thuật Viên Chứng Chỉ Hãng</span>
                </div>

                {/* Floating Badge Trên Ảnh (Góc Dưới) */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-bold text-white">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/20 flex items-center gap-1">
                    <span className="text-amber-400">★ 4.9/5</span>
                    <span className="text-slate-300">• 5.200+ Xe</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 font-black flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cam Kết Minh Bạch</span>
                  </div>
                </div>
              </div>

              {/* Ô Tra Cứu Nhanh Hồ Sơ Xe Bằng Biển Số Trực Tiếp */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-200/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-amber-600" />
                    Tra cứu tiến độ xe trên cầu nâng:
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                    Live Realtime
                  </span>
                </div>

                <div className="relative flex items-center">
                  <Car className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Nhập biển số xe (VD: 51K-999.99)..."
                    value={quickPlate}
                    onChange={(e) => setQuickPlate(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-24 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-inner"
                  />
                  <Link
                    href={`/login${quickPlate ? `?plate=${encodeURIComponent(quickPlate)}` : ""}`}
                    className="absolute right-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-xs flex items-center gap-1 active:scale-95"
                  >
                    <span>Tra Cứu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Thông Tin Trụ Sở & Hotline Trực Tiếp */}
              <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 text-left space-y-1.5 shadow-2xs">
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-semibold">Số 1 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <a href="tel:0797526990" className="text-slate-600 hover:text-amber-600 transition flex items-center gap-1 font-semibold">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    Hotline: <strong className="text-slate-900 font-mono">0797 526 990</strong>
                  </a>
                  <span className="text-slate-500 text-[11px]">Hỗ trợ kỹ thuật 24/7</span>
                </div>
              </div>

              {/* Nút Vào Cổng Khách Hàng */}
              <Link
                href="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-slate-950/20 flex items-center justify-center gap-2 group/btn active:scale-98"
              >
                <span>Vào Cổng Chủ Xe Để Xem Lệnh & Duyệt Báo Giá</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* 2. QUY TRÌNH 4 BƯỚC MINH BẠCH - NÓI KHÔNG VỚI "VẼ BỆNH" */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            QUY TRÌNH DỊCH VỤ CHUẨN MỰC
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quy Trình 4 Bước Bảo Dưỡng An Tâm
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Mọi bước thực hiện đều được số hóa, minh bạch phụ tùng và báo giá trước khi bất kỳ người thợ nào bắt đầu thi công.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Tiếp Nhận & Kiểm Tra 30 Điểm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cố vấn dịch vụ đo ODO, kiểm tra hệ thống phanh, gầm, dầu nhớt và ghi nhận tình trạng xe vào phiếu tiếp nhận điện tử 4S.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Báo Giá Điện Tử 8% VAT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gửi bảng giá chi tiết từng mã phụ tùng OEM và công thợ tới điện thoại của bạn. Bạn trực tiếp bấm duyệt mới tiến hành làm.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Thi Công & Ảnh Chụp Minh Bạch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kỹ thuật viên cập nhật thanh tiến độ % tại khoang nâng. Chụp ảnh đối chứng linh kiện cũ hỏng và phụ tùng mới bóc hộp.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">Nghiệm Thu QC & Thanh Toán QR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quản đốc xưởng chạy thử kiểm tra chất lượng (QC). Bạn quét mã VietQR nhận xe kèm sổ bảo hành điện tử 12 tháng.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CÁC GÓI DỊCH VỤ BẢO DƯỠNG NỔI BẬT */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              BẢNG GIÁ NIÊM YẾT MINH BẠCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Các Gói Dịch Vụ Bảo Dưỡng Tiêu Biểu
            </h2>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
          >
            Xem toàn bộ 24 gói dịch vụ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((svc) => (
            <div
              key={svc.title}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    {svc.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> {svc.time}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-base text-slate-900">{svc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{svc.desc}</p>
                
                <div className="pt-2">
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Bảo hành: {svc.warranty}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">Giá tham khảo:</span>
                  <span className="text-base font-black font-mono text-amber-600">{svc.price}</span>
                </div>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold transition shadow-xs"
                >
                  Đặt Lịch Ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BANNER CỨU HỘ 24/7 & LIÊN HỆ GARA */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 p-8 sm:p-12 text-slate-950 shadow-lg shadow-amber-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-extrabold uppercase">
              HỖ TRỢ KHẨN CẤP 24/7
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Xe Bị Sự Cố Giữa Đường Hay Cần Đặt Hẹn Bảo Dưỡng Gấp?
            </h2>
            <p className="text-xs sm:text-sm text-slate-900/90 max-w-xl font-medium leading-relaxed">
              Đội xe cứu hộ chuyên dụng cùng kỹ thuật viên lưu động trực 24/7 tại TP.HCM và vùng lân cận. Cam kết có mặt trong 30 phút sau khi nhận cuộc gọi.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <a
              href="tel:0797526990"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-sm shadow-md transition transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-amber-400 animate-bounce" />
              Hotline Cứu Hộ: 0797 526 990
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-950 font-bold text-sm shadow-xs transition"
            >
              Đặt Lịch Hẹn Trực Tuyến
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
