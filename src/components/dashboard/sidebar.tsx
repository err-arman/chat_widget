"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Home,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const sideBarItems: { label: string; icon: any; link: string }[] = [
  { label: "Home", icon: Home, link: "/dashboard" },
//   { label: "Analytics", icon: BarChart2, link: "/dashboard" },
//   { label: "Customers", icon: Users, link: "/user" },
//   { label: "Settings", icon: Settings, link: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`border-r bg-gray-100/40 ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && <span className="text-lg font-semibold">Menu</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <LayoutDashboard /> : <Layers />}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-2 p-2">
          {sideBarItems.map((item, index) => (
            <SidebarItem
              link={item.link}
              key={index}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  link,
  collapsed,
}: {
  icon: any;
  label: string;
  link: string;
  collapsed: boolean;
}) {
  return (
    <Link href={link} passHref>
      <Button
        variant="ghost"
        className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span className="ml-2">{label}</span>}
      </Button>
    </Link>
  );
}
