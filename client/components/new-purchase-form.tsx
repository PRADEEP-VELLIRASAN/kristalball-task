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

interface NewPurchaseFormProps {
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

export function NewPurchaseForm({ onClose, userRole, userBaseId }: NewPurchaseFormProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    equipmentType: "",
    quantity: "",
    unitCost: "",
    supplier: "",
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
      !formData.unitCost ||
      !formData.supplier ||
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

    if (isNaN(Number(formData.unitCost)) || Number(formData.unitCost) <= 0) {
      setError("Unit cost must be a positive number.")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, this would make an API call to save the purchase
      console.log("New purchase:", {
        ...formData,
        quantity: Number(formData.quantity),
        unitCost: Number(formData.unitCost),
        totalCost: Number(formData.quantity) * Number(formData.unitCost),
        date: new Date().toISOString(),
        status: "pending",
      })

      onClose()
    } catch (err) {
      setError("Failed to create purchase. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableBases = userRole === "admin" ? bases : bases.filter((base) => base.id === userBaseId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="itemName">Item Name *</Label>
          <Input
            id="itemName"
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            placeholder="e.g., M4A1 Carbine"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipmentType">Equipment Type *</Label>
          <Select
            value={formData.equipmentType}
            onValueChange={(value) => setFormData({ ...formData, equipmentType: value })}
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
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="e.g., 50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitCost">Unit Cost ($) *</Label>
          <Input
            id="unitCost"
            type="number"
            min="0"
            step="0.01"
            value={formData.unitCost}
            onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
            placeholder="e.g., 1200.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier *</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="e.g., Defense Contractor A"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseId">Destination Base *</Label>
          <Select value={formData.baseId} onValueChange={(value) => setFormData({ ...formData, baseId: value })}>
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

      {formData.quantity && formData.unitCost && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Cost:</span>
            <span className="text-lg font-bold">
              ${(Number(formData.quantity) * Number(formData.unitCost)).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes or specifications..."
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
          {isSubmitting ? "Creating..." : "Create Purchase"}
        </Button>
      </div>
    </form>
  )
}
