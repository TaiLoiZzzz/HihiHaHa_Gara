"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Car,
  QrCode,
  FileCheck,
  Sliders,
  Sparkles,
  ArrowRight,
  Phone,
  Lock,
  Eye,
  CreditCard,
  History,
  AlertCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function CustomerHelpPage() {
  const [activeSection, setActiveSection] = useState("login");

  const sections = [
    { id: "login", title: "1. Tra Cứu & Đăng Nhập OTP" },
    { id: "estimate", title: "2. Xem Báo Giá Điện Tử Minh Bạch" },
    { id: "approval", title: "3. Ký Duyệt Báo Giá Trực Tuyến" },
    { id: "tracking", title: "4. Theo Dõi Tiến Độ Thi Công Live" },
    { id: "payment", title: "5. Thanh Toán VietQR & Nhận Xe" },
    { id: "warranty", title: "6. Tra Cứu Lịch Sử & Bảo Hành" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/help" className="hover:text-amber-600 font-medium">
            Trung Tâm Hướng Dẫn
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-900">Cẩm Nang Dành Cho Khách Hàng</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/help/technician"
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
          >
            Chuyển Sang Sổ Tay Kỹ Thuật Viên →
          </Link>
          <Link
            href="/customer"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Car className="w-3.5 h-3.5" />
            Vào Cổng Khách Hàng
          </Link>
        </div>
      </div>

      {/* Hero Header Khách Hàng */}
      <div className="p-8 rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/30 text-blue-300 border border-blue-400/40">
          Tài Liệu Hướng Dẫn Khách Hàng (Customer Manual)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Cẩm Nang Sử Dụng Cổng Thông Tin Khách Hàng
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Theo dõi toàn bộ quá trình chăm sóc xe từ khi xe lăn bánh vào xưởng cho đến khi thanh toán và nhận xe,
          minh bạch 100% không phát sinh chi phí ẩn.
        </p>
      </div>

      {/* Grid Layout: Sidebar Mục Lục + Nội Dung Chi Tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Sticky Bên Trái (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Mục Lục Hướng Dẫn
            </h3>
            <div className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeSection === sec.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{sec.title}</span>
                  {activeSection === sec.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hộp Hotline Hỗ Trợ */}
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-black uppercase">Cần Hỗ Trợ Khẩn Cấp?</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Nếu bạn có bất kỳ thắc mắc nào về bảng báo giá hoặc tiến độ sửa chữa, vui lòng liên hệ trực tiếp Cố vấn dịch vụ hoặc Hotline:
            </p>
            <p className="font-mono font-black text-lg text-amber-700 pt-1">1900 8888</p>
          </div>
        </div>

        {/* Nội Dung Chi Tiết Bên Phải (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* PHẦN 1: ĐĂNG NHẬP OTP */}
          <section id="login" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-mono font-black text-sm flex items-center justify-center">
                01
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Tra Cứu Hồ Sơ & Đăng Nhập OTP Không Cần Mật Khẩu
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn không cần đăng ký tài khoản trước hay phải ghi nhớ mật khẩu rườm rà. Hệ thống bảo mật định danh bằng chính <strong>Biển số xe</strong> và <strong>Số điện thoại</strong> của bạn.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Các bước thực hiện:</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Truy cập vào trang chủ hoặc mục <strong>Đăng Nhập Khách Hàng</strong>.</li>
                <li>Nhập <strong>Biển số xe</strong> (Ví dụ: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">51K-99999</code>) và <strong>Số điện thoại</strong> (Ví dụ: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">0797526990</code>).</li>
                <li>Bấm <strong>&quot;Tiếp Tục & Gửi Mã OTP&quot;</strong>.</li>
                <li>Hệ thống gửi mã xác thực 6 chữ số qua SMS / Email (Trong môi trường thử nghiệm, mã OTP tự động gợi ý trên màn hình).</li>
                <li>Nhập mã OTP để mở ngay hồ sơ phương tiện và lệnh sửa chữa hiện tại.</li>
              </ol>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bảo mật riêng tư:</strong> Khách hàng chỉ xem được hồ sơ xe thuộc sở hữu của mình. Không ai có thể truy cập lệnh sửa chữa của xe khác mà không có mã OTP xác thực.
              </span>
            </div>
          </section>

          {/* PHẦN 2: BÁO GIÁ MINH BẠCH */}
          <section id="estimate" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-mono font-black text-sm flex items-center justify-center">
                02
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Kiểm Tra Bảng Báo Giá Điện Tử Minh Bạch
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sau khi xe được Cố vấn dịch vụ khám tổng quát, hệ thống tự động xuất bảng dự toán báo giá chi tiết, phân tách rõ ràng giữa <strong>Phụ tùng thay thế OEM</strong> và <strong>Tiền công kỹ thuật</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Linh Kiện OEM Chính Hãng</span>
                <p className="text-slate-500">Mã part rõ ràng, xuất xứ nhà máy, đơn giá niêm yết chuẩn.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Tiền Công Tiêu Chuẩn</span>
                <p className="text-slate-500">Định mức thời gian theo quy chuẩn 4S, không phát sinh thêm.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Thuế VAT 8% Minh Bạch</span>
                <p className="text-slate-500">Tự động tính thuế theo quy định, xuất hóa đơn điện tử VAT.</p>
              </div>
            </div>
          </section>

          {/* PHẦN 3: KÝ DUYỆT BÁO GIÁ */}
          <section id="approval" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-mono font-black text-sm flex items-center justify-center">
                03
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Ký Duyệt Báo Giá Trực Tuyến 1 Chạm (E-Sign)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn không cần phải có mặt trực tiếp tại gara để ký giấy tờ. Khi nhận được thông báo báo giá, bạn có thể kiểm tra từng hạng mục và ký duyệt ngay trên điện thoại di động.
            </p>

            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-300 text-amber-950 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-black uppercase">Quy định chuyển tiếp thi công:</span>
              </div>
              <p className="leading-relaxed">
                <strong>Chỉ sau khi bạn bấm &quot;Xác Nhận & Ký Duyệt Báo Giá&quot;</strong>, hệ thống mới cấp quyền cho Quản đốc xưởng phân công thợ và xếp khoang nâng cho xe của bạn. Nếu bạn chưa duyệt, xe sẽ giữ nguyên ở hàng đợi kiểm tra để đảm bảo gara không tự ý sửa chữa khi chưa có sự đồng ý của khách hàng!
              </p>
            </div>
          </section>

          {/* PHẦN 4: THEO DÕI TIẾN ĐỘ THỰC TẾ */}
          <section id="tracking" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-mono font-black text-sm flex items-center justify-center">
                04
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Theo Dõi Tiến Độ Thi Công Live & Camera Khoang Nâng
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi khi kỹ thuật viên thao tác trên Tablet khoang xưởng (thay dầu, siết ốc, lắp má phanh, chụp ảnh nghiệm thu), màn hình của bạn sẽ tự động nhảy số theo thời gian thực (Realtime Socket.io):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-mono font-black text-blue-600 text-sm">25%</p>
                <p className="text-slate-500 mt-0.5">Tháo dỡ phụ tùng cũ</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-mono font-black text-blue-600 text-sm">50%</p>
                <p className="text-slate-500 mt-0.5">Lắp ráp linh kiện mới</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-mono font-black text-blue-600 text-sm">75%</p>
                <p className="text-slate-500 mt-0.5">Cân chỉnh & Siết lực</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-mono font-black text-emerald-600 text-sm">100%</p>
                <p className="text-slate-500 mt-0.5">KCS Nghiệm thu đạt</p>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Bạn cũng có thể xem trực tiếp các bức ảnh cận cảnh chụp linh kiện mới được thợ tải lên hồ sơ ở mục <strong>Ảnh Nghiệm Thu Khoang Nâng</strong>.
            </p>
          </section>

          {/* PHẦN 5: THANH TOÁN VIETQR */}
          <section id="payment" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-mono font-black text-sm flex items-center justify-center">
                05
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Thanh Toán Không Tiền Mặt VietQR Động / VNPay
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Khi kỹ thuật viên hoàn tất nghiệm thu KCS 100%, hệ thống tự động kích hoạt Cổng Thanh Toán. Bạn chỉ cần mở bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank...) quét mã VietQR:
            </p>

            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
              <li>Mã QR đã điền sẵn số tiền chính xác và nội dung chuyển khoản.</li>
              <li>Hệ thống ngân hàng bắt tín hiệu Webhook tự động gạch nợ trong vòng 1-2 giây.</li>
              <li>Sau khi thanh toán thành công, màn hình tự động hiển thị <strong>Phiếu Bàn Giao Xe & Kích Hoạt Bảo Hành Điện Tử</strong>.</li>
            </ul>
          </section>

          {/* PHẦN 6: BẢO HÀNH & LỊCH SỬ */}
          <section id="warranty" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-mono font-black text-sm flex items-center justify-center">
                06
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Tra Cứu Lịch Sử Sửa Chữa & Sổ Bảo Hành Điện Tử
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mọi lần bảo dưỡng, thay nhớt hay sửa chữa của chiếc xe đều được lưu trữ vĩnh viễn trên nền tảng đám mây của HiHiHaHa Auto. Bạn có thể mở lại xem bất cứ lúc nào để theo dõi lịch nhắc bảo dưỡng định kỳ hoặc làm bằng chứng gia tăng giá trị khi cần chuyển nhượng xe.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
