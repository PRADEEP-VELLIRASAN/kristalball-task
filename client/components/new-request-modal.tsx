"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserRole, RequestType } from "@/lib/auth"
import { AlertTriangle } from "lucide-react"

interface NewRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: UserRole
  userBaseId?: string
}

export function NewRequestModal({ open, onOpenChange, userRole, userBaseId }: NewRequestModalProps) {
  const [requestType, setRequestType] = useState<RequestType | "">("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [equipmentType, setEquipmentType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitCost, setUnitCost] = useState("")
  const [supplier, setSupplier] = useState("")
  const [justification, setJustification] = useState("")
  const [targetBase, setTargetBase] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock submission - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setRequestType("")
    setTitle("")
    setDescription("")
    setPriority("medium")
    setEquipmentType("")
    setQuantity("")
    setUnitCost("")
    setSupplier("")
    setJustification("")
    setTargetBase("")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const canRequestPurchases = userRole === "logistics_officer"
  const canRequestTransfers = userRole === "logistics_officer"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-military-heading">Create New Request</DialogTitle>
          <DialogDescription>
            Submit a request for equipment purchase, transfer, or assignment approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="requestType">Request Type *</Label>
            <Select value={requestType} onValueChange={(value) => setRequestType(value as RequestType)}>
              <SelectTrigger className="focus-military">
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                {canRequestPurchases && <SelectItem value="purchase">Equipment Purchase</SelectItem>}
                {canRequestTransfers && <SelectItem value="transfer">Asset Transfer</SelectItem>}
                <SelectItem value="assignment">Personnel Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Request Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of request"
                required
                className="focus-military"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
                <SelectTrigger className="focus-military">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the request"
              required
              className="focus-military"
              rows={3}
            />
          </div>

          {/* Request-specific fields */}
          {requestType === "purchase" && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Purchase Details</CardTitle>
                <CardDescription>Provide details about the equipment to be purchased</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentType">Equipment Type *</Label>
                    <Select value={equipmentType} onValueChange={setEquipmentType}>
                      <SelectTrigger className="focus-military">
                        <SelectValue placeholder="Select equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weapons">Weapons</SelectItem>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                        <SelectItem value="ammunition">Ammunition</SelectItem>
                        <SelectItem value="communication">Communication Equipment</SelectItem>
                        <SelectItem value="medical">Medical Supplies</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Number of units"
                      required
                      className="focus-military"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unitCost">Unit Cost ($)</Label>
                    <Input
                      id="unitCost"
                      type="number"
                      step="0.01"
                      value={unitCost}
                      onChange={(e) => setUnitCost(e.target.value)}
                      placeholder="Cost per unit"
                      className="focus-military"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Preferred Supplier</Label>
                    <Input
                      id="supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="Supplier name"
                      className="focus-military"
                    />
                  </div>
                </div>

                {quantity && unitCost && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Estimated Cost:</span>
                      <Badge variant="secondary" className="text-lg">
                        ${(Number.parseFloat(quantity) * Number.parseFloat(unitCost)).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {requestType === "transfer" && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Transfer Details</CardTitle>
                <CardDescription>Specify the assets and destination for transfer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentType">Equipment Type *</Label>
                    <Select value={equipmentType} onValueChange={setEquipmentType}>
                      <SelectTrigger className="focus-military">
                        <SelectValue placeholder="Select equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weapons">Weapons</SelectItem>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                        <SelectItem value="ammunition">Ammunition</SelectItem>
                        <SelectItem value="communication">Communication Equipment</SelectItem>
                        <SelectItem value="medical">Medical Supplies</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetBase">Destination Base *</Label>
                    <Select value={targetBase} onValueChange={setTargetBase}>
                      <SelectTrigger className="focus-military">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base-alpha">Base Alpha</SelectItem>
                        <SelectItem value="base-beta">Base Beta</SelectItem>
                        <SelectItem value="base-gamma">Base Gamma</SelectItem>
                        <SelectItem value="base-delta">Base Delta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="justification">Justification *</Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why this request is necessary and how it supports mission objectives"
              required
              className="focus-military"
              rows={4}
            />
          </div>

          {/* Warning for logistics officers */}
          {userRole === "logistics_officer" && (
            <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-warning-foreground">Request Review Process</p>
                <p className="text-sm text-muted-foreground">
                  Your request will be sent to the Base Commander for initial review, then forwarded to Admin for final
                  approval. You will be notified of any status changes via the system.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !requestType || !title || !description}
              className="focus-military"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
