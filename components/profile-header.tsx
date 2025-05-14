"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase-provider"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { LogOut, Settings } from "lucide-react"

interface ProfileHeaderProps {
  user: User
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)

    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
      <Avatar className="w-24 h-24 border">
        <AvatarImage src="/placeholder-user.jpg" alt={user.email || ""} />
        <AvatarFallback className="text-2xl">{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold">{user.user_metadata?.username || user.email}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
