"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  History,
  AlertTriangle,
  Clock,
  Play
} from "lucide-react";

import { ProjectReport } from "@/lib/mockData";

interface DashboardAnalysisItem {
  id: string;
  url: string;
  domain: string;
  name: string;
  date: string;
  status: string;
  percent: number;
  error?: string;
  color: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [recentAnalyses, setRecentAnalyses] = useState<DashboardAnalysisItem[]>([]);

  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await fetch("/api/report");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Transform the retrieved reports to list item formats
        const reportsObj = data.reports as Record<string, ProjectReport>;
        const dynamicList = Object.values(reportsObj || {}).map((report) => ({
          id: report.id,
          url: report.url,
          domain: report.id,
          name: report.name,
          date: report.timestamp,
          status: "Completed",
          percent: 100,
          color: "text-success bg-success/10 border-success/20"
        }));

        // Merge with defaults (like Uber/Netflix which are mock failures/in-progress to show states)
        const staticList = [
          { id: "airbnb.com", url: "https://airbnb.com", domain: "airbnb.com", name: "Airbnb", date: "2026-06-24 13:50:00", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "swiggy.com", url: "https://swiggy.com", domain: "swiggy.com", name: "Swiggy", date: "2026-06-24 13:51:12", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "notion.so", url: "https://notion.so", domain: "notion.so", name: "Notion", date: "2026-06-24 13:52:45", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "stripe.com", url: "https://stripe.com", domain: "stripe.com", name: "Stripe", date: "2026-06-24 13:53:10", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "uber.com", url: "https://uber.com", domain: "uber.com", name: "Uber", date: "2026-06-24 10:12:05", status: "Failed", percent: 45, error: "Cloudflare WAF protection", color: "text-error bg-error/10 border-error/20" },
          { id: "netflix.com", url: "https://netflix.com", domain: "netflix.com", name: "Netflix", date: "2026-06-24 13:54:00", status: "Analyzing", percent: 75, color: "text-warning bg-warning/10 border-warning/20" }
        ];

        // Deduplicate: if item is in dynamic list, filter it out from static list
        const filteredStatic = staticList.filter(s => !dynamicList.some(d => d.id === s.id));
        const combined = [...dynamicList, ...filteredStatic];
        
