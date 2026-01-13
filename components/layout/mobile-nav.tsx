/**
 * Mobile navigation component
 * Bottom navigation for dashboard sections
 * Mobile-first design
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Zap, Clock, User, HelpCircle } from "lucide-react"

const navItems = [
  {
    label: "Friends",
    href: "/dashboard/friends",
    icon: Users,
  },
  {
    label: "Sort",
    href: "/dashboard/sort",
    icon: Zap,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: Clock,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
