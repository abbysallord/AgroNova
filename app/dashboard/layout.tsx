import { AgroSidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
        <AgroSidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
             <Topbar />
             <main className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-950">
                {children}
             </main>
        </div>
    </div>
  );
}
