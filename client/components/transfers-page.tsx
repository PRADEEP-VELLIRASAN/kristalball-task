"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth"
import { Plus, Search, ArrowUpDown, Clock, CheckCircle, XCircle, Truck, FileText, AlertCircle } from "lucide-react"
import { NewTransferForm } from "@/components/new-transfer-form"

interface Transfer {
  id: string
  date: string
  equipmentType: string
  itemName: string
  quantity: number
  fromBaseId: string
  fromBaseName: string
  toBaseId: string
  toBaseName: string
  status: "pending" | "in-transit" | "delivered" | "cancelled"
  requestedBy: string
  approvedBy?: string
  estimatedDelivery?: string
  actualDelivery?: string
  notes?: string
}

const mockTransfers: Transfer[] = [
  {
    id: "TRF-001",
    date: "2024-01-15",
    equipmentType: "vehicles",
    itemName: "HMMWV M1151",
    quantity: 3,
    fromBaseId: "base-alpha",
    fromBaseName: "Base Alpha",
    toBaseId: "base-bravo",
    toBaseName: "Base Bravo",
    status: "delivered",
    requestedBy: "Major Johnson",
    approvedBy: "Colonel Smith",
    estimatedDelivery: "2024-01-18",
    actualDelivery: "2024-01-17",
    notes: "Urgent transfer for mission support",
  },
  {
    id: "TRF-002",
    date: "2024-01-14",
    equipmentType: "weapons",
    itemName: "M249 SAW",
    quantity: 10,
    fromBaseId: "base-charlie",
    fromBaseName: "Base Charlie",
    toBaseId: "base-alpha",
    toBaseName: "Base Alpha",
    status: "in-transit",
    requestedBy: "Captain Wilson",
    approvedBy: "Colonel Smith",
    estimatedDelivery: "2024-01-16",
  },
  {
    id: "TRF-003",
    date: "2024-01-13",
    equipmentType: "ammunition",
    itemName: "7.62mm NATO Rounds",
    quantity: 5000,
    fromBaseId: "base-bravo",
    fromBaseName: "Base Bravo",
    toBaseId: "base-charlie",
    toBaseName: "Base Charlie",
    status: "pending",
    requestedBy: "Lieutenant Davis",
    notes: "Awaiting approval for training exercise",
  },
  {
    id: "TRF-004",
    date: "2024-01-12",
    equipmentType: "medical",
    itemName: "Field Medical Kit",
    quantity: 25,
    fromBaseId: "base-alpha",
    fromBaseName: "Base Alpha",
    toBaseId: "base-bravo",
    toBaseName: "Base Bravo",
    status: "delivered",
    requestedBy: "Medic Thompson",
    approvedBy: "Colonel Smith",
    estimatedDelivery: "2024-01-14",
    actualDelivery: "2024-01-14",
  },
]

const equipmentTypes = [
  { id: "all", name: "All Equipment" },
  { id: "vehicles", name: "Vehicles" },
  { id: "weapons", name: "Weapons" },
  { id: "ammunition", name: "Ammunition" },
  { id: "communications", name: "Communications" },
  { id: "medical", name: "Medical Equipment" },
]

