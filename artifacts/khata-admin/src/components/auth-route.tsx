import { AppLayout } from "@/components/app-layout"
import { useEffect } from "react"
import { useLocation } from "wouter"
import { getToken } from "@/lib/auth"

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation()
  
  useEffect(() => {
    if (!getToken()) {
      setLocation("/login")
    }
  }, [location, setLocation])

  if (!getToken()) {
    return null
  }

  return <AppLayout>{children}</AppLayout>
}
