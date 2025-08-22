"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface BackButtonProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
}

export function BackButton({ className, variant = "ghost" }: BackButtonProps) {
  const { logout } = useAuth()

  const handleBack = () => {
    logout()
  }

  return (
    <Button variant={variant} size="sm" onClick={handleBack} className={`focus-military nav-transition ${className}`}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Sign In
    </Button>
  )
}
