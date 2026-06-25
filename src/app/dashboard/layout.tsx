"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Sparkles,
  User
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "New Analysis", path: "/dashboard/new", icon: PlusCircle },
    { name: "Analysis History", path: "/dashboard/history", icon: History },
    { name: "Pricing", path: "/dashboard/pricing", icon: CreditCard },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text flex font-sans antialiased">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar-bg border-r border-border-color transition-all duration-300 relative ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b border-border-color gap-2 justify-between">
          {!sidebarCollapsed ? (
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary-text">
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-primary-text">
                Architect<span className="text-white">AI</span>
              </span>
            </Link>
          ) : (
            <Link href="/" className="mx-auto">
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </Link>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-secondary-text hover:text-primary-text p-1 rounded hover:bg-card-bg cursor-pointer transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-150 group relative ${
                  isActive
                    ? "bg-card-bg text-primary-text font-medium border-l-2 border-white"
                    : "text-secondary-text hover:text-primary-text hover:bg-card-bg/50"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-secondary-text group-hover:text-primary-text"}`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
                {sidebarCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-sidebar-bg border border-border-color text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-color flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-7 h-7 rounded-full bg-card-bg border border-border-color flex items-center justify-center overflow-hidden">
                <User className="w-3.5 h-3.5 text-secondary-text" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary-text truncate">Danish Kolhar</p>
                <p className="text-[10px] text-muted-text truncate">danish@workspace.io</p>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-card-bg border border-border-color flex items-center justify-center mx-auto">
              <User className="w-3.5 h-3.5 text-secondary-text" />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-60 h-full bg-sidebar-bg border-r border-border-color p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-primary-text">ArchitectAI</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-secondary-text p-1 hover:bg-card-bg rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-150 ${
                      isActive
                        ? "bg-card-bg text-primary-text font-medium border-l-2 border-white"
                        : "text-secondary-text hover:text-primary-text hover:bg-card-bg/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-border-color flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-card-bg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-secondary-text" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary-text">Danish Kolhar</p>
                <p className="text-[10px] text-muted-text">danish@workspace.io</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border-color bg-sidebar-bg/50 backdrop-blur flex items-center px-6 md:px-8 justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-secondary-text p-1.5 hover:bg-card-bg rounded"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            {/* Search Input */}
            <div className="hidden sm:flex items-center max-w-sm w-full relative">
              <Search className="w-3.5 h-3.5 absolute left-3 text-secondary-text" />
              <input
                type="text"
                placeholder="Search resources, specifications or pages..."
                className="w-full h-8 bg-card-bg border border-border-color rounded-lg pl-9 pr-4 text-xs text-primary-text placeholder-muted-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Active Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/10 border border-success/20 text-[10px] text-success font-medium">
              <span className="w-1 h-1 rounded-full bg-success"></span>
              All services online
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 text-secondary-text hover:text-primary-text hover:bg-card-bg rounded-lg transition-colors cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-card-bg border border-border-color rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-1.5 border-b border-border-color flex justify-between items-center">
                    <span className="text-[10px] font-medium text-secondary-text">Notifications</span>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[9px] text-accent hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-2.5 hover:bg-card-bg border-b border-border-color/50 last:border-b-0 cursor-pointer">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] text-success font-medium">Analysis Completed</span>
                        <span className="text-[9px] text-muted-text">2m ago</span>
                      </div>
                      <p className="text-[11px] text-primary-text">Successfully analyzed <strong>airbnb.com</strong></p>
                    </div>
                    <div className="px-4 py-2.5 hover:bg-card-bg border-b border-border-color/50 last:border-b-0 cursor-pointer">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] text-primary-text font-medium">Database Map Generated</span>
                        <span className="text-[9px] text-muted-text">1h ago</span>
                      </div>
                      <p className="text-[11px] text-primary-text">Inferred schema relationships for <strong>stripe.com</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-border-color"></div>

            {/* Profile Menu Trigger */}
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-card-bg transition-colors">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-semibold text-white">
                DK
              </div>
              <span className="hidden sm:inline text-xs font-medium text-primary-text">Danish</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background relative">
          {children}
        </main>
      </div>
    </div>
  );
}
