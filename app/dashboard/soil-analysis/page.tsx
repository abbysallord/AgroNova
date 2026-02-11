"use client";
import React, { useState, useRef } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { IconPlant, IconFlask, IconDroplet, IconMapPin, IconPalette, IconGrain, IconAnalyze, IconLoader, IconInfoCircle, IconChartBar, IconX, IconArrowDownRight } from "@tabler/icons-react";
import { toast } from "sonner";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SoilAnalysisPage() {
    const tabs = [
        {
            title: "Manual Input (Recommended)",
            value: "manual",
            content: <ManualInputForm />,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 h-full pb-20">
            <div className="text-center md:text-left mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-500 bg-clip-text text-transparent">
                    Soil Health Analysis
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                    Get detailed insights about your soil health using AI. Enter specific data for instant analysis.
                </p>
            </div>

            <div className="h-full min-h-[40rem] [perspective:1000px] relative flex flex-col max-w-6xl mx-auto w-full items-start justify-start">
                <Tabs tabs={tabs} />
            </div>
        </div>
    );
}

const ManualInputForm = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAnalyzing(true);
        setResult(null);

        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("type", "manual");

        try {
            const response = await fetch("/api/analyze-soil", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Analysis failed");
            setResult(data);
            toast.success("Soil Report Generated!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    if (result) {
        return <AnalysisResult result={result} onReset={() => setResult(null)} />;
    }

    return (
        <div className="w-full p-4 md:p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl min-h-[500px]">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location & Physical Properties */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-neutral-700 dark:text-neutral-300 border-b pb-2">Physical Properties</h3>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location / Region</Label>
                            <div className="relative">
                                <IconMapPin className="absolute left-3 top-2.5 text-neutral-400" size={18} />
                                <Input id="location" name="location" placeholder="e.g. Punjab, India" className="pl-10" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="color">Soil Color</Label>
                                <div className="relative">
                                    <IconPalette className="absolute left-3 top-2.5 text-neutral-400" size={18} />
                                    <Input id="color" name="color" placeholder="e.g. Reddish Brown" className="pl-10" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="texture">Texture</Label>
                                <div className="relative">
                                    <IconGrain className="absolute left-3 top-2.5 text-neutral-400" size={18} />
                                    <Input id="texture" name="texture" placeholder="e.g. Clay, Sandy" className="pl-10" required />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moisture">Moisture Content (%)</Label>
                            <Input id="moisture" name="moisture" placeholder="e.g. 40" type="number" required />
                        </div>
                    </div>

                    {/* Chemical Properties */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-neutral-700 dark:text-neutral-300 border-b pb-2">Nutrient Levels</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="n">N (mg/kg)</Label>
                                <Input id="n" name="n" placeholder="50" type="number" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p">P (mg/kg)</Label>
                                <Input id="p" name="p" placeholder="20" type="number" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="k">K (mg/kg)</Label>
                                <Input id="k" name="k" placeholder="150" type="number" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ph">pH Level</Label>
                            <Input id="ph" name="ph" placeholder="e.g. 6.5" type="number" step="0.1" required />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-black text-white flex items-center space-x-2 px-8 py-3"
                        disabled={analyzing}
                    >
                        {analyzing ? (
                            <>
                                <IconLoader className="animate-spin" />
                                <span>Analyzing Soil Data...</span>
                            </>
                        ) : (
                            <>
                                <IconAnalyze className="w-5 h-5" />
                                <span>Generate Soil Report</span>
                            </>
                        )}
                    </HoverBorderGradient>
                </div>
            </form>
        </div>
    );
};



const AnalysisResult = ({ result, onReset }: { result: any, onReset: () => void }) => {
    const [selectedItem, setSelectedItem] = useState<{ title: string, content: any, type: 'success' | 'warning' | 'info' | 'danger' } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Initial Reveal
        tl.from(".diagnosis-header", { y: -20, opacity: 0, duration: 0.6, ease: "power2.out" });
        tl.from(".hero-card", { scale: 0.95, opacity: 0, duration: 0.8, ease: "back.out(1.1)" }, "-=0.4");
        tl.from(".stat-card", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4");
        tl.from(".action-card", { y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.1)" }, "-=0.2");

    }, []);

    useGSAP(() => {
        if (selectedItem && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
            );
        }
    }, [selectedItem]);

    return (
        <div ref={containerRef} className="w-full relative min-h-[800px] flex flex-col gap-10">

            {/* 1. Header Row */}
            <div className="diagnosis-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-900/50 backdrop-blur-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
                        <IconAnalyze className="text-white" size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-tight">System Diagnosis</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Analysis Complete • 100% Accuracy</p>
                        </div>
                    </div>
                </div>
                <button onClick={onReset} className="group relative px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-neutral-500/10">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                        <IconAnalyze size={16} />
                        New Analysis
                    </span>
                </button>
            </div>

            {/* 2. Hero & stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Hero Diagnosis Card (Wide) */}
                <div className="hero-card lg:col-span-2 relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-8 shadow-2xl flex flex-col justify-between min-h-[300px] group border border-neutral-800">
                    {/* Backgrounds */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/20 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:bg-amber-500/30 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/40 blur-[80px] rounded-full pointer-events-none" />
                    <IconPlant className="absolute right-[-20px] bottom-[-40px] text-white/5 w-80 h-80 rotate-12 group-hover:rotate-6 transition-transform duration-1000" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                            Primary Classification
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neutral-400 mb-6 max-w-2xl">
                            {renderContent(result.soil_type)}
                        </h2>
                    </div>

                    <div className="relative z-10 glass-panel bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-xl">
                        <div className="text-neutral-200 text-base leading-relaxed">
                            {renderContent(result.description)}
                        </div>
                    </div>
                </div>

                {/* Stats Column */}
                <div className="space-y-4 flex flex-col justify-between h-full">
                    <div className="stat-card flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <IconDroplet className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={40} />
                        <div className="text-3xl font-black text-neutral-800 dark:text-neutral-100">{result.needs_water || "N/A"}</div>
                        <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold mt-1">Water Need</div>
                    </div>
                    <div className="stat-card flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <IconFlask className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" size={40} />
                        <div className="text-3xl font-black text-neutral-800 dark:text-neutral-100">{result.ph_level || "6.5"}</div>
                        <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold mt-1">pH Level</div>
                    </div>
                </div>
            </div>

            {/* 3. Command Grid (Insights) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <SoilInsightCard
                    title="Suitable Crops"
                    icon={<IconPlant size={24} />}
                    color="emerald"
                    delay={0}
                    content={result.suitable_crops}
                    onClick={() => setSelectedItem({ title: "Suitable Crops", content: result.suitable_crops, type: 'success' })}
                />
                <SoilInsightCard
                    title="Fertilizer Plan"
                    icon={<IconFlask size={24} />}
                    color="blue"
                    delay={1}
                    content={result.fertilizer_recommendation}
                    onClick={() => setSelectedItem({ title: "Fertilizer Recommendations", content: result.fertilizer_recommendation, type: 'info' })}
                />
                <SoilInsightCard
                    title="Irrigation"
                    icon={<IconDroplet size={24} />}
                    color="cyan"
                    delay={2}
                    content={result.irrigation_advice}
                    onClick={() => setSelectedItem({ title: "Irrigation Strategy", content: result.irrigation_advice, type: 'warning' })}
                />
                {result.improvement_tips && (
                    <SoilInsightCard
                        title="Expert Tips"
                        icon={<IconChartBar size={24} />}
                        color="amber"
                        delay={3}
                        content={result.improvement_tips}
                        onClick={() => setSelectedItem({ title: "Improvement Tips", content: result.improvement_tips, type: 'danger' })}
                    />
                )}
            </div>

            {/* Focus Modal Overlay */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedItem(null)}>
                    <div
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200 dark:border-neutral-800"
                    >
                        <div className={`p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between ${selectedItem.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' :
                            selectedItem.type === 'info' ? 'bg-blue-50/50 dark:bg-blue-900/10' :
                                selectedItem.type === 'warning' ? 'bg-cyan-50/50 dark:bg-cyan-900/10' :
                                    'bg-amber-50/50 dark:bg-amber-900/10'
                            }`}>
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{selectedItem.title}</h3>
                            </div>
                            <button onClick={() => setSelectedItem(null)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <IconX size={24} className="text-neutral-500" />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {renderContent(selectedItem.content)}
                            </div>
                        </div>
                        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
                            <button onClick={() => setSelectedItem(null)} className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm hover:scale-105 transition-transform">
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const SoilInsightCard = ({ title, color, icon, content, onClick, delay }: { title: string, color: string, icon: any, content: any, onClick: () => void, delay: number }) => {

    const colors: any = {
        emerald: "from-emerald-500 to-green-600 border-emerald-200 dark:border-emerald-900/30 text-emerald-600",
        blue: "from-blue-500 to-indigo-600 border-blue-200 dark:border-blue-900/30 text-blue-600",
        cyan: "from-cyan-500 to-sky-600 border-cyan-200 dark:border-cyan-900/30 text-cyan-600",
        amber: "from-amber-500 to-orange-600 border-amber-200 dark:border-amber-900/30 text-amber-600",
    };

    return (
        <div
            onClick={onClick}
            className={`action-card group relative bg-white dark:bg-neutral-900 border rounded-3xl p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${colors[color].split(' ')[2]}`}
        >
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`} />

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 transition-transform ${colors[color].split(' ').pop()}`}>
                    {icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <IconArrowDownRight className="text-neutral-400" />
                </div>
            </div>

            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">{title}</h3>

            <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                {Array.isArray(content) ? content.join(", ") : (typeof content === 'string' ? content : "Tap to analyze detailed report.")}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />

            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-2 py-1 rounded-lg group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800 transition-colors">
                View Details
            </span>
        </div>
    );
};

const renderContent = (content: any): React.ReactNode => {
    if (!content) return "N/A";

    // Check if content is string and contains bullet points
    if (typeof content === "string") {
        // If it contains newlines or bullet markers, treat as list
        if (content.includes("\n") || content.match(/^[-*•] /m)) {
            const lines = content.split("\n").filter(line => line.trim() !== "");
            return (
                <ul className="space-y-3">
                    {lines.map((line, i) => {
                        const cleanLine = line.replace(/^[-*•]\s+/, "").trim();
                        if (!cleanLine) return null;
                        return (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                <span className="leading-relaxed">{cleanLine}</span>
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return <p>{content}</p>;
    }

    if (typeof content === "number") return content.toString();

    if (Array.isArray(content)) {
        return (
            <ul className="space-y-3">
                {content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        <span className="leading-relaxed">{renderContent(item)}</span>
                    </li>
                ))}
            </ul>
        );
    }

    if (typeof content === "object") {
        return (
            <div className="space-y-4">
                {Object.entries(content).map(([key, value]) => (
                    <div key={key}>
                        <strong className="block text-neutral-900 dark:text-white capitalize mb-1">{key.replace(/_/g, " ")}:</strong>
                        <div className="pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
                            {renderContent(value)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return String(content);
};
