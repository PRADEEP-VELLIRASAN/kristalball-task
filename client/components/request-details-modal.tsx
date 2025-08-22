"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Request, UserRole } from "@/lib/auth"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  Package,
  MessageSquare,
  FileText,
} from "lucide-react"

interface RequestDetailsModalProps {
  request: Request | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: UserRole
}

export function RequestDetailsModal({ request, open, onOpenChange, userRole }: RequestDetailsModalProps) {
  const [reviewComment, setReviewComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!request) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-pending" />
      case "under_review":
        return <AlertCircle className="w-5 h-5 text-info" />
      case "approved":
        return <CheckCircle className="w-5 h-5 text-approved" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-rejected" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-muted-foreground" />
      default:
        return <Clock className="w-5 h-5 text-pending" />
    }
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    onOpenChange(false)
  }

  const handleReject = async () => {
    setIsProcessing(true)
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    onOpenChange(false)
  }

  const handleCancel = async () => {
    setIsProcessing(true)
    // Mock API call to cancel the request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    onOpenChange(false)
  }

  const canApprove = userRole === "admin" || (userRole === "base_commander" && request.status === "pending")
  const canReview = userRole === "base_commander" && request.status === "pending"
  const canCancel = userRole === "admin" && (request.status === "pending" || request.status === "under_review")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon(request.status)}
            <div>
              <DialogTitle className="font-military-heading">{request.title}</DialogTitle>
              <DialogDescription>Request ID: {request.id}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-3">
            <Badge
              className={
                request.status === "pending"
                  ? "status-pending"
                  : request.status === "under_review"
                    ? "bg-info text-info-foreground"
                    : request.status === "approved"
                      ? "status-approved"
                      : request.status === "rejected"
                        ? "status-rejected"
                        : request.status === "cancelled"
                          ? "bg-muted text-muted-foreground"
                          : "status-pending"
              }
            >
              {request.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge
              className={
                request.priority === "urgent"
                  ? "bg-destructive text-destructive-foreground"
                  : request.priority === "high"
                    ? "bg-warning text-warning-foreground"
                    : request.priority === "medium"
                      ? "bg-info text-info-foreground"
                      : "bg-muted text-muted-foreground"
              }
            >
              {request.priority.toUpperCase()} PRIORITY
            </Badge>
            <Badge variant="outline">{request.type.toUpperCase()}</Badge>
          </div>

          {/* Request Information */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Requested by: {request.requestedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {new Date(request.requestedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>Base: {request.baseId}</span>
                  </div>
                </div>

                {request.reviewedBy && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Reviewed by: {request.reviewedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Reviewed: {new Date(request.reviewedAt!).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Request-specific Details */}
          {request.type === "purchase" && request.data && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Purchase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Equipment Type</label>
                    <p className="font-semibold capitalize">{request.data.equipmentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                    <p className="font-semibold">{request.data.quantity?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Unit Cost</label>
                    <p className="font-semibold">${request.data.unitCost?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Cost</label>
                    <p className="font-semibold text-lg">${request.data.totalCost?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                    <p className="font-semibold">{request.data.supplier || "TBD"}</p>
                  </div>
                </div>

                {request.data.justification && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Justification</label>
                      <p className="mt-1">{request.data.justification}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {request.type === "transfer" && request.data && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Transfer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Equipment Type</label>
                    <p className="font-semibold capitalize">{request.data.equipmentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From Base</label>
                    <p className="font-semibold">{request.data.fromBase}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">To Base</label>
                    <p className="font-semibold">{request.data.toBase}</p>
                  </div>
                </div>

                {request.data.assets && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Assets to Transfer</label>
                      <div className="mt-2 space-y-2">
                        {request.data.assets.map((asset: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{asset.id}</p>
                              <p className="text-sm text-muted-foreground">{asset.type}</p>
                            </div>
                            <Badge variant="outline">{asset.condition}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Review Section */}
          {(canReview || canApprove) &&
            request.status !== "approved" &&
            request.status !== "rejected" &&
            request.status !== "cancelled" && (
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Review & Decision
                  </CardTitle>
                  <CardDescription>
                    {userRole === "base_commander"
                      ? "Review this request and provide your recommendation"
                      : "Make the final decision on this request"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Review Comments</label>
                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Add your comments about this request..."
                      className="focus-military"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    {canCancel && (
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="text-muted-foreground hover:text-muted-foreground bg-transparent border-muted"
                      >
                        {isProcessing ? "Processing..." : "Cancel Request"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </Button>
                    <Button onClick={handleApprove} disabled={isProcessing} className="focus-military">
                      {isProcessing ? "Processing..." : userRole === "base_commander" ? "Recommend" : "Approve"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Admin Action Summary */}
          {userRole === "admin" &&
            (request.status === "approved" || request.status === "rejected" || request.status === "cancelled") && (
              <Card className="card-elevated bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-approved" />
                    <span className="font-medium">
                      Request {request.status === "cancelled" ? "cancelled" : request.status} by admin
                    </span>
                    {request.approvedAt && (
                      <span className="text-muted-foreground">
                        on {new Date(request.approvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
