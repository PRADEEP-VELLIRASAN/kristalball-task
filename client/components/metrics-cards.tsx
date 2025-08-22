"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Package, Users, AlertTriangle, FileText, Clock, CheckCircle } from "lucide-react"
import type { UserRole } from "@/lib/auth"

interface MetricsCardsProps {
  selectedBase: string
  selectedEquipmentType: string
  dateRange: string
  onNetMovementClick: () => void
  userRole: UserRole
  userBaseId?: string
}

const getMockMetrics = (base: string, equipmentType: string, dateRange: string, userRole: UserRole) => {
  const baseMetrics = {
    openingBalance: 1250,
    closingBalance: 1180,
    netMovement: -70,
    assigned: 890,
    expended: 45,
    purchases: 120,
    transferIn: 85,
    transferOut: 275,
    // Advanced metrics
    pendingRequests: 8,
    approvedRequests: 15,
    rejectedRequests: 2,
    criticalLowStock: 3,
    maintenanceRequired: 12,
    readinessScore: 87,
    totalValue: 2450000,
    monthlyBudget: 500000,
    budgetUsed: 320000,
  }

  // Role-specific adjustments
  if (userRole === "logistics_officer") {
    return {
      ...baseMetrics,
      // Logistics officers see limited data
      weaponsCount: 450,
      vehiclesCount: 85,
      myRequests: 5,
      pendingApprovals: 3,
    }
  }

  if (userRole === "base_commander") {
    return {
      ...baseMetrics,
      // Base commanders see base-specific data
      openingBalance: Math.floor(baseMetrics.openingBalance * 0.6),
      closingBalance: Math.floor(baseMetrics.closingBalance * 0.6),
      assigned: Math.floor(baseMetrics.assigned * 0.6),
    }
  }

  return baseMetrics
}

export function MetricsCards({
  selectedBase,
  selectedEquipmentType,
  dateRange,
  onNetMovementClick,
  userRole,
  userBaseId,
}: MetricsCardsProps) {
  const metrics = getMockMetrics(selectedBase, selectedEquipmentType, dateRange, userRole)

  if (userRole === "logistics_officer") {
    return (
      <div className="space-y-6">
        {/* Quick Actions for Logistics Officers */}
        <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg gradient-secondary">
          <CardHeader>
            <CardTitle className="font-military-heading text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 focus-military bg-transparent"
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">Request Purchase</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 focus-military bg-transparent"
              >
                <Package className="w-6 h-6" />
                <span className="text-sm font-medium">Request Transfer</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 focus-military bg-transparent"
              >
                <Clock className="w-6 h-6" />
                <span className="text-sm font-medium">View My Requests</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logistics Officer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weapons Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.weaponsCount?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available weapons</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vehicles Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.vehiclesCount?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available vehicles</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.myRequests}</div>
              <p className="text-xs text-muted-foreground">Submitted requests</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{metrics.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Request Workflow Status - Only for Base Commanders and Admins */}
      {(userRole === "base_commander" || userRole === "admin") && (
        <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="font-military-heading text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Request Workflow Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-pending/10 rounded-lg border border-pending/20">
                <Clock className="w-8 h-8 text-pending" />
                <div>
                  <div className="text-2xl font-bold text-pending">{metrics.pendingRequests}</div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-approved/10 rounded-lg border border-approved/20">
                <CheckCircle className="w-8 h-8 text-approved" />
                <div>
                  <div className="text-2xl font-bold text-approved">{metrics.approvedRequests}</div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <div>
                  <div className="text-2xl font-bold text-destructive">{metrics.rejectedRequests}</div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-info/10 rounded-lg border border-info/20">
                <Package className="w-8 h-8 text-info" />
                <div>
                  <div className="text-2xl font-bold text-info">{metrics.criticalLowStock}</div>
                  <p className="text-sm text-muted-foreground">Critical Stock</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Asset Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opening Balance</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.openingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Assets at period start</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closing Balance</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.closingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current asset count</p>
          </CardContent>
        </Card>

        <Card
          className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
          onClick={onNetMovementClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Movement</CardTitle>
            {metrics.netMovement >= 0 ? (
              <TrendingUp className="h-4 w-4 text-chart-3" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.netMovement >= 0 ? "text-chart-3" : "text-destructive"}`}>
              {metrics.netMovement > 0 ? "+" : ""}
              {metrics.netMovement.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Click for details</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.assigned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Assets in use</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expended</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{metrics.expended.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Assets consumed</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics - Admin Only */}
      {userRole === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Asset Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${metrics.totalValue?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Utilization</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(((metrics.budgetUsed || 0) / (metrics.monthlyBudget || 1)) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                ${metrics.budgetUsed?.toLocaleString()} of ${metrics.monthlyBudget?.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Readiness Score</CardTitle>
              <Badge
                className={
                  (metrics.readinessScore || 0) >= 90
                    ? "bg-approved text-approved-foreground"
                    : (metrics.readinessScore || 0) >= 70
                      ? "bg-warning text-warning-foreground"
                      : "bg-destructive text-destructive-foreground"
                }
              >
                {(metrics.readinessScore || 0) >= 90
                  ? "Excellent"
                  : (metrics.readinessScore || 0) >= 70
                    ? "Good"
                    : "Poor"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.readinessScore}%</div>
              <p className="text-xs text-muted-foreground">Operational readiness</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
