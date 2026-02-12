"use client";
import { AgroSidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCommunityPage = pathname === "/dashboard/community";

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      <AgroSidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Topbar />
        <main className={`flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 ${isCommunityPage ? "p-0" : "p-6"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
