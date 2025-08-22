"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react"

interface NetMovementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBase: string
  selectedEquipmentType: string
  dateRange: string
}

export function NetMovementModal({
  open,
  onOpenChange,
  selectedBase,
  selectedEquipmentType,
  dateRange,
}: NetMovementModalProps) {
  // Mock data - in real app, this would come from API
  const movementData = {
    purchases: 120,
    transferIn: 85,
    transferOut: 275,
    netMovement: -70,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-military-heading">Net Movement Details</DialogTitle>
          <DialogDescription>Detailed breakdown of asset movements for the selected period</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Purchases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Purchases</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">+{movementData.purchases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">New acquisitions</p>
            </CardContent>
          </Card>

          {/* Transfer In */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transfer In</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">+{movementData.transferIn.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Received from other bases</p>
            </CardContent>
          </Card>

          {/* Transfer Out */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transfer Out</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">-{movementData.transferOut.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sent to other bases</p>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg font-military-heading">Net Movement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Purchases + Transfer In - Transfer Out</span>
              <div
                className={`text-xl font-bold ${movementData.netMovement >= 0 ? "text-chart-3" : "text-destructive"}`}
              >
                {movementData.netMovement > 0 ? "+" : ""}
                {movementData.netMovement.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {movementData.purchases} + {movementData.transferIn} - {movementData.transferOut} ={" "}
              {movementData.netMovement}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
