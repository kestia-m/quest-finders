"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import {
  Search,
  BarChart3,
  Target,
  Trophy,
  Wallet,
  Users as UsersIcon,
  MapPin,
  Diamond,
  FileText,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Download,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Info,
  Menu,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useEffect, useState } from "react";

import {
  type Budget,
  type Quest,
  type LeaderboardEntry,
  type MultiplayerGroup,
} from "@/services/dataService";

const currentUserId = "user1";

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Target, label: "Quests", active: false, hasSubmenu: true },
  { icon: Trophy, label: "Leaderboards", active: false },
  { icon: Wallet, label: "Budget", active: false },
  { icon: UsersIcon, label: "Multiplayer", active: false },
  { icon: MapPin, label: "Spots", active: false },
  { icon: Diamond, label: "Activities", active: false },
  { icon: FileText, label: "Tasks", active: false },
  { icon: Settings, label: "Settings", active: false },
];

function getCategoryBadge(category: string) {
  switch (category) {
    case "Wildlife":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
    case "Adventure":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>;
    case "Landmark":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{category}</Badge>;
    case "Events":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{category}</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>;
  }
}

function getQuestStatusBadge(completed: boolean) {
  return completed ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
  ) : (
    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
  );
}

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-white p-0 text-gray-900">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}

function SidebarContent() {
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
              <div
                className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                  item.active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}>
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
              </div>
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

