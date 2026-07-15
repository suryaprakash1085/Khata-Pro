import { useGetAdminAnalytics, getGetAdminAnalyticsQueryKey } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart } from "@/components/ui/charts"
import { formatCurrency } from "@/lib/utils"
import { Building2, Users, ReceiptIndianRupee, TrendingUp, AlertCircle } from "lucide-react"
import { Link } from "wouter"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function Dashboard() {
  const { data: analytics, isLoading, error } = useGetAdminAnalytics({
    query: { enabled: true, queryKey: getGetAdminAnalyticsQueryKey() }
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-destructive gap-4">
        <AlertCircle className="h-10 w-10" />
        <h2 className="text-lg font-semibold">Failed to load analytics</h2>
        <p className="text-sm opacity-80 text-center max-w-md">There was a problem connecting to the API. Check your connection or try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and key performance indicators.</p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : analytics ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard 
              title="Total Businesses" 
              value={analytics.total_businesses.toLocaleString()} 
              subtitle={`${analytics.active_businesses.toLocaleString()} active`}
              icon={Building2}
              trend="+12%"
            />
            <KpiCard 
              title="Total Users" 
              value={analytics.total_users.toLocaleString()} 
              icon={Users}
              trend="+8%"
            />
            <KpiCard 
              title="Total Transactions" 
              value={analytics.total_transactions.toLocaleString()} 
              icon={ReceiptIndianRupee}
              trend="+24%"
            />
            <KpiCard 
              title="Platform Volume" 
              value={formatCurrency(analytics.total_transaction_volume)} 
              icon={TrendingUp}
              trend="+18%"
              className="border-primary/50 bg-primary/5"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-5">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>Monthly businesses and users over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={analytics.monthly_growth || []} 
                  index="month" 
                  categories={["businesses", "users"]} 
                  colors={["hsl(var(--primary))", "hsl(var(--chart-2))"]}
                />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Active subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="font-medium">Premium</span>
                    </div>
                    <span className="font-mono">{analytics.plan_breakdown?.premium || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium">Pro</span>
                    </div>
                    <span className="font-mono">{analytics.plan_breakdown?.pro || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-400" />
                      <span className="font-medium">Free</span>
                    </div>
                    <span className="font-mono">{analytics.plan_breakdown?.free || 0}</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-sm font-semibold mb-4">Recent Signups</h4>
                  <div className="space-y-4">
                    {analytics.recent_signups?.slice(0, 4).map(biz => (
                      <Link key={biz.id} href={`/businesses/${biz.id}`} className="block hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium leading-none">{biz.business_name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{biz.business_type}</p>
                          </div>
                          <Badge variant={biz.plan as any || 'outline'} className="capitalize">{biz.plan}</Badge>
                        </div>
                      </Link>
                    ))}
                    {(!analytics.recent_signups || analytics.recent_signups.length === 0) && (
                      <p className="text-sm text-muted-foreground">No recent signups</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}

function KpiCard({ title, value, subtitle, icon: Icon, trend, className }: any) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">{value}</div>
        <div className="flex items-center text-xs mt-1">
          {trend && (
            <span className="text-success font-medium mr-2">{trend}</span>
          )}
          {subtitle && (
            <span className="text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-5 h-[450px]">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-2 h-[450px]">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <div className="mt-8 pt-6 border-t space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
