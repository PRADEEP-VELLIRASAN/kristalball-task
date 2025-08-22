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
import { Plus, Search, Calendar, Package, DollarSign, FileText, AlertCircle } from "lucide-react"
import { NewPurchaseForm } from "@/components/new-purchase-form"

interface Purchase {
  id: string
  date: string
  equipmentType: string
  itemName: string
  quantity: number
  unitCost: number
  totalCost: number
  supplier: string
  baseId: string
  baseName: string
  status: "pending" | "approved" | "delivered" | "cancelled"
  purchasedBy: string
}

const mockPurchases: Purchase[] = [
  {
    id: "PUR-001",
    date: "2024-01-15",
    equipmentType: "weapons",
    itemName: "M4A1 Carbine",
    quantity: 50,
    unitCost: 1200,
    totalCost: 60000,
    supplier: "Defense Contractor A",
    baseId: "base-alpha",
    baseName: "Base Alpha",
    status: "delivered",
    purchasedBy: "Colonel Smith",
  },
  {
    id: "PUR-002",
    date: "2024-01-14",
    equipmentType: "vehicles",
    itemName: "HMMWV M1151",
    quantity: 5,
    unitCost: 85000,
    totalCost: 425000,
    supplier: "Military Vehicles Inc",
    baseId: "base-bravo",
    baseName: "Base Bravo",
    status: "approved",
    purchasedBy: "Major Johnson",
  },
  {
    id: "PUR-003",
    date: "2024-01-13",
    equipmentType: "ammunition",
    itemName: "5.56mm NATO Rounds",
    quantity: 10000,
    unitCost: 0.75,
    totalCost: 7500,
    supplier: "Ammunition Supply Co",
    baseId: "base-alpha",
    baseName: "Base Alpha",
    status: "delivered",
    purchasedBy: "Lieutenant Davis",
  },
  {
    id: "PUR-004",
    date: "2024-01-12",
    equipmentType: "communications",
    itemName: "AN/PRC-152 Radio",
    quantity: 25,
    unitCost: 4500,
    totalCost: 112500,
    supplier: "Communications Tech Ltd",
    baseId: "base-charlie",
    baseName: "Base Charlie",
    status: "pending",
    purchasedBy: "Captain Wilson",
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
    case "approved":
      return "bg-chart-2 text-white"
    case "pending":
      return "bg-chart-4 text-white"
    case "cancelled":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function PurchasesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all")
  const [selectedBase, setSelectedBase] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showNewPurchaseDialog, setShowNewPurchaseDialog] = useState(false)

  if (!user || !hasPermission(user, "canViewPurchases")) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view purchases.</p>
      </div>
    )
  }

  const filteredPurchases = mockPurchases.filter((purchase) => {
    // Role-based filtering
    if (user.role === "base_commander" && purchase.baseId !== user.baseId) {
      return false
    }
    // Logistics officers can view all weapons and vehicles
    if (user.role === "logistics_officer") {
      if (!["weapons", "vehicles"].includes(purchase.equipmentType)) {
        return false
      }
    }

    // Search filter
    if (
      searchTerm &&
      !purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Equipment type filter
    if (selectedEquipmentType !== "all" && purchase.equipmentType !== selectedEquipmentType) {
      return false
    }

    // Base filter
    if (selectedBase !== "all" && purchase.baseId !== selectedBase) {
      return false
    }

    // Status filter
    if (selectedStatus !== "all" && purchase.status !== selectedStatus) {
      return false
    }

    return true
  })

  const totalValue = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0)

  const canCreateDirectly = hasPermission(user, "canCreatePurchases") && user.role !== "logistics_officer"
  const canRequestPurchases = hasPermission(user, "canRequestPurchases") && user.role === "logistics_officer"
  const canApprove = hasPermission(user, "canApproveRequests")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-military-heading text-foreground">Purchases Management</h2>
          <p className="text-muted-foreground">
            {user.role === "logistics_officer"
              ? "View weapons and vehicles inventory - submit requests for new purchases"
              : "Track and manage asset purchases across bases"}
          </p>
        </div>

        <div className="flex gap-2">
          {canRequestPurchases && (
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to requests page with purchase request pre-selected
                window.dispatchEvent(new CustomEvent("navigate-to-requests", { detail: { type: "purchase" } }))
              }}
              className="flex items-center gap-2 focus-military"
            >
              <FileText className="w-4 h-4" />
              Request Purchase
            </Button>
          )}

          {canCreateDirectly && (
            <Dialog open={showNewPurchaseDialog} onOpenChange={setShowNewPurchaseDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 focus-military">
                  <Plus className="w-4 h-4" />
                  New Purchase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-military-heading">Record New Purchase</DialogTitle>
                  <DialogDescription>Add a new asset purchase to the system</DialogDescription>
                </DialogHeader>
                <NewPurchaseForm
                  onClose={() => setShowNewPurchaseDialog(false)}
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
                  You can view weapons and vehicles inventory. To request new purchases, use the "Request Purchase"
                  button which will route your request through the proper approval channels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {user.role === "logistics_officer" ? "Viewable Items" : "Total Purchases"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{filteredPurchases.length}</div>
            <p className="text-xs text-muted-foreground">
              {user.role === "logistics_officer" ? "Weapons & vehicles" : "Purchase orders"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined purchase value</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {canApprove ? "Pending Approvals" : "Pending Items"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">
              {filteredPurchases.filter((p) => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">{canApprove ? "Awaiting approval" : "In pending status"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search items or suppliers..."
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

            {user.role === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="base-filter">Base</Label>
                <Select value={selectedBase} onValueChange={setSelectedBase}>
                  <SelectTrigger id="base-filter" className="focus-military">
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
            )}

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-filter" className="focus-military">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-military-heading">
            {user.role === "logistics_officer" ? "Weapons & Vehicles Inventory" : "Purchase History"}
          </CardTitle>
          <CardDescription>
            {user.role === "logistics_officer"
              ? "View current weapons and vehicles inventory"
              : "Complete record of asset purchases"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  {user.role === "admin" && <TableHead>Base</TableHead>}
                  <TableHead>Status</TableHead>
                  {canApprove && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{purchase.itemName}</div>
                        <div className="text-sm text-muted-foreground">{purchase.supplier}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {purchase.equipmentType}
                      </Badge>
                    </TableCell>
                    <TableCell>{purchase.quantity.toLocaleString()}</TableCell>
                    <TableCell>${purchase.unitCost.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">${purchase.totalCost.toLocaleString()}</TableCell>
                    {user.role === "admin" && <TableCell>{purchase.baseName}</TableCell>}
                    <TableCell>
                      <Badge className={`${getStatusColor(purchase.status)} capitalize`}>{purchase.status}</Badge>
                    </TableCell>
                    {canApprove && (
                      <TableCell>
                        {purchase.status === "pending" && (
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
          {filteredPurchases.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {user.role === "logistics_officer"
                ? "No weapons or vehicles found matching your criteria."
                : "No purchases found matching your criteria."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
