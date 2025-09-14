"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  //Wallet,
  Info,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataService } from "@/services/dataService";
import { type Budget } from "@/services/dataService";

const budgetSteps = [
  { id: 1, title: "Budget Period", description: "Select the budget period" },
  { id: 2, title: "Category Allocation", description: "Set budget allocations" },
  { id: 3, title: "Confirmation", description: "Review and save budget" },
];

interface SetBudgetFlowProps {
  onClose: () => void;
  onSave: (budget: Budget) => void;
  userId: string;
  selectedRange: string;
}

export function SetBudgetFlow({ onClose, onSave, userId, selectedRange }: SetBudgetFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentBudget, setCurrentBudget] = useState<Budget>(
    dataService.getBudgets(userId, selectedRange)[0] || {
      id: Date.now(),
      userId,
      date: new Date("2025-09-14T04:59:00Z").toISOString(),
      totalBudget: 0,
      currentSpent: 0,
      resourceMeter: 0,
      categories: { transport: 0, accommodation: 0, activities: 0, food: 0 },
      alerts: [],
    }
  );
  const [formData, setFormData] = useState({
    period: "monthly",
    transport: currentBudget.categories.transport.toString(),
    accommodation: currentBudget.categories.accommodation.toString(),
    activities: currentBudget.categories.activities.toString(),
    food: currentBudget.categories.food.toString(),
  });

  useEffect(() => {
    const budget = dataService.getBudgets(userId, selectedRange)[0] || {
      id: Date.now(),
      userId,
      date: new Date("2025-09-14T04:59:00Z").toISOString(),
      totalBudget: 0,
      currentSpent: 0,
      resourceMeter: 0,
      categories: { transport: 0, accommodation: 0, activities: 0, food: 0 },
      alerts: [],
    };
    setCurrentBudget(budget);
    setFormData({
      period: "monthly",
      transport: budget.categories.transport.toString(),
      accommodation: budget.categories.accommodation.toString(),
      activities: budget.categories.activities.toString(),
      food: budget.categories.food.toString(),
    });
  }, [userId, selectedRange]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      const totalBudget =
        parseFloat(formData.transport || "0") +
        parseFloat(formData.accommodation || "0") +
        parseFloat(formData.activities || "0") +
        parseFloat(formData.food || "0");
      const newBudget: Budget = {
        id: Date.now(),
        userId,
        date: new Date("2025-09-14T04:59:00Z").toISOString(),
        totalBudget,
        currentSpent: 0,
        resourceMeter: 0,
        categories: {
          transport: parseFloat(formData.transport || "0"),
          accommodation: parseFloat(formData.accommodation || "0"),
          activities: parseFloat(formData.activities || "0"),
          food: parseFloat(formData.food || "0"),
        },
        alerts: [],
      };
      dataService.addBudget(newBudget);
      onSave(newBudget);
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
          <div className="space-y-6 text-center">
            <CardHeader className="px-0 pt-0 text-center">
              <CardTitle>Choose Budget Period</CardTitle>
              <CardDescription>
                Select the period for your budget.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="flex justify-center">
              <Select value={formData.period} onValueChange={(value) => updateFormData("period", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Category Allocation</CardTitle>
              <CardDescription>
                Allocate your budget across categories.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="transport">Transport (ZAR)</Label>
                <Input
                  id="transport"
                  type="number"
                  placeholder="Enter transport budget"
                  className="mt-2"
                  value={formData.transport}
                  onChange={(e) => updateFormData("transport", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accommodation">Accommodation (ZAR)</Label>
                <Input
                  id="accommodation"
                  type="number"
                  placeholder="Enter accommodation budget"
                  className="mt-2"
                  value={formData.accommodation}
                  onChange={(e) => updateFormData("accommodation", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="activities">Activities (ZAR)</Label>
                <Input
                  id="activities"
                  type="number"
                  placeholder="Enter activities budget"
                  className="mt-2"
                  value={formData.activities}
                  onChange={(e) => updateFormData("activities", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="food">Food (ZAR)</Label>
                <Input
                  id="food"
                  type="number"
                  placeholder="Enter food budget"
                  className="mt-2"
                  value={formData.food}
                  onChange={(e) => updateFormData("food", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Confirm Budget</CardTitle>
              <CardDescription>
                Review your budget details before saving.{" "}
                <Link to="#" className="text-purple-600 hover:underline">
                  Learn More
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Period: {formData.period}</p>
                <p className="text-sm text-gray-500">Transport: {formData.transport} ZAR</p>
                <p className="text-sm text-gray-500">Accommodation: {formData.accommodation} ZAR</p>
                <p className="text-sm text-gray-500">Activities: {formData.activities} ZAR</p>
                <p className="text-sm text-gray-500">Food: {formData.food} ZAR</p>
                <p className="text-sm text-gray-500">
                  Total Budget: {(parseFloat(formData.transport || "0") + parseFloat(formData.accommodation || "0") + parseFloat(formData.activities || "0") + parseFloat(formData.food || "0")).toFixed(2)} ZAR
                </p>
                <p className="text-sm text-gray-500">Date: {new Date("2025-09-14T04:59:00Z").toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</p>
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
      <Card className="w-full max-w-3xl shadow-lg" style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
        <CardHeader className="pb-0 flex justify-between items-center">
          <div className="mb-6 flex items-center justify-between w-full">
            {budgetSteps.map((step) => (
              <div key={step.id} className="relative flex flex-1 flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300",
                    currentStep > step.id
                      ? "bg-purple-600 text-white"
                      : currentStep === step.id
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div
                  className={cn(
                    "mt-2 text-center text-sm font-medium",
                    currentStep >= step.id ? "text-gray-800" : "text-gray-500"
                  )}>
                  {step.title}
                </div>
                {step.id < budgetSteps.length && (
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
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {renderStepContent()}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button onClick={handleNext}>
              <span>{currentStep === 3 ? "Save Budget" : "Continue"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ResourceMeterProps {
  userId: string;
  selectedRange: string;
  onEdit: () => void;
}

export default function ResourceMeter({ userId, selectedRange, onEdit }: ResourceMeterProps) {
  const [budget, setBudget] = useState<Budget>({
    id: Date.now(),
    userId,
    date: new Date("2025-09-14T04:59:00Z").toISOString(),
    totalBudget: 0,
    currentSpent: 0,
    resourceMeter: 0,
    categories: { transport: 0, accommodation: 0, activities: 0, food: 0 },
    alerts: [],
  });

  useEffect(() => {
    const fetchedBudget = dataService.getBudgets(userId, selectedRange)[0] || {
      id: Date.now(),
      userId,
      date: new Date("2025-09-14T04:59:00Z").toISOString(),
      totalBudget: 0,
      currentSpent: 0,
      resourceMeter: 0,
      categories: { transport: 0, accommodation: 0, activities: 0, food: 0 },
      alerts: [],
    };
    setBudget(fetchedBudget);
  }, [userId, selectedRange]);

  return (
    <Card>
      <CardHeader className="pb-3 flex justify-between items-center">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          Resource Meter
          <Info className="h-4 w-4" />
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          {/*<Wallet className="h-4 w-4 mr-1" />*/}
          Edit
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-2 text-xs text-gray-500">Current Spent: {budget.currentSpent} ZAR</div>
        <div className="bg-muted mb-4 h-2 w-full rounded-full">
          <div className="h-2 rounded-full bg-orange-600" style={{ width: `${budget.resourceMeter}%` }}></div>
        </div>
        <div className="mb-3 text-xs text-gray-500">SPENT / REMAINING</div>
        <div className="flex justify-between">
          <div>
            <div className="text-lg font-semibold">{budget.currentSpent} ZAR</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{budget.totalBudget - budget.currentSpent} ZAR</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
