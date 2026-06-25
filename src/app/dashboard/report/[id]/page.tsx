"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Download,
  CheckCircle2,
  ArrowLeft,
  Server,
  Zap,
  Loader2
} from "lucide-react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { mockProjects, ProjectReport, FlowNode, FlowEdge } from "@/lib/mockData";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [project, setProject] = useState<ProjectReport | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Fetch dynamic report from API, fallback to mock template
  useEffect(() => {
    let active = true;
    async function loadReport() {
      try {
        const res = await fetch(`/api/report?id=${reportId}`);
        if (!res.ok) throw new Error("Report load failed");
        const data = await res.json();
        if (active && data.report) {
          setProject(data.report);
          setNodes(data.report.flowNodes || []);
          setEdges(data.report.flowEdges || []);
          setSelectedNode(null);
        }
      } catch (err) {
        console.error("Failed to load dynamic report, falling back to static mock data", err);
        const fallback = mockProjects[reportId] || mockProjects["airbnb.com"];
        if (active) {
          setProject(fallback);
          setNodes(fallback.flowNodes || []);
          setEdges(fallback.flowEdges || []);
          setSelectedNode(null);
        }
      }
    }

    loadReport();
    return () => {
      active = false;
    };
  }, [reportId]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs text-secondary-text font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-white mb-2" />
        Loading dynamic specification report...
      </div>
    );
  }

  // Export JSON function
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `architect_ai_spec_${project.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Markdown function
  const handleExportMarkdown = () => {
    const mdContent = `# ArchitectAI Spec Report: ${project.name}
Generated: ${project.timestamp}
URL: ${project.url}
Industry: ${project.industry}
Product Type: ${project.productType}

## Pages Discovered (${project.pagesCount})
${project.pages.map((p) => `- **${p.name}**: ${p.purpose}`).join("\n")}

## Detected Features (${project.featuresCount})
${project.features.map((f) => `- **${f.name}** (Confidence: ${f.confidence}%): ${f.description}`).join("\n")}

## Backend Architecture
${project.services.map((s) => `- **${s.name}** (${s.tech}): ${s.purpose}`).join("\n")}

## Database Design
${project.tables
  .map(
    (t) => `### Table: ${t.name}
${t.columns.map((c) => `  - ${c.name} (${c.type})${c.key ? ` [${c.key}${c.refTable ? ` -> ${c.refTable}` : ""}]` : ""}`).join("\n")}`
  )
  .join("\n\n")}

