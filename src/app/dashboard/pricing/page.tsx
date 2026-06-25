"use client";

import React, { useState } from "react";
import {
  Check,
  Cpu,
  Globe,
  Database
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Developer Sandbox",
      price: 0,
      desc: "For solo developers auditing side-projects or learning database heuristics.",
      features: [
        "3 scans / month limit",
        "Max depth: 1 link step",
        "Single-thread scanning queue",
        "Client-side MD/JSON downloads",
        "Community forum support"
      ],
      cta: "Current Plan",
      isCurrent: true,
      accent: false
    },
    {
      name: "Principal Architect",
      price: billingCycle === "monthly" ? 89 : 69,
      desc: "For tech leads, consultants, and founders reverse-engineering system specs.",
      features: [
        "Unlimited scans / month",
        "Max depth: 5 link steps (Deep Scan)",
        "5 concurrent crawler threads",
        "Bypass standard firewall protections",
        "Full database schema designs",
        "Client API keys and webhooks integrations",
        "Priority email support"
      ],
      cta: "Upgrade",
      isCurrent: false,
      accent: true
    },
    {
      name: "Enterprise Operator",
      price: billingCycle === "monthly" ? 399 : 299,
      desc: "For technical agencies and large engineering teams mapping digital systems.",
      features: [
        "All features of Principal Architect",
        "Unlimited concurrent crawler threads",
        "Custom rotating proxy configurations",
        "Bespoke domain white-labeled exports",
        "Access to GPU code translation engine",
        "Dedicated Technical Architect seat",
        "SLA guaranteed availability"
      ],
      cta: "Contact Sales",
      isCurrent: false,
      accent: false
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-white font-sans">Pricing Plans</h1>
        <p className="text-xs text-secondary-text max-w-md mx-auto font-sans">
          Unlock advanced crawler concurrency, rotating proxy sets, and database schema design tools.
        </p>

        {/* Month/Year toggle */}
        <div className="inline-flex bg-secondary-bg border border-border-color p-1 rounded-xl mt-4 text-[10px] font-semibold shadow-sm font-sans">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${billingCycle === "monthly" ? "bg-card-bg text-white font-semibold shadow-sm" : "text-secondary-text"}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${billingCycle === "yearly" ? "bg-card-bg text-white font-semibold shadow-sm" : "text-secondary-text"}`}
          >
            Yearly Billing (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-sans">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-card-bg border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm ${
              plan.accent ? "border-white shadow-md shadow-white/5" : "border-border-color"
            }`}
          >
            {plan.accent && (
              <span className="absolute top-3 right-3 text-[8px] bg-white/10 border border-white/20 text-white font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Popular
              </span>
            )}

            <div className="space-y-4">
              <span className="text-[10px] font-semibold text-muted-text block uppercase tracking-wider">{plan.name}</span>
              
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">${plan.price}</span>
                <span className="text-[10px] text-muted-text">/ month</span>
              </div>

              <p className="text-xs text-secondary-text leading-relaxed font-sans">{plan.desc}</p>
              
              <div className="h-px bg-border-color"></div>

              <ul className="space-y-2.5">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-[11px] text-secondary-text leading-tight font-sans">
                    <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`mt-8 w-full py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                plan.isCurrent
                  ? "bg-secondary-bg border border-border-color text-muted-text cursor-default"
                  : plan.accent
                  ? "bg-white hover:bg-zinc-200 text-black shadow-sm"
                  : "bg-secondary-bg border border-border-color hover:border-white text-white"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust Badge / Features list */}
      <div className="bg-card-bg border border-border-color rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-secondary-text text-center md:text-left shadow-sm font-sans">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-white flex-shrink-0" />
          <p>GPU-accelerated parsers scanning microservice routes in milliseconds.</p>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-white flex-shrink-0" />
          <p>Rotating residential proxy nodes bypassing advanced cloud firewalls safely.</p>
        </div>
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-white flex-shrink-0" />
          <p>Strict ACID-compliant archives protecting and storing private workspace specifications.</p>
        </div>
      </div>
    </div>
  );
}
