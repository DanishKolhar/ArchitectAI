"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Clock,
  Activity,
  ArrowRight,
  Shield,
  FileText
} from "lucide-react";

interface PipelineStep {
  id: number;
  label: string;
  desc: string;
  logs: string[];
}

function ProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract domain name from URL query parameter
  const targetUrl = searchParams.get("url") || "https://airbnb.com";
  let targetDomain = "airbnb.com";
  try {
    const urlObj = new URL(targetUrl);
    targetDomain = urlObj.hostname.replace("www.", "");
  } catch {
    targetDomain = targetUrl.replace(/https?:\/\//i, "").split("/")[0] || "airbnb.com";
  }

  const [reportId, setReportId] = useState(targetDomain.toLowerCase().replace("www.", ""));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isError, setIsError] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{ time: string; text: string }[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Dynamic log builder based on target parameters
  const steps: PipelineStep[] = useMemo(() => [
    {
      id: 1,
      label: "Website Crawl",
      desc: "Booting browser and downloading raw pages",
      logs: []
    },
    {
      id: 2,
      label: "Screenshot Generation",
      desc: "Capturing responsive layouts viewport grids",
      logs: []
    },
    {
      id: 3,
      label: "Page Detection",
      desc: "Grouping layouts and identifying routing patterns",
      logs: []
    },
    {
      id: 4,
      label: "Feature Detection",
      desc: "Detecting functional blocks using component checks",
      logs: []
    },
    {
      id: 5,
      label: "User Flow Mapping",
      desc: "Compiling user transitions routes maps",
      logs: []
    },
    {
      id: 6,
      label: "Architecture Inference",
      desc: "Inferring service APIs structure based on actions",
      logs: []
    },
    {
      id: 7,
      label: "Database Inference",
      desc: "Constructing table structures and relationship schemas",
      logs: []
    },
    {
      id: 8,
      label: "Report Generation",
      desc: "Consolidating findings and compiling architecture docs",
      logs: []
    }
  ], []);

  // Analysis trigger effect
  useEffect(() => {
    let active = true;
    const startAnalysis = async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: targetUrl,
            depth: searchParams.get("depth") || "3",
            agent: searchParams.get("agent") || "ArchitectAI-Crawler/1.4",
            bypass: searchParams.get("bypass") === "true"
          })
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Analysis failed on backend server");
        }

        if (!res.body) {
          throw new Error("No response stream body available");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (active) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Save the last partial line back to the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (data.type === "log") {
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setConsoleLogs((prev) => [...prev, { time: timestamp, text: data.message }]);
                // Update active stepper index
                setCurrentStepIndex(data.step - 1);
              } else if (data.type === "complete") {
                setReportId(data.reportId);
                setIsFinished(true);
              } else if (data.type === "error") {
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setConsoleLogs((prev) => [...prev, { time: timestamp, text: `ERROR: ${data.message}` }]);
                setIsError(true);
                setIsFinished(true);
              }
            } catch (err) {
              console.error("Error parsing NDJSON line:", err);
            }
          }
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setConsoleLogs((prev) => [...prev, { time: timestamp, text: `FATAL ERROR: ${errMsg}` }]);
        setIsError(true);
        setIsFinished(true);
      }
    };

    startAnalysis();

    return () => {
      active = false;
    };
  }, [targetUrl, searchParams]);

  // Scroll console to bottom on update
  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Target status bar */}
      <div className="bg-card-bg border border-border-color p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Target Domain</span>
          <h1 className="text-sm font-semibold text-white mt-0.5">{targetUrl}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-secondary-bg border border-border-color text-white rounded-full text-[10px] flex items-center gap-1.5 font-semibold">
            <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
            Sandbox Cluster Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Vertical pipeline steppers */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card-bg border border-border-color rounded-xl p-5 space-y-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-color pb-3">
              Analysis Pipeline
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-color">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.id} className="relative flex gap-3 text-left">
                    {/* Step Icon Indicator */}
                    <div className="absolute -left-[22px] top-0 bg-card-bg rounded-full p-0.5 z-10">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                          <Loader2 className="w-3 h-3 text-black animate-spin" />
                        </div>
                      ) : (
                        <Clock className="w-4 h-4 text-muted-text" />
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="space-y-0.5">
                      <p
                        className={`text-xs font-semibold ${
                          isCompleted ? "text-success" : isCurrent ? "text-white" : "text-secondary-text"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-text leading-tight">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Console Log and Finish Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Activity Logger */}
          <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-sm flex flex-col h-[380px]">
            <div className="h-9 bg-secondary-bg border-b border-border-color flex items-center px-4 justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-white" />
                Activity Logs
              </span>
              <span className="text-[10px] text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Running</span>
            </div>

            <div className="flex-1 p-4 bg-black text-[11px] text-secondary-text space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="flex gap-4 items-start py-0.5 border-b border-border-color/30 last:border-b-0">
                  <span className="text-muted-text text-[10px] select-none font-medium flex-shrink-0 w-12">{log.time}</span>
                  <span className="text-white break-all">{log.text}</span>
                </div>
              ))}
              {/* Spinner if running */}
              {!isFinished && (
                <div className="flex items-center gap-2 text-white mt-2 py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing workspace specs data...</span>
                </div>
              )}
              <div ref={consoleBottomRef} />
            </div>
          </div>

          {/* Action completion prompt */}
          {isFinished ? (
            isError ? (
              <div className="bg-card-bg border border-error/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-semibold text-error flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-error" />
                    Analysis Failed
                  </p>
                  <p className="text-[11px] text-secondary-text">
                    The reverse engineering process encountered an error. Please verify your website and GEMINI_API_KEY.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/new")}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all w-full sm:w-auto justify-center"
                >
                  <span>Try Again</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-card-bg border border-success/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-semibold text-success flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Analysis Complete
                  </p>
                  <p className="text-[11px] text-secondary-text">
                    The reverse engineering process finished successfully with 99% heuristics validation.
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/report/${reportId}`)}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all w-full sm:w-auto justify-center"
                >
                  <span>View Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          ) : (
            <div className="bg-card-bg border border-border-color rounded-xl p-4 flex items-center justify-between text-xs text-secondary-text shadow-sm">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-white" />
                Audits running in secure environments
              </span>
              <span className="text-muted-text">Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24 text-xs text-secondary-text">
        <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
        Loading sandbox pipeline...
      </div>
    }>
      <ProgressContent />
    </Suspense>
  );
}
