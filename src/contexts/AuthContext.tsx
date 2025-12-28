"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  ActionCodeSettings,
} from "firebase/auth"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { auth, googleProvider, db } from "@/lib/firebase"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  username: string
  balance: number
  totalMined: number
  referralCode: string
  referralsCount: number
  referralEarnings: number
  referredBy?: string
  photoURL?: string
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signup: (
    email: string,
    username: string,
    password: string,
    referralCode?: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const generateReferralCode = (username: string) =>
  `${username.substring(0, 3).toUpperCase()}${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔄 Auth state sync
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid))
        if (snap.exists()) {
          setUser({ ...(snap.data() as User), emailVerified: fbUser.emailVerified })
          setFirebaseUser(fbUser)
        }
      } else {
        setUser(null)
        setFirebaseUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // ---------------- LOGIN ----------------
  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      await res.user.reload()

      const snap = await getDoc(doc(db, "users", res.user.uid))
      if (!snap.exists()) return { success: false, error: "User data not found" }

      setUser({ ...(snap.data() as User), emailVerified: res.user.emailVerified })
      setFirebaseUser(res.user)
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  // ---------------- GOOGLE LOGIN ----------------
  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider)
      const fbUser = res.user
      const ref = doc(db, "users", fbUser.uid)
      const snap = await getDoc(ref)

      if (!snap.exists()) {
        const username =
          fbUser.displayName?.replace(/\s+/g, "") ||
          fbUser.email!.split("@")[0]

        const data: User = {
          id: fbUser.uid,
          email: fbUser.email!,
          username,
          balance: 0,
          totalMined: 0,
          referralCode: generateReferralCode(username),
          referralsCount: 0,
          referralEarnings: 0,
          photoURL: fbUser.photoURL || undefined,
          emailVerified: true,
        }

        await setDoc(ref, { ...data, createdAt: serverTimestamp() })
        setUser(data)
      } else {
        setUser({ ...(snap.data() as User), emailVerified: true })
      }

      setFirebaseUser(fbUser)
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  // ---------------- SIGNUP (EMAIL) ----------------
  const signup = async (email: string, username: string, password: string, referralCode?: string) => {
    let cred: any = null
    try {
      const nameSnap = await getDocs(
        query(collection(db, "users"), where("username", "==", username))
      )
      if (!nameSnap.empty) return { success: false, error: "Username already taken" }

      cred = await createUserWithEmailAndPassword(auth, email, password)
      const fbUser = cred.user

      let referrerId: string | undefined
      let bonus = 0

      if (referralCode) {
        const refSnap = await getDocs(
          query(collection(db, "users"), where("referralCode", "==", referralCode))
        )
        if (!refSnap.empty) {
          referrerId = refSnap.docs[0].id
          bonus = 10

          await updateDoc(doc(db, "users", referrerId), {
            referralsCount: increment(1),
            balance: increment(15),
            referralEarnings: increment(15),
          })
        }
      }

      const userData: any = {
        id: fbUser.uid,
        email,
        username,
        balance: bonus,
        totalMined: 0,
        referralCode: generateReferralCode(username),
        referralsCount: 0,
        referralEarnings: 0,
        emailVerified: false,
        createdAt: serverTimestamp(),
      }

      if (referrerId) userData.referredBy = referrerId

      await setDoc(doc(db, "users", fbUser.uid), userData)

      const settings: ActionCodeSettings = {
        url: `${window.location.origin}/auth`,
        handleCodeInApp: false,
      }
      await sendEmailVerification(fbUser, settings)

      toast.success("Verification email sent. Please verify before login.")
      await signOut(auth) // 🔒 force logout until verification

      return { success: true }
    } catch (e: any) {
      if (cred) await cred.user.delete()
      return { success: false, error: e.message }
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
