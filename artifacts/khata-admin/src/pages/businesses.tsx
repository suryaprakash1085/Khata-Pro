import { useState } from "react"
import { useLocation } from "wouter"
import {
  useListAdminBusinesses,
  getListAdminBusinessesQueryKey,
  useUpdateBusinessStatus,
  useListSubscriptionPlans,
  getListSubscriptionPlansQueryKey,
  ListAdminBusinessesStatus,
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Search,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Store,
  Users,
  Building2,
  Filter,
  X,
  Phone,
  RefreshCw,
} from "lucide-react"

import { useDebounce } from "@/hooks/use-debounce"

/* =============================================================
   DATE HELPERS
============================================================= */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const formatDate = (value: string) => {
  const d = new Date(value)
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

export default function Businesses() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ListAdminBusinessesStatus | undefined>()
  // CHANGED: plan is now a plain string so any new plan name works
  const [plan, setPlan] = useState<string | undefined>()

  const debouncedSearch = useDebounce(search, 500)

  // CHANGED: "as any" so new plan names don't fail the generated enum type
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(status ? { status } : {}),
    ...(plan ? { plan } : {}),
  } as any

  /* ---------------------------------------------------------
     NEW: fetch plans from Subscription Plans API
  --------------------------------------------------------- */
  const { data: plansResponse } = useListSubscriptionPlans({
    query: { queryKey: getListSubscriptionPlansQueryKey() },
  })

  const planOptions: string[] = Array.from(
    new Set(
      (plansResponse?.data ?? []).map((p: any) =>
        String(p.plan).trim().toLowerCase()
      )
    )
  )

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useListAdminBusinesses(queryParams, {
    query: {
      enabled: true,
      queryKey: getListAdminBusinessesQueryKey(queryParams),
    },
  })

  const updateStatus = useUpdateBusinessStatus()

  const handleStatusChange = (id: number, isActive: boolean) => {
    updateStatus.mutate(
      {
        id,
        data: {
          is_active: isActive,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: `Business ${isActive ? "activated" : "suspended"}`,
            description:
              "The business status has been updated successfully.",
          })

          queryClient.invalidateQueries({
            queryKey: getListAdminBusinessesQueryKey(queryParams),
          })

          queryClient.invalidateQueries({
            queryKey: getListAdminBusinessesQueryKey({}),
          })
        },

        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description:
              "Failed to update business status. Please try again.",
          })
        },
      }
    )
  }

  const clearFilters = () => {
    setSearch("")
    setStatus(undefined)
    setPlan(undefined)
    setPage(1)
  }

  const hasFilters = Boolean(search || status || plan)

  const totalBusinesses = response?.total ?? 0

  return (
    // NOTE: "-mt-6" pulls the page up to remove the top gap coming from AppLayout.
    // If you already reduced the padding in AppLayout.tsx, remove "-mt-6" (or use -mt-2).
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
            <Store className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Businesses
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor all businesses registered on the KhataPro
              platform.
            </p>
          </div>
        </div>

        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* =========================================================
          QUICK OVERVIEW
      ========================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Businesses"
          value={isLoading ? "—" : totalBusinesses.toLocaleString()}
          description="Registered businesses"
          icon={Building2}
        />

        <OverviewCard
          title="Active Businesses"
          value={
            isLoading
              ? "—"
              : response?.data
                  ?.filter((business) => business.is_active)
                  .length.toLocaleString()
          }
          description="On current page"
          icon={CheckCircle}
          iconClassName="text-emerald-600"
          iconBgClassName="bg-emerald-500/10"
        />

        <OverviewCard
          title="Suspended"
          value={
            isLoading
              ? "—"
              : response?.data
                  ?.filter((business) => !business.is_active)
                  .length.toLocaleString()
          }
          description="On current page"
          icon={Ban}
          iconClassName="text-red-600"
          iconBgClassName="bg-red-500/10"
        />

        <OverviewCard
          title="Current Page"
          value={isLoading ? "—" : response?.data?.length.toLocaleString()}
          description={`Businesses shown · Page ${page}`}
          icon={Users}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-500/10"
        />
      </div>

      {/* =========================================================
          MAIN CARD
      ========================================================= */}
      <Card className="overflow-hidden border-border/70 shadow-sm">
        {/* HEADER */}
        <CardHeader className="border-b bg-card pb-5">
          <div className="flex flex-col gap-5">
            <div>
              <CardTitle className="text-xl font-bold">
                Business Directory
              </CardTitle>

              <CardDescription className="mt-1">
                Search, filter and manage businesses across the platform.
              </CardDescription>
            </div>

            {/* =====================================================
                FILTER BAR
            ===================================================== */}
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              {/* Search */}
              <div className="relative w-full xl:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="search"
                  placeholder="Search by business, owner or phone..."
                  className="h-10 border-border/80 bg-background pl-10 pr-10 text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("")
                      setPage(1)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Status */}
                <Select
                  value={status || "all"}
                  onValueChange={(val) => {
                    setStatus(
                      val === "all"
                        ? undefined
                        : (val as ListAdminBusinessesStatus)
                    )
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-10 w-full sm:w-[155px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                {/* Plan — CHANGED: now dynamic from Subscription Plans */}
                <Select
                  value={plan || "all"}
                  onValueChange={(val) => {
                    setPlan(val === "all" ? undefined : val)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-10 w-full capitalize sm:w-[155px]">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {planOptions.map((name) => (
                      <SelectItem
                        key={name}
                        value={name}
                        className="capitalize"
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear */}
                {hasFilters && (
                  <Button
                    variant="outline"
                    className="h-10 gap-2"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Active filters:
                </span>

                {search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {search}
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("")
                        setPage(1)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {status && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    Status: {status}
                    <button
                      type="button"
                      onClick={() => {
                        setStatus(undefined)
                        setPage(1)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {plan && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    Plan: {plan}
                    <button
                      type="button"
                      onClick={() => {
                        setPlan(undefined)
                        setPage(1)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {/* =========================================================
            TABLE  (table-fixed + % widths => always fits, no side scroll)
        ========================================================= */}
        <CardContent className="p-0">
          <div className="w-full overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[22%] overflow-hidden truncate pl-5 pr-3">
                    Business
                  </TableHead>
                  <TableHead className="w-[16%] overflow-hidden truncate px-3">
                    Owner
                  </TableHead>
                  <TableHead className="w-[8%] overflow-hidden truncate px-3">
                    Plan
                  </TableHead>
                  <TableHead className="w-[11%] overflow-hidden truncate px-3 text-right">
                    Customers
                  </TableHead>
                  <TableHead className="w-[13%] overflow-hidden truncate px-3 text-right">
                    Transactions
                  </TableHead>
                  <TableHead className="w-[10%] overflow-hidden truncate px-3 pl-6">
                    Status
                  </TableHead>
                  <TableHead className="w-[12%] overflow-hidden truncate px-3">
                    Created
                  </TableHead>
                  <TableHead className="w-12 px-2">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* LOADING */}
                {isLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <BusinessSkeletonRow key={`skeleton-${index}`} />
                  ))}

                {/* DATA */}
                {!isLoading &&
                  response?.data &&
                  response.data.length > 0 &&
                  response.data.map((business) => (
                    <TableRow
                      key={business.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Business */}
                      <TableCell className="overflow-hidden pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-primary/5 text-primary">
                            <Store className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <button
                              type="button"
                              className="block max-w-full truncate text-left text-sm font-bold text-foreground transition-colors hover:text-primary"
                              onClick={() =>
                                setLocation(`/businesses/${business.id}`)
                              }
                            >
                              {business.business_name}
                            </button>

                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {business.business_type}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Owner */}
                      <TableCell className="overflow-hidden px-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {business.owner_name}
                          </p>

                          {business.phone && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <Phone className="h-3 w-3 shrink-0" />
                              {business.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Plan */}
                      <TableCell className="overflow-hidden px-3">
                        <PlanBadge plan={business.plan} />
                      </TableCell>

                      {/* Customers */}
                      <TableCell className="overflow-hidden px-3 text-right font-mono text-sm font-semibold">
                        {(business.customer_count ?? 0).toLocaleString()}
                      </TableCell>

                      {/* Transactions */}
                      <TableCell className="overflow-hidden px-3 text-right font-mono text-sm font-semibold">
                        {(business.transaction_count ?? 0).toLocaleString()}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="overflow-hidden px-3 pl-6">
                        {business.is_active ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                          >
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                          >
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                            Suspended
                          </Badge>
                        )}
                      </TableCell>

                      {/* Created */}
                      <TableCell className="overflow-hidden px-3">
                        <div className="flex flex-col leading-tight">
                          <span className="whitespace-nowrap text-sm font-medium text-foreground">
                            {formatDate(business.created_at)}
                          </span>
                          <span className="whitespace-nowrap text-xs text-muted-foreground">
                            {formatTime(business.created_at)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-70 transition-opacity hover:opacity-100 group-hover:opacity-100"
                            >
                              <span className="sr-only">
                                Open business actions
                              </span>

                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() =>
                                setLocation(`/businesses/${business.id}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {business.is_active ? (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                disabled={updateStatus.isPending}
                                onClick={() =>
                                  handleStatusChange(business.id, false)
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend Business
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-emerald-600 focus:text-emerald-600"
                                disabled={updateStatus.isPending}
                                onClick={() =>
                                  handleStatusChange(business.id, true)
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate Business
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}

                {/* ERROR */}
                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                          <Store className="h-7 w-7 text-red-500" />
                        </div>

                        <h3 className="text-base font-bold">
                          Failed to load businesses
                        </h3>

                        <p className="mt-1 max-w-md whitespace-normal text-sm text-muted-foreground">
                          There was a problem connecting to the API. Please
                          check your connection and try again.
                        </p>

                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() =>
                            queryClient.invalidateQueries({
                              queryKey:
                                getListAdminBusinessesQueryKey(queryParams),
                            })
                          }
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* EMPTY */}
                {!isLoading &&
                  !error &&
                  (!response?.data || response.data.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-72">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                            <Store className="h-8 w-8 text-muted-foreground/50" />
                          </div>

                          <h3 className="text-base font-bold">
                            No businesses found
                          </h3>

                          <p className="mt-1 max-w-sm whitespace-normal text-sm text-muted-foreground">
                            {hasFilters
                              ? "No businesses match your current search or filters."
                              : "There are no businesses registered on the platform yet."}
                          </p>

                          {hasFilters && (
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={clearFilters}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          {response && !error && (
            <div className="border-t bg-muted/10">
              <Pagination
                page={page}
                limit={limit}
                total={response.total}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit)
                  setPage(1)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* =============================================================
   OVERVIEW CARD
============================================================= */

function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "text-primary",
  iconBgClassName = "bg-primary/10",
}: {
  title: string
  value: string | number | undefined
  description: string
  icon: React.ElementType
  iconClassName?: string
  iconBgClassName?: string
}) {
  return (
    <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClassName}`}
          >
            <Icon className={`h-5 w-5 ${iconClassName}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* =============================================================
   PLAN BADGE
============================================================= */

function PlanBadge({
  plan,
}: {
  plan: string
}) {
  const normalizedPlan = plan?.toLowerCase()

  if (normalizedPlan === "premium") {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
      >
        Premium
      </Badge>
    )
  }

  if (normalizedPlan === "pro") {
    return (
      <Badge
        variant="outline"
        className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
      >
        Pro
      </Badge>
    )
  }

  // CHANGED: capitalize so any new plan name looks clean
  return (
    <Badge
      variant="outline"
      className="max-w-full truncate border-slate-200 bg-slate-50 capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
    >
      {plan || "Free"}
    </Badge>
  )
}

/* =============================================================
   TABLE SKELETON
============================================================= */

function BusinessSkeletonRow() {
  return (
    <TableRow>
      <TableCell className="overflow-hidden pl-5 pr-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-14 rounded-full" />
      </TableCell>

      <TableCell>
        <div className="flex justify-end">
          <Skeleton className="h-4 w-10" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-end">
          <Skeleton className="h-4 w-10" />
        </div>
      </TableCell>

      <TableCell className="overflow-hidden px-3 pl-6">
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </TableCell>

      <TableCell className="px-2">
        <Skeleton className="ml-auto h-8 w-8 rounded-md" />
      </TableCell>
    </TableRow>
  )
}