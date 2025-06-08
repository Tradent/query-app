"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useEffect, useState } from "react"
import { fetchUserProfile } from "@/lib/auth/auth-utils"

export function useProfileData() {
  const { user, isAuthenticated } = useAuth()
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    avatar: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfileData = async () => {
      if (isAuthenticated && user?.publicKey) {
        try {
          setLoading(true)
          // In a real app, fetch user data from your backend
          const userData = await fetchUserProfile(user.publicKey.toString())

          setProfileData({
            username: userData.username || `user_${user.publicKey.toString().slice(0, 4)}`,
            email: `${user.publicKey.toString().slice(0, 6)}@example.com`,
            avatar:
              userData.avatar ||
              `/placeholder.svg?height=100&width=100&query=avatar for ${user.publicKey.toString().slice(0, 8)}`,
          })
        } catch (error) {
          console.error("Error loading profile data:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [isAuthenticated, user])

  return {
    profileData,
    loading,
    publicKey: user?.publicKey?.toString(),
  }
}
