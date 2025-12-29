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

export interface User {
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
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  loginWithGoogle: () => Promise<any>
  signup: (
    email: string,
    username: string,
    password: string,
    referralCode?: string
  ) => Promise<any>
  logout: () => Promise<void>
  updateBalance: (amount: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const generateReferralCode = (username: string) =>
  `${username.slice(0, 3).toUpperCase()}${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  /* ---------- AUTH STATE ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid))
        if (snap.exists()) {
          setUser({
            ...(snap.data() as User),
            emailVerified: fbUser.emailVerified,
          })
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

  /* ---------- UPDATE BALANCE (MINING) ---------- */
  const updateBalance = async (amount: number) => {
    if (!user) return

    const ref = doc(db, "users", user.id)

    await updateDoc(ref, {
      balance: increment(amount),
      totalMined: increment(amount),
    })

    setUser(prev =>
      prev
        ? {
            ...prev,
            balance: prev.balance + amount,
            totalMined: prev.totalMined + amount,
          }
        : prev
    )
  }

  /* ---------- LOGIN ---------- */
  const login = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password)
    await res.user.reload()

    if (!res.user.emailVerified)
      return { success: false, error: "Verify email first" }

    const snap = await getDoc(doc(db, "users", res.user.uid))
    setUser({ ...(snap.data() as User), emailVerified: true })
    setFirebaseUser(res.user)

    return { success: true }
  }

  /* ---------- GOOGLE LOGIN ---------- */
  const loginWithGoogle = async () => {
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
        emailVerified: true,
      }

      await setDoc(ref, { ...data, createdAt: serverTimestamp() })
      setUser(data)
    } else {
      setUser({ ...(snap.data() as User), emailVerified: true })
    }

    setFirebaseUser(fbUser)
    return { success: true }
  }

  /* ---------- SIGNUP WITH REFERRAL ---------- */
  const signup = async (
    email: string,
    username: string,
    password: string,
    referralCode?: string
  ) => {
    let cred: any = null

    try {
      const nameCheck = await getDocs(
        query(collection(db, "users"), where("username", "==", username))
      )
      if (!nameCheck.empty)
        return { success: false, error: "Username taken" }

      cred = await createUserWithEmailAndPassword(auth, email, password)
      const fbUser = cred.user

      const NEW_USER_BONUS = 100
      const REFERRER_BONUS = 150
      let referrerId: string | null = null

      if (referralCode) {
        const refSnap = await getDocs(
          query(
            collection(db, "users"),
            where("referralCode", "==", referralCode)
          )
        )

        if (!refSnap.empty) {
          referrerId = refSnap.docs[0].id

          await updateDoc(doc(db, "users", referrerId), {
            balance: increment(REFERRER_BONUS),
            referralEarnings: increment(REFERRER_BONUS),
            referralsCount: increment(1),
          })
        }
      }

      const userData: any = {
        id: fbUser.uid,
        email,
        username,
        balance: referrerId ? NEW_USER_BONUS : 0,
        totalMined: 0,
        referralCode: generateReferralCode(username),
        referralsCount: 0,
        referralEarnings: 0,
        referredBy: referrerId || undefined,
        emailVerified: false,
        createdAt: serverTimestamp(),
      }

      await setDoc(doc(db, "users", fbUser.uid), userData)

      const settings: ActionCodeSettings = {
        url: `${window.location.origin}/auth`,
        handleCodeInApp: false,
      }

      await sendEmailVerification(fbUser, settings)
      toast.success("Verify email before login")
      await signOut(auth)

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
        loading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
