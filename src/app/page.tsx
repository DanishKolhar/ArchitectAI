"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe,
  Database,
  Network,
  Cpu,
  Layers,
  FileText,
  Activity,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"pages" | "features" | "architecture" | "database">("pages");

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

  const steps = [
    { num: "01", name: "Paste URL", desc: "Enter any digital product's main link" },
    { num: "02", name: "Website Crawl", desc: "Automated analysis of structure & assets" },
    { num: "03", name: "Feature Mapping", desc: "Smart heuristic checks identify logical blocks" },
    { num: "04", name: "Architecture Inference", desc: "Inference of database models & microservices" },
    { num: "05", name: "Generate Report", desc: "Ready to review, share, or export instantly" }
  ];

  const features = [
    { icon: Globe, title: "Website Crawling", desc: "Scans pages, gathers assets distributions, and maps site routing trees." },
    { icon: Sparkles, title: "Feature Detection", desc: "Recognizes login blocks, checkouts, review sections, and billing integrations." },
    { icon: Network, title: "User Flow Mapping", desc: "Automatically reconstructs customer journeys through navigation analysis." },
    { icon: Cpu, title: "Architecture Inference", desc: "Estimates service API routing setups and microservices layouts." },
    { icon: Database, title: "Database Inference", desc: "Generates relational table schemas, key mappings, and datatypes." },
    { icon: Activity, title: "Infrastructure Estimation", desc: "Projects hosting requirements, bandwidth spikes, and cloud pricing." },
    { icon: FileText, title: "Document Export", desc: "Export specifications in structured markdown, PDF, or JSON." },
    { icon: Layers, title: "Competitor Benchmarking", desc: "Compares architecture schemas against industry standards. (Coming soon)", isComingSoon: true }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 flex flex-col font-sans antialiased">
      {/* Header Bar */}
      <header className="border-b border-border-color bg-black/70 backdrop-blur sticky top-0 z-50 h-14 flex items-center justify-between px-8 md:px-12">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="w-5.5 h-5.5 rounded bg-white flex items-center justify-center text-black">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            Architect<span className="text-zinc-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard/history" className="text-xs text-secondary-text hover:text-white transition-colors">
            Reports
          </Link>
          <Link href="/dashboard/pricing" className="text-xs text-secondary-text hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-xs px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black transition-all font-semibold cursor-pointer">
            Go to Workspace
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-28 px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col items-center text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-bg border border-border-color text-xs text-secondary-text mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Engine v1.4 Active</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl text-white leading-tight font-sans">
          Reverse Engineer Any Digital Product
        </h1>

        <p className="mt-6 text-sm md:text-lg text-secondary-text max-w-2xl leading-relaxed font-sans">
          Understand pages, features, architecture, databases, user flows, and infrastructure from any website.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleAnalyze} className="mt-10 w-full max-w-xl flex flex-col sm:flex-row gap-2 bg-card-bg p-1.5 border border-border-color rounded-xl shadow-lg">
          <div className="flex-1 flex items-center px-3 gap-2">
            <Globe className="w-4 h-4 text-muted-text" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL (e.g. airbnb.com)..."
              className="w-full bg-transparent border-0 focus:outline-none text-xs text-white placeholder-muted-text"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>Analyze Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-secondary-text">
          <span className="text-muted-text font-medium">Templates:</span>
          <button onClick={() => { setUrlInput("airbnb.com"); }} className="hover:text-white transition-colors cursor-pointer">airbnb.com</button>
          <span className="text-border-color">•</span>
          <button onClick={() => { setUrlInput("swiggy.com"); }} className="hover:text-white transition-colors cursor-pointer">swiggy.com</button>
          <span className="text-border-color">•</span>
          <button onClick={() => { setUrlInput("notion.so"); }} className="hover:text-white transition-colors cursor-pointer">notion.so</button>
          <span className="text-border-color">•</span>
          <button onClick={() => { setUrlInput("stripe.com"); }} className="hover:text-white transition-colors cursor-pointer">stripe.com</button>
        </div>

        {/* Hero Visual Mockup - Basedash Workspace style */}
        <div className="mt-20 w-full bg-card-bg border border-border-color rounded-xl shadow-2xl p-1 relative overflow-hidden">
          <div className="h-9 bg-secondary-bg border-b border-border-color flex items-center px-4 justify-between">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
            </div>
            <div className="text-[10px] font-semibold text-secondary-text uppercase tracking-wider">Workspace Preview</div>
            <div className="w-10"></div>
          </div>
          
          {/* Mockup Content Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-black text-left text-xs">
            {/* Column 1 - Pages discovered list */}
            <div className="bg-card-bg p-5 border border-border-color rounded-xl flex flex-col gap-4 shadow-sm">
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">Pages Discovered</span>
              <div className="space-y-2">
                <div className="p-2.5 bg-secondary-bg border border-border-color rounded-lg flex justify-between items-center text-[11px]">
                  <span>/home (Discover Listing)</span>
                  <span className="text-success text-[9px] bg-success/10 px-2 py-0.5 rounded font-semibold border border-success/20">Active</span>
                </div>
                <div className="p-2.5 bg-secondary-bg border border-border-color rounded-lg flex justify-between items-center text-[11px]">
                  <span>/search (Listing Map Grid)</span>
                  <span className="text-success text-[9px] bg-success/10 px-2 py-0.5 rounded font-semibold border border-success/20">Active</span>
                </div>
                <div className="p-2.5 bg-secondary-bg border border-border-color rounded-lg flex justify-between items-center text-[11px]">
                  <span>/rooms/[id] (Detail Panel)</span>
                  <span className="text-success text-[9px] bg-success/10 px-2 py-0.5 rounded font-semibold border border-success/20">Active</span>
                </div>
                <div className="p-2.5 bg-secondary-bg border border-border-color rounded-lg flex justify-between items-center text-[11px]">
                  <span>/checkout (Payment Escrow)</span>
                  <span className="text-success text-[9px] bg-success/10 px-2 py-0.5 rounded font-semibold border border-success/20">Active</span>
                </div>
              </div>
              <div className="mt-auto pt-2 border-t border-border-color text-muted-text text-[10px] flex justify-between">
                <span>Total pages: 5</span>
                <span>Confidence: 99%</span>
              </div>
            </div>

            {/* Column 2 - User Journey Flow Mockup */}
            <div className="bg-card-bg p-5 border border-border-color rounded-xl flex flex-col gap-4 lg:col-span-2 shadow-sm">
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">User Flow</span>
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-2 py-6">
                <div className="p-3 bg-secondary-bg border border-border-color rounded-xl text-center min-w-[110px] shadow-sm">
                  <p className="font-semibold text-white">Homepage</p>
                  <p className="text-[9px] text-secondary-text mt-0.5">Discovery Entry</p>
                </div>
                <span className="text-white font-bold">➔</span>
                <div className="p-3 bg-secondary-bg border border-white rounded-xl text-center min-w-[110px] shadow-sm">
                  <p className="font-semibold text-white">Search Grid</p>
                  <p className="text-[9px] text-secondary-text mt-0.5">Filter Map Query</p>
                </div>
                <span className="text-border-color font-bold">➔</span>
                <div className="p-3 bg-secondary-bg border border-border-color rounded-xl text-center min-w-[110px] shadow-sm">
                  <p className="font-semibold text-white">Checkout</p>
                  <p className="text-[9px] text-secondary-text mt-0.5">Stripe escrow hold</p>
                </div>
              </div>
              <div className="p-3.5 bg-black border border-border-color rounded-xl text-[10px] space-y-1">
                <p className="text-secondary-text leading-relaxed">
                  <span className="text-white font-bold">Inferred architecture:</span> Session data is managed via secure cookie payloads with edge middleware validation mechanisms.
                </p>
              </div>
            </div>

            {/* Row 2 - System Architecture Microservices Map */}
            <div className="bg-card-bg p-5 border border-border-color rounded-xl flex flex-col gap-4 lg:col-span-3 shadow-sm">
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">Inferred Architecture</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center text-[11px]">
                <div className="p-3.5 bg-secondary-bg border border-border-color rounded-xl">
                  <div className="text-white font-bold mb-0.5">Gateway API</div>
                  <div className="text-[9px] text-secondary-text">Kong Proxy</div>
                </div>
                <div className="p-3.5 bg-secondary-bg border border-border-color rounded-xl">
                  <div className="text-success font-bold mb-0.5">Auth Core</div>
                  <div className="text-[9px] text-secondary-text">Go Service</div>
                </div>
                <div className="p-3.5 bg-secondary-bg border border-border-color rounded-xl">
                  <div className="text-warning font-bold mb-0.5">Booking Engine</div>
                  <div className="text-[9px] text-secondary-text">Spring Boot</div>
                </div>
                <div className="p-3.5 bg-secondary-bg border border-border-color rounded-xl">
                  <div className="text-white font-bold mb-0.5">Payment Queue</div>
                  <div className="text-[9px] text-secondary-text">Ruby / RabbitMQ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border-color bg-secondary-bg">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center md:text-left mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-white">How it Works</h2>
            <p className="text-xs text-secondary-text mt-1">The pipeline translates any URL endpoint into structured architecture documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-card-bg border border-border-color rounded-xl p-5 relative flex flex-col justify-between group hover:border-white transition-all duration-200 shadow-sm">
                <div>
                  <div className="text-lg font-bold text-white mb-3">{step.num}</div>
                  <h3 className="text-xs font-semibold text-white">{step.name}</h3>
                  <p className="text-[11px] text-secondary-text mt-1 leading-normal">{step.desc}</p>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-border-color">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full bg-black">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-bold tracking-tight text-white">Platform Capabilities</h2>
          <p className="text-xs text-secondary-text mt-1 max-w-md mx-auto">Deep visual parsing scan suites running inside sandbox execution clusters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-card-bg border border-border-color rounded-xl p-5 flex flex-col justify-between hover:border-white transition-all group shadow-sm">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-secondary-bg border border-border-color flex items-center justify-center mb-5 text-secondary-text group-hover:text-white group-hover:border-white transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    {feature.title}
                    {feature.isComingSoon && (
                      <span className="text-[8px] bg-white/10 border border-white/20 text-white font-semibold px-1.5 py-0.5 rounded">Soon</span>
                    )}
                  </h3>
                  <p className="text-[11px] text-secondary-text mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Example Report Section */}
      <section className="py-24 border-t border-border-color bg-secondary-bg">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-white">Sample Specifications Report</h2>
            <p className="text-xs text-secondary-text mt-1">Review the reverse-engineered blueprints for airbnb.com</p>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-2xl">
            {/* Input display */}
            <div className="bg-secondary-bg border-b border-border-color px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-secondary-text uppercase tracking-wider">Target Endpoint:</span>
                <span className="text-[11px] font-bold text-white bg-white/10 border border-white/20 px-2.5 py-0.5 rounded">airbnb.com</span>
              </div>
              <div className="text-[10px] text-secondary-text">
                Scanned: 2026-06-24 13:50:00
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border-color overflow-x-auto bg-black">
              {(["pages", "features", "architecture", "database"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 text-xs border-r border-border-color hover:bg-card-bg cursor-pointer transition-colors whitespace-nowrap capitalize ${
                    activeTab === tab ? "bg-card-bg text-white border-b border-b-white font-semibold" : "text-secondary-text"
                  }`}
                >
                  {tab === "pages" ? "Pages Discovered" : tab === "features" ? "Detected Features" : tab === "architecture" ? "Architecture" : "Database Design"}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 bg-card-bg min-h-[220px] text-xs">
              {activeTab === "pages" && (
                <div className="space-y-3">
                  <div className="text-[10px] text-secondary-text uppercase font-semibold tracking-wider">Pages Discovered</div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5">•</span>
                      <div>
                        <strong>Home Page (/):</strong> Main user landing route containing geographical tags, filter blocks, search sliders.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5">•</span>
                      <div>
                        <strong>Search (/search):</strong> Listing search matrix mapping properties alongside interactive maps.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5">•</span>
                      <div>
                        <strong>Property Page (/rooms/[id]):</strong> Detail panels for listings with photo sets, reviews, host profiles.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5">•</span>
                      <div>
                        <strong>Checkout (/book):</strong> Dynamic invoice calculations, house validation forms, checkout pipelines.
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-3">
                  <div className="text-[10px] text-secondary-text uppercase font-semibold tracking-wider">Detected Features</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-secondary-bg border border-border-color rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-white">Authentication</strong>
                        <span className="text-success text-[10px] font-bold bg-success/10 border border-success/20 px-1.5 py-0.5 rounded">98% Confidence</span>
                      </div>
                      <p className="text-[11px] text-secondary-text mt-1 leading-normal">Client portal signups, host security profiles, validation checks.</p>
                    </div>
                    <div className="p-4 bg-secondary-bg border border-border-color rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-white">Escrow Payments</strong>
                        <span className="text-success text-[10px] font-bold bg-success/10 border border-success/20 px-1.5 py-0.5 rounded">97% Confidence</span>
                      </div>
                      <p className="text-[11px] text-secondary-text mt-1 leading-normal">Hold and release flow payouts to hosts via API triggers.</p>
                    </div>
                    <div className="p-4 bg-secondary-bg border border-border-color rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-white">Live Messaging</strong>
                        <span className="text-success text-[10px] font-bold bg-success/10 border border-success/20 px-1.5 py-0.5 rounded">92% Confidence</span>
                      </div>
                      <p className="text-[11px] text-secondary-text mt-1 leading-normal">Real-time message routing between guests and hosts via WebSockets.</p>
                    </div>
                    <div className="p-4 bg-secondary-bg border border-border-color rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-white">Geo-Spatial Catalog</strong>
                        <span className="text-success text-[10px] font-bold bg-success/10 border border-success/20 px-1.5 py-0.5 rounded">95% Confidence</span>
                      </div>
                      <p className="text-[11px] text-secondary-text mt-1 leading-normal">Map location boundaries matching client search clusters.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "architecture" && (
                <div className="space-y-3">
                  <div className="text-[10px] text-secondary-text uppercase font-semibold tracking-wider">Architecture</div>
                  <div className="p-4 bg-secondary-bg border border-border-color rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between border-b border-border-color pb-2 text-[10px] text-white font-bold uppercase tracking-wider">
                      <span>Service Name</span>
                      <span>Technology</span>
                      <span>Role</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-0.5">
                      <span className="font-semibold text-white">Auth Service</span>
                      <span className="text-secondary-text">Go / Auth0</span>
                      <span className="text-secondary-text">Identity verification</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-0.5">
                      <span className="font-semibold text-white">Booking Engine</span>
                      <span className="text-secondary-text">Java / Spring Boot</span>
                      <span className="text-secondary-text">Transactional state lock</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-0.5">
                      <span className="font-semibold text-white">Review Pipeline</span>
                      <span className="text-secondary-text">Node.js / PostgreSQL</span>
                      <span className="text-secondary-text">Dual-blind reviews logic</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-0.5">
                      <span className="font-semibold text-white">Payment Router</span>
                      <span className="text-secondary-text">Ruby on Rails</span>
                      <span className="text-secondary-text">Split payouts escrow</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "database" && (
                <div className="space-y-3">
                  <div className="text-[10px] text-secondary-text uppercase font-semibold tracking-wider">Database Design</div>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="p-4 bg-secondary-bg border border-border-color rounded-xl">
                      <div className="text-white font-semibold mb-1 uppercase tracking-wider">TABLE: users</div>
                      <div className="text-secondary-text space-y-1 mt-2">
                        <p>• id (UUID) [PK]</p>
                        <p>• email (VARCHAR)</p>
                        <p>• full_name (VARCHAR)</p>
                        <p>• is_host (BOOLEAN)</p>
                      </div>
                    </div>
                    <div className="p-4 bg-secondary-bg border border-border-color rounded-xl">
                      <div className="text-white font-semibold mb-1 uppercase tracking-wider">TABLE: bookings</div>
                      <div className="text-secondary-text space-y-1 mt-2">
                        <p>• id (UUID) [PK]</p>
                        <p>• property_id (UUID) [FK]</p>
                        <p>• guest_id (UUID) [FK]</p>
                        <p>• status (VARCHAR)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="border-t border-border-color bg-black py-12 text-xs text-secondary-text mt-auto">
        <div className="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="font-semibold text-white">ArchitectAI</span>
            <span>- © 2026. Workspace registry.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
            <Link href="/dashboard/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/dashboard/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
