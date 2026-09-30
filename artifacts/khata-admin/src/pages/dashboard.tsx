import { useGetAdminAnalytics, getGetAdminAnalyticsQueryKey, useListAuditLogs } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import {
  Building2,
  Users,
  ReceiptIndianRupee,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Ban,
  ArrowRight,
  UserPlus,
  ArrowUpCircle,
  RefreshCw,
  UserX,
  Wallet,
  ShieldAlert,
} from "lucide-react"
import { Link } from "wouter"
import { format, formatDistanceToNow } from "date-fns"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// ── Design tokens (matches the approved Super Admin mockup) ──────────────────
const PLAN_COLORS: Record<string, string> = {
  premium: "#D97706", // amber-600
  pro: "#2563EB",     // blue-600    
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
}

const PLAN_BADGE_STYLES: Record<string, string> = {
  premium: "bg-amber-50 text-amber-700 border-amber-200",
  pro: "bg-blue-50 text-blue-700 border-blue-200",
  free: "bg-slate-100 text-slate-600 border-slate-200",
}

const ACTIVITY_ICON: Record<string, any> = {
  create_business: UserPlus,
  update_business_status: Ban,
  update_subscription: ArrowUpCircle,
  renew_subscription: RefreshCw,
  update_user_status: UserX,
  default: ShieldAlert,
}

function activityIconFor(action: string) {
  const key = Object.keys(ACTIVITY_ICON).find((k) => action?.toLowerCase().includes(k.replace("_", " ")) || action?.toLowerCase().includes(k))
  return ACTIVITY_ICON[key ?? "default"]
}

