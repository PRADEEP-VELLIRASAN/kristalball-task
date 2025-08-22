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

interface NewAssignmentFormProps {
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

const ranks = [
  "PVT",
  "PFC",
  "SPC",
  "CPL",
  "SGT",
  "SSG",
  "SFC",
  "MSG",
  "1SG",
  "SGM",
  "CSM",
  "2LT",
  "1LT",
  "CPT",
  "MAJ",
  "LTC",
  "COL",
  "BG",
  "MG",
  "LTG",
  "GEN",
]

// Mock available assets for assignment
const mockAssets = [
  { id: "1", name: "M4A1 Carbine", type: "weapons", available: 25 },
  { id: "2", name: "HMMWV M1151", type: "vehicles", available: 8 },
  { id: "3", name: "AN/PRC-152 Radio", type: "communications", available: 15 },
  { id: "4", name: "Night Vision Goggles", type: "weapons", available: 12 },
  { id: "5", name: "Field Medical Kit", type: "medical", available: 20 },
]

export function NewAssignmentForm({ onClose, userRole, userBaseId }: NewAssignmentFormProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    equipmentType: "",
    quantity: "",
    assignedTo: "",
    rank: "",
    unit: "",
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
      !formData.assignedTo ||
      !formData.rank ||
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
      setError(`Only ${selectedAsset.available} units available for assignment.`)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, this would make an API call to create the assignment
      console.log("New assignment:", {
        ...formData,
        quantity: Number(formData.quantity),
        date: new Date().toISOString(),
        status: "active",
      })

      onClose()
    } catch (err) {
      setError("Failed to create assignment. Please try again.")
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
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="e.g., 1"
            required
          />
          {formData.itemName && (
            <p className="text-xs text-muted-foreground">
              Available: {mockAssets.find((a) => a.name === formData.itemName)?.available || 0} units
            </p>
          )}
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To *</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="e.g., Sergeant Johnson"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rank">Rank *</Label>
          <Select value={formData.rank} onValueChange={(value) => setFormData({ ...formData, rank: value })}>
            <SelectTrigger id="rank">
              <SelectValue placeholder="Select rank" />
            </SelectTrigger>
            <SelectContent>
              {ranks.map((rank) => (
                <SelectItem key={rank} value={rank}>
                  {rank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., Alpha Company, Bravo Squad"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes or special instructions..."
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
          {isSubmitting ? "Creating..." : "Create Assignment"}
        </Button>
      </div>
    </form>
  )
}
