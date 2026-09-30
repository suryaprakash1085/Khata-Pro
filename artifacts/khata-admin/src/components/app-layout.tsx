import { Sidebar } from "./sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-w-0 overflow-x-hidden px-4 py-6 md:px-6 md:py-8 ml-52 sm:ml-56 lg:ml-64">
        <div className="max-w-full mx-auto w-full xl:max-w-[1280px]">
          {children}
        </div>
      </main>
    </div>
  )
}