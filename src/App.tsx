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
import Referrals from "./pages/Referrals"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

// 🔐 UPDATED Protected Route (email verification enforced)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()

  // ⏳ Wait until auth state is resolved
  if (loading) return null

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
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />

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
            {/* 👇 shows verify-email banner when needed */}
            <EmailVerificationBanner />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
