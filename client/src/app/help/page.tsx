"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  User,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck,
  QrCode,
  Sliders,
  Camera,
  Layers,
  Car,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function HelpIndexPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Tại sao Quản đốc chỉ phân công được Thợ khi xe ở bước 'Đã duyệt / Chờ vật tư'?",
      a: "Đây là quy định nghiệp vụ cốt lõi của Gara 4S nhằm đảm bảo tính minh bạch và tránh lãng phí nguồn lực: Chỉ khi khách hàng đã xem kỹ bảng giá phụ tùng, tiền công và đồng ý ký duyệt điện tử, quản đốc mới được sắp xếp khoang nâng và giao xe cho kỹ thuật viên thi công. Khi xe đang tiếp nhận hoặc chờ duyệt giá, lệnh chưa được cấp phép thi công.",
    },
    {
      q: "Mỗi Kỹ thuật viên được nhận tối đa bao nhiêu xe cùng một thời điểm?",
      a: "Hệ thống quy định tải tối đa là 3 xe/thợ tại bất kỳ thời điểm nào. Điều này bảo đảm kỹ thuật viên tập trung cao độ, tuân thủ đúng quy chuẩn an toàn siết lực và kiểm tra rò rỉ. Khi thợ đã có 3 xe đang thi công, hệ thống sẽ cảnh báo ĐẦY TẢI và từ chối phân công thêm cho đến khi thợ nghiệm thu xong ít nhất 1 xe.",
    },
    {
      q: "Khách hàng đăng nhập vào cổng thông tin bằng cách nào?",
      a: "Khách hàng không cần nhớ mật khẩu phức tạp. Chỉ cần nhập Biển số xe và Số điện thoại đã đăng ký, hệ thống sẽ gửi mã xác thực OTP 6 số (hoặc mã demo hiển thị trực tiếp) để đăng nhập tức thì.",
    },
    {
      q: "Thợ làm xong xe có tự động lưu vào lịch sử cá nhân không?",
      a: "Có! Khi kỹ thuật viên đạt 100% tiến độ và bấm 'Nghiệm Thu KCS & Lưu Lịch Sử', chiếc xe sẽ được tự động chuyển vào Tab 'Lịch Sử Đã Hoàn Thành Của Riêng Tôi', đồng thời tải hiện tại của thợ giảm đi 1 xe và hệ thống tự động mở sang xe tiếp theo trong khoang.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Cổng Tra Cứu Tài Liệu Hướng Dẫn Vận Hành 4.0
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Chào Mừng Đến Với Hệ Thống Hướng Dẫn Gara{" "}
            <span className="text-amber-400">HiHiHaHa Auto</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hệ thống quản lý xưởng sửa chữa & chăm sóc ô tô hiện đại, kết nối tức thời giữa
            chủ xe, cố vấn dịch vụ, quản đốc khoang xưởng và kỹ thuật viên trên cùng một nền tảng Realtime.
          </p>
        </div>
      </div>

      {/* 2 Lựa chọn phân hệ chính: Khách Hàng vs Kỹ Thuật Viên */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Chọn Phân Hệ Bạn Muốn Xem Hướng Dẫn
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tài liệu được biên soạn trực quan, chi tiết từng bước thao tác thực tế kèm hình ảnh minh họa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Hướng Dẫn Khách Hàng */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-100 text-blue-800 border border-blue-300">
                  Dành Cho Khách Hàng
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  Cẩm Nang Chủ Xe & Cổng Khách Hàng
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hướng dẫn tra cứu hồ sơ xe qua OTP, duyệt báo giá điện tử minh bạch,
                  xem camera khoang nâng và thanh toán VietQR không tiền mặt.
                </p>
              </div>

              {/* Các điểm nổi bật */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Đăng nhập 1 chạm qua mã OTP SMS / Email</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Minh bạch 100% linh kiện OEM, tiền công & VAT 8%</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Ký chữ ký điện tử trực tuyến (E-Sign) tức thì</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Theo dõi tiến độ sửa chữa Realtime 0% → 100%</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Thanh toán VietQR động & Lưu sổ bảo hành điện tử</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/help/customer"
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 group-hover:gap-3"
              >
                <span>Xem Cẩm Nang Khách Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Hướng Dẫn Kỹ Thuật Viên */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Wrench className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                  Dành Cho Kỹ Thuật Viên
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                  Sổ Tay Kỹ Thuật Viên & Tablet Khoang Nâng
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hướng dẫn thao tác trên màn hình Tablet khoang xưởng: Đăng nhập PIN,
                  quản lý giới hạn tải 3 xe, cập nhật checklist, nghiệm thu KCS & tự động lưu lịch sử.
                </p>
              </div>

              {/* Các điểm nổi bật */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Đăng nhập ca làm việc nhanh bằng mã PIN 4 số</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cơ chế nhận tối đa 3 xe/thợ bảo đảm an toàn kỹ thuật</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Chuyển đổi linh hoạt giữa các xe đang nhận thi công</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Gạt slider tiến độ & đánh dấu checklist từng công đoạn</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>KCS Hoàn tất 100% → Tự động lưu Lịch Sử riêng của thợ</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/help/technician"
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 group-hover:gap-3"
              >
                <span>Xem Sổ Tay Kỹ Thuật Viên</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quy trình khép kín 6 bước của Gara 4S */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Nguyên Tắc Vận Hành Khép Kín
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Quy Trình 6 Bước Chuẩn Xác Tuyệt Đối Của Gara HiHiHaHa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mỗi bước đều có điều kiện kiểm tra (Guard Condition) bảo đảm không thể nhảy cóc hoặc thực hiện sai vai trò.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            {
              step: "01",
              title: "Tiếp Nhận Xe",
              role: "Cố vấn dịch vụ",
              desc: "Khám xe tổng quát, chụp ảnh hiện trạng, nhập thông tin chủ xe.",
              status: "Khóa phân công",
            },
            {
              step: "02",
              title: "Lập Báo Giá",
              role: "Cố vấn dịch vụ",
              desc: "Liệt kê phụ tùng OEM, tiền công thợ, tính thuế VAT 8% và gửi cho khách.",
              status: "Khóa phân công",
            },
            {
              step: "03",
              title: "Ký Duyệt Giá",
              role: "Khách hàng",
              desc: "Khách hàng duyệt qua OTP điện tử. Xe chuyển sang Đã Duyệt / Chờ Vật Tư.",
              status: "Điều kiện mở phân công",
            },
            {
              step: "04",
              title: "Phân Công Thợ",
              role: "Quản đốc xưởng",
              desc: "Chỉ được phân công tại bước này! Chọn thợ (tối đa 3 xe) & xếp khoang nâng.",
              status: "Bước phân công duy nhất",
              highlight: true,
            },
            {
              step: "05",
              title: "Thi Công Khoang",
              role: "Kỹ thuật viên",
              desc: "Tablet khoang nâng: Gạt tiến độ, tích checklist, chụp ảnh nghiệm thu.",
              status: "Tablet realtime",
            },
            {
              step: "06",
              title: "KCS & Quyết Toán",
              role: "QC & Khách hàng",
              desc: "Thợ ký KCS lưu vào Lịch sử. Khách quét mã VietQR nhận xe & bảo hành.",
              status: "Đóng hồ sơ",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                item.highlight
                  ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                      item.highlight
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    BƯỚC {item.step}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                <p className="text-[10px] font-semibold text-amber-700 mt-0.5">
                  Phụ trách: {item.role}
                </p>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/80 text-[10px] font-bold text-slate-500">
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-black text-slate-900">Câu Hỏi Thường Gặp (FAQ)</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-100/70 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? "rotate-90 text-amber-500" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/70 pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
