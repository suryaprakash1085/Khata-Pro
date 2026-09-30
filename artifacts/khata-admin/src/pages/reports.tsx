// import { useGetAdminAnalytics, getGetAdminAnalyticsQueryKey } from "@workspace/api-client-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { BarChart, PieChart } from "@/components/ui/charts"
// import { Skeleton } from "@/components/ui/skeleton"
// import { BarChart3 } from "lucide-react"

// export default function Reports() {
//   const { data: analytics, isLoading } = useGetAdminAnalytics({
//     query: { enabled: true, queryKey: getGetAdminAnalyticsQueryKey() }
//   })

//   // Format data for charts
//   const planData = analytics?.plan_breakdown ? [
//     { name: "Free", value: analytics.plan_breakdown.free },
//     { name: "Pro", value: analytics.plan_breakdown.pro },
//     { name: "Premium", value: analytics.plan_breakdown.premium },
//   ] : []

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
//             <BarChart3 className="h-8 w-8 text-primary" />
//             Platform Reports
//           </h1>
//           <p className="text-muted-foreground mt-1">Deep dive into platform metrics and distribution.</p>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-2">
//           <Card className="h-[450px]">
//             <CardHeader>
//               <Skeleton className="h-6 w-40" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-[350px] w-full" />
//             </CardContent>
//           </Card>
//           <Card className="h-[450px]">
//             <CardHeader>
//               <Skeleton className="h-6 w-40" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-[350px] w-full" />
//             </CardContent>
//           </Card>
//         </div>
//       ) : analytics ? (
//         <div className="grid gap-6 md:grid-cols-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>Transaction Volume by Month</CardTitle>
//               <CardDescription>Number of transactions recorded across all businesses</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <BarChart 
//                 data={analytics.monthly_growth || []} 
//                 index="month" 
//                 categories={["transactions"]} 
//                 colors={["hsl(var(--chart-3))"]}
//               />
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Plan Distribution</CardTitle>
//               <CardDescription>Active businesses by subscription tier</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <PieChart 
//                 data={planData} 
//                 category="value" 
//                 index="name" 
//                 colors={[
//                   "hsl(var(--muted-foreground))", // Free - gray
//                   "hsl(var(--primary))",          // Pro - blue
//                   "hsl(var(--warning))"           // Premium - gold
//                 ]}
//               />
//             </CardContent>
//           </Card>

//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle>Business Onboarding</CardTitle>
//               <CardDescription>New businesses registered per month</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <BarChart 
//                 data={analytics.monthly_growth || []} 
//                 index="month" 
//                 categories={["businesses"]} 
//                 colors={["hsl(var(--primary))"]}
//               />
//             </CardContent>
//           </Card>
//         </div>
//       ) : (
//         <div className="text-center p-12 text-muted-foreground border rounded-lg bg-muted/20">
//           No data available
//         </div>
//       )}
//     </div>
//   )
// }
import {
  useGetAdminAnalytics,
  getGetAdminAnalyticsQueryKey,
} from "@workspace/api-client-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { BarChart, PieChart } from "@/components/ui/charts"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart3,
  Building2,
  CheckCircle,
  Users,
  ReceiptIndianRupee,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react"

/* =============================================================
   HELPERS
============================================================= */

const PLAN_COLORS = [
  "hsl(var(--muted-foreground))", // Free    - gray
  "hsl(var(--primary))", //          Pro     - blue
  "hsl(var(--warning))", //          Premium - gold
]

const PLAN_DOT_CLASSES = ["bg-slate-400", "bg-blue-500", "bg-amber-500"]

const getChange = (current = 0, previous = 0) => {
  if (previous === 0) {
    return current === 0 ? null : { label: "New", up: true }
  }
  const pct = ((current - previous) / previous) * 100
  return {
    label: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    up: pct >= 0,
  }
}