export default function Dashboard() {
  const { data: analytics, isLoading, error } = useGetAdminAnalytics({
    query: { enabled: true, queryKey: getGetAdminAnalyticsQueryKey() },
  })

  const { data: activityData } = useListAuditLogs({ limit: 6, page: 1 })

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center h-96 text-destructive gap-4"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <AlertCircle className="h-10 w-10" />
        <h2 className="text-lg font-semibold">Failed to load analytics</h2>
        <p className="text-sm opacity-80 text-center max-w-md">
          There was a problem connecting to the API. Check your connection or try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Platform overview and key performance indicators</p>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : analytics ? (
        <>
          {/* ── KPI Row ─────────────────────────────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Businesses"
              value={analytics.total_businesses.toLocaleString()}
              subtitle={`${analytics.active_businesses.toLocaleString()} active`}
              icon={Building2}
              iconBg="bg-blue-50 text-blue-600"
            />
            <KpiCard
              title="Total Users"
              value={analytics.total_users.toLocaleString()}
              icon={Users}
              iconBg="bg-emerald-50 text-emerald-600"
            />
            <KpiCard
              title="Total Transactions"
              value={analytics.total_transactions.toLocaleString()}
              subtitle="Platform subscription payments"
              icon={ReceiptIndianRupee}
              iconBg="bg-violet-50 text-violet-600"
            />
            <KpiCard
              title="Platform Volume"
              value={formatCurrency(analytics.total_transaction_volume)}
              subtitle="Total subscription revenue"
              icon={TrendingUp}
              iconBg="bg-amber-50 text-amber-600"
              highlight
            />
          </div>

          {/* ── Platform Growth + Plan Distribution ────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-7 md:col-span-5 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Platform Growth</CardTitle>
                <CardDescription>Monthly businesses and users over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.monthly_growth?.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.monthly_growth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} fontFamily="'Times New Roman', Times, serif" />
                      <YAxis stroke="#94A3B8" fontSize={12} fontFamily="'Times New Roman', Times, serif" />
                      <Tooltip contentStyle={{ fontFamily: "'Times New Roman', Times, serif", borderRadius: 8, borderColor: "#E2E8F0" }} />
                      <Legend wrapperStyle={{ fontFamily: "'Times New Roman', Times, serif" }} />
                      <Line type="monotone" dataKey="businesses" name="Businesses" stroke="#2563EB" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="users" name="Users" stroke="#059669" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState label="No growth data yet" />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-7 md:col-span-2 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Plan Distribution</CardTitle>
                <CardDescription>Active subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <PlanDistribution planBreakdown={analytics.plan_breakdown} />
              </CardContent>
            </Card>
          </div>

          {/* ── Revenue Overview + Subscription Status ─────────────────────── */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-7 md:col-span-4 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Revenue Overview</CardTitle>
                <CardDescription>Subscription revenue (monthly)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(analytics.current_month_revenue ?? 0)}
                  </span>
                  <RevenueTrend current={analytics.current_month_revenue} previous={analytics.previous_month_revenue} />
                </div>
                {analytics.monthly_revenue?.length ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={analytics.monthly_revenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} fontFamily="'Times New Roman', Times, serif" />
                      <YAxis stroke="#94A3B8" fontSize={12} fontFamily="'Times New Roman', Times, serif" />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{ fontFamily: "'Times New Roman', Times, serif", borderRadius: 8, borderColor: "#E2E8F0" }}
                      />
                      <Bar dataKey="amount" name="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState label="No revenue recorded yet" />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-7 md:col-span-3 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Subscription Status</CardTitle>
                <CardDescription>Current subscription breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionStatusList breakdown={analytics.subscription_status_breakdown} />
              </CardContent>
            </Card>
          </div>

          {/* ── System Alerts ───────────────────────────────────────────────── */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-slate-900">System Alerts</CardTitle>
                <CardDescription>Require attention</CardDescription>
              </div>
              <Link href="/subscriptions" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <SystemAlerts alerts={analytics.system_alerts} />
            </CardContent>
          </Card>

          {/* ── Recent Signups + Recent Activity ────────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-slate-900">Recent Signups</CardTitle>
                  <CardDescription>Latest business registrations</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {analytics.recent_signups?.length ? (
                    analytics.recent_signups.slice(0, 5).map((biz) => {
                      const planKey = biz.plan ?? "free"
                      const planBadgeClass = PLAN_BADGE_STYLES[planKey] ?? ""
                      return (
                        <Link
                          key={biz.id}
                          href={`/businesses/${biz.id}`}
                          className="flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium leading-none text-slate-900">{biz.business_name}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {biz.business_type} · {format(new Date(biz.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="outline" className={`capitalize ${planBadgeClass}`}>
                            {biz.plan ?? "Free"}
                          </Badge>
                        </Link>
                      )
                    })
                  ) : (
                    <EmptyState label="No recent signups" />
                  )}
                </div>
                <Link href="/businesses" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-4">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                  <CardDescription>Latest platform actions</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData?.data?.length ? (
                    activityData.data.slice(0, 5).map((log) => {
                      const Icon = activityIconFor(log.action)
                      return (
                        <div key={log.id} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 leading-tight">
                              {log.action?.replace(/_/g, " ")}
                              {log.user_name ? ` — ${log.user_name}` : ""}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <EmptyState label="No recent activity" />
                  )}
                </div>
                <Link href="/audit-logs" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-4">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ── Recent Payments ──────────────────────────────────────────────── */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-slate-900">Recent Payments</CardTitle>
                <CardDescription>Latest subscription payments</CardDescription>
              </div>
              <Link href="/subscriptions" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {analytics.recent_payments?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="font-medium py-2 pr-4">Business</th>
                        <th className="font-medium py-2 pr-4">Plan</th>
                        <th className="font-medium py-2 pr-4">Amount</th>
                        <th className="font-medium py-2 pr-4">Date</th>
                        <th className="font-medium py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recent_payments.map((p) => (
                        <tr key={p.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-2.5 pr-4 text-slate-900">{p.business_name}</td>
                          <td className="py-2.5 pr-4 capitalize text-slate-600">{p.plan}</td>
                          <td className="py-2.5 pr-4 font-mono text-slate-900">{formatCurrency(p.amount)}</td>
                          <td className="py-2.5 pr-4 text-slate-500">{format(new Date(p.payment_date), "MMM d, yyyy")}</td>
                          <td className="py-2.5">
                            <Badge variant="outline" className={`capitalize ${PAYMENT_STATUS_STYLES[p.status] ?? ""}`}>
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState label="No payments recorded yet" />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function KpiCard({ title, value, subtitle, icon: Icon, iconBg, highlight }: any) {
  return (
    <Card className={`border-slate-200 shadow-sm ${highlight ? "bg-amber-50/40 border-amber-200" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

function RevenueTrend({ current, previous }: { current?: number; previous?: number }) {
  if (current == null || previous == null || previous === 0) return null
  const pct = ((current - previous) / previous) * 100
  const positive = pct >= 0
  return (
    <span className={`text-sm font-medium flex items-center gap-1 ${positive ? "text-emerald-600" : "text-red-600"}`}>
      {positive ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}% vs last month
    </span>
  )
}

function PlanDistribution({ planBreakdown }: { planBreakdown?: { pro: number; premium: number; trial?: number } }) {
  if (!planBreakdown) return <EmptyState label="No plan data" />

  const data = [
    { name: "Premium", value: planBreakdown.premium ?? 0, key: "premium" },
    { name: "Pro", value: planBreakdown.pro ?? 0, key: "pro" },

  ]
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="space-y-4">
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
              {data.map((d) => (
                <Cell key={d.key} fill={PLAN_COLORS[d.key]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontFamily: "'Times New Roman', Times, serif", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyState label="No active subscriptions" />
      )}
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAN_COLORS[d.key] }} />
              <span className="font-medium text-slate-700">{d.name}</span>
            </div>
            <span className="font-mono text-slate-900">
              {d.value}
              {total > 0 && <span className="text-slate-400 text-xs ml-1">({((d.value / total) * 100).toFixed(0)}%)</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubscriptionStatusList({
  breakdown,
}: {
  breakdown?: { active: number; trial: number; expiring_soon: number; expired: number; cancelled: number }
}) {
  if (!breakdown) return <EmptyState label="No subscription data" />

  const rows = [
    { label: "Active", value: breakdown.active, color: "bg-emerald-500" },
    { label: "Trial", value: breakdown.trial, color: "bg-blue-500" },
    { label: "Expiring Soon", value: breakdown.expiring_soon, color: "bg-amber-500" },
    { label: "Expired", value: breakdown.expired, color: "bg-red-500" },
    { label: "Cancelled", value: breakdown.cancelled, color: "bg-slate-400" },
  ]
  const total = rows.reduce((sum, r) => sum + r.value, 0) || 1

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
            <span className="text-slate-700">{r.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-900">{r.value}</span>
            <span className="text-xs text-slate-400 w-10 text-right">{((r.value / total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function SystemAlerts({
  alerts,
}: {
  alerts?: { expiring_soon_count: number; failed_payments_count: number; suspended_businesses_count: number }
}) {
  if (!alerts) return <EmptyState label="No alerts" />

  const items = [
    {
      count: alerts.expiring_soon_count,
      label: "subscriptions expiring soon",
      detail: "Within 7 days",
      icon: AlertTriangle,
      styles: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      count: alerts.failed_payments_count,
      label: "failed payments",
      detail: "Requires action",
      icon: XCircle,
      styles: "bg-red-50 border-red-200 text-red-700",
    },
    {
      count: alerts.suspended_businesses_count,
      label: "suspended businesses",
      detail: "Needs review",
      icon: Ban,
      styles: "bg-slate-50 border-slate-200 text-slate-700",
    },
  ]

  const hasAny = items.some((i) => i.count > 0)

  if (!hasAny) {
    return <EmptyState label="No active alerts — everything looks good" />
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items
        .filter((i) => i.count > 0)
        .map((i) => (
          <div key={i.label} className={`flex items-start gap-3 rounded-lg border p-3 ${i.styles}`}>
            <i.icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium leading-tight">
                {i.count} {i.label}
              </p>
              <p className="text-xs opacity-80 mt-0.5">{i.detail}</p>
            </div>
          </div>
        ))}
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
      {label}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-5 h-[420px] border-slate-200">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-2 h-[420px] border-slate-200">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-64 border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card className="h-64 border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}