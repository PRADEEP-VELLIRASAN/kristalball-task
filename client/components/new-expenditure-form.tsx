"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UserRole } from "@/lib/auth"

interface NewExpenditureFormProps {
  onClose: () => void
  userRole: UserRole
  userBaseId?: string
}

const equipmentTypes = [
  { id: "vehicles", name: "Vehicles" },
  { id: "weapons", name: "Weapons" },
  { id: "ammunition", name: "Ammunition" },
  { id: "communications", name: "Communications" },
  { id: "medical", name: "Medical Equipment" },
]

const bases = [
  { id: "base-alpha", name: "Base Alpha" },
  { id: "base-bravo", name: "Base Bravo" },
  { id: "base-charlie", name: "Base Charlie" },
]

const expenditureReasons = [
  "Training Exercise",
  "Combat Operations",
  "Mission Consumption",
  "Equipment Failure",
  "Maintenance",
  "Emergency Use",
  "Lost/Damaged",
  "Other",
]

// Mock available assets for expenditure
const mockAssets = [
  { id: "1", name: "5.56mm NATO Rounds", type: "ammunition", available: 15000 },
  { id: "2", name: "7.62mm NATO Rounds", type: "ammunition", available: 8500 },
  { id: "3", name: "Field Medical Kit", type: "medical", available: 45 },
  { id: "4", name: "MRE (Meal Ready-to-Eat)", type: "medical", available: 500 },
  { id: "5", name: "Smoke Grenade", type: "weapons", available: 120 },
]

export function NewExpenditureForm({ onClose, userRole, userBaseId }: NewExpenditureFormProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    equipmentType: "",
    quantity: "",
    reason: "",
    unit: "",
    operation: "",
    baseId: userRole === "base_commander" ? userBaseId || "" : "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validation
    if (
      !formData.itemName ||
      !formData.equipmentType ||
      !formData.quantity ||
      !formData.reason ||
      !formData.unit ||
      !formData.baseId
    ) {
      setError("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      setError("Quantity must be a positive number.")
      setIsSubmitting(false)
      return
    }

    // Check availability
    const selectedAsset = mockAssets.find((asset) => asset.name === formData.itemName)
    if (selectedAsset && Number(formData.quantity) > selectedAsset.available) {
      setError(`Only ${selectedAsset.available} units available.`)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, this would make an API call to record the expenditure
      console.log("New expenditure:", {
        ...formData,
        quantity: Number(formData.quantity),
        date: new Date().toISOString(),
      })

      onClose()
    } catch (err) {
      setError("Failed to record expenditure. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableBases = userRole === "admin" ? bases : bases.filter((base) => base.id === userBaseId)
  const availableAssets = mockAssets.filter((asset) =>
    formData.equipmentType ? asset.type === formData.equipmentType : true,
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="equipmentType">Equipment Type *</Label>
          <Select
            value={formData.equipmentType}
            onValueChange={(value) => setFormData({ ...formData, equipmentType: value, itemName: "" })}
          >
            <SelectTrigger id="equipmentType">
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
          <Label htmlFor="itemName">Item Name *</Label>
          <Select
            value={formData.itemName}
            onValueChange={(value) => setFormData({ ...formData, itemName: value })}
            disabled={!formData.equipmentType}
          >
            <SelectTrigger id="itemName">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {availableAssets.map((asset) => (
                <SelectItem key={asset.id} value={asset.name}>
                  {asset.name} ({asset.available} available)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity Expended *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="e.g., 500"
            required
          />
          {formData.itemName && (
            <p className="text-xs text-muted-foreground">
              Available: {mockAssets.find((a) => a.name === formData.itemName)?.available || 0} units
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Expenditure *</Label>
          <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
            <SelectTrigger id="reason">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {expenditureReasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., Alpha Company, Medical Corps"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="operation">Operation/Exercise</Label>
          <Input
            id="operation"
            value={formData.operation}
            onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
            placeholder="e.g., Operation Thunder, Training Op Bravo"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="baseId">Base *</Label>
          <Select
            value={formData.baseId}
            onValueChange={(value) => setFormData({ ...formData, baseId: value })}
            disabled={userRole === "base_commander"}
          >
            <SelectTrigger id="baseId">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional details about the expenditure..."
          rows={3}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record Expenditure"}
        </Button>
      </div>
    </form>
  )
}
