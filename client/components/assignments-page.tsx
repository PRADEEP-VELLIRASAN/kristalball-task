"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, Search, Users, AlertTriangle, UserCheck, Minus, Shield } from "lucide-react"
import { NewAssignmentForm } from "@/components/new-assignment-form"
import { NewExpenditureForm } from "@/components/new-expenditure-form"

interface Assignment {
  id: string
  date: string
  equipmentType: string
  itemName: string
  quantity: number
  assignedTo: string
  rank: string
  unit: string
  baseId: string
  baseName: string
  status: "active" | "returned" | "lost" | "damaged"
  assignedBy: string
  returnDate?: string
  notes?: string
}

interface Expenditure {
  id: string
  date: string
  equipmentType: string
  itemName: string
  quantity: number
  reason: string
  baseId: string
  baseName: string
  authorizedBy: string
  unit: string
  operation?: string
  notes?: string
}

const mockAssignments: Assignment[] = [
  {
    id: "ASG-001",
    date: "2024-01-15",
    equipmentType: "weapons",
    itemName: "M4A1 Carbine",
    quantity: 1,
    assignedTo: "Sergeant Johnson",
    rank: "SGT",
    unit: "Alpha Company",
    baseId: "base-alpha",
    baseName: "Base Alpha",
    status: "active",
    assignedBy: "Lieutenant Davis",
    notes: "Standard issue for patrol duty",
  },
  {
    id: "ASG-002",
    date: "2024-01-14",
    equipmentType: "communications",
    itemName: "AN/PRC-152 Radio",
    quantity: 2,
    assignedTo: "Corporal Smith",
    rank: "CPL",
    unit: "Bravo Squad",
    baseId: "base-alpha",
    baseName: "Base Alpha",
    status: "active",
    assignedBy: "Captain Wilson",
  },
  {
    id: "ASG-003",
    date: "2024-01-13",
    equipmentType: "vehicles",
    itemName: "HMMWV M1151",
    quantity: 1,
    assignedTo: "Staff Sergeant Brown",
    rank: "SSG",
    unit: "Charlie Platoon",
    baseId: "base-bravo",
    baseName: "Base Bravo",
    status: "returned",
    assignedBy: "Major Johnson",
    returnDate: "2024-01-15",
  },
]