export default function Reports() {
  const {
    data: analytics,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAdminAnalytics({
    query: { enabled: true, queryKey: getGetAdminAnalyticsQueryKey() },
  })

  // Format data for charts
  const planData = analytics?.plan_breakdown
    ? [
        { name: "Pro", value: analytics.plan_breakdown.pro },
        { name: "Premium", value: analytics.plan_breakdown.premium },
      ]
    : []

  const planTotal = planData.reduce((sum, p) => sum + (p.value || 0), 0)

  const monthlyGrowth = analytics?.monthly_growth ?? []
  const monthlyRevenue = analytics?.monthly_revenue ?? []

  const currentRevenue = analytics?.current_month_revenue ?? 0
  const previousRevenue = analytics?.previous_month_revenue ?? 0
  const revenueChange = getChange(currentRevenue, previousRevenue)

  const statusBreakdown = analytics?.subscription_status_breakdown

  return (
    // NOTE: "-mt-6" removes the top gap (same as the other admin pages).
    // If you already reduced the padding in AppLayout.tsx, remove "-mt-6".
    <div
      className="-mt-6 min-h-full space-y-6 bg-background"
      style={{ fontFamily: "Times New Roman, Times, serif" }}
    >
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Platform Reports
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Deep dive into platform metrics, revenue and distribution.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 gap-2"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Updating..." : "Refresh"}
        </Button>
      </div>

      {/* =========================================================
          LOADING
      ========================================================= */}
      {isLoading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={`kpi-skel-${i}`} className="border-border/70 shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={`chart-skel-${i}`} className="border-border/70 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-2 h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[320px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* =========================================================
          ERROR
      ========================================================= */}
      {!isLoading && error && (
        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <BarChart3 className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-base font-bold">Failed to load reports</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              There was a problem connecting to the API. Please check your
              connection and try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* =========================================================
          CONTENT
      ========================================================= */}
      {!isLoading && !error && analytics && (
        <>
          {/* KPI CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Businesses"
              value={analytics.total_businesses.toLocaleString()}
              description="Registered on the platform"
              icon={Building2}
            />
            <KpiCard
              title="Active Businesses"
              value={analytics.active_businesses.toLocaleString()}
              description={
                analytics.total_businesses > 0
                  ? `${Math.round(
                      (analytics.active_businesses / analytics.total_businesses) *
                        100
                    )}% of all businesses`
                  : "No businesses yet"
              }
              icon={CheckCircle}
              iconClassName="text-emerald-600"
              iconBgClassName="bg-emerald-500/10"
            />
            <KpiCard
              title="Total Users"
              value={analytics.total_users.toLocaleString()}
              description="Owners, staff and admins"
              icon={Users}
              iconClassName="text-blue-600"
              iconBgClassName="bg-blue-500/10"
            />
            <KpiCard
              title="Transactions"
              value={analytics.total_transactions.toLocaleString()}
              description={`Volume ${formatCurrency(
                analytics.total_transaction_volume || 0
              )}`}
              icon={ReceiptIndianRupee}
              iconClassName="text-purple-600"
              iconBgClassName="bg-purple-500/10"
            />
          </div>

          {/* REVENUE + SUBSCRIPTION STATUS */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      This Month Revenue
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      {formatCurrency(currentRevenue)}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <IndianRupee className="h-5 w-5 text-amber-600" />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  {revenueChange ? (
                    <Badge
                      variant="outline"
                      className={
                        revenueChange.up
                          ? "gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "gap-1 border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      {revenueChange.up ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {revenueChange.label}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No change</Badge>
                  )}
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Month Revenue
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {formatCurrency(previousRevenue)}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Paid subscription payments only
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Subscription Status
                </p>
                <div className="mt-3 space-y-2">
                  <StatusRow
                    label="Active"
                    value={statusBreakdown?.active ?? 0}
                    dot="bg-emerald-500"
                  />
                  <StatusRow
                    label="Trial"
                    value={statusBreakdown?.trial ?? 0}
                    dot="bg-blue-500"
                  />
                  <StatusRow
                    label="Expiring soon"
                    value={statusBreakdown?.expiring_soon ?? 0}
                    dot="bg-amber-500"
                  />
                  <StatusRow
                    label="Expired"
                    value={statusBreakdown?.expired ?? 0}
                    dot="bg-orange-500"
                  />
                  <StatusRow
                    label="Cancelled"
                    value={statusBreakdown?.cancelled ?? 0}
                    dot="bg-red-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Subscription Revenue by Month"
              description="Paid subscription payments received per month"
              isEmpty={monthlyRevenue.length === 0}
              emptyText="No paid subscription payments yet"
            >
              <BarChart
                data={monthlyRevenue}
                index="month"
                categories={["amount"]}
                colors={["hsl(var(--warning))"]}
              />
            </ChartCard>

            <ChartCard
              title="Transaction Volume by Month"
              description="Number of transactions recorded across all businesses"
              isEmpty={monthlyGrowth.length === 0}
            >
              <BarChart
                data={monthlyGrowth}
                index="month"
                categories={["transactions"]}
                colors={["hsl(var(--chart-3))"]}
              />
            </ChartCard>

            <ChartCard
              title="Business Onboarding"
              description="New businesses registered per month"
              isEmpty={monthlyGrowth.length === 0}
            >
              <BarChart
                data={monthlyGrowth}
                index="month"
                categories={["businesses"]}
                colors={["hsl(var(--primary))"]}
              />
            </ChartCard>

            <ChartCard
              title="User Growth"
              description="New users registered per month"
              isEmpty={monthlyGrowth.length === 0}
            >
              <BarChart
                data={monthlyGrowth}
                index="month"
                categories={["users"]}
                colors={["hsl(var(--success))"]}
              />
            </ChartCard>

            <Card className="border-border/70 shadow-sm lg:col-span-2">
              <CardHeader className="border-b bg-card">
                <CardTitle className="text-lg font-bold">
                  Plan Distribution
                </CardTitle>
                <CardDescription>
                  Businesses by subscription tier
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                {planTotal === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No subscription data yet
                  </div>
                ) : (
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    <PieChart
                      data={planData}
                      category="value"
                      index="name"
                      colors={PLAN_COLORS}
                    />

                    <div className="space-y-3">
                      {planData.map((p, i) => (
                        <div
                          key={p.name}
                          className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-3 w-3 rounded-full ${PLAN_DOT_CLASSES[i]}`}
                            />
                            <span className="text-sm font-semibold">
                              {p.name}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-bold">
                              {(p.value || 0).toLocaleString()}
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {Math.round(((p.value || 0) / planTotal) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* =========================================================
          NO DATA
      ========================================================= */}
      {!isLoading && !error && !analytics && (
        <div className="rounded-lg border bg-muted/20 p-12 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  )
}

/* =============================================================
   KPI CARD
============================================================= */

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "text-primary",
  iconBgClassName = "bg-primary/10",
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  iconClassName?: string
  iconBgClassName?: string
}) {
  return (
    <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgClassName}`}
          >
            <Icon className={`h-5 w-5 ${iconClassName}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* =============================================================
   STATUS ROW
============================================================= */

function StatusRow({
  label,
  value,
  dot,
}: {
  label: string
  value: number
  dot: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-bold">{value.toLocaleString()}</span>
    </div>
  )
}

/* =============================================================
   CHART CARD
============================================================= */

function ChartCard({
  title,
  description,
  isEmpty,
  emptyText = "No data available yet",
  children,
}: {
  title: string
  description: string
  isEmpty?: boolean
  emptyText?: string
  children: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="border-b bg-card">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {isEmpty ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}