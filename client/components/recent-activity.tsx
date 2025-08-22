"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UserRole } from "@/lib/auth"
import { Package, ArrowUpDown, Users, AlertTriangle, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react"

interface RecentActivityProps {
  selectedBase: string
  userRole: UserRole
  userBaseId?: string
}

const mockActivities = [
  {
    id: 1,
    type: "request_approved",
    description: "Purchase request for 50 M4A1 Rifles approved",
    base: "Base Alpha",
    timestamp: "30 minutes ago",
    status: "approved",
    priority: "high",
    requestedBy: "Lieutenant Johnson",
  },
  {
    id: 2,
    type: "purchase",
    description: "50 M4A1 Rifles purchased",
    base: "Base Alpha",
    timestamp: "2 hours ago",
    status: "completed",
    priority: "medium",
  },
  {
    id: 3,
    type: "request_pending",
    description: "Vehicle transfer request awaiting approval",
    base: "Base Alpha",
    timestamp: "3 hours ago",
    status: "pending",
    priority: "urgent",
    requestedBy: "Sergeant Davis",
  },
  {
    id: 4,
    type: "transfer",
    description: "25 Humvees transferred to Base Bravo",
    base: "Base Alpha",
    timestamp: "4 hours ago",
    status: "in-transit",
    priority: "medium",
  },
  {
    id: 5,
    type: "assignment",
    description: "15 Night Vision Goggles assigned to Squad 3",
    base: "Base Charlie",
    timestamp: "6 hours ago",
    status: "completed",
    priority: "low",
  },
  {
    id: 6,
    type: "request_rejected",
    description: "Ammunition request rejected - insufficient justification",
    base: "Base Alpha",
    timestamp: "7 hours ago",
    status: "rejected",
    priority: "medium",
    requestedBy: "Corporal Wilson",
  },
  {
    id: 7,
    type: "expenditure",
    description: "500 rounds of 5.56mm ammunition expended",
    base: "Base Alpha",
    timestamp: "8 hours ago",
    status: "completed",
    priority: "low",
  },
  {
    id: 8,
    type: "maintenance_alert",
    description: "Vehicle maintenance required for Humvee HV-001",
    base: "Base Bravo",
    timestamp: "10 hours ago",
    status: "alert",
    priority: "high",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "purchase":
      return <Package className="w-4 h-4" />
    case "transfer":
      return <ArrowUpDown className="w-4 h-4" />
    case "assignment":
      return <Users className="w-4 h-4" />
    case "expenditure":
      return <AlertTriangle className="w-4 h-4" />
    case "request_pending":
      return <Clock className="w-4 h-4" />
    case "request_approved":
      return <CheckCircle className="w-4 h-4" />
    case "request_rejected":
      return <XCircle className="w-4 h-4" />
    case "maintenance_alert":
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-approved text-approved-foreground"
    case "approved":
      return "bg-approved text-approved-foreground"
    case "in-transit":
      return "bg-info text-info-foreground"
    case "pending":
      return "bg-pending text-pending-foreground"
    case "rejected":
      return "bg-destructive text-destructive-foreground"
    case "alert":
      return "bg-warning text-warning-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "text-destructive"
    case "high":
      return "text-warning"
    case "medium":
      return "text-info"
    case "low":
      return "text-muted-foreground"
    default:
      return "text-muted-foreground"
  }
}

export function RecentActivity({ selectedBase, userRole, userBaseId }: RecentActivityProps) {
  const filteredActivities = (() => {
    let activities = mockActivities

    if (userRole === "logistics_officer") {
      // Logistics officers see their own requests and general inventory updates
      activities = activities.filter(
        (activity) =>
          activity.requestedBy === "Lieutenant Johnson" || // Their own requests
          ["purchase", "transfer"].includes(activity.type), // General inventory they can view
      )
    } else if (userRole === "base_commander") {
      // Base commanders see activities for their base
      const baseName = `Base ${userBaseId?.split("-")[1]?.charAt(0).toUpperCase()}${userBaseId?.split("-")[1]?.slice(1)}`
      activities = activities.filter((activity) => activity.base === baseName)
    }
    // Admin sees all activities

    return activities.slice(0, 8) // Limit to recent 8 activities
  })()

  return (
    <Card className="shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-military-heading">Recent Activity</CardTitle>
            <CardDescription>
              {userRole === "logistics_officer"
                ? "Your requests and inventory updates"
                : "Latest asset movements and operations"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="focus-military bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-muted/30 transition-all duration-200 shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type.includes("request")
                      ? "bg-primary/10 text-primary"
                      : activity.type === "maintenance_alert"
                        ? "bg-warning/10 text-warning"
                        : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground leading-relaxed">{activity.description}</p>
                    <Badge className={`text-xs ${getStatusColor(activity.status)} flex-shrink-0`}>
                      {activity.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{activity.base}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    {activity.requestedBy && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">by {activity.requestedBy}</span>
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className={`text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                      {activity.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
