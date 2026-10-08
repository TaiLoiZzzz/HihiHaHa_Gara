import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { BLOG_POSTS } from "../page";

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogDetailPage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="relative min-h-screen py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-500 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách bài viết
        </Link>

        {/* Post Meta & Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {post.category}
            </span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>Tác giả: <strong className="text-zinc-800 dark:text-zinc-200">{post.author}</strong></span>
          </div>
        </div>

        {/* Post Content (Markdown-like Typography) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-brand-cardDark border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          
          <div className="p-4 rounded-2xl bg-amber-500/5 border-l-4 border-amber-500 text-xs sm:text-sm font-medium italic text-zinc-800 dark:text-zinc-200">
            {post.excerpt}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">
            1. Nguyên lý cơ học và bối cảnh kỹ thuật thực tế
          </h2>
          <p>
            Trong quá trình vận hành xe hơi hàng ngày, đặc biệt là các dòng sedan cao cấp và SUV gia đình, các bộ phận như má phanh, dầu động cơ và hệ thống đánh lửa là những chi tiết chịu hao mòn ma sát và nhiệt lượng khắc nghiệt nhất.
          </p>
          <p>
            Việc sử dụng các linh kiện không đạt chuẩn hoặc chẩn đoán sai mã tương thích phụ tùng có thể dẫn đến việc phá hủy đĩa phanh, gây xước nòng xy-lanh hoặc làm sai lệch tỷ lệ hòa khí của hệ thống phun xăng điện tử.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">
            2. Ứng dụng công nghệ chẩn đoán Graph-RAG tại xưởng HiHiHaHa Auto
          </h2>
          <p>
            Tại trung tâm dịch vụ kỹ thuật HiHiHaHa Auto, chúng tôi loại bỏ hoàn toàn phương pháp đoán bệnh bằng cảm quan thông qua việc đưa hệ thống <strong>Graph-RAG AI</strong> vào quy trình kiểm tra 30 hạng mục:
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Đối soát cấu trúc khung gầm dùng chung (như nền tảng TNGA-K giữa Toyota Camry và Lexus ES250) để đưa ra phụ tùng tương thích cơ khí hoàn hảo.</span>
            </div>
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Tự động đặt giữ phụ tùng trong kho thời gian thực ngay khi khách hàng ký duyệt trực tuyến trên điện thoại.</span>
            </div>
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Chụp ảnh nghiệm thu cận cảnh trước và sau khi thay thế, lưu vết vĩnh viễn trên sổ bảo dưỡng điện tử.</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">
            3. Lời khuyên an toàn dành cho chủ xe
          </h2>
          <p>
            Định kỳ mỗi 10.000km hoặc 6 tháng, quý khách nên mang xe đến trung tâm để được quét lỗi bằng thiết bị chuyên hãng và kiểm tra độ dày má phanh. Mọi chi phí và báo giá tại HiHiHaHa Auto luôn được minh bạch từng đồng trước khi tiến hành sửa chữa.
          </p>

        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Cần kiểm tra xe bằng công nghệ Graph-RAG AI?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Đăng nhập ngay cổng khách hàng để xem lịch sử bảo dưỡng xe của bạn.
            </p>
          </div>
          <Link
            href="/login"
            className="px-6 py-3 text-xs font-bold rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 transition"
          >
            Đăng Nhập Tra Cứu Xe
          </Link>
        </div>

      </div>
    </article>
  );
}
