"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

interface AssetChartProps {
  selectedBase: string
  selectedEquipmentType: string
  dateRange: string
}

const generateChartData = (selectedBase: string, selectedEquipmentType: string, dateRange: string) => {
  const baseData = [
    { name: "Vehicles", total: 450, assigned: 380, available: 70 },
    { name: "Weapons", total: 320, assigned: 280, available: 40 },
    { name: "Ammunition", total: 180, assigned: 120, available: 60 },
    { name: "Communications", total: 95, assigned: 75, available: 20 },
    { name: "Medical", total: 135, assigned: 95, available: 40 },
  ]

  // Filter by equipment type
  let filteredData =
    selectedEquipmentType === "all"
      ? baseData
      : baseData.filter((item) => item.name.toLowerCase().includes(selectedEquipmentType.toLowerCase()))

  // Adjust data based on base selection
  if (selectedBase !== "all") {
    filteredData = filteredData.map((item) => ({
      ...item,
      total: Math.floor(item.total * 0.7), // Simulate base-specific data
      assigned: Math.floor(item.assigned * 0.7),
      available: Math.floor(item.available * 0.7),
    }))
  }

  // Adjust data based on date range
  const dateMultiplier = dateRange === "7d" ? 0.8 : dateRange === "90d" ? 1.2 : 1
  return filteredData.map((item) => ({
    ...item,
    total: Math.floor(item.total * dateMultiplier),
    assigned: Math.floor(item.assigned * dateMultiplier),
    available: Math.floor(item.available * dateMultiplier),
  }))
}

const chartConfig = {
  total: {
    label: "Total Assets",
    color: "hsl(var(--chart-1))",
  },
  assigned: {
    label: "Assigned",
    color: "hsl(var(--chart-2))",
  },
  available: {
    label: "Available",
    color: "hsl(var(--chart-3))",
  },
}

export function AssetChart({ selectedBase, selectedEquipmentType, dateRange }: AssetChartProps) {
  const chartData = generateChartData(selectedBase, selectedEquipmentType, dateRange)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-military-heading text-lg">Asset Distribution</CardTitle>
        <CardDescription className="text-sm">
          Current asset allocation across equipment types
          {selectedBase !== "all" && ` • Base: ${selectedBase}`}
          {selectedEquipmentType !== "all" && ` • Type: ${selectedEquipmentType}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} />
              <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                name="Total Assets"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="assigned"
                fill="var(--color-assigned)"
                name="Assigned"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="available"
                fill="var(--color-available)"
                name="Available"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-1">
              {chartData.reduce((sum, item) => sum + item.total, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Assets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-2">
              {chartData.reduce((sum, item) => sum + item.assigned, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Assigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-3">
              {chartData.reduce((sum, item) => sum + item.available, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
