"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/auth"

interface NewTransferFormProps {
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

// Mock available assets for transfer
const mockAssets = [
  { id: "1", name: "HMMWV M1151", type: "vehicles", available: 12 },
  { id: "2", name: "M4A1 Carbine", type: "weapons", available: 45 },
  { id: "3", name: "5.56mm NATO Rounds", type: "ammunition", available: 8500 },
  { id: "4", name: "AN/PRC-152 Radio", type: "communications", available: 18 },
  { id: "5", name: "Field Medical Kit", type: "medical", available: 32 },
]

export function NewTransferForm({ onClose, userRole, userBaseId }: NewTransferFormProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    equipmentType: "",
    quantity: "",
    fromBaseId: userRole === "base_commander" ? userBaseId || "" : "",
    toBaseId: "",
    priority: "normal",
    notes: "",
  })
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date>()
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
      !formData.fromBaseId ||
      !formData.toBaseId
    ) {
      setError("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    if (formData.fromBaseId === formData.toBaseId) {
      setError("Source and destination bases must be different.")
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
      setError(`Only ${selectedAsset.available} units available for transfer.`)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, this would make an API call to create the transfer
      console.log("New transfer:", {
        ...formData,
        quantity: Number(formData.quantity),
        estimatedDelivery: estimatedDelivery?.toISOString(),
        date: new Date().toISOString(),
        status: "pending",
      })

      onClose()
    } catch (err) {
      setError("Failed to create transfer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableBases = bases.filter((base) => {
    if (userRole === "base_commander") {
      return base.id === userBaseId || formData.fromBaseId !== base.id
    }
    return true
  })

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
            placeholder="e.g., 5"
            required
          />
          {formData.itemName && (
            <p className="text-xs text-muted-foreground">
              Available: {mockAssets.find((a) => a.name === formData.itemName)?.available || 0} units
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromBaseId">From Base *</Label>
          <Select
            value={formData.fromBaseId}
            onValueChange={(value) => setFormData({ ...formData, fromBaseId: value })}
            disabled={userRole === "base_commander"}
          >
            <SelectTrigger id="fromBaseId">
              <SelectValue placeholder="Select source base" />
            </SelectTrigger>
            <SelectContent>
              {bases.map((base) => (
                <SelectItem key={base.id} value={base.id}>
                  {base.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toBaseId">To Base *</Label>
          <Select value={formData.toBaseId} onValueChange={(value) => setFormData({ ...formData, toBaseId: value })}>
            <SelectTrigger id="toBaseId">
              <SelectValue placeholder="Select destination base" />
            </SelectTrigger>
            <SelectContent>
              {availableBases
                .filter((base) => base.id !== formData.fromBaseId)
                .map((base) => (
                  <SelectItem key={base.id} value={base.id}>
                    {base.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Estimated Delivery Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !estimatedDelivery && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {estimatedDelivery ? format(estimatedDelivery, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={estimatedDelivery}
              onSelect={setEstimatedDelivery}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
          {isSubmitting ? "Creating..." : "Create Transfer"}
        </Button>
      </div>
    </form>
  )
}
