"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    IconLeaf,
    IconCloudStorm,
    IconTrendingUp,
    IconScan,
    IconFlask,
    IconNews,
    IconArrowRight,
    IconSun
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { WeatherWidget } from "@/components/dashboard/widgets/WeatherWidget";
import { NewsWidget } from "@/components/dashboard/widgets/NewsWidget";
import { MarketTrendsWidget } from "@/components/dashboard/widgets/MarketTrendsWidget";

export default function FarmerDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-12">

            {/* 1. Hero / Welcome Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 to-green-800 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-500/30 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-emerald-400/30">
                            Smart Farming
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Good Morning, {user?.name?.split(" ")[0] || "Farmer"}! 🌾
                    </h1>
                    <p className="text-lg text-emerald-50 mb-8 leading-relaxed max-w-xl">
                        Your farm's performance is looking great today. Check the latest weather advisory and pest alerts below.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/dashboard/weather" className="bg-white text-emerald-900 rounded-xl px-6 py-3 font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-lg">
                            <IconCloudStorm size={20} /> Weather Report
                        </Link>
                        <Link href="/dashboard/market-price" className="bg-emerald-700/50 text-white border border-emerald-500 rounded-xl px-6 py-3 font-bold hover:bg-emerald-700/70 transition-colors flex items-center gap-2 backdrop-blur-md">
                            <IconTrendingUp size={20} /> Market Rates
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Core Tools Section (Pest & Soil) */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                        <IconLeaf className="text-green-500" /> Farm Management Tools
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pest Detection Card */}
                    <Link href="/dashboard/pest-detection" className="group relative h-64 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-neutral-200 dark:border-neutral-800">
                        <Image
                            src="/images/dashboard/pest-mockup.png"
                            alt="Pest Detection"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="mb-2 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg w-fit backdrop-blur-md flex items-center gap-1">
                                <IconScan size={14} /> AI SCANNER
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Pest Detection</h3>
                            <p className="text-neutral-200 text-sm line-clamp-2">
                                Instant disease identification for crops using advanced AI.
                            </p>
                        </div>
                    </Link>

                    {/* Soil Analysis Card */}
                    <Link href="/dashboard/soil-analysis" className="group relative h-64 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-neutral-200 dark:border-neutral-800">
                        <Image
                            src="/images/dashboard/soil-mockup.png"
                            alt="Soil Analysis"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="mb-2 bg-amber-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg w-fit backdrop-blur-md flex items-center gap-1">
                                <IconFlask size={14} /> SOIL HEALTH
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Soil Analysis</h3>
                            <p className="text-neutral-200 text-sm line-clamp-2">
                                Check NPK levels and get fertilizer recommendations.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 3. Metrics Grid (Changes from Widgets) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Weather Widget */}
                <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-neutral-800 dark:text-white flex items-center gap-2">
                            <IconCloudStorm className="text-blue-500" /> Live Weather
                        </h3>
                    </div>
                    <div className="h-[300px]"> {/* Fixed height container for widget */}
                        <WeatherWidget />
                    </div>
                </section>

                {/* Market Trends Widget */}
                <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-neutral-800 dark:text-white flex items-center gap-2">
                            <IconTrendingUp className="text-green-500" /> Market Trends
                        </h3>
                        <Link href="/dashboard/market-price" className="text-xs font-bold text-green-600 hover:text-green-700 uppercase">
                            Full Report
                        </Link>
                    </div>
                    <div className="h-[300px] overflow-hidden">
                        <MarketTrendsWidget />
                    </div>
                </section>

                {/* News/Updates (Using NewsWidget) */}
                <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-neutral-800 dark:text-white flex items-center gap-2">
                            <IconNews className="text-purple-500" /> Agri News
                        </h3>
                    </div>
                    <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <NewsWidget />
                    </div>
                </section>
            </div>

            {/* 4. Quick Actions / Schemes */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Government Schemes & Subsidies</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">
                        Stay updated with the latest financial aid, loan waivers, and subsidies available for farmers in your region.
                    </p>
                </div>
                <Link href="/dashboard/schemes" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all whitespace-nowrap">
                    Explore Schemes
                </Link>
            </div>

        </div>
    );
}
