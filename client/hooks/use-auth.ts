"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type User, mockUsers, type AuthState } from "@/lib/auth"

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        const user = mockUsers.find((u) => u.username === username)
        if (user && password === "password") {
          // Simple mock password
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: "military-auth-storage",
    },
  ),
)
