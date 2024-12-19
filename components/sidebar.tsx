"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Image, Wand2, ArrowUpCircle, Search, PenTool } from 'lucide-react'

const sidebarNavItems = [
  {
    title: "Generate Image",
    href: "/",
    icon: Wand2,
  },
  {
    title: "Upscale Image",
    href: "/upscale",
    icon: ArrowUpCircle,
  },
  {
    title: "Search and Replace",
    href: "/search-replace",
    icon: Search,
  },
  {
    title: "Sketch",
    href: "/sketch",
    icon: PenTool,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <Image className="h-6 w-6" />
            <span>AI Image Dashboard</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 overflow-auto">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarNavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent" : "transparent"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}

