"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Info } from "lucide-react";
//import { cn } from "@/lib/utils";
import { Sidebar, MobileSidebar } from "@/components/ui/Sidebar";
import { dataService } from "@/services/dataService";
import { type UserRewards } from "@/services/dataService";

export default function Rewards({ userId }: { userId: string }) {
  const [rewards, setRewards] = useState<UserRewards>({
    id: Date.now(),
    userId,
    totalRands: 0,
    xpEarned: 0,
    lastUpdated: new Date("2025-09-14T05:38:00Z").toISOString(), // Updated to current time
    sponsorContributions: [],
  });

  useEffect(() => {
    const fetchedRewards = dataService.getRewards(userId) || {
      id: Date.now(),
      userId,
      totalRands: 0,
      xpEarned: 0,
      lastUpdated: new Date("2025-09-14T05:38:00Z").toISOString(), // Updated to current time
      sponsorContributions: [],
    };
    setRewards(fetchedRewards);
  }, [userId]);

  const calculateRandsFromXP = (xp: number) => {
    return Math.floor(xp / 10) * 10;
  };

  const updateRewards = () => {
    const newXp = rewards.xpEarned + 50;
    const newRands = calculateRandsFromXP(newXp);
    const updatedRewards = {
      ...rewards,
      xpEarned: newXp,
      totalRands: newRands,
      lastUpdated: new Date().toISOString(),
      sponsorContributions: [
        ...rewards.sponsorContributions,
        { sponsor: "Sponsor A", amount: 5, date: new Date().toISOString() },
      ],
    };
    dataService.updateRewards(userId, updatedRewards);
    setRewards(updatedRewards);
  };

  // Mock data for chart (simulating rewards history)
  const rewardsHistory = [
    { date: "2025-09-01", xp: 0, rands: 0 },
    { date: "2025-09-07", xp: 50, rands: 5 },
    { date: "2025-09-14", xp: rewards.xpEarned, rands: rewards.totalRands },
  ].map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    xp: item.xp,
    rands: item.rands,
  }));

  return (
    <div className="bg-white flex h-screen">
      <Sidebar currentPath="/rewards" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileSidebar />
              <h1 className="text-xl font-semibold md:text-2xl">Rewards</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 xl:grid-cols-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:col-span-3">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-muted-foreground text-sm">Total Rands</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{rewards.totalRands} ZAR</div>
                  <div className="text-sm text-green-600">+5% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground text-sm">Total XP</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{rewards.xpEarned}</div>
                  <div className="text-sm text-green-600">+50 this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground text-sm">Sponsor Contributions</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{rewards.sponsorContributions.length}</div>
                  <div className="text-sm text-green-600">+1 new sponsor</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 xl:grid-cols-4">
            <Card className="xl:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                    Rewards History
                    <Info className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 h-48 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rewardsHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
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
                        dataKey="xp"
                        stroke="#36a2eb"
                        strokeWidth={2}
                        fill="url(#colorXp)"
                      />
                      <Area
                        type="monotone"
                        dataKey="rands"
                        stroke="#ff6384"
                        strokeWidth={2}
                        fill="url(#colorRands)"
                      />
                      <defs>
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#36a2eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#36a2eb" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorRands" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6384" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff6384" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="mb-2 text-xs text-gray-500">Last Updated</div>
                <div className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">{new Date(rewards.lastUpdated).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-xs text-green-600">Total Sponsors</div>
                    <div className="text-lg font-semibold">{rewards.sponsorContributions.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
                Sponsor Contributions
                <Info className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">Sponsor</th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">Amount (ZAR)</th>
                      <th className="text-muted-foreground p-3 text-left text-xs font-medium md:p-4 md:text-sm">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.sponsorContributions.length > 0 ? (
                      rewards.sponsorContributions.map((contrib, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b">
                          <td className="p-3 text-sm md:p-4">{contrib.sponsor}</td>
                          <td className="text-muted-foreground p-3 text-sm md:p-4">{contrib.amount}</td>
                          <td className="text-muted-foreground p-3 text-sm md:p-4">{new Date(contrib.date).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-3 text-center text-sm md:p-4">No contributions yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6">
            <Button onClick={updateRewards} className="w-full md:w-auto">
              Earn 50 XP & Check Sponsors
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
