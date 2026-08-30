"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarMark } from "@/components/avatar-mark"
import { IconError } from "@/components/icons"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (username === "user" && password === "user123") {
      setError(false)
      router.push("/tenants")
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-raised)] bg-secondary/30 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-card border border-border rounded-xl p-10 shadow-lg flex flex-col gap-6">
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <AvatarMark initials="CA" size="sm" variant="brand" shape="rounded" />
            <span className="text-lg font-bold tracking-tight text-foreground">Cloud Alpha</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="user" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[var(--input-bg)] bg-background"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs font-medium text-primary hover:underline">
                Forgot?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[var(--input-bg)] bg-background"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2.5 text-[13px] text-destructive flex items-center gap-2 mt-1">
              <IconError className="h-4 w-4 shrink-0" /> Invalid credentials. Try user / user123
            </div>
          )}

          <Button type="submit" className="w-full mt-2 h-10">
            Sign In
          </Button>
        </form>

        <p className="text-center text-[13px] text-muted-foreground mt-2">
          Don't have an account? <Link href="#" className="text-primary font-medium hover:underline">Contact sales</Link>
        </p>
      </div>
    </div>
  )
}
