"use client";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconCloud, IconWind, IconDroplet, IconThermometer, IconSun, IconPlant, IconAnalyze, IconLoader, IconAlertTriangle, IconCheck, IconInfoCircle, IconMapPin, IconSearch, IconX, IconArrowRight } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock location for MVP (Bangalore)
const DEFAULT_LAT = 12.9716;
const DEFAULT_LON = 77.5946;

export default function WeatherPage() {
    const [weather, setWeather] = useState<any>(null);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [cityName, setCityName] = useState("Bangalore, Karnataka");
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

    const [crops, setCrops] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [impactReport, setImpactReport] = useState<any>(null);
    const [selectedCard, setSelectedCard] = useState<{ title: string, content: any, type: string } | null>(null); // New State
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null); // For GSAP

    useGSAP(() => {
        if (impactReport && containerRef.current) {
            gsap.from(".impact-card", {
                y: 30, // subtle move
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all"
            });
        }
    }, [impactReport]);

    useGSAP(() => {
        if (selectedCard && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
            );
        }
    }, [selectedCard]);

    useEffect(() => {
        async function fetchWeather() {
            try {
                setLoadingWeather(true);
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto`
                );
                const data = await res.json();
                setWeather(data);
            } catch (e) {
                console.error("Failed to fetch weather", e);
                toast.error("Could not load weather data.");
            } finally {
                setLoadingWeather(false);
            }
        }
        fetchWeather();
    }, [coords]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                toast.error("City not found. Please try again.");
                return;
            }

            const place = data.results[0];
            setCoords({ lat: place.latitude, lon: place.longitude });
            setCityName(`${place.name}, ${place.country}`);
            setSearchQuery("");
        } catch (e) {
            toast.error("Failed to search location.");
        } finally {
            setSearching(false);
        }
    };

    const handleAnalyze = async () => {
        if (!crops.trim()) {
            toast.error("Please enter your crops first.");
            return;
        }
        setAnalyzing(true);
        setImpactReport(null);

        try {
            const res = await fetch("/api/analyze-weather-impact", {
                method: "POST",
                body: JSON.stringify({
                    crops: crops,
                    weatherData: weather // Send full weather data (current + daily)
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setImpactReport(data);
            toast.success("Crop Impact Report Generated!");
        } catch (e: any) {
            toast.error(e.message || "Analysis failed.");
        } finally {
            setAnalyzing(false);
        }
    };

    const getWeatherIcon = (code: number, isDay: number = 1) => {
        if (code <= 3) return isDay ? <IconSun className="text-yellow-500" /> : <IconCloud className="text-gray-400" />;
        if (code <= 67) return <IconDroplet className="text-blue-500" />;
        return <IconAlertTriangle className="text-red-500" />;
    };

    if (loadingWeather) {
        return <div className="h-[50vh] flex items-center justify-center"><IconLoader className="animate-spin text-neutral-400" size={40} /></div>;
    }

    if (!weather || !weather.current) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-neutral-500">
                <IconAlertTriangle size={48} className="text-red-400" />
                <p className="text-lg font-medium">Unable to load weather data.</p>
                <p className="text-sm opacity-75 max-w-xs text-center">Please check your internet connection or try searching for a specific city.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium shadow-lg hover:scale-105 transition-transform"
                >
                    Retry
                </button>
            </div>
        );
    }

    const current = weather.current;
    const todayDaily = weather.daily;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Weather Insight</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Real-time forecast & AI-powered crop impact analysis.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto relative group items-center">
                    <div className="relative flex-1 md:flex-none">
                        <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors z-10" size={18} />
                        <Input
                            placeholder="Search city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 w-full md:w-64 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 transition-all ring-offset-0 focus:ring-2 focus:ring-blue-500/20 border-neutral-200 dark:border-neutral-700"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={searching}
                        className="bg-black text-white h-10 w-10 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        {searching ? <IconLoader className="animate-spin" size={18} /> : <IconSearch size={18} />}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Weather Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                {getWeatherIcon(current.weather_code, current.is_day)}
                                <span className="text-6xl font-bold">{current.temperature_2m}°C</span>
                            </div>
                            <p className="text-xl font-medium opacity-90">Feels like {current.apparent_temperature}°C</p>
                            <p className="opacity-75 flex items-center gap-2"><IconMapPin size={16} /> {cityName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            <WeatherDetail icon={<IconWind />} label="Wind" value={`${current.wind_speed_10m} km/h`} />
                            <WeatherDetail icon={<IconDroplet />} label="Humidity" value={`${current.relative_humidity_2m}%`} />
                            <WeatherDetail icon={<IconCloud />} label="Precipitation" value={`${current.precipitation} mm`} />
                            <WeatherDetail icon={<IconSun />} label="UV Index" value={`${todayDaily?.uv_index_max?.[0] || 'N/A'}`} />
                        </div>
                    </div>
                    <div className="absolute -right-20 -top-20 text-white opacity-10">
                        <IconCloud size={300} />
                    </div>
                </div>

                {/* Crop Impact Input */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white flex items-center gap-2">
                            <IconPlant className="text-green-500" />
                            Crop Impact Analysis
                        </h3>
                        <p className="text-sm text-neutral-500 mb-6">
                            Enter your active crops to get a personalized weather impact report.
                        </p>
                        <div className="mb-4">
                            <Input
                                placeholder="e.g. Rice, Tomato, Cotton"
                                value={crops}
                                onChange={(e) => setCrops(e.target.value)}
                                className="h-12 px-4 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <HoverBorderGradient
                            containerClassName="rounded-full w-full"
                            as="button"
                            className="bg-black text-white flex items-center justify-center space-x-2 px-8 py-3 w-full"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <>
                                    <IconLoader className="animate-spin w-5 h-5" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <IconAnalyze className="w-5 h-5" />
                                    <span>Generate Report</span>
                                </>
                            )}
                        </HoverBorderGradient>
                    </div>
                </div>
            </div>

            {/* 5 Day Forecast Row */}
            <div>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {todayDaily?.time.slice(0, 5).map((date: string, i: number) => (
                        <ForecastCard
                            key={date}
                            day={new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                            temp={`${Math.round(todayDaily.temperature_2m_max[i])}° / ${Math.round(todayDaily.temperature_2m_min[i])}°`}
                            icon={getWeatherIcon(todayDaily.weather_code[i])}
                            rain={`${todayDaily.precipitation_sum[i]}mm`}
                        />
                    ))}
                </div>
            </div>

            {/* Impact Report Section */}
            {impactReport && (
                <div ref={containerRef} className="space-y-8 py-10 w-full relative">
                    <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left duration-500">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                        <div>
                            <h3 className="text-3xl font-black text-neutral-800 dark:text-white tracking-tight">AI Impact Analysis</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Tap any card to view detailed insights for {crops}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImpactCard
                            title="Impact Summary"
                            type="warning"
                            icon={<IconAlertTriangle size={28} />}
                            content={impactReport.impact_summary}
                            onClick={() => setSelectedCard({ title: "Impact Summary", content: impactReport.impact_summary, type: "warning" })}
                        />
                        <ImpactCard
                            title="Positive Outlook"
                            type="success"
                            icon={<IconCheck size={28} />}
                            content={impactReport.positive_outlook || "No significant benefits noted."}
                            onClick={() => setSelectedCard({ title: "Positive Outlook", content: impactReport.positive_outlook || "No significant benefits noted.", type: "success" })}
                        />
                        <ImpactCard
                            title="Advisory"
                            type="info"
                            icon={<IconInfoCircle size={28} />}
                            content={impactReport.advisory}
                            onClick={() => setSelectedCard({ title: "Advisory", content: impactReport.advisory, type: "info" })}
                        />
                        <ImpactCard
                            title="Precautions"
                            type="danger"
                            icon={<IconAlertTriangle size={28} />}
                            content={impactReport.precautions}
                            onClick={() => setSelectedCard({ title: "Recommended Precautions", content: impactReport.precautions, type: "danger" })}
                        />
                    </div>
                </div>
            )}

            {/* Focus Modal Overlay */}
            {selectedCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedCard(null)}>
                    <div
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200 dark:border-neutral-800"
                    >
                        <div className={`p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between ${selectedCard.type === 'warning' ? 'bg-orange-50/50 dark:bg-orange-900/10' :
                            selectedCard.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' :
                                selectedCard.type === 'danger' ? 'bg-rose-50/50 dark:bg-rose-900/10' :
                                    'bg-blue-50/50 dark:bg-blue-900/10'
                            }`}>
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{selectedCard.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            >
                                <IconX size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {renderContent(selectedCard.content)}
                            </div>
                        </div>

                        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm hover:scale-105 transition-transform"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const renderContent = (content: any): React.ReactNode => {
    if (!content) return "N/A";
    if (typeof content === "string") return content;
    if (typeof content === "number") return content.toString();

    if (Array.isArray(content)) {
        return (
            <ul className="mt-2 space-y-1">
                {content.map((item: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1.5">•</span>
                        <span>{renderContent(item)}</span>
                    </li>
                ))}
            </ul>
        );
    }

    if (typeof content === "object") {
        return (
            <div className="space-y-3 mt-2">
                {Object.entries(content).map(([key, value]: [string, any], i: number) => (
                    <div key={i} className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                        <span className="font-bold capitalize text-neutral-800 dark:text-neutral-200 block mb-1">{key.replace(/_/g, ' ')}</span>
                        <div className="text-neutral-600 dark:text-neutral-300 pl-1">
                            {renderContent(value)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return String(content);
};

const WeatherDetail = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {icon}
        </div>
        <div>
            <p className="text-xs opacity-75">{label}</p>
            <p className="font-bold">{value}</p>
        </div>
    </div>
);

const ImpactCard = ({ title, type, icon, content, onClick }: { title: string, type: 'warning' | 'success' | 'info' | 'danger', icon: any, content: any, onClick: () => void }) => {
    const theme = {
        warning: {
            bg: 'bg-orange-50',
            gradient: 'from-orange-50 via-white to-orange-50/20 dark:from-orange-900/10 dark:via-neutral-900 dark:to-orange-900/5',
            text: 'text-orange-600 dark:text-orange-400',
            border: 'border-orange-100 dark:border-orange-900/30',
            bar: 'from-orange-500 to-red-500',
            shadow: 'hover:shadow-orange-500/20 shadow-orange-500/5'
        },
        success: {
            bg: 'bg-emerald-50',
            gradient: 'from-emerald-50 via-white to-emerald-50/20 dark:from-emerald-900/10 dark:via-neutral-900 dark:to-emerald-900/5',
            text: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-100 dark:border-emerald-900/30',
            bar: 'from-emerald-500 to-teal-500',
            shadow: 'hover:shadow-emerald-500/20 shadow-emerald-500/5'
        },
        info: {
            bg: 'bg-blue-50',
            gradient: 'from-blue-50 via-white to-blue-50/20 dark:from-blue-900/10 dark:via-neutral-900 dark:to-blue-900/5',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-100 dark:border-blue-900/30',
            bar: 'from-blue-500 to-cyan-500',
            shadow: 'hover:shadow-blue-500/20 shadow-blue-500/5'
        },
        danger: {
            bg: 'bg-rose-50',
            gradient: 'from-rose-50 via-white to-rose-50/20 dark:from-rose-900/10 dark:via-neutral-900 dark:to-rose-900/5',
            text: 'text-rose-600 dark:text-rose-400',
            border: 'border-rose-100 dark:border-rose-900/30',
            bar: 'from-rose-500 to-pink-500',
            shadow: 'hover:shadow-rose-500/20 shadow-rose-500/5'
        }
    }[type];

    return (
        <div
            onClick={onClick}
            className={`impact-card group relative overflow-hidden rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradient} transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-lg ${theme.shadow} cursor-pointer h-[240px] flex flex-col`}
        >
            {/* Top Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.bar}`} />

            {/* Massive Abstract Background Icon */}
            <div className={`absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05] transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-700 text-black dark:text-white pointer-events-none`}>
                {/* We clone the icon to make it huge */}
                <div className="scale-[5] origin-bottom-right">
                    {icon}
                </div>
            </div>

            <div className="p-6 relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm ${theme.text} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">{title}</h4>
                        <p className="text-xs font-medium opacity-50 uppercase tracking-wider mt-0.5">Click to expand</p>
                    </div>
                </div>

                {/* Content Preview */}
                <div className="relative flex-1">
                    <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-3 font-medium">
                        {typeof content === 'string' ? content : "Detailed breakdown available. Tap to read full report."}
                    </div>
                    {/* Fade Mask */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/80 dark:from-neutral-900/80 to-transparent" />
                </div>

                {/* Slide-in CTA */}
                <div className="mt-auto overflow-hidden h-8 relative">
                    <div className="absolute inset-0 flex items-center gap-2 text-sm font-bold opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ${theme.text}">
                        <span className={theme.text}>Read Full Analysis</span>
                        <IconArrowRight size={16} className={theme.text} />
                    </div>
                    <div className="absolute inset-0 flex items-center text-xs font-medium opacity-50 group-hover:translate-y-[-100%] transition-transform duration-500">
                        Tap for details
                    </div>
                </div>
            </div>
        </div>
    );
};

const ForecastCard = ({ day, temp, icon, rain }: { day: string, temp: string, icon: any, rain: string }) => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-shadow">
        <span className="text-neutral-500 text-sm font-medium">{day}</span>
        <div className="scale-125 my-2">{icon}</div>
        <span className="text-lg font-bold text-neutral-800 dark:text-white text-center">{temp}</span>
        <div className="flex items-center text-xs text-blue-500 font-medium">
            <IconDroplet size={12} className="mr-1" /> {rain}
        </div>
    </div>
);

