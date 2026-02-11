"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconSearch, IconShoppingCart, IconUsers, IconLeaf, IconArrowRight } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";

export default function UserDashboardPage() {
    const { user } = useAuth();

    // Mock Data for UI (This would come from DB ideally)
    const featuredProducts = [
        { id: 1, name: "Fresh Tomatoes", price: "₹40/kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60" },
        { id: 2, name: "Organic Potatoes", price: "₹30/kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60" },
        { id: 3, name: "Green Spinach", price: "₹20/unit", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60" },
        { id: 4, name: "Red Onions", price: "₹35/kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60" },
    ];

    const communityTopics = [
        { id: 1, title: "Best fertilizer for home garden?", author: "Ravi K.", time: "2h ago", answers: 5 },
        { id: 2, title: "Where to buy organic seeds?", author: "Priya S.", time: "4h ago", answers: 12 },
        { id: 3, title: "Mango season predictions 2024", author: "Amit Verma", time: "1d ago", answers: 8 },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-12">

            {/* 1. Hero / Welcome Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-800 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <p className="text-green-100 font-medium mb-2 uppercase tracking-wide text-sm">Welcome Back</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Hello, {user?.name?.split(" ")[0] || "Friend"}! 👋
                    </h1>
                    <p className="text-lg text-green-50 mb-8 leading-relaxed">
                        Support local farmers and get fresh, organic produce delivered daily. What are you looking for today?
                    </p>

                    {/* Search Bar */}
                    <Link href="/dashboard/store" className="bg-white text-neutral-800 rounded-full px-6 py-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all w-full max-w-md cursor-text group">
                        <IconSearch className="text-neutral-400 group-hover:text-green-600 transition-colors" size={24} />
                        <span className="text-neutral-400 font-medium">Search for fresh vegetables, fruits...</span>
                    </Link>
                </div>
            </div>

            {/* 2. Featured Market Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                        <IconLeaf className="text-green-500" /> Fresh from Farm
                    </h2>
                    <Link href="/dashboard/store" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 group">
                        View All <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-40 w-full overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-neutral-800 dark:text-white mb-1 group-hover:text-green-600 transition-colors">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-600 font-bold">{product.price}</span>
                                    <button className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 text-neutral-600 hover:text-green-600 transition-colors">
                                        <IconShoppingCart size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Community & Education Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Community Highlights */}
                <section className="md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                            <IconUsers className="text-blue-500" /> Community Discussions
                        </h2>
                        <Link href="/dashboard/community" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                            See All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {communityTopics.map((topic) => (
                            <Link key={topic.id} href="/dashboard/community" className="block p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all">
                                <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">{topic.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-neutral-500">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium">{topic.answers} answers</span>
                                    <span>• Posted by {topic.author}</span>
                                    <span>• {topic.time}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Seasonal/Promo Card */}
                <section>
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6">&nbsp;</h2> {/* Spacer for alignment */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-3xl p-6 h-full flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 block">Seasonal Guide</span>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Winter Harvest is Here! 🥕</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                                Discover the best root vegetables of the season. Carrots, radishes, and beets are at their peak sweetness now.
                            </p>
                        </div>
                        <Link href="/dashboard/resources" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-center shadow-lg shadow-amber-500/30 transition-all">
                            Read Guide
                        </Link>
                    </div>
                </section>
            </div>

        </div>
    );
}
