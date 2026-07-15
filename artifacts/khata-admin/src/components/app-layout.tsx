import { Sidebar } from "./sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
