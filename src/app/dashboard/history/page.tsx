"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react";

import { ProjectReport } from "@/lib/mockData";

interface HistoryReportItem {
  id: string;
  name: string;
  domain: string;
  industry: string;
  date: string;
  pages: number;
  features: number;
  status: string;
  size: string;
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [reports, setReports] = useState<HistoryReportItem[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/report");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Transform the retrieved reports to history row format
        const reportsObj = data.reports as Record<string, ProjectReport>;
        const dynamicList = Object.values(reportsObj || {}).map((report) => ({
          id: report.id,
          name: report.name,
          domain: report.id,
          industry: report.industry,
          date: report.timestamp,
          pages: report.pagesCount || (report.pages || []).length,
          features: report.featuresCount || (report.features || []).length,
          status: "Completed",
          size: "340KB"
        }));

        const staticList = [
          { id: "airbnb.com", name: "Airbnb", domain: "airbnb.com", industry: "Hospitality & Vacation Rentals", date: "2026-06-24 13:50:00", pages: 5, features: 8, status: "Completed", size: "320KB" },
          { id: "swiggy.com", name: "Swiggy", domain: "swiggy.com", industry: "Food Delivery & Hyperlocal Commerce", date: "2026-06-24 13:51:12", pages: 6, features: 7, status: "Completed", size: "290KB" },
          { id: "notion.so", name: "Notion", domain: "notion.so", industry: "Productivity & Collaboration Software", date: "2026-06-24 13:52:45", pages: 4, features: 6, status: "Completed", size: "410KB" },
          { id: "stripe.com", name: "Stripe", domain: "stripe.com", industry: "Financial Infrastructure & Payments", date: "2026-06-24 13:53:10", pages: 5, features: 8, status: "Completed", size: "380KB" }
        ];

        // Deduplicate: if item is in dynamic list, filter it out from static list
        const filteredStatic = staticList.filter(s => !dynamicList.some(d => d.id === s.id));
        const combined = [...dynamicList, ...filteredStatic];

        // Sort by date/timestamp descending
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReports(combined);
      } catch (err) {
        console.error("Error loading reports history", err);
        setReports([
          { id: "airbnb.com", name: "Airbnb", domain: "airbnb.com", industry: "Hospitality & Vacation Rentals", date: "2026-06-24 13:50:00", pages: 5, features: 8, status: "Completed", size: "320KB" },
          { id: "swiggy.com", name: "Swiggy", domain: "swiggy.com", industry: "Food Delivery & Hyperlocal Commerce", date: "2026-06-24 13:51:12", pages: 6, features: 7, status: "Completed", size: "290KB" },
          { id: "notion.so", name: "Notion", domain: "notion.so", industry: "Productivity & Collaboration Software", date: "2026-06-24 13:52:45", pages: 4, features: 6, status: "Completed", size: "410KB" },
          { id: "stripe.com", name: "Stripe", domain: "stripe.com", industry: "Financial Infrastructure & Payments", date: "2026-06-24 13:53:10", pages: 5, features: 8, status: "Completed", size: "380KB" }
        ]);
      }
    }
    loadReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === "all" || report.industry.includes(filterIndustry);
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-sans">Analysis History</h1>
        <p className="text-xs text-secondary-text mt-1 font-sans">Audit log of all reverse-engineered digital products.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card-bg border border-border-color p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input
            type="text"
            placeholder="Search reports by domain or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-secondary-bg border border-border-color rounded-lg pl-10 pr-4 text-xs text-white placeholder-muted-text focus:outline-none focus:border-white font-sans"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto font-sans">
          <div className="relative flex-1 md:flex-none">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="w-full md:w-52 h-9 bg-secondary-bg border border-border-color rounded-lg pl-10 pr-4 text-xs text-white focus:outline-none focus:border-white cursor-pointer font-sans"
            >
              <option value="all">All Industries</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Food Delivery">Food Delivery</option>
              <option value="Productivity">Productivity</option>
              <option value="Financial">Financial Infrastructure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Listing Table */}
      <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-sm font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-color bg-secondary-bg text-secondary-text">
                <th className="p-4 font-semibold font-sans">Domain</th>
                <th className="p-4 font-semibold font-sans">Industry</th>
                <th className="p-4 font-semibold font-sans">Routes</th>
                <th className="p-4 font-semibold font-sans">Features</th>
                <th className="p-4 font-semibold font-sans">Report Size</th>
                <th className="p-4 font-semibold font-sans">Status</th>
                <th className="p-4 text-right font-semibold font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-card-bg">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-secondary-bg/50 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-white" />
                        <span>{report.domain}</span>
                      </div>
                    </td>
                    <td className="p-4 text-secondary-text">{report.industry}</td>
                    <td className="p-4 text-white">{report.pages} pages</td>
                    <td className="p-4 text-white">{report.features} features</td>
                    <td className="p-4 text-secondary-text">{report.size}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/dashboard/report/${report.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-bg border border-border-color hover:border-white text-white rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
                      >
                        <span>Open Report</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-text font-sans text-xs">
                    No reports match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
