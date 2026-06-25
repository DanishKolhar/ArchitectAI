"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  ArrowRight,
  Settings2,
  Sliders,
  Info
} from "lucide-react";

export default function NewAnalysisPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("3");
  const [userAgent, setUserAgent] = useState("ArchitectAI-Crawler/1.4");
  const [bypassWaf, setBypassWaf] = useState(true);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      let formattedUrl = urlInput.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      router.push(
        `/dashboard/progress?url=${encodeURIComponent(
          formattedUrl
        )}&depth=${crawlDepth}&agent=${encodeURIComponent(userAgent)}&bypass=${bypassWaf}`
      );
    } else {
      router.push("/dashboard/progress?url=https%3A%2F%2Fairbnb.com");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-sans">New Analysis</h1>
        <p className="text-xs text-secondary-text mt-1 font-sans">Configure and spin up a new automated reverse engineering analysis scan.</p>
      </div>

      {/* Main Form Box */}
      <div className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <form onSubmit={handleAnalyze} className="space-y-6 font-sans">
          
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-white" />
              Target Destination URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2 bg-secondary-bg p-1.5 border border-border-color rounded-xl">
              <div className="flex-1 flex items-center px-3 gap-2">
                <span className="text-xs text-muted-text">https://</span>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="airbnb.com"
                  className="w-full bg-transparent border-0 focus:outline-none text-xs text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-text font-sans">
              Make sure you have scanning permissions for the target domain name. Scans run on isolated nodes.
            </p>
          </div>

          <div className="h-px bg-border-color"></div>

          {/* Crawler Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Depth Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-secondary-text" />
                Max Crawl Depth
              </label>
              <select
                value={crawlDepth}
                onChange={(e) => setCrawlDepth(e.target.value)}
                className="w-full h-10 bg-secondary-bg border border-border-color rounded-lg px-3 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="1">1 page link (Entry page only)</option>
                <option value="3">3 page links (Recommended default)</option>
                <option value="5">5 page links (Deep audit)</option>
                <option value="10">10 page links (Comprehensive site crawl)</option>
              </select>
            </div>

            {/* Custom User Agent */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-secondary-text" />
                User-Agent Request String
              </label>
              <input
                type="text"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="w-full h-10 bg-secondary-bg border border-border-color rounded-lg px-3 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            {/* Smart Bypass Checkbox */}
            <div className="flex items-center gap-3 bg-secondary-bg border border-border-color p-4 rounded-xl md:col-span-2">
              <input
                type="checkbox"
                id="bypass"
                checked={bypassWaf}
                onChange={(e) => setBypassWaf(e.target.checked)}
                className="w-4 h-4 accent-white rounded bg-card-bg cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="bypass" className="text-xs font-semibold text-white block cursor-pointer">
                  Smart firewall bypass middleware
                </label>
                <span className="text-[10px] text-muted-text font-sans">
                  Routes requests through rotating proxy connections to bypass Cloudflare and static CDN blockers.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Redesigned Info Guidelines Card */}
      <div className="bg-card-bg border border-border-color rounded-xl p-5 shadow-sm flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-white font-sans">Audit Sandbox Environment</h4>
          <p className="text-[11px] text-secondary-text leading-relaxed font-sans">
            The platform schedules scans on container nodes loading headless instances. Once crawler loops trace internal layouts, schemas are generated and structured in standard data reports.
          </p>
        </div>
      </div>
    </div>
  );
}