export default function Dashboardk() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
  const [multiplayerGroups, setMultiplayerGroups] = useState<MultiplayerGroup[]>([]);
  const [selectedRange, setSelectedRange] = useState("30days");

  useEffect(() => {
    setBudgets(dataService.getBudgets(currentUserId, selectedRange));
    setQuests(dataService.getQuests());
    setLeaderboards(dataService.getLeaderboards("global"));
    setMultiplayerGroups(dataService.getMultiplayerGroups(currentUserId));
  }, [selectedRange]);

  const userBudget = budgets[0] || { totalBudget: 0, currentSpent: 0, resourceMeter: 0, categories: { transport: 0, accommodation: 0, activities: 0, food: 0 } };
  const userLeaderboard = leaderboards.find((entry) => entry.userId === currentUserId) || { xp: 0, rank: 0, badges: [] };
  const activeQuestsCount = quests.filter((q) => !q.completed).length;

  const getBudgetData = () => {
    const sortedBudgets = [...budgets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (selectedRange === "30days") {
      return sortedBudgets.map((budget) => ({
        day: new Date(budget.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        food: budget.categories.food,
        transport: budget.categories.transport,
        accommodation: budget.categories.accommodation,
        activities: budget.categories.activities,
      }));
    } else if (selectedRange === "60days" || selectedRange === "90days" || selectedRange === "1year") {
      const months: { [key: string]: { food: number; transport: number; accommodation: number; activities: number } } = {};
      sortedBudgets.forEach((budget) => {
        const date = new Date(budget.date);
        const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        if (!months[monthKey]) {
          months[monthKey] = { food: 0, transport: 0, accommodation: 0, activities: 0 };
        }
        months[monthKey].food += budget.categories.food;
        months[monthKey].transport += budget.categories.transport;
        months[monthKey].accommodation += budget.categories.accommodation;
        months[monthKey].activities += budget.categories.activities;
      });
      const monthData = Object.keys(months).map((month) => ({
        month,
        food: months[month].food,
        transport: months[month].transport,
        accommodation: months[month].accommodation,
        activities: months[month].activities,
      }));
      const maxMonths = selectedRange === "60days" ? 2 : selectedRange === "90days" ? 3 : 12;
      return monthData.slice(-maxMonths);
    }
    return [];
  };

  const budgetData = getBudgetData();

  return (
    <div className="bg-white flex h-screen">
      <div className="hidden w-64 flex-col bg-white md:flex">
        <SidebarContent />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileSidebar />
              <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
            </div>
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger className="w-32 md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="60days">Last 60 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 xl:grid-cols-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:col-span-3">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-muted-foreground text-sm">Total Budget</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{userBudget.totalBudget} ZAR</div>
                  <div className="text-sm text-green-600">+5% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground text-sm">Current XP</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{userLeaderboard.xp}</div>
                  <div className="text-sm text-green-600">+50 this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-muted-foreground text-sm">Active Quests</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{activeQuestsCount}</div>
                  <div className="text-sm text-green-600">+1 new</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  Resource Meter
                  <Info className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-2 text-xs text-gray-500">Current Spent: {userBudget.currentSpent} ZAR</div>
                <div className="bg-muted mb-4 h-2 w-full rounded-full">
                  <div className="h-2 rounded-full bg-orange-600" style={{ width: `${userBudget.resourceMeter}%` }}></div>
                </div>
                <div className="mb-3 text-xs text-gray-500">SPENT / REMAINING</div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-lg font-semibold">{userBudget.currentSpent} ZAR</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{userBudget.totalBudget - userBudget.currentSpent} ZAR</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 xl:grid-cols-4">
            <Card className="xl:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                    Budget Allocation
                    <Info className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                  <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 h-48 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey={selectedRange === "30days" ? "day" : "month"}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="food"
                        stroke="#ff6384"
                        strokeWidth={2}
                        fill="url(#colorFood)"
                      />
                      <Area
                        type="monotone"
                        dataKey="transport"
                        stroke="#36a2eb"
                        strokeWidth={2}
                        fill="url(#colorTransport)"
                      />
                      <Area
                        type="monotone"
                        dataKey="accommodation"
                        stroke="#ffcd56"
                        strokeWidth={2}
                        fill="url(#colorAccommodation)"
                      />
                      <Area
                        type="monotone"
                        dataKey="activities"
                        stroke="#4bc0c0"
                        strokeWidth={2}
                        fill="url(#colorActivities)"
                      />
                      <defs>
                        <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6384" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff6384" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#36a2eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#36a2eb" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorAccommodation" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffcd56" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ffcd56" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4bc0c0" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4bc0c0" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="mb-2 text-xs text-gray-500">Rank as of Today</div>
                <div className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">#{userLeaderboard.rank}</div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-xs text-green-600">Badges Earned</div>
                    <div className="text-lg font-semibold">{userLeaderboard.badges?.length || 0}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-blue-600">Groups Joined</div>
                    <div className="text-lg font-semibold">{multiplayerGroups.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                  Active Quests
                  <Info className="h-4 w-4 text-gray-400" />
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button className="bg-purple-600 text-sm hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">New Quest</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                  <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        Quest ID
                      </th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        Name
                      </th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        Category
                      </th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        Status
                      </th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        XP Reward
                      </th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        Badge
                      </th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quests.map((quest) => (
                      <tr key={quest.id} className="hover:bg-gray-50 border-b">
                        <td className="p-3 md:p-4">
                          <span className="text-sm font-medium text-blue-600">{quest.id}</span>
                        </td>
                        <td className="p-3 text-sm md:p-4">{quest.name}</td>
                        <td className="p-3 md:p-4">{getCategoryBadge(quest.category)}</td>
                        <td className="p-3 md:p-4">{getQuestStatusBadge(quest.completed)}</td>
                        <td className="text-muted-foreground p-3 text-sm md:p-4">{quest.xpReward}</td>
                        <td className="text-muted-foreground p-3 text-sm md:p-4">{quest.badge}</td>
                        <td className="p-3 md:p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
                <Button variant="ghost" className="flex items-center gap-2 text-sm">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1 md:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-purple-600 text-white hover:bg-purple-700">
                    1
                  </Button>
                  <Button variant="ghost" size="sm">
                    2
                  </Button>
                  <Button variant="ghost" size="sm">
                    3
                  </Button>
                  <span className="hidden text-gray-400 sm:inline">...</span>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    8
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    9
                  </Button>
                  <Button variant="ghost" size="sm">
                    10
                  </Button>
                </div>
                <Button variant="ghost" className="flex items-center gap-2 text-sm">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
