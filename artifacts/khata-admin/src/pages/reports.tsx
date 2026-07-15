import { useGetAdminAnalytics, getGetAdminAnalyticsQueryKey } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, PieChart } from "@/components/ui/charts"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"

export default function Reports() {
  const { data: analytics, isLoading } = useGetAdminAnalytics({
    query: { enabled: true, queryKey: getGetAdminAnalyticsQueryKey() }
  })

  // Format data for charts
  const planData = analytics?.plan_breakdown ? [
    { name: "Free", value: analytics.plan_breakdown.free },
    { name: "Pro", value: analytics.plan_breakdown.pro },
    { name: "Premium", value: analytics.plan_breakdown.premium },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Platform Reports
          </h1>
          <p className="text-muted-foreground mt-1">Deep dive into platform metrics and distribution.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-[450px]">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
          <Card className="h-[450px]">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </div>
      ) : analytics ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume by Month</CardTitle>
              <CardDescription>Number of transactions recorded across all businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={analytics.monthly_growth || []} 
                index="month" 
                categories={["transactions"]} 
                colors={["hsl(var(--chart-3))"]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>Active businesses by subscription tier</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart 
                data={planData} 
                category="value" 
                index="name" 
                colors={[
                  "hsl(var(--muted-foreground))", // Free - gray
                  "hsl(var(--primary))",          // Pro - blue
                  "hsl(var(--warning))"           // Premium - gold
                ]}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Business Onboarding</CardTitle>
              <CardDescription>New businesses registered per month</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={analytics.monthly_growth || []} 
                index="month" 
                categories={["businesses"]} 
                colors={["hsl(var(--primary))"]}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center p-12 text-muted-foreground border rounded-lg bg-muted/20">
          No data available
        </div>
      )}
    </div>
  )
}
