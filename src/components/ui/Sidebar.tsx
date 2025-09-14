"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  BarChart3,
  Target,
  Trophy,
  Wallet,
  Users as UsersIcon,
  MapPin,
  Award,
  //FileText,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard-k", hasSubmenu: false },
  { icon: Target, label: "Quests", href: "/quests", hasSubmenu: true },
  { icon: Trophy, label: "Leaderboards", href: "/leaderboards", hasSubmenu: false },
  { icon: Wallet, label: "Budget", href: "/budget", hasSubmenu: false },
  { icon: UsersIcon, label: "Multiplayer", href: "/multiplayer", hasSubmenu: false },
  { icon: MapPin, label: "Spots", href: "/spots", hasSubmenu: false },
  { icon: Award, label: "Rewards", href: "/rewards", hasSubmenu: false },
  { icon: Settings, label: "Settings", href: "/settings", hasSubmenu: false },
];

interface SidebarContentProps {
  currentPath: string;
}

function SidebarContent({ currentPath }: SidebarContentProps) {
  return (
    <>
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
            <div className="h-4 w-4 rounded-full bg-white"></div>
          </div>
          <span className="text-lg font-semibold text-gray-900">Safari Quest SA</span>
        </div>
      </div>
      <div className="border-b border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search spots or quests"
            className="border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              {item.href ? (
                <Link
                  to={item.href}
                  className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                    currentPath === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
                </Link>
              ) : (
                <div
                  className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                    currentPath === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/professional-headshot.png" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Explorer Jane</div>
            <div className="text-xs text-gray-400">user1@example.com</div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </>
  );
}

export function Sidebar({ currentPath }: SidebarContentProps) {
  const location = useLocation();
  const activePath = currentPath || location.pathname;

  return (
    <div className="hidden w-64 flex-col bg-white md:flex">
      <SidebarContent currentPath={activePath} />
    </div>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-white p-0 text-gray-900">
        <SidebarContent currentPath={useLocation().pathname} />
      </SheetContent>
    </Sheet>
  );
}
