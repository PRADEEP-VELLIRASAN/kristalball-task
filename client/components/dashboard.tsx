"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth"
import {
  Shield,
  Package,
  TrendingUp,
  ArrowUpDown,
  Filter,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  FileText,
} from "lucide-react"
import { DashboardFilters } from "@/components/dashboard-filters"
import { MetricsCards } from "@/components/metrics-cards"
import { AssetChart } from "@/components/asset-chart"
import { RecentActivity } from "@/components/recent-activity"
import { NetMovementModal } from "@/components/net-movement-modal"
import { PurchasesPage } from "@/components/purchases-page"
import { TransfersPage } from "@/components/transfers-page"
import { AssignmentsPage } from "@/components/assignments-page"
import { RequestsPage } from "@/components/requests-page"
import { BackButton } from "@/components/ui/back-button"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [showNetMovement, setShowNetMovement] = useState(false)
  const [selectedBase, setSelectedBase] = useState("all")
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all")
  const [dateRange, setDateRange] = useState("30d")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")

  useEffect(() => {
    const handleNavigateToRequests = (event: any) => {
      setCurrentPage("requests")
      setSidebarOpen(false)
    }

    window.addEventListener("navigate-to-requests", handleNavigateToRequests)
    return () => window.removeEventListener("navigate-to-requests", handleNavigateToRequests)
  }, [])

  if (!user) return null

  const getPageTitle = () => {
    switch (currentPage) {
      case "purchases":
        return "Purchase Management"
      case "transfers":
        return "Transfer Management"
      case "assignments":
        return "Assignment Management"
      case "requests":
        return "Request Management"
      default:
        return "Dashboard Overview"
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "purchases":
        return <PurchasesPage />
      case "transfers":
        return <TransfersPage />
      case "assignments":
        return <AssignmentsPage />
      case "requests":
        return <RequestsPage />
      default:
        return (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-military-heading text-foreground">Asset Overview</h2>
                <p className="text-muted-foreground">Monitor and manage military assets across all bases</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 focus-military"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <DashboardFilters
                selectedBase={selectedBase}
                setSelectedBase={setSelectedBase}
                selectedEquipmentType={selectedEquipmentType}
                setSelectedEquipmentType={setSelectedEquipmentType}
                dateRange={dateRange}
                setDateRange={setDateRange}
                userRole={user.role}
                userBaseId={user.baseId}
              />
            )}

            {/* Metrics Cards */}
            <MetricsCards
              selectedBase={selectedBase}
              selectedEquipmentType={selectedEquipmentType}
              dateRange={dateRange}
              onNetMovementClick={() => setShowNetMovement(true)}
              userRole={user.role}
              userBaseId={user.baseId}
            />

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AssetChart
                selectedBase={selectedBase}
                selectedEquipmentType={selectedEquipmentType}
                dateRange={dateRange}
              />
              <RecentActivity selectedBase={selectedBase} userRole={user.role} userBaseId={user.baseId} />
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background military-fade-in">
      {/* Enhanced Header with Back Button */}
      <header className="bg-card border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden nav-transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="flex items-center gap-3">
              <BackButton variant="ghost" className="hidden sm:flex" />
              <div className="flex items-center gap-2">
                <Shield className="w-7 h-7 text-primary" />
                <div>
                  <h1 className="text-xl font-military-heading text-foreground">Military Asset Management</h1>
                  <p className="text-xs text-muted-foreground hidden md:block">{getPageTitle()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="focus-military hidden md:flex">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="focus-military hidden md:flex">
              <Settings className="w-4 h-4" />
            </Button>

            <Badge variant="secondary" className="hidden sm:flex gradient-primary text-white">
              {user.role.replace("_", " ").toUpperCase()}
            </Badge>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive focus-military"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg
          transform nav-transition lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-4 border-b border-sidebar-border bg-gradient-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-medium text-sidebar-foreground text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role.replace("_", " ")}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <div className="lg:hidden mb-4">
              <BackButton variant="outline" className="w-full" />
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start nav-transition focus-military ${
                currentPage === "dashboard"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => {
                setCurrentPage("dashboard")
                setSidebarOpen(false)
              }}
            >
              <Package className="w-4 h-4 mr-3" />
              Dashboard
            </Button>

            {hasPermission(user, "canViewPurchases") && (
              <Button
                variant="ghost"
                className={`w-full justify-start nav-transition focus-military ${
                  currentPage === "purchases"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                onClick={() => {
                  setCurrentPage("purchases")
                  setSidebarOpen(false)
                }}
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                Purchases
              </Button>
            )}

            {hasPermission(user, "canViewTransfers") && (
              <Button
                variant="ghost"
                className={`w-full justify-start nav-transition focus-military ${
                  currentPage === "transfers"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                onClick={() => {
                  setCurrentPage("transfers")
                  setSidebarOpen(false)
                }}
              >
                <ArrowUpDown className="w-4 h-4 mr-3" />
                Transfers
              </Button>
            )}

            {hasPermission(user, "canViewAssignments") && (
              <Button
                variant="ghost"
                className={`w-full justify-start nav-transition focus-military ${
                  currentPage === "assignments"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                onClick={() => {
                  setCurrentPage("assignments")
                  setSidebarOpen(false)
                }}
              >
                <Shield className="w-4 h-4 mr-3" />
                Assignments
              </Button>
            )}

            <Button
              variant="ghost"
              className={`w-full justify-start nav-transition focus-military ${
                currentPage === "requests"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => {
                setCurrentPage("requests")
                setSidebarOpen(false)
              }}
            >
              <FileText className="w-4 h-4 mr-3" />
              Requests
            </Button>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden nav-transition"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Main Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 military-fade-in">
          {currentPage !== "dashboard" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("dashboard")}
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Button>
              <span>/</span>
              <span className="text-foreground font-medium">{getPageTitle()}</span>
            </div>
          )}

          {renderCurrentPage()}
        </main>
      </div>

      {/* Net Movement Modal */}
      <NetMovementModal
        open={showNetMovement}
        onOpenChange={setShowNetMovement}
        selectedBase={selectedBase}
        selectedEquipmentType={selectedEquipmentType}
        dateRange={dateRange}
      />
    </div>
  )
}
