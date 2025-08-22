"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserRole } from "@/lib/auth"

interface DashboardFiltersProps {
  selectedBase: string
  setSelectedBase: (base: string) => void
  selectedEquipmentType: string
  setSelectedEquipmentType: (type: string) => void
  dateRange: string
  setDateRange: (range: string) => void
  userRole: UserRole
  userBaseId?: string
}

const bases = [
  { id: "all", name: "All Bases" },
  { id: "base-alpha", name: "Base Alpha" },
  { id: "base-bravo", name: "Base Bravo" },
  { id: "base-charlie", name: "Base Charlie" },
]

const equipmentTypes = [
  { id: "all", name: "All Equipment" },
  { id: "vehicles", name: "Vehicles" },
  { id: "weapons", name: "Weapons" },
  { id: "ammunition", name: "Ammunition" },
  { id: "communications", name: "Communications" },
  { id: "medical", name: "Medical Equipment" },
]

const dateRanges = [
  { id: "7d", name: "Last 7 days" },
  { id: "30d", name: "Last 30 days" },
  { id: "90d", name: "Last 90 days" },
  { id: "1y", name: "Last year" },
]

export function DashboardFilters({
  selectedBase,
  setSelectedBase,
  selectedEquipmentType,
  setSelectedEquipmentType,
  dateRange,
  setDateRange,
  userRole,
  userBaseId,
}: DashboardFiltersProps) {
  const availableBases =
    userRole === "admin"
      ? bases
      : userRole === "base_commander"
        ? bases.filter((base) => base.id === "all" || base.id === userBaseId)
        : bases

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base-select">Base</Label>
            <Select value={selectedBase} onValueChange={setSelectedBase}>
              <SelectTrigger id="base-select">
                <SelectValue placeholder="Select base" />
              </SelectTrigger>
              <SelectContent>
                {availableBases.map((base) => (
                  <SelectItem key={base.id} value={base.id}>
                    {base.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment-select">Equipment Type</Label>
            <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
              <SelectTrigger id="equipment-select">
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-select">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-select">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