## Recommended Stack
${project.techStack.map((ts) => `- **${ts.category}**: ${ts.name} (${ts.reason})`).join("\n")}
`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `architect_ai_spec_${project.id}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveReport = () => {
    alert(`Report for ${project.name} has been archived in workspace registry.`);
  };

  const totalMonthlyCost = project.costs.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 font-sans">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 bg-card-bg hover:bg-secondary-bg border border-border-color rounded-xl text-secondary-text hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-sans">{project.name} Report</h1>
              <span className="text-[10px] bg-success/10 border border-success/20 text-success font-semibold px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
            <p className="text-xs text-secondary-text mt-0.5 font-sans">Automated architecture blueprints and specifications summary.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-text">Scanned: {project.timestamp}</span>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-4 border-b border-border-color pb-2 tracking-wide font-sans">
          Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 font-sans">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Website URL</p>
            <p className="text-xs font-semibold text-white whitespace-normal break-words">{project.url}</p>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Industry</p>
            <p className="text-xs font-semibold text-white whitespace-normal break-words">{project.industry}</p>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Product Type</p>
            <p className="text-xs font-semibold text-white whitespace-normal break-words">{project.productType}</p>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Pages Discovered</p>
            <p className="text-xs font-semibold text-white whitespace-normal break-words">{project.pagesCount} templates</p>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Features Mapped</p>
            <p className="text-xs font-semibold text-white whitespace-normal break-words">{project.featuresCount} modules</p>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Crawl Runtime</p>
            <p className="text-xs font-semibold text-success whitespace-normal break-words">1.8s</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: PAGES DISCOVERED */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-4 border-b border-border-color pb-2 tracking-wide font-sans">
          Pages Discovered
        </h3>
        <div className="space-y-3 font-sans">
          {project.pages.map((page, idx) => {
            // Infer simple slug from page name
            let inferredSlug = "/";
            const lowerName = page.name.toLowerCase();
            if (lowerName.includes("auth") || lowerName.includes("login") || lowerName.includes("signin")) {
              inferredSlug = "/auth";
            } else if (lowerName.includes("settings") || lowerName.includes("console")) {
              inferredSlug = "/settings";
            } else if (lowerName.includes("search") || lowerName.includes("explore") || lowerName.includes("listing")) {
              inferredSlug = "/search";
            } else if (lowerName.includes("checkout") || lowerName.includes("pay") || lowerName.includes("book")) {
              inferredSlug = "/checkout";
            } else if (lowerName.includes("rooms") || lowerName.includes("room") || lowerName.includes("product") || lowerName.includes("item")) {
              inferredSlug = "/rooms/[id]";
            } else if (lowerName.includes("detail")) {
              inferredSlug = "/detail";
            } else if (lowerName.includes("dashboard") || lowerName.includes("home")) {
              inferredSlug = "/dashboard";
            }
            
            return (
              <div key={idx} className="bg-secondary-bg border border-border-color p-4 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-white transition-all shadow-sm">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-white">{page.name}</span>
                    <span className="text-[10px] bg-card-bg text-secondary-text px-2 py-0.5 rounded font-mono border border-border-color">
                      {inferredSlug}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary-text leading-relaxed whitespace-normal break-words">{page.purpose}</p>
                  {page.screenshotDesc && (
                    <p className="text-[10px] text-muted-text font-medium whitespace-normal break-words">
                      <span className="text-secondary-text font-semibold">Visual Layout:</span> {page.screenshotDesc}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 md:self-start">
                  <span className="text-[9px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: DETECTED FEATURES */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-4 border-b border-border-color pb-2 tracking-wide font-sans">
          Detected Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          {project.features.map((feat, idx) => (
            <div key={idx} className="bg-card-bg border border-border-color p-4 rounded-xl flex flex-col justify-between h-auto min-w-0 shadow-sm flex-grow">
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center gap-2 border-b border-border-color/30 pb-2 mb-2">
                  <span className="text-xs font-semibold text-white whitespace-normal break-words min-w-0">{feat.name}</span>
                  <span className="text-[9px] font-semibold text-white bg-white/10 border border-white/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {feat.confidence}% Match
                  </span>
                </div>
                <p className="text-[11px] text-secondary-text leading-6 whitespace-normal break-words flex-grow">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: USER JOURNEY FLOW */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 flex flex-col shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-color pb-3 mb-4">
          <h3 className="text-xs font-semibold text-white tracking-wide font-sans">
            User Journey Flow
          </h3>
          <span className="text-[9px] text-muted-text font-sans">Zoom with scroll. Click any node below to inspect details.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans">
          {/* React Flow Board */}
          <div className="lg:col-span-3 h-[320px] bg-secondary-bg border border-border-color rounded-xl overflow-hidden relative shadow-inner">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodeClick={(_, node) => setSelectedNode(node.id)}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
            >
              <Background color="#1F1F1F" gap={16} size={0.5} />
              <Controls className="bg-card-bg border border-border-color text-white rounded p-1 fill-white [&_button]:bg-card-bg [&_button]:text-white [&_button]:border-0 [&_svg]:fill-white" />
            </ReactFlow>
          </div>

          {/* Flow detail panel */}
          <div className="lg:col-span-1 bg-card-bg border border-border-color p-4 rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[9px] uppercase text-muted-text font-semibold tracking-wider block mb-2">Step Details</span>
              {selectedNode ? (
                (() => {
                  const nodeObj = project.flowNodes.find((n) => n.id === selectedNode);
                  return (
                    <div className="space-y-3 font-sans">
                      <p className="text-xs font-semibold text-white">{nodeObj?.data.label}</p>
                      <p className="text-[11px] text-white leading-relaxed">{nodeObj?.data.description}</p>
                      <div className="h-px bg-border-color/50"></div>
                      <p className="text-[9px] text-muted-text">State: <span className="text-success font-semibold">Active</span></p>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-[10px] text-muted-text leading-relaxed font-sans">
                  Select any step block in the user journey flow diagram to review detailed metrics.
                </div>
              )}
            </div>
            {selectedNode && (
              <button
                onClick={() => setSelectedNode(null)}
                className="mt-4 w-full py-1.5 bg-secondary-bg border border-border-color hover:border-white text-[10px] font-semibold rounded-lg text-secondary-text hover:text-white cursor-pointer transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: ARCHITECTURE */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-4 border-b border-border-color pb-2 tracking-wide font-sans">
          Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
          {project.services.map((service, idx) => (
            <div key={idx} className="bg-card-bg border border-border-color p-4 rounded-xl relative overflow-hidden flex flex-col justify-between group hover:border-white transition-colors shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold text-white">{service.name}</span>
                  <span className="text-[9px] font-semibold text-white bg-white/10 border border-white/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {service.tech}
                  </span>
                </div>
                <p className="text-[11px] text-secondary-text leading-relaxed">{service.purpose}</p>
              </div>

              {service.dependencies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border-color/30">
                  <span className="text-[9px] uppercase text-muted-text font-semibold tracking-wider block mb-1.5">Databases</span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.dependencies.map((dep, dIdx) => (
                      <span key={dIdx} className="px-2 py-0.5 bg-secondary-bg border border-border-color text-secondary-text text-[9px] rounded-lg">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: DATABASE DESIGN */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-4 border-b border-border-color pb-2 tracking-wide font-sans">
          Database Design
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {project.tables.map((table, tIdx) => (
            <div key={tIdx} className="bg-card-bg border border-border-color rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
              {/* Table header */}
              <div className="bg-secondary-bg px-4 py-2 border-b border-border-color flex justify-between items-center">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-white" />
                  {table.name}
                </span>
                <span className="text-[9px] text-muted-text font-medium">Table Schema</span>
              </div>

              {/* Column list */}
              <div className="p-3 text-[10px] space-y-1.5 flex-1 bg-card-bg">
                {table.columns.map((col, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center hover:bg-secondary-bg px-1 py-0.5 rounded transition-colors">
                    <span className="flex items-center gap-1.5">
                      {col.key === "PK" ? (
                        <span className="text-[8px] bg-white/20 text-white font-bold px-1 rounded flex-shrink-0">PK</span>
                      ) : col.key === "FK" ? (
                        <span className="text-[8px] bg-warning/20 text-warning font-bold px-1 rounded flex-shrink-0">FK</span>
                      ) : (
                        <span className="w-[13px]"></span>
                      )}
                      <span className="text-white font-semibold">{col.name}</span>
                    </span>
                    <span className="text-secondary-text">
                      {col.type}
                      {col.refTable && <span className="text-warning text-[9px] ml-1">➔ {col.refTable}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: INFRASTRUCTURE ESTIMATES */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-6 border-b border-border-color pb-2 tracking-wide font-sans">
          Infrastructure Estimates
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Metrics Column */}
          <div className="lg:col-span-1 space-y-4">
            {project.infraMetrics.map((metric, idx) => (
              <div key={idx} className="bg-card-bg border border-border-color p-4 rounded-xl shadow-sm">
                <p className="text-[9px] uppercase font-bold text-muted-text tracking-wider">{metric.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-lg font-bold text-white">{metric.value}</p>
                </div>
                <p className="text-[10px] text-secondary-text mt-1 leading-normal">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Column */}
          <div className="lg:col-span-2 bg-card-bg border border-border-color rounded-xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-[#1F1F1F] pb-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Estimated Cloud Cost Allocation</span>
                <span className="text-sm font-semibold text-white">${totalMonthlyCost}/mo</span>
              </div>

              <div className="space-y-3 font-sans">
                {project.costs.map((cost, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white">{cost.category} <span className="text-muted-text text-[10px]">({cost.resource})</span></span>
                      <span className="text-secondary-text font-bold">${cost.cost}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${(cost.cost / totalMonthlyCost) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3.5 bg-secondary-bg border border-border-color rounded-xl flex items-center gap-3">
              <Server className="w-5 h-5 text-white flex-shrink-0" />
              <p className="text-[10px] text-secondary-text leading-normal font-sans">
                Projections are calculated based on standard cloud providers enterprise lists. Actual budgets will fluctuate according to workload configurations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: RECOMMENDED TECH STACK */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-white mb-4 border-b border-border-color pb-2 tracking-wide font-sans">
          Recommended Tech Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
          {project.techStack.map((tech, idx) => (
            <div key={idx} className="bg-card-bg border border-border-color p-4 rounded-xl flex flex-col justify-between shadow-sm">
              <div className="space-y-2 font-sans">
                <p className="text-[9px] uppercase font-bold text-muted-text tracking-wider">{tech.category}</p>
                <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-white" />
                  {tech.name}
                </p>
                <p className="text-[11px] text-secondary-text leading-relaxed">{tech.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: EXPORTS */}
      <section className="bg-card-bg border border-border-color rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm font-sans">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-semibold text-white">Export Options</h4>
          <p className="text-[11px] text-secondary-text font-sans">Download this specifications report as clean Markdown, JSON, or save in history.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto font-sans">
          <button
            onClick={handleExportMarkdown}
            className="px-4 py-2 bg-secondary-bg border border-border-color hover:border-white text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-secondary-bg border border-border-color hover:border-white text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleSaveReport}
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm font-semibold"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Report</span>
          </button>
        </div>
      </section>
    </div>
  );
}
