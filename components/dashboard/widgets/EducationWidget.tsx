"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconBook } from "@tabler/icons-react";

export const EducationWidget = () => {
    return (
        <div className="flex flex-col md:flex-row h-full w-full bg-white dark:bg-neutral-900 rounded-xl relative overflow-hidden group">

            {/* Left Content */}
            <div className="flex-1 p-6 relative z-10 flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent opacity-60 pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <IconBook className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Seasonal Guide</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
                        What to Buy in February?
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-md">
                        Winter crops are at their peak sweetness. Look for carrots, spinach, and cauliflower in your local market for the best taste and nutrition.
                    </p>
                    <Link href="/dashboard/resources" className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                        Read Full Guide
                    </Link>
                </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full md:w-1/3 min-h-[150px] md:min-h-full">
                <Image
                    src="https://images.unsplash.com/photo-1601648764658-008544d156b8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Seasonal Veggies"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-l" />
            </div>
        </div>
    );
};
