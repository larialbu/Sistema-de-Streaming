"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }

    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const navItems = [
    { href: "/tracks", label: "Faixas" },
    { href: "/playlists", label: "Minhas Playlists" },
    { href: "/taylor-swift", label: "Extra (API TAYLOR SWIFT)" },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            <span className="font-bold">MusicStream</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
