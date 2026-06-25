"use client";

import React, { useState } from "react";
import {
  Key,
  Webhook,
  Sliders,
  Save,
  CheckCircle2,
  Copy
} from "lucide-react";

export default function SettingsPage() {
  const [activeSettingsTab, setActiveSettingsTab] = useState<"api" | "webhook" | "crawler">("api");
  
  const apiKey = "arc_live_51N2xH3k891LpQz09a8s7d8f9g8h7j6k";
  const [showKey, setShowKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourdomain.com/webhooks/architect-ai");
  const [userAgent, setUserAgent] = useState("ArchitectAI-Crawler/1.4 (compatible; Sandbox;)");
  const [concurrentLimit, setConcurrentLimit] = useState("5");

  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
    }, 3000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied to clipboard.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-6 font-sans">
        <div>
          <h1 className="text-xl font-bold text-white font-sans">Workspace Settings</h1>
          <p className="text-xs text-secondary-text mt-1 font-sans">Configure your API keys, webhook integrations, and crawler preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
        {/* Navigation Tabs (Vertical) */}
        <div className="md:col-span-1 space-y-1">
          <button
            onClick={() => setActiveSettingsTab("api")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeSettingsTab === "api"
                ? "bg-card-bg text-white border-l-2 border-white shadow-sm"
                : "text-secondary-text hover:text-white hover:bg-card-bg/60"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Credentials</span>
          </button>
          <button
            onClick={() => setActiveSettingsTab("webhook")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeSettingsTab === "webhook"
                ? "bg-card-bg text-white border-l-2 border-white shadow-sm"
                : "text-secondary-text hover:text-white hover:bg-card-bg/60"
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            <span>Webhook Rules</span>
          </button>
          <button
            onClick={() => setActiveSettingsTab("crawler")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeSettingsTab === "crawler"
                ? "bg-card-bg text-white border-l-2 border-white shadow-sm"
                : "text-secondary-text hover:text-white hover:bg-card-bg/60"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Crawler Engine</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 bg-card-bg border border-border-color rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {activeSettingsTab === "api" && (
              <div className="space-y-6">
                <div className="border-b border-border-color pb-3">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5 font-sans">
                    <Key className="w-4 h-4 text-white" />
                    API Credentials
                  </h3>
                  <p className="text-[10px] text-muted-text mt-0.5 font-sans">Use keys to access the reverse engineering parser pipelines programmatically.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-semibold text-secondary-text">Workspace API Key</label>
                  <div className="flex gap-2 bg-secondary-bg p-1.5 border border-border-color rounded-lg">
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="flex-1 bg-transparent border-0 focus:outline-none text-xs text-white px-2 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-[10px] text-secondary-text hover:text-white px-2 cursor-pointer transition-colors"
                    >
                      {showKey ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="p-1 text-secondary-text hover:text-white cursor-pointer transition-colors"
                      title="Copy Key"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-text block font-sans">
                    Never commit secrets to Git. Treat this API key like a password.
                  </span>
                </div>
              </div>
            )}

            {activeSettingsTab === "webhook" && (
              <div className="space-y-6">
                <div className="border-b border-border-color pb-3">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5 font-sans">
                    <Webhook className="w-4 h-4 text-white" />
                    Webhook Dispatches
                  </h3>
                  <p className="text-[10px] text-muted-text mt-0.5 font-sans">Dispatches JSON specifications blueprints once target crawls finish.</p>
                </div>

                <div className="space-y-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-[9px] font-semibold text-secondary-text">Target Webhook URI</label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full h-10 bg-secondary-bg border border-border-color rounded-lg px-3 text-xs text-white focus:outline-none focus:border-white"
                      placeholder="https://api.yourdomain.com/webhooks/architect-ai"
                    />
                  </div>

                  <div className="p-3.5 bg-secondary-bg border border-border-color rounded-xl space-y-1.5 text-[10px] text-secondary-text font-sans">
                    <span className="text-white font-semibold">Dispatched Events:</span>
                    <p>• <span className="text-white font-semibold">Crawl Completed</span> - Triggers on successful parsing of target URL schema.</p>
                    <p>• <span className="text-white font-semibold">Crawl Failed</span> - Fired if anti-bot protections block parsing.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSettingsTab === "crawler" && (
              <div className="space-y-6">
                <div className="border-b border-border-color pb-3">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5 font-sans">
                    <Sliders className="w-4 h-4 text-white" />
                    Crawler Engine Settings
                  </h3>
                  <p className="text-[10px] text-muted-text mt-0.5 font-sans">Control base request headers, connections pools, and browser threads parameters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-[9px] font-semibold text-secondary-text font-sans">Global Scraper User Agent</label>
                    <input
                      type="text"
                      value={userAgent}
                      onChange={(e) => setUserAgent(e.target.value)}
                      className="w-full h-10 bg-secondary-bg border border-border-color rounded-lg px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-semibold text-secondary-text font-sans">Max Concurrency Limit</label>
                    <input
                      type="number"
                      value={concurrentLimit}
                      onChange={(e) => setConcurrentLimit(e.target.value)}
                      className="w-full h-10 bg-secondary-bg border border-border-color rounded-lg px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="h-px bg-border-color"></div>

            {/* Save Button */}
            <div className="flex items-center justify-between font-sans">
              {savedStatus ? (
                <span className="text-success text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Configuration saved successfully
                </span>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
