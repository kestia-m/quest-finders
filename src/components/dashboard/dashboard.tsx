"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Download,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import ResourceMeter, { SetBudgetFlow } from "@/components/budget/ResourceMeter";
import type { User } from "@/types";
import {
  type Budget,
  type Quest,
  type LeaderboardEntry,
  type MultiplayerGroup,
} from "@/services/dataService";
import { Link } from "react-router-dom";

const questSteps = [
  { id: 1, title: "Quest Category", description: "Select the quest category" },
  { id: 2, title: "Quest Details", description: "Enter quest details" },
  { id: 3, title: "Rewards", description: "Set quest rewards" },
  { id: 4, title: "Confirmation", description: "Review and create quest" },
];

function getCategoryBadge(category: string) {
  switch (category) {
    case "Wildlife":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
    case "Adventure":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-green-100">{category}</Badge>;
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

function NewQuestFlow({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "Wildlife",
    name: "",
    description: "",
    xpReward: "0",
    badge: "",
    cost: "0",
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      const newQuest: Quest = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        completed: false,
        xpReward: parseInt(formData.xpReward),
        badge: formData.badge,
        requirements: [],
        multiplayer: false,
        cost: parseInt(formData.cost),
      };
      dataService.addQuest(newQuest);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Choose Quest Category</CardTitle>
              <CardDescription>
                Select the category for your new quest.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {["Wildlife", "Adventure", "Landmark", "Events"].map((category) => (
                <Card
                  key={category}
                  className={cn(
                    "cursor-pointer transition-all",
                    formData.category === category
                      ? "bg-muted border-purple-500 ring-2 ring-purple-500"
                      : "border-gray-200 hover:shadow-md"
                  )}
                  onClick={() => updateFormData("category", category)}
                >
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        {getCategoryBadge(category)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 font-semibold">{category}</h3>
                      <p className="text-muted-foreground text-sm">
                        Create a {category.toLowerCase()} quest
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Quest Details</CardTitle>
              <CardDescription>
                Provide details for your new quest.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Quest Name</Label>
                <Input
                  id="name"
                  placeholder="Enter quest name"
                  className="mt-2"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter quest description"
                  className="mt-2"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cost">Quest Cost (ZAR)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="Enter quest cost"
                  className="mt-2"
                  value={formData.cost}
                  onChange={(e) => updateFormData("cost", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Rewards</CardTitle>
              <CardDescription>
                Set the rewards for completing the quest.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="xpReward">XP Reward</Label>
                <Input
                  id="xpReward"
                  type="number"
                  placeholder="Enter XP reward"
                  className="mt-2"
                  value={formData.xpReward}
                  onChange={(e) => updateFormData("xpReward", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="badge">Badge Name</Label>
                <Input
                  id="badge"
                  placeholder="Enter badge name"
                  className="mt-2"
                  value={formData.badge}
                  onChange={(e) => updateFormData("badge", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Confirm Quest Creation</CardTitle>
              <CardDescription>
                Review your quest details before creating.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Category: {formData.category}</p>
                <p className="text-sm text-gray-500">Name: {formData.name}</p>
                <p className="text-sm text-gray-500">Description: {formData.description}</p>
                <p className="text-sm text-gray-500">XP Reward: {formData.xpReward}</p>
                <p className="text-sm text-gray-500">Badge: {formData.badge}</p>
                <p className="text-sm text-gray-500">Cost: {formData.cost} ZAR</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
      <Card className="w-full max-w-3xl bg-white shadow-lg" style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
        <CardHeader className="pb-0">
          <div className="mb-6 flex items-center justify-between">
            {questSteps.map((step) => (
              <div key={step.id} className="relative flex flex-1 flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300",
                    currentStep > step.id
                      ? "bg-purple-600 text-white"
                      : currentStep === step.id
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div
                  className={cn(
                    "mt-2 text-center text-sm font-medium",
                    currentStep >= step.id ? "text-gray-800" : "text-gray-500"
                  )}
                >
                  {step.title}
                </div>
                {step.id < questSteps.length && (
                  <div
                    className={cn(
                      "absolute top-5 left-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] -translate-y-1/2 bg-gray-200 transition-colors duration-300",
                      currentStep > step.id && "bg-purple-400"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {renderStepContent()}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button onClick={handleNext}>
              <span>{currentStep === 4 ? "Create Quest" : "Continue"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardProps {
  user: User | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
  const [multiplayerGroups, setMultiplayerGroups] = useState<MultiplayerGroup[]>([]);
  const [selectedRange, setSelectedRange] = useState("30days");
  const [isNewQuestOpen, setIsNewQuestOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

  const userId = user?.id || "user1";

  useEffect(() => {
    setBudgets(dataService.getBudgets(userId, selectedRange));
    setQuests(dataService.getQuests());
    setLeaderboards(dataService.getLeaderboards("global"));
    setMultiplayerGroups(dataService.getMultiplayerGroups(userId));
  }, [selectedRange, userId]);

  const userLeaderboard = leaderboards.find((entry) => entry.userId === userId) || {
    xp: 0,
    rank: 0,
    badges: [],
  };
  const completedQuestsCount = quests.filter((q) => q.completed).length;

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
      <div className="flex flex-1 flex-col">
        <header className="border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 xl:grid-cols-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:col-span-3">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-muted-foreground text-sm">Total Budget</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">
                    {(budgets[0]?.totalBudget || 0)} ZAR
                  </div>
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
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground text-sm">Rewards Earned</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">
                    {userLeaderboard.badges?.length || 0}
                  </div>
                  <div className="text-sm text-green-600">+{completedQuestsCount} quests completed</div>
                </CardContent>
              </Card>
            </div>
            <Sheet open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
              <SheetTrigger asChild>
                <div>
                  <ResourceMeter
                    userId={userId}
                    selectedRange={selectedRange}
                    onEdit={() => setIsEditBudgetOpen(true)}
                  />
                </div>
              </SheetTrigger>
              <SheetContent className="w-full max-w-3xl p-0 bg-white">
                <SetBudgetFlow
                  userId={userId}
                  selectedRange={selectedRange}
                  onClose={() => setIsEditBudgetOpen(false)}
                  onSave={(newBudget) => {
                    setBudgets([newBudget, ...budgets]);
                    setIsEditBudgetOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 xl:grid-cols-4">
            <Card className="xl:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                    Budget Allocation
                    <Info className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                  <div className="h-5 w-5 text-gray-400" />
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
                  <Sheet open={isNewQuestOpen} onOpenChange={setIsNewQuestOpen}>
                    <SheetTrigger asChild>
                      <Button className="bg-purple-600 text-sm hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">New Quest</span>
                        <span className="sm:hidden">New</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full max-w-3xl p-0 bg-white">
                      <NewQuestFlow
                        onClose={() => {
                          setIsNewQuestOpen(false);
                          setQuests(dataService.getQuests());
                        }}
                      />
                    </SheetContent>
                  </Sheet>
                  <div className="h-5 w-5 text-gray-400" />
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
                    className="bg-purple-600 text-white hover:bg-purple-700"
                  >
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
