import React from "react";
import { StaffNavbar } from "@/components/layout/staff-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark transition-colors">
      <StaffNavbar currentRoleTitle="CỐ VẤN DỊCH VỤ (SERVICE ADVISOR)" />
      <main className="flex-1 py-10 px-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
