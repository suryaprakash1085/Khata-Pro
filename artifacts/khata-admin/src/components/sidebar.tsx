import { Link, useLocation } from "wouter"
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  BarChart3, 
  BellRing, 
  ShieldAlert, 
  Settings,
  LogOut,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLogout } from "@workspace/api-client-react"
import { removeToken } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Businesses", href: "/businesses", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
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
      }
    })
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-sidebar text-sidebar-foreground w-52 sm:w-56 lg:w-64 border-r border-sidebar-border shadow-lg">
      <div className="p-5">
        <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-primary-foreground">
            K
          </div>
          <span>KhataPro</span>
          <span className="text-primary">.</span>
        </h1>
        <p className="text-[11px] text-sidebar-foreground/60 mt-1 uppercase tracking-wider font-semibold">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
              )}
            >
              <item.icon
                className={cn(
                  isActive ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
                  "mr-3 flex-shrink-0 h-5 w-5"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-md transition-colors cursor-pointer"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-sidebar-foreground/40" />
          Log out
        </button>
      </div>
    </div>
  )
}
