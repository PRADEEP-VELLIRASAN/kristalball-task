"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { Shield, Lock, User, Users, Package } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(username, password)

    if (!success) {
      setError("Invalid credentials. Please try again.")
    }

    setIsLoading(false)
  }

  const quickLogin = async (demoUsername: string) => {
    setUsername(demoUsername)
    setPassword("password")
    setIsLoading(true)
    setError("")

    const success = await login(demoUsername, "password")

    if (!success) {
      setError("Login failed. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-secondary p-4 military-fade-in">
      <Card className="w-full max-w-md shadow-lg bg-card border border-gray-200 dark:border-gray-700 rounded-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center gradient-primary">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-military-heading text-foreground">Military Asset Management</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Secure access to asset tracking system
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="focus-military"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="focus-military"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground font-medium focus-military"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button
                variant="outline"
                onClick={() => quickLogin("admin")}
                disabled={isLoading}
                className="w-full justify-start focus-military bg-transparent"
              >
                <User className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">System Administrator</div>
                  <div className="text-xs text-muted-foreground">Full system access</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => quickLogin("commander1")}
                disabled={isLoading}
                className="w-full justify-start focus-military bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Base Commander</div>
                  <div className="text-xs text-muted-foreground">Base Alpha operations</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => quickLogin("logistics1")}
                disabled={isLoading}
                className="w-full justify-start focus-military bg-transparent"
              >
                <Package className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Logistics Officer</div>
                  <div className="text-xs text-muted-foreground">Inventory & requests</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground font-medium mb-2">System Features:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Role-based access control</div>
              <div>• Request/approval workflows</div>
              <div>• Asset tracking & management</div>
              <div>• Mobile responsive design</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
