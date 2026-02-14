"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconSearch, IconShoppingCart, IconUsers, IconLeaf, IconArrowRight, IconMessageCircle } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";

export default function UserDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, topicsRes] = await Promise.all([
                    fetch("/api/store/products"),
                    fetch("/api/community/posts")
                ]);

                const productsData = await productsRes.json();
                const topicsData = await topicsRes.json();

                setProducts(productsData.slice(0, 4)); // Get top 4
                setTopics(topicsData.slice(0, 3)); // Get top 3
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/dashboard/store?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-12">

            {/* 1. Hero / Welcome Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-800 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <p className="text-green-100 font-medium mb-2 uppercase tracking-wide text-sm">Consumer Dashboard</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Hello, {user?.name?.split(" ")[0] || "Friend"}! 👋
                    </h1>
                    <p className="text-lg text-green-50 mb-8 leading-relaxed">
                        Support local farmers and get fresh, organic produce delivered daily. What are you looking for today?
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white text-neutral-800 rounded-full px-6 py-2 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all w-full max-w-md group focus-within:ring-2 focus-within:ring-green-500/50">
                        <IconSearch className="text-neutral-400 group-hover:text-green-600 transition-colors" size={24} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for fresh vegetables, fruits..."
                            className="bg-transparent border-none focus:outline-none w-full py-2 text-neutral-800 font-medium placeholder:text-neutral-400"
                        />
                        <button type="submit" className="hidden">Search</button>
                    </form>
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

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-gray-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.length > 0 ? products.map((product) => (
                            <Link key={product.id} href={`/dashboard/store?product=${product.id}`} className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-neutral-400">
                                            <IconLeaf size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-neutral-800 dark:text-white mb-1 group-hover:text-green-600 transition-colors line-clamp-1">{product.name}</h3>
                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-green-600 font-bold">₹{product.price}/{product.unit}</span>
                                        <button className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 text-neutral-600 hover:text-green-600 transition-colors">
                                            <IconShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center py-10 text-neutral-500">
                                No products found. <Link href="/dashboard/store" className="text-green-600 underline">Visit Store</Link>
                            </div>
                        )}
                    </div>
                )}
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
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-neutral-900 rounded-xl animate-pulse" />)
                        ) : (
                            topics.length > 0 ? topics.map((topic) => (
                                <Link key={topic.id} href="/dashboard/community" className="block p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all">
                                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2 line-clamp-1">{topic.content}</h3>
                                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                                            <IconMessageCircle size={12} /> {topic.comments?.length || 0} replies
                                        </span>
                                        <span>• Posted by {topic.userName}</span>
                                        <span>• {new Date(topic.date).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-center py-8 text-neutral-500 border border-dashed rounded-xl border-neutral-300">
                                    No discussions yet. <Link href="/dashboard/community" className="text-blue-600 underline">Start one!</Link>
                                </div>
                            )
                        )}
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
