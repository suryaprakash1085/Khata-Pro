import { Sidebar } from "./sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-full mx-auto w-full xl:max-w-[1280px]">
          {children}
        </div>
      </main>
    </div>
  )
}
