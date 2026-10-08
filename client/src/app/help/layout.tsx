import React from "react";
import Link from "next/link";
import { BookOpen, User, Wrench, Shield, Home, ArrowLeft } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";

export const metadata = {
  title: "Trung Tâm Trợ Giúp & Tài Liệu Vận Hành | HiHiHaHa Auto",
  description:
    "Tài liệu hướng dẫn sử dụng chi tiết dành cho Khách Hàng và Kỹ Thuật Viên hệ thống gara ô tô thông minh HiHiHaHa Auto.",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      {/* Sub-header chuyên biệt cho Documentation */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <span className="font-black text-sm tracking-tight text-white">
                HIHIHAHA DOCS
              </span>
              <span className="text-slate-400 ml-2 hidden sm:inline">
                • Cẩm Nang & Hướng Dẫn Vận Hành Hệ Thống Gara 4S
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/help/customer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5 font-bold"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Dành Cho Khách Hàng</span>
            </Link>
            <Link
              href="/help/technician"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5 font-bold"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Dành Cho Kỹ Thuật Viên</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Footer Documentation */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          HiHiHaHa Auto • Trung Tâm Sửa Chữa & Chăm Sóc Ô Tô Chuyên Nghiệp Tiêu Chuẩn 4S
        </p>
        <p className="mt-1 text-slate-400">
          Hotline Hỗ Trợ Kỹ Thuật: <span className="font-bold text-amber-600">1900 8888</span> • Cập nhật phiên bản hệ thống 2026.1
        </p>
      </footer>
    </div>
  );
}
