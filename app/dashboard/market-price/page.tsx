"use client";
import React, { useState } from "react";
import { IconSearch, IconTrendingUp, IconTrendingDown, IconMapPin, IconFilter } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

export default function MarketPricePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("All States");
    const [loading, setLoading] = useState(false);

    // Initial Mock Data (Fallback/Trending)
    const initialData = [
        { name: "Tomato", variety: "Hybrid", market: "Kolar Mandi", state: "Karnataka", price: 1800, change: -12.0 },
        { name: "Onion", variety: "Red Nasik", market: "Lasalgaon", state: "Maharashtra", price: 2500, change: 8.5 },
        { name: "Potato", variety: "Desi", market: "Agra", state: "Uttar Pradesh", price: 1200, change: 5.4 },
        { name: "Wheat", variety: "Sharbati", market: "Khanna", state: "Punjab", price: 2300, change: 1.5 },
        { name: "Cotton", variety: "Long Staple", market: "Rajkot", state: "Gujarat", price: 6200, change: 0.8 },
        { name: "Rice (Paddy)", variety: "Basmati", market: "Karnal", state: "Haryana", price: 3400, change: -0.5 },
    ];

    const [marketData, setMarketData] = useState<any[]>(initialData);

    const states = ["All States", "Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"];

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            // If searching for specific crop/state combo
            const res = await fetch("/api/market-price", {
                method: "POST",
                body: JSON.stringify({
                    crop: searchTerm,
                    state: selectedState
                })
            });

            const data = await res.json();
            if (data.market_data) {
                // Inject source into each item if waiting for mapping
                const dataWithSource = data.market_data.map((item: any) => ({
                    ...item,
                    source: data.source || "Unknown",
                    source_url: data.source_url,
                    source_domain: data.source_domain
                }));
                setMarketData(dataWithSource);
            }
        } catch (e) {
            console.error("Failed to fetch prices", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Market Price</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-balance">
                        Find the best selling price. Spot food deficits and sell where demand is high.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
                    <div className="relative w-full md:min-w-[300px]">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search crop (e.g. Ginger)..."
                            className="w-full pl-9 pr-4 py-2 bg-transparent text-sm outline-none text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>
                    <div className="h-px md:h-8 w-full md:w-px bg-neutral-200 dark:bg-neutral-800" />
                    <div className="relative w-full md:w-64">
                        <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                        <select
                            className="w-full pl-9 pr-8 py-2 bg-transparent text-sm outline-none appearance-none text-neutral-800 dark:text-neutral-200 cursor-pointer"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            {states.map(state => (
                                <option key={state} value={state} className="bg-white dark:bg-neutral-900">{state}</option>
                            ))}
                        </select>
                        <IconFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 h-3 w-3 pointer-events-none" />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-neutral-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>
            </div>

            {/* Trending Cards Grid */}
            <div>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                    <IconTrendingUp className="text-emerald-500" size={20} />
                    Trending High Demand
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <TrendingCard name="Onion" market="Lasalgaon, MH" price="₹2,500" change="+8.5%" isUp={true} />
                    <TrendingCard name="Tomato" market="Kolar, KA" price="₹1,800" change="-12%" isUp={false} />
                    <TrendingCard name="Potato" market="Agra, UP" price="₹1,200" change="+5.4%" isUp={true} />
                    <TrendingCard name="Cotton" market="Rajkot, GJ" price="₹6,200" change="+0.8%" isUp={true} />
                </div>
            </div>

            {/* Prices List */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-neutral-800 dark:text-white">Real-time Mandi Rates</h3>
                        <p className="text-xs text-neutral-500 mt-1">Comparing prices across {marketData.length} markets</p>
                    </div>

                    {/* Data Source Indicator */}
                    {marketData.length > 0 && (
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                            {/* Source Badge */}
                            {marketData[0].source && marketData[0].source.includes("Government") ? (
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800 flex items-center gap-1">
                                    <IconTrendingUp size={12} /> Official Gov Data
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                                    ⚠️ AI Estimated ( Verify Below )
                                </span>
                            )}

                            {/* Always Valid Verify Link */}
                            <a
                                href={`https://www.google.com/search?q=current+market+price+of+${searchTerm || 'crops'}+in+${selectedState}+today`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1"
                            >
                                <IconSearch size={12} /> Verify on Google
                            </a>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                        <thead className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Crop Name</th>
                                <th className="px-6 py-4">Variety</th>
                                <th className="px-6 py-4">Market (Mandi)</th>
                                <th className="px-6 py-4">State</th>
                                <th className="px-6 py-4 text-right">Price (₹/qt)</th>
                                <th className="px-6 py-4 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {marketData.map((crop, idx) => (
                                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-neutral-800 dark:text-white">{crop.name || searchTerm}</td>
                                    <td className="px-6 py-4">{crop.variety || "Local"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                                                <IconMapPin size={14} />
                                            </div>
                                            {crop.market}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-700">
                                            {crop.state}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-base font-bold text-neutral-900 dark:text-white">
                                                {crop.min_price && crop.max_price && crop.min_price !== crop.max_price
                                                    ? `₹${crop.min_price.toLocaleString()} - ₹${crop.max_price.toLocaleString()}`
                                                    : `₹${crop.price?.toLocaleString() || "N/A"}`
                                                }
                                            </span>
                                            <span className="text-xs text-neutral-500">per quintal</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium`}>
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${crop.change > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                                            {crop.change > 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
                                            {Math.abs(crop.change)}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {marketData.length === 0 && (
                        <div className="p-12 text-center text-neutral-500 flex flex-col items-center gap-4">
                            <IconSearch size={48} className="text-neutral-300" />
                            <p>No market data found for &quot;{searchTerm}&quot; in {selectedState}.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedState("All States"); }}
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TrendingCard = ({ name, market, price, change, isUp }: { name: string, market: string, price: string, change: string, isUp: boolean }) => (
    <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {isUp ? <IconTrendingUp size={64} /> : <IconTrendingDown size={64} />}
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Top Gainer</p>
                    <p className="text-lg font-bold text-neutral-800 dark:text-white mt-0.5">{name}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {isUp ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
                    {change}
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{price}</p>
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <IconMapPin size={12} /> {market}
                </p>
            </div>
        </div>
    </div>
);
