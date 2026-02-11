"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRouter() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // AuthContext usually handles this, but double check
      router.push("/login");
      return;
    }

    if (user?.role === "Farmer") {
      router.replace("/dashboard/farmer");
    } else if (user?.role === "User") {
      router.replace("/dashboard/user");
    } else if (user?.role === "Admin") {
      router.replace("/admin"); // or stay here if admin view is built later
    } else {
      // Fallback
      router.replace("/dashboard/farmer");
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-green-200 mb-4"></div>
        <p className="text-neutral-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
