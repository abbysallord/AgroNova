"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft, IconCalendar, IconLeaf, IconBook } from "@tabler/icons-react";

export default function ResourcesPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            <Link href="/dashboard/user" className="inline-flex items-center text-neutral-600 hover:text-green-600 transition-colors mb-4">
                <IconArrowLeft size={18} className="mr-2" /> Back to Dashboard
            </Link>

            <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden shadow-xl">
                <Image
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
                    alt="Winter Harvest"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <IconCalendar size={12} /> Seasonal Guide
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">Winter Harvest Guide 🧊🥕</h1>
                    <p className="text-neutral-200">Everything you need to know about growing and buying winter crops.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                            <IconLeaf className="text-green-600" /> Best Crops to Buy Now
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-700 dark:text-green-400 font-bold text-2xl">🥕</div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Root Vegetables</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">Carrots, Radishes, and Beets are sweetest after a frost. Look for firm roots with bright greens attached.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-700 dark:text-emerald-400 font-bold text-2xl">🥬</div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Leafy Greens</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">Spinach, Kale, and Mustard Greens thrive in cool weather. They are packed with nutrients and flavor.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-700 dark:text-orange-400 font-bold text-2xl">🍊</div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Citrus Fruits</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">Oranges, Grapefruits, and Lemons are in peak season. Great for boosting immunity during winter.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                        <h3 className="font-bold text-lg text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                            <IconBook className="text-blue-600" size={20} /> Farming Tips
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                                <span className="text-blue-500">•</span> Mulch your soil to retain moisture and warmth.
                            </li>
                            <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                                <span className="text-blue-500">•</span> Use row covers to protect sensitive crops from frost.
                            </li>
                            <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                                <span className="text-blue-500">•</span> Water in the morning to prevent freezing overnight.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
