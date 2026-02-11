"use client";
import React from "react";
import Link from "next/link";
import { IconUsers, IconMessageCircle } from "@tabler/icons-react";

export const CommunityWidget = () => {
    return (
        <div className="flex flex-col h-full justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Community</span>
                    <IconUsers className="w-4 h-4 text-blue-500" />
                </div>

                <div className="space-y-4">
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 font-medium">
                            "Does anyone know where to get organic seeds for winter crops?"
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-4 h-4 rounded-full bg-blue-200" />
                            <span className="text-[10px] text-neutral-400">Ravi K. • 2m ago</span>
                        </div>
                    </div>
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 font-medium">
                            "Market prices for onions are rising in Nasik..."
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-4 h-4 rounded-full bg-green-200" />
                            <span className="text-[10px] text-neutral-400">Priya S. • 1h ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <Link href="/dashboard/community" className="relative z-10 mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg text-center transition-colors">
                Join Discussion
            </Link>
        </div>
    );
};