const mockExpenditures: Expenditure[] = [
  {
    id: "EXP-001",
    date: "2024-01-15",
    equipmentType: "ammunition",
    itemName: "5.56mm NATO Rounds",
    quantity: 500,
    reason: "Training Exercise",
    baseId: "base-alpha",
    baseName: "Base Alpha",
    authorizedBy: "Colonel Smith",
    unit: "Alpha Company",
    operation: "Training Op Bravo",
  },
  {
    id: "EXP-002",
    date: "2024-01-14",
    equipmentType: "medical",
    itemName: "Field Medical Kit",
    quantity: 3,
    reason: "Mission Consumption",
    baseId: "base-charlie",
    baseName: "Base Charlie",
    authorizedBy: "Major Thompson",
    unit: "Medical Corps",
    operation: "Operation Shield",
    notes: "Used during emergency medical response",
  },
  {
    id: "EXP-003",
    date: "2024-01-13",
    equipmentType: "ammunition",
    itemName: "7.62mm NATO Rounds",
    quantity: 200,
    reason: "Combat Operations",
    baseId: "base-bravo",
    baseName: "Base Bravo",
    authorizedBy: "Lieutenant Colonel Davis",
    unit: "Delta Company",
    operation: "Operation Thunder",
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

const getAssignmentStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-chart-3 text-white"
    case "returned":
      return "bg-chart-2 text-white"
    case "lost":
      return "bg-destructive text-destructive-foreground"
    case "damaged":
      return "bg-chart-4 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function AssignmentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all")
  const [selectedBase, setSelectedBase] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showNewAssignmentDialog, setShowNewAssignmentDialog] = useState(false)
  const [showNewExpenditureDialog, setShowNewExpenditureDialog] = useState(false)

  if (!user || !hasPermission(user, "canViewAssignments")) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Shield className="w-16 h-16 text-muted-foreground opacity-50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            {user.role === "logistics_officer"
              ? "Logistics officers do not have access to personnel assignments. This function is restricted to base commanders and administrators for security and operational reasons."
              : "You don't have permission to view assignments."}
          </p>
          {user.role === "logistics_officer" && (
            <p className="text-sm text-muted-foreground mt-2">
              Please contact your base commander if you need information about asset assignments.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Filter assignments based on user role and filters
  const filteredAssignments = mockAssignments.filter((assignment) => {
    // Role-based filtering
    if (user.role === "base_commander" && assignment.baseId !== user.baseId) {
      return false
    }

    // Search filter
    if (
      searchTerm &&
      !assignment.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !assignment.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !assignment.unit.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Equipment type filter
    if (selectedEquipmentType !== "all" && assignment.equipmentType !== selectedEquipmentType) {
      return false
    }

    // Base filter
    if (selectedBase !== "all" && assignment.baseId !== selectedBase) {
      return false
    }

    // Status filter
    if (selectedStatus !== "all" && assignment.status !== selectedStatus) {
      return false
    }

    return true
  })

  // Filter expenditures based on user role and filters
  const filteredExpenditures = mockExpenditures.filter((expenditure) => {
    // Role-based filtering
    if (user.role === "base_commander" && expenditure.baseId !== user.baseId) {
      return false
    }

    // Search filter
    if (
      searchTerm &&
      !expenditure.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !expenditure.reason.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !expenditure.unit.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Equipment type filter
    if (selectedEquipmentType !== "all" && expenditure.equipmentType !== selectedEquipmentType) {
      return false
    }

    // Base filter
    if (selectedBase !== "all" && expenditure.baseId !== selectedBase) {
      return false
    }

    return true
  })

  const totalAssignments = filteredAssignments.length
  const activeAssignments = filteredAssignments.filter((a) => a.status === "active").length
  const totalExpenditures = filteredExpenditures.length
  const totalExpendedQuantity = filteredExpenditures.reduce((sum, exp) => sum + exp.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-military-heading text-foreground">Assignments & Expenditures</h2>
          <p className="text-muted-foreground">Track asset assignments to personnel and record expenditures</p>
        </div>
        <div className="flex gap-2">
          {hasPermission(user, "canCreateAssignments") && (
            <>
              <Dialog open={showNewAssignmentDialog} onOpenChange={setShowNewAssignmentDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 focus-military">
                    <Plus className="w-4 h-4" />
                    New Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-military-heading">Create New Assignment</DialogTitle>
                    <DialogDescription>Assign assets to personnel</DialogDescription>
                  </DialogHeader>
                  <NewAssignmentForm
                    onClose={() => setShowNewAssignmentDialog(false)}
                    userRole={user.role}
                    userBaseId={user.baseId}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={showNewExpenditureDialog} onOpenChange={setShowNewExpenditureDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 focus-military bg-transparent">
                    <Minus className="w-4 h-4" />
                    Record Expenditure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-military-heading">Record Asset Expenditure</DialogTitle>
                    <DialogDescription>Log consumed or expended assets</DialogDescription>
                  </DialogHeader>
                  <NewExpenditureForm
                    onClose={() => setShowNewExpenditureDialog(false)}
                    userRole={user.role}
                    userBaseId={user.baseId}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">All asset assignments</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Assignments</CardTitle>
            <UserCheck className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenditures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{totalExpenditures}</div>
            <p className="text-xs text-muted-foreground">Expenditure records</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Expended</CardTitle>
            <Minus className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalExpendedQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total consumed</p>
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
                  placeholder="Search personnel, items..."
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
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
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
              <Label htmlFor="status-filter">Assignment Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-filter" className="focus-military">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Assignments and Expenditures */}
      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-military-heading">Asset Assignments</CardTitle>
              <CardDescription>Track assets assigned to personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Unit</TableHead>
                      {user.role === "admin" && <TableHead>Base</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.id}</TableCell>
                        <TableCell>{new Date(assignment.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{assignment.itemName}</div>
                            <Badge variant="outline" className="capitalize text-xs">
                              {assignment.equipmentType}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.quantity}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{assignment.assignedTo}</div>
                            <div className="text-sm text-muted-foreground">{assignment.rank}</div>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.unit}</TableCell>
                        {user.role === "admin" && <TableCell>{assignment.baseName}</TableCell>}
                        <TableCell>
                          <Badge className={`${getAssignmentStatusColor(assignment.status)} capitalize`}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{assignment.assignedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredAssignments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No assignments found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenditures">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-military-heading">Asset Expenditures</CardTitle>
              <CardDescription>Record of consumed and expended assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expenditure ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Operation</TableHead>
                      {user.role === "admin" && <TableHead>Base</TableHead>}
                      <TableHead>Authorized By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenditures.map((expenditure) => (
                      <TableRow key={expenditure.id}>
                        <TableCell className="font-medium">{expenditure.id}</TableCell>
                        <TableCell>{new Date(expenditure.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{expenditure.itemName}</div>
                            <Badge variant="outline" className="capitalize text-xs">
                              {expenditure.equipmentType}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{expenditure.quantity.toLocaleString()}</TableCell>
                        <TableCell>{expenditure.reason}</TableCell>
                        <TableCell>{expenditure.unit}</TableCell>
                        <TableCell>{expenditure.operation || "N/A"}</TableCell>
                        {user.role === "admin" && <TableCell>{expenditure.baseName}</TableCell>}
                        <TableCell>{expenditure.authorizedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredExpenditures.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No expenditures found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
