"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, BarChart, Users, Clock, Menu, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart, color: "text-blue-600" },
  { href: "/events", label: "Events", icon: Calendar, color: "text-purple-600" },
  { href: "/meetings", label: "Meetings", icon: Users, color: "text-emerald-600" },
  { href: "/availability", label: "Availability", icon: Clock, color: "text-orange-600" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {/* Sidebar - Fixed Left with Toggle */}
      <aside
        className={`hidden md:block bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="py-8 px-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex justify-end mb-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                      isActive ? item.color : "group-hover:text-blue-600"
                    }`}
                  />
                  <span
                    className={`font-medium whitespace-nowrap transition-all duration-200 ${
                      sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Bottom Navigation - Fixed Bottom (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-3 px-2 transition-all duration-200 ${
                    isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 transition-all duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
