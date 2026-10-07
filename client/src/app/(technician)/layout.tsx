import { StaffNavbar } from "@/components/layout/staff-navbar";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans select-none">
      {/* Navbar chuyên dụng tablet cho thợ */}
      <StaffNavbar role="technician" />
      <main className="flex-1 p-3 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
