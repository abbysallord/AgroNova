"use client";
import React from 'react';
import { IconWorld } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

export const Topbar = () => {
  const { user } = useAuth();
  
  // Create initials from name
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : "JD";

  return (
    <div className="w-full h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-neutral-800 dark:text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
             <ThemeToggle />
             <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="size-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold border border-green-200 dark:border-green-800 overflow-hidden relative">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                        initials
                    )}
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-medium text-neutral-800 dark:text-white">{user?.name || "Guest Farmer"}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.role || "Visitor"}</p>
                </div>
             </Link>
        </div>
    </div>
  );
};
