"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Car,
  Lock,
  Sliders,
  Sparkles,
  ArrowRight,
  Camera,
  Layers,
  History,
  AlertCircle,
  HelpCircle,
  Clock,
  Award,
  ListTodo,
  FileCheck,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function TechnicianHelpPage() {
  const [activeSection, setActiveSection] = useState("pin-login");

  const sections = [
    { id: "pin-login", title: "1. Đăng Nhập Ca Bằng Mã PIN" },
    { id: "workload-rule", title: "2. Quy Tắc Giới Hạn Tải (Max 3 Xe)" },
    { id: "multi-order", title: "3. Nhận & Chuyển Đổi Nhiều Xe Cùng Lúc" },
    { id: "checklist-slider", title: "4. Cập Nhật Checklist & Thanh Trượt %" },
    { id: "capture-photos", title: "5. Chụp Ảnh Nghiệm Thu Tại Khoang" },
    { id: "complete-history", title: "6. KCS Hoàn Tất & Tự Động Lưu Lịch Sử" },
    { id: "safety-checklist", title: "7. Tiêu Chuẩn An Toàn Khoang Nâng 4S" },
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
          <span className="font-bold text-slate-900">Sổ Tay Kỹ Thuật Viên Khoang Xưởng</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/help/customer"
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
          >
            ← Chuyển Sang Cẩm Nang Khách Hàng
          </Link>
          <Link
            href="/technician"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-xs flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            Mở Tablet Kỹ Thuật Viên
          </Link>
        </div>
      </div>

      {/* Hero Header Kỹ Thuật Viên */}
      <div className="p-8 rounded-3xl bg-linear-to-r from-slate-900 via-amber-950/80 to-slate-900 text-white shadow-lg space-y-3 border border-amber-500/20">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/30 text-amber-300 border border-amber-400/40">
          Sổ Tay Nghiệp Vụ Khoang Nâng (Technician Field Manual)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Cẩm Nang Thao Tác Tablet Kỹ Thuật Viên & Nghiệm Thu KCS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Hướng dẫn toàn diện dành cho thợ máy gầm, thợ điện chẩn đoán và bảo dưỡng nhanh:
          Nhận xe từ Quản đốc, thi công đúng checklist tiêu chuẩn, cập nhật tiến độ Live và tích lũy lịch sử tay nghề.
        </p>
      </div>

      {/* Grid Layout: Sidebar Mục Lục + Nội Dung Chi Tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Sticky Bên Trái (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Mục Lục Sổ Tay Thợ
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
                      ? "bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{sec.title}</span>
                  {activeSection === sec.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hộp Thông Tin Tài Khoản Thợ Demo */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 text-xs border border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-400 uppercase">Mã PIN Thợ Mặc Định</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>• <strong>Nguyễn Văn Thợ (THO-01)</strong>: PIN <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">1357</code></p>
              <p>• <strong>Trần Văn Cường (THO-02)</strong>: PIN <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">1234</code></p>
              <p>• <strong>Lê Hoàng Long (THO-03)</strong>: PIN <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">1111</code></p>
              <p>• <strong>Phạm Minh Tuấn (THO-04)</strong>: PIN <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">2222</code></p>
            </div>
          </div>
        </div>

        {/* Nội Dung Chi Tiết Bên Phải (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* PHẦN 1: ĐĂNG NHẬP MÃ PIN */}
          <section id="pin-login" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-mono font-black text-sm flex items-center justify-center">
                01
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Đăng Nhập Ca Làm Việc Bằng Mã PIN Nhanh
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tablet khoang nâng được trang bị bàn phím số Numpad cảm ứng to rõ, phù hợp cho kỹ thuật viên thao tác nhanh ngay cả khi đeo găng tay bảo hộ.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Cách thao tác:</h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                <li>Chọn đúng tên của bạn ở ô chuyển tài khoản (hoặc hệ thống sẽ nhớ thiết bị).</li>
                <li>Gõ 4 chữ số PIN cá nhân trên màn hình cảm ứng.</li>
                <li>Sau khi đăng nhập thành công, giao diện sẽ mở ra bàn làm việc với danh sách xe đang được phân công cho riêng bạn.</li>
                <li>Khi rời khỏi khoang nâng, bấm nút <strong>&quot;Khóa PIN&quot;</strong> để bảo đảm người khác không thao tác nhầm vào hồ sơ kỹ thuật.</li>
              </ul>
            </div>
          </section>

          {/* PHẦN 2: QUY TẮC GIỚI HẠN TẢI (MAX 3 XE) */}
          <section id="workload-rule" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-mono font-black text-sm flex items-center justify-center">
                02
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Quy Tắc Giới Hạn Tải: Tối Đa 3 Xe / Kỹ Thuật Viên
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Để bảo đảm an toàn kỹ thuật siết ốc, canh chỉnh góc đặt và kiểm tra rò rỉ theo tiêu chuẩn 4S, hệ thống <strong>giới hạn cứng mỗi thợ chỉ nhận tối đa 3 xe đang thi công cùng một thời điểm</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-950 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="font-bold uppercase">Cơ chế cảnh báo của Quản Đốc:</span>
              </div>
              <p className="leading-relaxed">
                Trên bảng điều phối Kanban của Quản đốc xưởng, thanh đo tải công việc sẽ hiển thị màu đỏ <strong>&quot;ĐẦY TẢI (3/3 xe)&quot;</strong>. Quản đốc sẽ bị hệ thống chặn lại và không thể gán thêm xe thứ 4 cho bạn, bắt buộc phải phân công thợ khác hoặc đợi bạn hoàn tất nghiệm thu KCS xe hiện tại!
              </p>
            </div>
          </section>

          {/* PHẦN 3: NHẬN & CHUYỂN ĐỔI NHIỀU XE */}
          <section id="multi-order" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-mono font-black text-sm flex items-center justify-center">
                03
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Nhận & Chuyển Đổi Linh Hoạt Giữa Các Xe Đang Phụ Trách
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Khi bạn đang nhận từ 2 đến 3 xe (Ví dụ: 1 xe đang xả nhớt chờ ráo, 1 xe đang tháo má phanh):
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Cách chuyển đổi bàn làm việc:</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Ở khối <strong>&quot;Chọn Xe Đang Làm Việc Tại Khoang&quot;</strong>, toàn bộ các xe bạn đang nhận sẽ hiển thị thành từng thẻ riêng biệt.</li>
                <li>Thẻ xe có badge vàng <strong>[ĐANG THAO TÁC]</strong> là xe đang được mở chi tiết trên bàn làm việc bên dưới.</li>
                <li>Để chuyển sang thao tác xe khác, chỉ cần nhấp vào thẻ xe đó hoặc bấm nút <strong>&quot;👉 Nhấp để chuyển qua thi công xe này&quot;</strong>. Bàn làm việc sẽ tự động nạp toàn bộ checklist, thông số và ảnh nghiệm thu của chiếc xe đó ngay lập tức!</li>
              </ul>
            </div>
          </section>

          {/* PHẦN 4: CHECKLIST & SLIDER TIẾN ĐỘ */}
          <section id="checklist-slider" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-mono font-black text-sm flex items-center justify-center">
                04
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Cập Nhật Checklist Hạng Mục & Gạt Thanh Trượt Tiến Độ %
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi chiếc xe có danh sách công việc đồng bộ từ Báo giá (Thay lọc nhớt, thay má phanh, bảo dưỡng họng nạp...):
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span><strong>Bấm vào thẻ từng hạng mục:</strong></span>
                <span className="text-slate-500">Chuyển vòng tuần hoàn: Chưa làm (0%) → Đang làm (50%) → Đã xong (100%)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span><strong>Thanh trượt tiến độ tổng:</strong></span>
                <span className="text-slate-500">Gạt thanh trượt hoặc bấm nhanh các nút 25% • 50% • 75% • 100%</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Mỗi khi bạn thay đổi tiến độ, tín hiệu Realtime sẽ lập tức bắn về màn hình điện thoại của chủ xe và bảng Kanban của Quản đốc xưởng!
            </p>
          </section>

          {/* PHẦN 5: CHỤP ẢNH NGHIỆM THU */}
          <section id="capture-photos" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-mono font-black text-sm flex items-center justify-center">
                05
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Chụp Ảnh Nghiệm Thu Hiện Trường Tại Khoang Nâng
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Để bảo đảm tính minh bạch đối với khách hàng, kỹ thuật viên có trách nhiệm chụp ảnh linh kiện mới đã lắp hoàn thiện trên xe (bằng camera tablet hoặc bấm nút tải ảnh nghiệm thu).
            </p>

            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
              <li>Ảnh được đóng dấu thời gian (Timestamp) và vị trí khoang nâng.</li>
              <li>Chủ xe có thể xem trực tiếp ảnh này trên Cổng Khách Hàng.</li>
              <li>Ảnh được lưu vào biên bản nghiệm thu KCS phục vụ bảo hành về sau.</li>
            </ul>
          </section>

          {/* PHẦN 6: KCS HOÀN TẤT & LƯU LỊCH SỬ */}
          <section id="complete-history" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-black text-sm flex items-center justify-center">
                06
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Nghiệm Thu KCS Hoàn Tất 100% & Tự Động Lưu Lịch Sử Riêng
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Khi tất cả các hạng mục trong checklist đã xong và tiến độ đạt 100%, nút <strong>&quot;Nghiệm Thu KCS & Lưu Lịch Sử&quot;</strong> màu xanh lá sẽ nhấp nháy:
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 text-xs">
              <h4 className="font-bold">Khi bạn bấm nút xác nhận nghiệm thu KCS:</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-emerald-900">
                <li>Chiếc xe sẽ tự động chuyển sang Tab <strong>&quot;Lịch Sử Đã Hoàn Thành Của Riêng Tôi&quot;</strong>.</li>
                <li>Tải công việc của bạn tự động giảm bớt 1 xe (Ví dụ: từ 3/3 giảm xuống 2/3), giúp bạn sẵn sàng nhận xe mới.</li>
                <li>Nếu bạn đang có xe khác trong khoang, Tablet sẽ tự động chuyển giao diện sang xe tiếp theo.</li>
                <li>Hệ thống gửi thông báo cho khách hàng và mở cổng thanh toán VietQR.</li>
              </ol>
            </div>
          </section>

          {/* PHẦN 7: AN TOÀN LAO ĐỘNG KHOANG NÂNG */}
          <section id="safety-checklist" className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-100 text-red-800 font-mono font-black text-sm flex items-center justify-center">
                07
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Tiêu Chuẩn An Toàn Lao Động Khoang Nâng Tiêu Chuẩn 4S
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">1. Khóa Cóc An Toàn Cầu Nâng</span>
                <p className="text-slate-500">Luôn hạ cầu tựa vào cóc cơ khí trước khi chui vào gầm xe làm việc.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">2. Bọc Ghế & Vô Lăng Bảo Vệ</span>
                <p className="text-slate-500">Phải trải bọc nilon bảo vệ nội thất trước khi lên xe chạy thử hoặc chẩn đoán.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">3. Cân Lực Siết Bánh Xe</span>
                <p className="text-slate-500">Dùng cần xiết lực (Torque Wrench) siết theo quy định nhà sản xuất (110 - 140 Nm).</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">4. Vệ Sinh Khoang Sau Ca Làm</span>
                <p className="text-slate-500">Lau sạch vết dầu mỡ, cất dụng cụ về tủ đồ nghề trước khi khóa Tablet.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
