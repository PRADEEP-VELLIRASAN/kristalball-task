"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission, type Request, type RequestStatus } from "@/lib/auth"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react"
import { NewRequestModal } from "@/components/new-request-modal"
import { RequestDetailsModal } from "@/components/request-details-modal"

// Mock request data
const mockRequests: Request[] = [
  {
    id: "req-001",
    type: "purchase",
    status: "pending",
    requestedBy: "logistics1",
    requestedAt: "2024-01-15T10:30:00Z",
    baseId: "base-alpha",
    title: "M4A1 Carbine Purchase Request",
    description: "Request for 50 M4A1 carbines for training purposes",
    priority: "high",
    data: {
      equipmentType: "weapons",
      quantity: 50,
      unitCost: 1200,
      totalCost: 60000,
      supplier: "Defense Contractor Inc.",
      justification: "Required for upcoming training exercises",
    },
  },
  {
    id: "req-002",
    type: "transfer",
    status: "under_review",
    requestedBy: "logistics1",
    requestedAt: "2024-01-14T14:20:00Z",
    reviewedBy: "commander1",
    reviewedAt: "2024-01-15T09:15:00Z",
    baseId: "base-alpha",
    title: "Vehicle Transfer to Base Beta",
    description: "Transfer 3 Humvees to Base Beta for patrol operations",
    priority: "medium",
    data: {
      equipmentType: "vehicles",
      fromBase: "base-alpha",
      toBase: "base-beta",
      assets: [
        { id: "HV-001", type: "Humvee", condition: "Good" },
        { id: "HV-002", type: "Humvee", condition: "Excellent" },
        { id: "HV-003", type: "Humvee", condition: "Fair" },
      ],
    },
  },
  {
    id: "req-003",
    type: "purchase",
    status: "approved",
    requestedBy: "logistics1",
    requestedAt: "2024-01-10T11:45:00Z",
    reviewedBy: "commander1",
    reviewedAt: "2024-01-12T16:30:00Z",
    approvedBy: "admin",
    approvedAt: "2024-01-13T08:20:00Z",
    baseId: "base-alpha",
    title: "Ammunition Resupply",
    description: "5.56mm ammunition for training and operations",
    priority: "urgent",
    data: {
      equipmentType: "ammunition",
      quantity: 10000,
      unitCost: 0.75,
      totalCost: 7500,
      supplier: "Ammo Supply Co.",
    },
  },
  {
    id: "req-004",
    type: "assignment",
    status: "cancelled",
    requestedBy: "logistics1",
    requestedAt: "2024-01-11T09:00:00Z",
    cancelledBy: "admin",
    cancelledAt: "2024-01-12T10:00:00Z",
    baseId: "base-alpha",
    title: "Weapon Assignment Request",
    description: "Assign 10 M16 rifles to new personnel",
    priority: "medium",
    data: {
      equipmentType: "weapons",
      quantity: 10,
      unitCost: 800,
      totalCost: 8000,
      justification: "New personnel need weapons for training",
    },
  },
]

const getStatusIcon = (status: RequestStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />
    case "under_review":
      return <AlertCircle className="w-4 h-4" />
    case "approved":
      return <CheckCircle className="w-4 h-4" />
    case "rejected":
      return <XCircle className="w-4 h-4" />
    case "cancelled":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case "pending":
      return "status-pending"
    case "under_review":
      return "bg-info text-info-foreground"
    case "approved":
      return "status-approved"
    case "rejected":
      return "status-rejected"
    case "cancelled":
      return "bg-muted text-muted-foreground"
    default:
      return "status-pending"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-destructive text-destructive-foreground"
    case "high":
      return "bg-warning text-warning-foreground"
    case "medium":
      return "bg-info text-info-foreground"
    case "low":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function RequestsPage() {
  const { user } = useAuth()
  const [requests] = useState<Request[]>(mockRequests)
  const [filteredRequests, setFilteredRequests] = useState<Request[]>(mockRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  if (!user) return null

  // Filter requests based on user role and permissions
  const getVisibleRequests = () => {
    let visible = requests

    // Role-based filtering
    if (user.role === "logistics_officer") {
      visible = requests.filter((req) => req.requestedBy === user.username)
    } else if (user.role === "base_commander") {
      visible = requests.filter((req) => req.baseId === user.baseId || req.requestedBy === user.username)
    }
    // Admin sees all requests

    // Apply filters
    if (searchTerm) {
      visible = visible.filter(
        (req) =>
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      visible = visible.filter((req) => req.status === statusFilter)
    }

    if (typeFilter !== "all") {
      visible = visible.filter((req) => req.type === typeFilter)
    }

    if (priorityFilter !== "all") {
      visible = visible.filter((req) => req.priority === priorityFilter)
    }

    return visible
  }

  const visibleRequests = getVisibleRequests()

  const getTabRequests = (tab: string) => {
    switch (tab) {
      case "pending":
        return visibleRequests.filter((req) => req.status === "pending")
      case "review":
        return visibleRequests.filter((req) => req.status === "under_review")
      case "approved":
        return visibleRequests.filter((req) => req.status === "approved")
      case "my-requests":
        return visibleRequests.filter((req) => req.requestedBy === user.username)
      default:
        return visibleRequests
    }
  }

  const canCreateRequests = hasPermission(user, "canRequestPurchases") || hasPermission(user, "canRequestTransfers")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-military-heading text-foreground">Request Management</h2>
          <p className="text-muted-foreground">
            {user.role === "logistics_officer"
              ? "Submit and track your equipment requests"
              : user.role === "base_commander"
                ? "Review and manage requests for your base"
                : "Oversee all requests across the system - approve, reject, or cancel as needed"}
          </p>
        </div>

        {canCreateRequests && (
          <Button onClick={() => setShowNewRequest(true)} className="focus-military">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus-military"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="focus-military">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="focus-military">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="focus-military">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                  setPriorityFilter("all")
                }}
                className="focus-military"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {getTabRequests(activeTab).length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Requests Found</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === "my-requests"
                    ? "You haven't submitted any requests yet."
                    : "No requests match your current filters."}
                </p>
                {canCreateRequests && activeTab === "my-requests" && (
                  <Button onClick={() => setShowNewRequest(true)} className="mt-4 focus-military">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Request
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getTabRequests(activeTab).map((request) => (
                <Card key={request.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                          <Badge className={getPriorityColor(request.priority)}>{request.priority.toUpperCase()}</Badge>
                          <Badge variant="outline">{request.type.toUpperCase()}</Badge>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{request.title}</h3>
                          <p className="text-muted-foreground text-sm">{request.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Requested by: {request.requestedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                          {request.data?.totalCost && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Cost: ${request.data.totalCost.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="focus-military"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>

                        {hasPermission(user, "canApproveRequests") &&
                          (request.status === "pending" || request.status === "under_review") && (
                            <Button size="sm" className="focus-military">
                              {user.role === "admin" ? "Manage Request" : "Review"}
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewRequestModal
        open={showNewRequest}
        onOpenChange={setShowNewRequest}
        userRole={user.role}
        userBaseId={user.baseId}
      />

      <RequestDetailsModal
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        userRole={user.role}
      />
    </div>
  )
}
