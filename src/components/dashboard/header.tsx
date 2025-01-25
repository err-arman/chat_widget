"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input className="w-64 bg-white pl-8" placeholder="Search..." type="search" />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button size="icon" variant="ghost">
          <User className="h-5 w-5" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  )
}