        // Sort by date/timestamp descending
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentAnalyses(combined);
      } catch (err) {
        console.error("Error loading recent analyses", err);
        // Fallback to static list
        setRecentAnalyses([
          { id: "airbnb.com", url: "https://airbnb.com", domain: "airbnb.com", name: "Airbnb", date: "2026-06-24 13:50:00", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "swiggy.com", url: "https://swiggy.com", domain: "swiggy.com", name: "Swiggy", date: "2026-06-24 13:51:12", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "notion.so", url: "https://notion.so", domain: "notion.so", name: "Notion", date: "2026-06-24 13:52:45", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "stripe.com", url: "https://stripe.com", domain: "stripe.com", name: "Stripe", date: "2026-06-24 13:53:10", status: "Completed", percent: 100, color: "text-success bg-success/10 border-success/20" },
          { id: "uber.com", url: "https://uber.com", domain: "uber.com", name: "Uber", date: "2026-06-24 10:12:05", status: "Failed", percent: 45, error: "Cloudflare WAF protection", color: "text-error bg-error/10 border-error/20" },
          { id: "netflix.com", url: "https://netflix.com", domain: "netflix.com", name: "Netflix", date: "2026-06-24 13:54:00", status: "Analyzing", percent: 75, color: "text-warning bg-warning/10 border-warning/20" }
        ]);
      }
    }
    loadRecent();
  }, []);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      let formattedUrl = urlInput.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      router.push(`/dashboard/progress?url=${encodeURIComponent(formattedUrl)}`);
    } else {
      router.push("/dashboard/progress?url=https%3A%2F%2Fairbnb.com");
    }
  };

  const stats = [
    { label: "Total Reports Generated", value: "37", icon: Layers, detail: "+4 this week" },
    { label: "Inferred Database Tables", value: "142 Tables", icon: Database, detail: "Across all schemas" },
    { label: "Inferred Services", value: "24 Services", icon: Cpu, detail: "Microservices layout" },
    { label: "Active Crawler Pools", value: "3 Clusters", icon: Globe, detail: "Scans active globally" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">Workspace Dashboard</h1>
          <p className="text-xs text-secondary-text mt-1 font-sans">Submit web applications to infer layout structures, schemas, and systems details.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-card-bg border border-border-color p-5 rounded-xl flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-wider uppercase text-secondary-text">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[9px] text-muted-text">{stat.detail}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary-bg border border-border-color flex items-center justify-center text-secondary-text">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* URL Ingestion Panel */}
      <div className="bg-card-bg border border-border-color rounded-xl p-6 relative overflow-hidden shadow-sm font-sans">
        <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Play className="w-4 h-4 text-white" />
          New Analysis
        </h2>
        <p className="text-xs text-secondary-text max-w-2xl mb-6 font-sans">
          Input any target URL. The system runs sandbox crawls to map routing flows, infer backend systems architectures, and project database models.
        </p>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2 bg-secondary-bg p-1.5 border border-border-color rounded-xl max-w-2xl">
          <div className="flex-1 flex items-center px-3 gap-2">
            <Globe className="w-4 h-4 text-secondary-text" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter destination URL (e.g. airbnb.com)..."
              className="w-full bg-transparent border-0 focus:outline-none text-xs text-white placeholder-muted-text"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>Analyze Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-secondary-text">
          <span className="text-muted-text font-semibold">Templates:</span>
          <button onClick={() => { setUrlInput("airbnb.com"); }} className="hover:text-white transition-colors cursor-pointer">airbnb.com</button>
          <span className="text-border-color">•</span>
          <button onClick={() => { setUrlInput("swiggy.com"); }} className="hover:text-white transition-colors cursor-pointer">swiggy.com</button>
          <span className="text-border-color">•</span>
          <button onClick={() => { setUrlInput("notion.so"); }} className="hover:text-white transition-colors cursor-pointer">notion.so</button>
          <span className="text-border-color">•</span>
          <button onClick={() => { setUrlInput("stripe.com"); }} className="hover:text-white transition-colors cursor-pointer">stripe.com</button>
        </div>
      </div>

      {/* Recent Analyses list */}
      <div className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm font-sans">
        <div className="flex justify-between items-center mb-6 border-b border-border-color pb-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-secondary-text" />
            Recent Analyses
          </h2>
          <span className="text-[10px] text-muted-text font-semibold uppercase tracking-wider">{recentAnalyses.length} total sessions</span>
        </div>

        <div className="space-y-4">
          {recentAnalyses.map((analysis, idx) => {
            const isCompleted = analysis.status === "Completed";
            const isFailed = analysis.status === "Failed";
            const isAnalyzing = analysis.status === "Analyzing";

            return (
              <div
                key={idx}
                className="bg-card-bg border border-border-color p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white transition-all group shadow-sm"
              >
                {/* Site details */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary-bg border border-border-color flex items-center justify-center text-white">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{analysis.name}</span>
                      <span className="text-[10px] text-secondary-text">({analysis.domain})</span>
                    </div>
                    <span className="text-[9px] text-muted-text">{analysis.date}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-[9px] text-secondary-text font-semibold">
                    <span>Progress</span>
                    <span>{analysis.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary-bg border border-border-color rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFailed ? "bg-error" : isAnalyzing ? "bg-warning" : "bg-white"
                      }`}
                      style={{ width: `${analysis.percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status tag and action */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wider ${analysis.color}`}>
                    {analysis.status}
                  </div>

                  {isCompleted ? (
                    <Link
                      href={`/dashboard/report/${analysis.id}`}
                      className="px-3.5 py-1.5 bg-secondary-bg hover:bg-card-bg border border-border-color hover:border-white text-white rounded-lg text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : isFailed ? (
                    <span className="text-[10px] text-error/80 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{analysis.error}</span>
                    </span>
                  ) : (
                    <Link
                      href={`/dashboard/progress?url=${encodeURIComponent(analysis.url)}`}
                      className="px-3.5 py-1.5 bg-secondary-bg border border-border-color text-warning rounded-lg text-[10px] font-semibold cursor-pointer animate-pulse flex items-center gap-1"
                    >
                      <span>Track Progress</span>
                      <Clock className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
