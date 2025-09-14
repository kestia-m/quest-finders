"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Settings2, Blocks } from "lucide-react";
import { dataService } from "@/services/dataService";
import { useEffect, useState } from "react";
import type { User } from "@/types";
import { type Budget, type Quest, type Activity } from "@/services/dataService";
import { SetBudgetFlow } from "@/components/budget/ResourceMeter";
import { Sidebar, MobileSidebar } from "@/components/ui/Sidebar"; // Adjust import path as needed
import { useLocation } from "react-router-dom";

function getCategoryBadge(category: string) {
  switch (category) {
    case "food":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
    case "transport":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>;
    case "accommodation":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{category}</Badge>;
    case "activities":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{category}</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>;
  }
}

interface BudgetProps {
  user: User | null;
}

export default function Budget({ user }: BudgetProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const selectedRange = "30days";

  const userId = user?.id || "user1";

  useEffect(() => {
    setBudgets(dataService.getBudgets(userId, selectedRange));
    setQuests(dataService.getQuests());
  }, [userId, selectedRange]);

  const latestBudget = budgets[0] || { totalBudget: 0, currentSpent: 0, categories: { transport: 0, accommodation: 0, activities: 0, food: 0 } };
  const totalBudget = latestBudget.totalBudget || 0;
  const amountSpent = latestBudget.currentSpent || 0;
  const progressPercentage = totalBudget > 0 ? Math.min((amountSpent / totalBudget) * 100, 100) : 0;

  const categorySpending: { [key: string]: number } & { food: number; transport: number; accommodation: number; activities: number; uncategorized: number } = {
    food: latestBudget.categories.food || 0,
    transport: latestBudget.categories.transport || 0,
    accommodation: latestBudget.categories.accommodation || 0,
    activities: latestBudget.categories.activities || 0,
    uncategorized: 0,
  };
  quests
    .filter((q) => q.completed)
    .forEach((quest) => {
      const category = quest.category || "uncategorized";
      categorySpending[category] = (categorySpending[category] || 0) + (quest.cost || 0);
    });

  const recentQuestsWithActivities = [...quests]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5)
    .map((quest) => ({
      ...quest,
      activities: [] as Activity[], // No activities available due to missing activitiesData
    }));

  const alerts = latestBudget.alerts || [];

  const location = useLocation();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar currentPath={location.pathname} />
      <div className="flex flex-1 flex-col">
        <header className="border-b p-4 flex items-center justify-between">
          <MobileSidebar />
          <h1 className="text-xl font-semibold">Budget</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="w-full max-w-[--breakpoint-lg] mx-auto">
            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-semibold md:text-lg">Budget Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-muted-foreground text-sm">Total Budget</span>
                    <span className="text-2xl font-bold text-gray-900 ml-auto">{totalBudget} ZAR</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground text-sm">Amount Spent</span>
                    <span className="text-2xl font-bold text-gray-900 ml-auto">{amountSpent} ZAR</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground text-sm">Remaining</span>
                    <span className="text-2xl font-bold text-green-600 ml-auto">{totalBudget - amountSpent} ZAR</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-muted-foreground text-sm">Progress</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-auto flex-1">
                      <div
                        className="bg-red-600 h-2.5 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-semibold md:text-lg">Budget Management</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Settings2 className="shrink-0" />
                    <span className="text-muted-foreground text-sm">Tracking</span>
                    <span className="text-sm ml-auto">
                      Track spending across categories like food, transport, and activities.
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Blocks className="shrink-0" />
                    <span className="text-muted-foreground text-sm">Allocation</span>
                    <span className="text-sm ml-auto">
                      Allocate funds for your next quest with ease.
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Sheet open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
                      <SheetTrigger asChild>
                        <Button className="mt-4 w-full md:w-auto">
                          Set/Edit Budget <ArrowRight />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full max-w-3xl p-0">
                        <SetBudgetFlow
                          userId={userId}
                          selectedRange={selectedRange}
                          onClose={() => setIsEditBudgetOpen(false)}
                          onSave={(newBudget: Budget) => {
                            dataService.addBudget(newBudget);
                            setBudgets(dataService.getBudgets(userId, selectedRange));
                            setIsEditBudgetOpen(false);
                          }}
                        />
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-semibold md:text-lg">Budget Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">{alert}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      <span className="text-sm text-gray-500">No alerts at this time.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {Object.entries(categorySpending).map(([category, spent]) => (
                    <li key={category} className="flex items-center justify-between">
                      <span className="text-base">{getCategoryBadge(category)}</span>
                      <span className="text-base font-medium">{spent} ZAR</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                  Recent Activities
                </CardTitle>
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
                        <th className="text-muted-foreground p-3 text-center text-xs font-medium md:p-4 md:text-sm">
                          Activities
                        </th>
                        <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">
                          Total Cost (ZAR)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentQuestsWithActivities.map((quest) => (
                        <tr key={quest.id} className="hover:bg-gray-50 border-b">
                          <td className="p-3 md:p-4">
                            <span className="text-sm font-medium text-blue-600">{quest.id}</span>
                          </td>
                          <td className="p-3 text-sm md:p-4">{quest.name}</td>
                          <td className="p-3 md:p-4">{getCategoryBadge(quest.category || "uncategorized")}</td>
                          <td className="p-3 md:p-4">
                            {quest.activities.length > 0 ? (
                              quest.activities.map((activity: Activity, index: number) => (
                                <div key={index} className="text-sm">
                                  {activity.name} ({activity.estimatedCost} ZAR)
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No activities</span>
                            )}
                          </td>
                          <td className="p-3 text-sm md:p-4">
                            {quest.activities.reduce((sum: number, activity: Activity) => sum + (activity.estimatedCost || 0), 0)} ZAR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
