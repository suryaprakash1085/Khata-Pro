
// import { Link, useLocation } from "wouter"
// import {
//   LayoutDashboard,
//   Building2,
//   Users,
//   CreditCard,
//   Layers,
//   BarChart3,
//   BellRing,
//   ShieldAlert,
//   Settings,
//   LogOut,
//   Send,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useLogout } from "@workspace/api-client-react"
// import { removeToken } from "@/lib/auth"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Businesses", href: "/businesses", icon: Building2 },
//   { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
//   { name: "Plans", href: "/subscription-plans", icon: Layers },
//   { name: "Reports", href: "/reports", icon: BarChart3 },
//   { name: "Reminders", href: "/reminders", icon: BellRing },
//   { name: "Broadcast", href: "/broadcast", icon: Send },
//   { name: "Audit Logs", href: "/audit-logs", icon: ShieldAlert },
//   { name: "Settings", href: "/settings", icon: Settings },
// ]

// export function Sidebar() {
//   const [location, setLocation] = useLocation()
//   const logout = useLogout()

//   const handleLogout = () => {
//     logout.mutate(undefined, {
//       onSuccess: () => {
//         removeToken()
//         setLocation("/login")
//       },
//       onError: () => {
//         removeToken()
//         setLocation("/login")
//       },
//     })
//   }

//   return (
//     <div className="fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground w-52 sm:w-56 lg:w-64 border-r border-sidebar-border shadow-lg">
//       <div className="p-5">
//         <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground flex items-center gap-2">
//           <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-primary-foreground">
//             K
//           </div>
//           <span>KhataPro</span>
//           <span className="text-primary">.</span>
//         </h1>
//         <p className="text-[11px] text-sidebar-foreground/60 mt-1 uppercase tracking-wider font-semibold">
//           Admin Console
//         </p>
//       </div>

//       <nav className="flex-1 min-h-0 space-y-1 px-4 py-4 overflow-y-auto">
//         {navigation.map((item) => {
//           const isActive =
//             location === item.href ||
//             (item.href !== "/dashboard" && location.startsWith(item.href))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 isActive
//                   ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                   : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
//                 "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
//               )}
//             >
//               <item.icon
//                 className={cn(
//                   isActive
//                     ? "text-primary"
//                     : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
//                   "mr-3 flex-shrink-0 h-5 w-5"
//                 )}
//                 aria-hidden="true"
//               />
//               {item.name}
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="p-4 border-t border-sidebar-border">
//         <button
//           onClick={handleLogout}
//           className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md transition-colors cursor-pointer"
//         >
//           <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-sidebar-foreground/40" />
//           Log out
//         </button>
//       </div>
//     </div>
//   )
// }

import { Link, useLocation } from "wouter"
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Layers,
  BarChart3,
  BellRing,
  ShieldAlert,
  Settings,
  LogOut,
  Send,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLogout } from "@workspace/api-client-react"
import { removeToken } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Businesses", href: "/businesses", icon: Building2 },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Plans", href: "/subscription-plans", icon: Layers },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Reminders", href: "/reminders", icon: BellRing },
  { name: "Broadcast", href: "/broadcast", icon: Send },
  { name: "Audit Logs", href: "/audit-logs", icon: ShieldAlert },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [location, setLocation] = useLocation()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        removeToken()
        setLocation("/login")
      },
      onError: () => {
        removeToken()
        setLocation("/login")
      },
    })
  }

  return (
    <div className="fixed inset-y-0 left-0 z-30 flex w-52 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg sm:w-56 lg:w-64">
      {/* =========================================================
          BRAND HEADER
      ========================================================= */}
      <div className="border-b border-sidebar-border/60 p-5">
        <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/30">
            K
          </div>
          <span>
            KhataPro<span className="text-primary">.</span>
          </span>
        </h1>
        <p className="mt-1.5 pl-[42px] text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
          Admin Console
        </p>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <nav className="no-scrollbar min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">
          Platform
        </p>

        {navigation.map((item) => {
          const isActive =
            location === item.href ||
            (item.href !== "/dashboard" && location.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
              )}
            >
              {/* active indicator bar */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              <item.icon
                className={cn(
                  "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* =========================================================
          FOOTER — logout + trust signal
      ========================================================= */}
      <div className="space-y-2 border-t border-sidebar-border/60 p-3">
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/65 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0 text-sidebar-foreground/40" />
          {logout.isPending ? "Logging out..." : "Log out"}
        </button>

        <div className="flex items-center gap-1.5 px-3 text-[10px] text-sidebar-foreground/35">
          <ShieldCheck className="h-3 w-3" />
          Secured operator session
        </div>
      </div>
    </div>
  )
}