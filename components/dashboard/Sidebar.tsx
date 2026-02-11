"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconLeaf,
  IconBug,
  IconCloudStorm,
  IconChartInfographic,
  IconBuildingBank,
  IconShoppingBag,
  IconUsers,
  IconReportAnalytics,
  IconUserCircle,
  IconLogout,
  IconLayoutDashboard
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AgroSidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { user } = useAuth();

  const commonLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const farmerLinks = [
    {
      label: "Pest Detection",
      href: "/dashboard/pest-detection",
      icon: (
        <IconBug className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Soil Analysis",
      href: "/dashboard/soil-analysis",
      icon: (
        <IconLeaf className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Weather",
      href: "/dashboard/weather",
      icon: (
        <IconCloudStorm className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Market Price",
      href: "/dashboard/market-price",
      icon: (
        <IconChartInfographic className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Govt Schemes",
      href: "/dashboard/schemes",
      icon: (
        <IconBuildingBank className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Farm Reports",
      href: "/dashboard/reports",
      icon: (
        <IconReportAnalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const userLinks = [
    {
      label: "Agri Store",
      href: "/dashboard/store",
      icon: (
        <IconShoppingBag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Community",
      href: "/dashboard/community",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];



  // Refined Logic based on typical app flow:
  // Common: Dashboard, Profile
  // Farmer Specific: Pest, Soil, Weather, Market, Schemes, Reports
  // User Specific: Store (Buy) - Farmers might access 'Store' to Sell? Or 'Market Price'?
  // Shared: Community

  const getLinks = () => {
    const base = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
    ];

    const farmerSpecific = [
      {
        label: "Weather",
        href: "/dashboard/weather",
        icon: <IconCloudStorm className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Pest Detection",
        href: "/dashboard/pest-detection",
        icon: <IconBug className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Soil Analysis",
        href: "/dashboard/soil-analysis",
        icon: <IconLeaf className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Market Price",
        href: "/dashboard/market-price",
        icon: <IconChartInfographic className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Govt Schemes",
        href: "/dashboard/schemes",
        icon: <IconBuildingBank className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Farm Reports",
        href: "/dashboard/reports",
        icon: <IconReportAnalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
    ];

    const userSpecific = [
      {
        label: "Agri Store",
        href: "/dashboard/store",
        icon: <IconShoppingBag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Community",
        href: "/dashboard/community",
        icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
    ];

    const profile = [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
    ];

    if (user?.role === "Farmer") {
      // Farmers also need Community and maybe Store (to see what's listing?)
      // For strict separation as requested:
      return [...base, ...farmerSpecific, ...userSpecific, ...profile];
    } else {
      // Consumers
      return [...base, ...userSpecific, ...profile];
    }
  };

  const links = getLinks();

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col">
            <Logo />
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Sign Out",
              href: "#",
              icon: <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            }}
            onClick={() => router.push("/")}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-lg text-black dark:text-white whitespace-pre"
      >
        AgroNova
      </motion.span>
    </Link>
  );
};
