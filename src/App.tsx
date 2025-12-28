"use client"

import type React from "react"

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner"

import Index from "./pages/Index"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Mining from "./pages/Mining"
import WalletPage from "./pages/WalletPage"
import Games from "./pages/Games"
import GamePlay from "./pages/GamePlay"
import Referrals from "./pages/Referrals"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

/**
 * 🔐 ProtectedRoute
 * - Enforces login
 * - Enforces email verification
 * - Avoids blank screen during auth loading
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()

  // ⏳ Wait for Firebase auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    )
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // ❌ Logged in but email not verified
  if (!user?.emailVerified) {
    return <Navigate to="/auth?verify=true" replace />
  }

  // ✅ Logged in + verified
  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌐 Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />

      {/* 🔒 Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mining"
        element={
          <ProtectedRoute>
            <Mining />
          </ProtectedRoute>
        }
      />

      <Route
        path="/games"
        element={
          <ProtectedRoute>
            <Games />
          </ProtectedRoute>
        }
      />

      {/* 🎮 GameDistribution single game page */}
      <Route
        path="/games/:gamePath"
        element={
          <ProtectedRoute>
            <GamePlay />
          </ProtectedRoute>
        }
      />

      <Route
        path="/referrals"
        element={
          <ProtectedRoute>
            <Referrals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        }
      />

      {/* ❓ 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* 📧 Email verification banner */}
            <EmailVerificationBanner />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
