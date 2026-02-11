"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FileUpload } from "@/components/ui/file-upload";
import { IconAnalyze, IconLeaf, IconVirus, IconMedicineSyrup, IconShieldCheck, IconAlertTriangle, IconCheck, IconInfoCircle, IconLoader, IconChartBar } from "@tabler/icons-react";
import { toast } from "sonner";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const safeRender = (value: any) => {
  if (typeof value === "string" || typeof value === "number") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) {
    return Object.values(value).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(". ");
  }
  return "";
};

export default function PestDetectionPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement as it's a div now

  useGSAP(() => {
    if (result) {
      // Staggered Entry
      gsap.from(".result-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
      });

      // Confidence Score Counter
      const numericScore = parseInt(result.confidence) || 0;
      if (scoreRef.current) {
        gsap.fromTo(scoreRef.current,
          { innerText: 0 },
          {
            innerText: numericScore,
            duration: 2,
            snap: { innerText: 1 },
            ease: "power2.out",
            onUpdate: function () {
              if (scoreRef.current) {
                scoreRef.current.innerText = Math.ceil(this.targets()[0].innerText) + "%";
              }
            }
          }
        );
      }
    }
  }, [result]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    setResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (files.length === 0) {
      toast.error("Please upload an image first");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", files[0]);

    try {
      const response = await fetch("/api/analyze-crop", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);

      if (data.error) {
        setError(data.error);
        setResult(null);
        if (data.error === "Not a crop image") {
          toast.error("Please upload a valid crop or plant image.");
        } else {
          toast.error(data.error);
        }
      } else {
        toast.success("Analysis complete!");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const isHealthy = result?.type === 'healthy';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20" ref={containerRef}>
      <div className="flex flex-col space-y-2 text-center mb-10">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          AI Pest Diagnosis
        </h2>
        <p className="text-muted-foreground text-lg">
          Upload a clear image of your crop for instant disease identification and expert remedies.
        </p>
      </div>

      <div className="w-full border-2 border-dashed bg-white/50 backdrop-blur-sm dark:bg-neutral-900/50 border-neutral-300 dark:border-neutral-700 rounded-3xl max-w-4xl mx-auto shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <FileUpload onChange={handleFileUpload} maxFiles={1} accept={{ 'image/*': [] }} />
      </div>

      <div className="flex justify-center my-8">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="bg-black text-white flex items-center space-x-2 px-10 py-4 text-lg font-medium"
          onClick={analyzeImage}
          disabled={analyzing || files.length === 0}
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
              <span>Analyzing Crop...</span>
            </>
          ) : (
            <>
              <IconAnalyze className="w-6 h-6" />
              <span>Run Diagnosis</span>
            </>
          )}
        </HoverBorderGradient>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-3 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto shadow-sm">
          <IconAlertTriangle size={24} />
          <span className="font-medium text-lg">{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Top Section: Split View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Left: Image Preview & Confidence */}
            <div className="md:col-span-5 result-card flex flex-col gap-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 aspect-square group">
                {files[0] && (
                  <img
                    src={URL.createObjectURL(files[0])}
                    alt="Uploaded Crop"
                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Confidence Score</p>
                  <div className="text-6xl font-black tabular-nums tracking-tighter" ref={scoreRef}>
                    0%
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Diagnosis Details */}
            <div
              className={cn(
                "md:col-span-7 result-card h-full min-h-[400px] rounded-3xl p-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl group border",
                isHealthy
                  ? "bg-emerald-950/40 border-emerald-500/20 hover:border-emerald-500/40"
                  : "bg-rose-950/40 border-rose-500/20 hover:border-rose-500/40"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="h-full flex flex-col justify-center relative z-10">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full self-start mb-6 border backdrop-blur-md shadow-lg",
                  isHealthy
                    ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-100"
                    : "bg-rose-500/20 border-rose-400/30 text-rose-100"
                )}>
                  {isHealthy ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {isHealthy ? "Healthy Crop" : `Severity: ${safeRender(result.severity)}`}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 text-balance drop-shadow-sm">
                  {safeRender(result.disease)}
                </h2>

                <div className="bg-neutral-950/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-inner">
                  <h3 className="text-white/60 font-bold mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                    <IconInfoCircle size={14} /> Observed Symptoms
                  </h3>
                  {Array.isArray(result.symptoms) ? (
                    <ul className="space-y-2">
                      {result.symptoms.map((symptom: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-lg text-white/90 font-medium animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-white/90 leading-relaxed font-medium">
                      {safeRender(result.symptoms)}
                    </p>
                  )}
                </div>
              </div>
              {/* Background Decor */}
              {isHealthy
                ? <IconLeaf className="absolute -right-10 -bottom-20 text-emerald-500/10 rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" size={400} />
                : <IconVirus className="absolute -right-10 -bottom-20 text-rose-500/10 rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" size={400} />
              }
            </div>
          </div>

          {/* Bottom Section: Treatment & Prevention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 match-height">

            {/* Treatment Card */}
            <div className="result-card bg-white dark:bg-neutral-900/50 backdrop-blur-md rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden group hover:border-blue-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <IconMedicineSyrup size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Recommended Cure</h3>
                </div>

                <div className="space-y-6">
                  {/* Check if we have ANY cure data */}
                  {(result?.cure && (
                    (Array.isArray(result.cure.chemical) && result.cure.chemical.length > 0) ||
                    (Array.isArray(result.cure.organic) && result.cure.organic.length > 0) ||
                    typeof result.cure === 'string' ||
                    typeof result.cure.chemical === 'string'
                  )) ? (
                    <>
                      {/* Chemical Cures */}
                      {(result.cure.chemical && (
                        (Array.isArray(result.cure.chemical) && result.cure.chemical.length > 0) ||
                        typeof result.cure.chemical === 'string'
                      )) && (
                          <div className="pl-4 border-l-4 border-blue-500/50 group-hover:border-blue-500 transition-colors duration-300">
                            <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm uppercase tracking-wide mb-3">Chemical Treatment</h4>
                            {Array.isArray(result.cure.chemical) ? (
                              <ul className="space-y-3">
                                {result.cure.chemical.map((item: string, i: number) => (
                                  <li key={i} className="checklist-item flex items-start gap-3 text-zinc-800 dark:text-zinc-200 text-base font-medium">
                                    <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 rounded-full p-0.5 shrink-0">
                                      <IconCheck size={14} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-zinc-800 dark:text-zinc-200 text-base leading-relaxed">{safeRender(result.cure.chemical)}</p>
                            )}
                          </div>
                        )}

                      {/* Organic Cures */}
                      {(result.cure.organic && (
                        (Array.isArray(result.cure.organic) && result.cure.organic.length > 0) ||
                        typeof result.cure.organic === 'string'
                      )) && (
                          <div className="pl-4 border-l-4 border-green-500/50 group-hover:border-green-500 transition-colors duration-300">
                            <h4 className="font-bold text-green-700 dark:text-green-400 text-sm uppercase tracking-wide mb-3">Organic Alternative</h4>
                            {Array.isArray(result.cure.organic) ? (
                              <ul className="space-y-3">
                                {result.cure.organic.map((item: string, i: number) => (
                                  <li key={i} className="checklist-item flex items-start gap-3 text-zinc-800 dark:text-zinc-200 text-base font-medium">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 rounded-full p-0.5 shrink-0">
                                      <IconLeaf size={14} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-zinc-800 dark:text-zinc-200 text-base leading-relaxed">{safeRender(result.cure.organic)}</p>
                            )}
                          </div>
                        )}

                      {/* Legacy Wrapper for string cure */}
                      {typeof result.cure === 'string' && (
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg font-medium">{safeRender(result.cure)}</p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-60">
                      <IconMedicineSyrup size={48} className="text-neutral-300 mb-2" />
                      <p className="text-neutral-500 italic">No specific cure information available.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
            </div>

            {/* Prevention Card */}
            <div className="result-card bg-white dark:bg-neutral-900/50 backdrop-blur-md rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden group hover:border-purple-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <IconShieldCheck size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Future Prevention</h3>
                </div>

                {(result?.prevention && (
                  (Array.isArray(result.prevention) && result.prevention.length > 0) ||
                  typeof result.prevention === 'string'
                )) ? (
                  Array.isArray(result.prevention) ? (
                    <ul className="space-y-3">
                      {result.prevention.map((item: string, i: number) => (
                        <li key={i} className="checklist-item flex items-start gap-3 text-zinc-800 dark:text-zinc-200 text-lg font-medium group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-300">
                          <div className="mt-1 bg-purple-100 dark:bg-purple-900/30 rounded-full p-0.5 shrink-0">
                            <IconCheck size={16} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg font-medium">
                      {safeRender(result.prevention)}
                    </p>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-60">
                    <IconShieldCheck size={48} className="text-neutral-300 mb-2" />
                    <p className="text-neutral-500 italic">No prevention tips available.</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