const bases = [
  { id: "all", name: "All Bases" },
  { id: "base-alpha", name: "Base Alpha" },
  { id: "base-bravo", name: "Base Bravo" },
  { id: "base-charlie", name: "Base Charlie" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-chart-3 text-white"
    case "in-transit":
      return "bg-chart-2 text-white"
    case "pending":
      return "bg-chart-4 text-white"
    case "cancelled":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4" />
    case "in-transit":
      return <Truck className="w-4 h-4" />
    case "pending":
      return <Clock className="w-4 h-4" />
    case "cancelled":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export function TransfersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all")
  const [selectedFromBase, setSelectedFromBase] = useState("all")
  const [selectedToBase, setSelectedToBase] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showNewTransferDialog, setShowNewTransferDialog] = useState(false)

  if (!user || !hasPermission(user, "canViewTransfers")) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view transfers.</p>
      </div>
    )
  }

  const filteredTransfers = mockTransfers.filter((transfer) => {
    // Role-based filtering
    if (user.role === "base_commander") {
      if (transfer.fromBaseId !== user.baseId && transfer.toBaseId !== user.baseId) {
        return false
      }
    }
    if (user.role === "logistics_officer") {
      if (!["weapons", "vehicles"].includes(transfer.equipmentType)) {
        return false
      }
    }

    // Search filter
    if (
      searchTerm &&
      !transfer.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transfer.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Equipment type filter
    if (selectedEquipmentType !== "all" && transfer.equipmentType !== selectedEquipmentType) {
      return false
    }

    // From base filter
    if (selectedFromBase !== "all" && transfer.fromBaseId !== selectedFromBase) {
      return false
    }

    // To base filter
    if (selectedToBase !== "all" && transfer.toBaseId !== selectedToBase) {
      return false
    }

    // Status filter
    if (selectedStatus !== "all" && transfer.status !== selectedStatus) {
      return false
    }

    return true
  })

  const totalTransfers = filteredTransfers.length
  const pendingTransfers = filteredTransfers.filter((t) => t.status === "pending").length
  const inTransitTransfers = filteredTransfers.filter((t) => t.status === "in-transit").length

  const canCreateDirectly = hasPermission(user, "canCreateTransfers") && user.role !== "logistics_officer"
  const canRequestTransfers = hasPermission(user, "canRequestTransfers") && user.role === "logistics_officer"
  const canApprove = hasPermission(user, "canApproveRequests")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-military-heading text-foreground">Transfer Management</h2>
          <p className="text-muted-foreground">
            {user.role === "logistics_officer"
              ? "View weapons and vehicles transfers - submit requests for new transfers"
              : "Manage asset transfers between military bases"}
          </p>
        </div>

        <div className="flex gap-2">
          {canRequestTransfers && (
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to requests page with transfer request pre-selected
                window.dispatchEvent(new CustomEvent("navigate-to-requests", { detail: { type: "transfer" } }))
              }}
              className="flex items-center gap-2 focus-military"
            >
              <FileText className="w-4 h-4" />
              Request Transfer
            </Button>
          )}

          {canCreateDirectly && (
            <Dialog open={showNewTransferDialog} onOpenChange={setShowNewTransferDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 focus-military">
                  <Plus className="w-4 h-4" />
                  New Transfer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-military-heading">Create New Transfer</DialogTitle>
                  <DialogDescription>Transfer assets between bases</DialogDescription>
                </DialogHeader>
                <NewTransferForm
                  onClose={() => setShowNewTransferDialog(false)}
                  userRole={user.role}
                  userBaseId={user.baseId}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {user.role === "logistics_officer" && (
        <Card className="border-info bg-info/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-info mt-0.5" />
              <div>
                <h4 className="font-semibold text-info-foreground">Logistics Officer View</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You can view weapons and vehicles transfers. To request new transfers, use the "Request Transfer"
                  button which will route your request through the proper approval channels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {user.role === "logistics_officer" ? "Viewable Transfers" : "Total Transfers"}
            </CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalTransfers}</div>
            <p className="text-xs text-muted-foreground">
              {user.role === "logistics_officer" ? "Weapons & vehicles" : "All transfer requests"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {canApprove ? "Pending Approvals" : "Pending"}
            </CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{pendingTransfers}</div>
            <p className="text-xs text-muted-foreground">{canApprove ? "Awaiting approval" : "In pending status"}</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{inTransitTransfers}</div>
            <p className="text-xs text-muted-foreground">Currently moving</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              {filteredTransfers.filter((t) => t.status === "delivered").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 focus-military"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment-filter">Equipment Type</Label>
              <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
                <SelectTrigger id="equipment-filter" className="focus-military">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {user.role === "logistics_officer" ? (
                    <>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="weapons">Weapons</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                    </>
                  ) : (
                    equipmentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-base-filter">From Base</Label>
              <Select value={selectedFromBase} onValueChange={setSelectedFromBase}>
                <SelectTrigger id="from-base-filter" className="focus-military">
                  <SelectValue />
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
              <Label htmlFor="to-base-filter">To Base</Label>
              <Select value={selectedToBase} onValueChange={setSelectedToBase}>
                <SelectTrigger id="to-base-filter" className="focus-military">
                  <SelectValue />
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
              <Label htmlFor="status-filter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-filter" className="focus-military">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-military-heading">
            {user.role === "logistics_officer" ? "Weapons & Vehicles Transfers" : "Transfer History"}
          </CardTitle>
          <CardDescription>
            {user.role === "logistics_officer"
              ? "View current weapons and vehicles transfer history"
              : "Complete record of asset transfers between bases"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  {canApprove && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.id}</TableCell>
                    <TableCell>{new Date(transfer.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transfer.itemName}</div>
                        <Badge variant="outline" className="capitalize text-xs">
                          {transfer.equipmentType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{transfer.quantity.toLocaleString()}</TableCell>
                    <TableCell>{transfer.fromBaseName}</TableCell>
                    <TableCell>{transfer.toBaseName}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(transfer.status)} capitalize flex items-center gap-1 w-fit`}>
                        {getStatusIcon(transfer.status)}
                        {transfer.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{transfer.requestedBy}</TableCell>
                    <TableCell>
                      {transfer.estimatedDelivery ? new Date(transfer.estimatedDelivery).toLocaleDateString() : "TBD"}
                    </TableCell>
                    {canApprove && (
                      <TableCell>
                        {transfer.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-transparent">
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs text-destructive bg-transparent"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredTransfers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {user.role === "logistics_officer"
                ? "No weapons or vehicles transfers found matching your criteria."
                : "No transfers found matching your criteria."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
