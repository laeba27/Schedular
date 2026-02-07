"use client";

import { usePathname } from "next/navigation";
import { Calendar, BarChart, Users, Clock } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/meetings", label: "Meetings", icon: Users },
  { href: "/availability", label: "Availability", icon: Clock },
];

export default function PageTitle() {
  const pathname = usePathname();
  const currentItem = navItems.find((item) => item.href === pathname);
  const Icon = currentItem?.icon;

  return (
    <div className="mb-8 flex items-center gap-3">
      {Icon && <Icon className="w-8 h-8 text-gray-700" />}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        {currentItem?.label || "Dashboard"}
      </h1>
    </div>
  );
}
