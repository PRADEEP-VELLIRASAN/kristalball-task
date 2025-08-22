export type UserRole = "admin" | "base_commander" | "logistics_officer"

export interface User {
  id: string
  username: string
  role: UserRole
  baseId?: string // For base commanders, which base they manage
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock user data for demonstration
export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    role: "admin",
    name: "System Administrator",
    email: "admin@military.gov",
  },
  {
    id: "2",
    username: "commander1",
    role: "base_commander",
    baseId: "base-alpha",
    name: "Colonel Smith",
    email: "smith@military.gov",
  },
  {
    id: "3",
    username: "logistics1",
    role: "logistics_officer",
    name: "Lieutenant Johnson",
    email: "johnson@military.gov",
  },
]

export const rolePermissions = {
  admin: {
    canViewAllBases: true,
    canManageUsers: true,
    canViewPurchases: true,
    canCreatePurchases: true,
    canViewTransfers: true,
    canCreateTransfers: true,
    canViewAssignments: true,
    canCreateAssignments: true,
    canApproveRequests: true,
    canViewAllRequests: true,
    canManageWorkflow: true,
    canViewReports: true,
    canExportData: true,
  },
  base_commander: {
    canViewAllBases: false,
    canManageUsers: false,
    canViewPurchases: true,
    canCreatePurchases: true,
    canViewTransfers: true,
    canCreateTransfers: true,
    canViewAssignments: true,
    canCreateAssignments: true,
    canApproveRequests: true,
    canViewAllRequests: false,
    canManageWorkflow: false,
    canViewReports: true,
    canExportData: false,
  },
  logistics_officer: {
    canViewAllBases: true,
    canManageUsers: false,
    canViewPurchases: true,
    canCreatePurchases: false, // Can only request purchases, not create directly
    canViewTransfers: true,
    canCreateTransfers: false, // Can only request transfers, not create directly
    canViewAssignments: false,
    canCreateAssignments: false,
    canApproveRequests: false,
    canViewAllRequests: false,
    canManageWorkflow: false,
    canViewReports: false,
    canExportData: false,
    canRequestPurchases: true, // New permission for requesting purchases
    canRequestTransfers: true, // New permission for requesting transfers
  },
}

export type RequestType = "purchase" | "transfer" | "assignment"
export type RequestStatus = "pending" | "under_review" | "approved" | "rejected" | "cancelled"

export interface Request {
  id: string
  type: RequestType
  status: RequestStatus
  requestedBy: string
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  approvedBy?: string
  approvedAt?: string
  baseId: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  data: any // Specific request data (purchase details, transfer details, etc.)
}

export function hasPermission(user: User | null, permission: keyof typeof rolePermissions.admin): boolean {
  if (!user) return false
  return rolePermissions[user.role][permission]
}

export function canAccessBase(user: User | null, baseId: string): boolean {
  if (!user) return false
  if (user.role === "admin") return true
  if (user.role === "base_commander") return user.baseId === baseId
  return true // Logistics officers can work across bases
}
