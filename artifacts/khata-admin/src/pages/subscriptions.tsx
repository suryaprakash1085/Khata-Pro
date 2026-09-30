// // import { useState } from "react"
// // import {
// //   useListSubscriptions,
// //   getListSubscriptionsQueryKey,
// //   useUpdateSubscription,
// //   ListSubscriptionsPlan,
// //   ListSubscriptionsStatus,
// // } from "@workspace/api-client-react"
// // import { useQueryClient } from "@tanstack/react-query"

// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// // } from "@/components/ui/card"
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table"
// // import { Button } from "@/components/ui/button"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"
// // import { Badge } from "@/components/ui/badge"
// // import { Pagination } from "@/components/ui/pagination"
// // import { Skeleton } from "@/components/ui/skeleton"
// // import { useToast } from "@/hooks/use-toast"
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// // } from "@/components/ui/dropdown-menu"

// // import {
// //   CreditCard,
// //   MoreVertical,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   XCircle,
// //   CheckCircle,
// //   Clock,
// //   Filter,
// //   X,
// //   RefreshCw,
// // } from "lucide-react"

// // /* =============================================================
// //    DATE HELPERS
// // ============================================================= */

// // const MONTHS = [
// //   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
// //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// // ]

// // const formatDate = (value?: string | null) => {
// //   if (!value) return "—"
// //   const d = new Date(value)
// //   if (Number.isNaN(d.getTime())) return "—"
// //   return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
// // }

// // // "12 days left" / "Expired 3 days ago" / "Ends today"
// // const getDaysLabel = (value?: string | null) => {
// //   if (!value) return null
// //   const end = new Date(value)
// //   if (Number.isNaN(end.getTime())) return null

// //   const today = new Date()
// //   today.setHours(0, 0, 0, 0)
// //   end.setHours(0, 0, 0, 0)

// //   const diff = Math.round((end.getTime() - today.getTime()) / 86400000)

// //   if (diff === 0) return { text: "Ends today", urgent: true }
// //   if (diff > 0) return { text: `${diff} day${diff === 1 ? "" : "s"} left`, urgent: diff <= 7 }
// //   return {
// //     text: `Ended ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`,
// //     urgent: false,
// //   }
// // }

// // export default function Subscriptions() {
// //   const { toast } = useToast()
// //   const queryClient = useQueryClient()

// //   const [page, setPage] = useState(1)
// //   const [limit, setLimit] = useState(20)
// //   const [plan, setPlan] = useState<ListSubscriptionsPlan | undefined>()
// //   const [status, setStatus] = useState<ListSubscriptionsStatus | undefined>()

// //   const queryParams = {
// //     page,
// //     limit,
// //     ...(plan ? { plan } : {}),
// //     ...(status ? { status } : {}),
// //   }

// //   const {
// //     data: response,
// //     isLoading,
// //     isFetching,
// //     error,
// //   } = useListSubscriptions(queryParams, {
// //     query: {
// //       enabled: true,
// //       queryKey: getListSubscriptionsQueryKey(queryParams),
// //     },
// //   })

// //   const updateMutation = useUpdateSubscription()

// //   const handleUpdate = (id: number, newPlan: string, newStatus: string) => {
// //     updateMutation.mutate(
// //       {
// //         id,
// //         data: {
// //           plan: newPlan as any,
// //           status: newStatus as any,
// //         },
// //       },
// //       {
// //         onSuccess: () => {
// //           toast({
// //             title: "Subscription updated",
// //             description: "The subscription has been successfully modified.",
// //           })
// //           queryClient.invalidateQueries({
// //             queryKey: getListSubscriptionsQueryKey({}),
// //           })
// //         },
// //         onError: () => {
// //           toast({
// //             variant: "destructive",
// //             title: "Update failed",
// //             description: "Could not modify subscription.",
// //           })
// //         },
// //       }
// //     )
// //   }

// //   const clearFilters = () => {
// //     setPlan(undefined)
// //     setStatus(undefined)
// //     setPage(1)
// //   }

// //   const hasFilters = Boolean(plan || status)
// //   const total = response?.total ?? 0
// //   const rows = response?.data ?? []

// //   const countByStatus = (s: string) =>
// //     rows.filter((r) => (r.status as string) === s).length

// //   return (
// //     // NOTE: "-mt-6" removes the top gap (same as Businesses page).
// //     // If you already reduced the padding in AppLayout.tsx, remove "-mt-6".
// //     <div
// //       className="-mt-6 min-h-full space-y-6 bg-background"
// //       style={{ fontFamily: "Times New Roman, Times, serif" }}
// //     >
// //       {/* =========================================================
// //           PAGE HEADER
// //       ========================================================= */}
// //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div className="flex items-start gap-4">
// //           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
// //             <CreditCard className="h-6 w-6 text-primary" />
// //           </div>

// //           <div>
// //             <h1 className="text-3xl font-bold tracking-tight text-foreground">
// //               Subscriptions
// //             </h1>
// //             <p className="mt-1 text-sm text-muted-foreground">
// //               Manage active plans and upgrades across all businesses.
// //             </p>
// //           </div>
// //         </div>

// //         {isFetching && !isLoading && (
// //           <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
// //             <RefreshCw className="h-4 w-4 animate-spin" />
// //             Updating...
// //           </div>
// //         )}
// //       </div>

// //       {/* =========================================================
// //           QUICK OVERVIEW
// //       ========================================================= */}
// //       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
// //         <OverviewCard
// //           title="Total Subscriptions"
// //           value={isLoading ? "—" : total.toLocaleString()}
// //           description={hasFilters ? "Matching filters" : "All businesses"}
// //           icon={CreditCard}
// //         />
// //         <OverviewCard
// //           title="Active"
// //           value={isLoading ? "—" : countByStatus("active").toLocaleString()}
// //           description="On current page"
// //           icon={CheckCircle}
// //           iconClassName="text-emerald-600"
// //           iconBgClassName="bg-emerald-500/10"
// //         />
// //         <OverviewCard
// //           title="Expired"
// //           value={isLoading ? "—" : countByStatus("expired").toLocaleString()}
// //           description="On current page"
// //           icon={Clock}
// //           iconClassName="text-amber-600"
// //           iconBgClassName="bg-amber-500/10"
// //         />
// //         <OverviewCard
// //           title="Cancelled"
// //           value={isLoading ? "—" : countByStatus("cancelled").toLocaleString()}
// //           description="On current page"
// //           icon={XCircle}
// //           iconClassName="text-red-600"
// //           iconBgClassName="bg-red-500/10"
// //         />
// //       </div>

// //       {/* =========================================================
// //           MAIN CARD
// //       ========================================================= */}
// //       <Card className="overflow-hidden border-border/70 shadow-sm">
// //         <CardHeader className="border-b bg-card pb-5">
// //           <div className="flex flex-col gap-4">
// //             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //               <div>
// //                 <CardTitle className="text-xl font-bold">
// //                   Subscription List
// //                 </CardTitle>
// //                 <CardDescription className="mt-1">
// //                   Filter by plan or status and manually upgrade, downgrade or
// //                   cancel a plan.
// //                 </CardDescription>
// //               </div>

// //               <div className="flex flex-col gap-3 sm:flex-row">
// //                 {/* Plan */}
// //                 <Select
// //                   value={plan || "all"}
// //                   onValueChange={(val) => {
// //                     setPlan(
// //                       val === "all" ? undefined : (val as ListSubscriptionsPlan)
// //                     )
// //                     setPage(1)
// //                   }}
// //                 >
// //                   <SelectTrigger className="h-10 w-full sm:w-[155px]">
// //                     <div className="flex items-center gap-2">
// //                       <Filter className="h-4 w-4 text-muted-foreground" />
// //                       <SelectValue placeholder="Plan" />
// //                     </div>
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Plans</SelectItem>
// //                     <SelectItem value="free">Free</SelectItem>
// //                     <SelectItem value="pro">Pro</SelectItem>
// //                     <SelectItem value="premium">Premium</SelectItem>
// //                   </SelectContent>
// //                 </Select>

// //                 {/* Status */}
// //                 <Select
// //                   value={status || "all"}
// //                   onValueChange={(val) => {
// //                     setStatus(
// //                       val === "all"
// //                         ? undefined
// //                         : (val as ListSubscriptionsStatus)
// //                     )
// //                     setPage(1)
// //                   }}
// //                 >
// //                   <SelectTrigger className="h-10 w-full sm:w-[155px]">
// //                     <SelectValue placeholder="Status" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Status</SelectItem>
// //                     <SelectItem value="active">Active</SelectItem>
// //                     <SelectItem value="expired">Expired</SelectItem>
// //                     <SelectItem value="cancelled">Cancelled</SelectItem>
// //                   </SelectContent>
// //                 </Select>

// //                 {hasFilters && (
// //                   <Button
// //                     variant="outline"
// //                     className="h-10 gap-2"
// //                     onClick={clearFilters}
// //                   >
// //                     <X className="h-4 w-4" />
// //                     Clear
// //                   </Button>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Active filters */}
// //             {hasFilters && (
// //               <div className="flex flex-wrap items-center gap-2">
// //                 <span className="text-xs font-semibold text-muted-foreground">
// //                   Active filters:
// //                 </span>

// //                 {plan && (
// //                   <Badge variant="secondary" className="gap-1 capitalize">
// //                     Plan: {plan}
// //                     <button
// //                       type="button"
// //                       onClick={() => {
// //                         setPlan(undefined)
// //                         setPage(1)
// //                       }}
// //                     >
// //                       <X className="h-3 w-3" />
// //                     </button>
// //                   </Badge>
// //                 )}

// //                 {status && (
// //                   <Badge variant="secondary" className="gap-1 capitalize">
// //                     Status: {status}
// //                     <button
// //                       type="button"
// //                       onClick={() => {
// //                         setStatus(undefined)
// //                         setPage(1)
// //                       }}
// //                     >
// //                       <X className="h-3 w-3" />
// //                     </button>
// //                   </Badge>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </CardHeader>

// //         {/* =========================================================
// //             TABLE  (table-fixed + % widths => always fits, no side scroll)
// //         ========================================================= */}
// //         <CardContent className="p-0">
// //           <div className="w-full overflow-hidden">
// //             <Table className="table-fixed">
// //               <TableHeader>
// //                 <TableRow className="bg-muted/30 hover:bg-muted/30">
// //                   <TableHead className="w-[26%] overflow-hidden truncate pl-5 pr-3">
// //                     Business
// //                   </TableHead>
// //                   <TableHead className="w-[10%] overflow-hidden truncate px-3">
// //                     Plan
// //                   </TableHead>
// //                   <TableHead className="w-[12%] overflow-hidden truncate px-3">
// //                     Status
// //                   </TableHead>
// //                   <TableHead className="w-[13%] overflow-hidden truncate px-3">
// //                     Start Date
// //                   </TableHead>
// //                   <TableHead className="w-[16%] overflow-hidden truncate px-3">
// //                     End Date
// //                   </TableHead>
// //                   <TableHead className="w-[15%] overflow-hidden truncate px-3">
// //                     Ref ID
// //                   </TableHead>
// //                   <TableHead className="w-12 px-2">
// //                     <span className="sr-only">Actions</span>
// //                   </TableHead>
// //                 </TableRow>
// //               </TableHeader>

// //               <TableBody>
// //                 {/* LOADING */}
// //                 {isLoading &&
// //                   Array.from({ length: 10 }).map((_, i) => (
// //                     <SubscriptionSkeletonRow key={`skel-${i}`} />
// //                   ))}

// //                 {/* DATA */}
// //                 {!isLoading &&
// //                   !error &&
// //                   rows.map((sub) => {
// //                     const daysLabel =
// //                       (sub.status as string) === "active" ||
// //                       (sub.status as string) === "trial"
// //                         ? getDaysLabel(sub.end_date)
// //                         : null
// //                     const isRunning =
// //                       (sub.status as string) === "active" ||
// //                       (sub.status as string) === "trial"

// //                     return (
// //                       <TableRow
// //                         key={sub.id}
// //                         className="group transition-colors hover:bg-muted/30"
// //                       >
// //                         {/* Business */}
// //                         <TableCell className="overflow-hidden pl-5 pr-3">
// //                           <div className="min-w-0">
// //                             <p className="truncate text-sm font-bold text-foreground">
// //                               {sub.business_name}
// //                             </p>
// //                             <p className="mt-0.5 truncate text-xs text-muted-foreground">
// //                               Business ID: {sub.business_id}
// //                             </p>
// //                           </div>
// //                         </TableCell>

// //                         {/* Plan */}
// //                         <TableCell className="overflow-hidden px-3">
// //                           <PlanBadge plan={sub.plan} />
// //                         </TableCell>

// //                         {/* Status */}
// //                         <TableCell className="overflow-hidden px-3">
// //                           <StatusBadge status={sub.status as string} />
// //                         </TableCell>

// //                         {/* Start */}
// //                         <TableCell className="overflow-hidden whitespace-nowrap px-3 text-sm">
// //                           {formatDate(sub.start_date)}
// //                         </TableCell>

// //                         {/* End */}
// //                         <TableCell className="overflow-hidden px-3">
// //                           <div className="flex flex-col leading-tight">
// //                             <span className="whitespace-nowrap text-sm font-medium text-foreground">
// //                               {formatDate(sub.end_date)}
// //                             </span>
// //                             {daysLabel && (
// //                               <span
// //                                 className={`whitespace-nowrap text-xs ${
// //                                   daysLabel.urgent
// //                                     ? "font-semibold text-red-600"
// //                                     : "text-muted-foreground"
// //                                 }`}
// //                               >
// //                                 {daysLabel.text}
// //                               </span>
// //                             )}
// //                           </div>
// //                         </TableCell>

// //                         {/* Ref */}
// //                         <TableCell className="overflow-hidden px-3">
// //                           <span
// //                             className="block truncate font-mono text-xs text-muted-foreground"
// //                             title={sub.payment_ref || undefined}
// //                           >
// //                             {sub.payment_ref || "—"}
// //                           </span>
// //                         </TableCell>

// //                         {/* Actions */}
// //                         <TableCell className="px-2 text-right">
// //                           <DropdownMenu>
// //                             <DropdownMenuTrigger asChild>
// //                               <Button
// //                                 variant="ghost"
// //                                 className="h-8 w-8 p-0 opacity-70 transition-opacity hover:opacity-100 group-hover:opacity-100"
// //                               >
// //                                 <span className="sr-only">Open menu</span>
// //                                 <MoreVertical className="h-4 w-4" />
// //                               </Button>
// //                             </DropdownMenuTrigger>

// //                             <DropdownMenuContent align="end" className="w-56">
// //                               <DropdownMenuLabel>Manual Override</DropdownMenuLabel>
// //                               <DropdownMenuSeparator />

// //                               {sub.plan !== "premium" && (
// //                                 <DropdownMenuItem
// //                                   disabled={updateMutation.isPending}
// //                                   onClick={() =>
// //                                     handleUpdate(sub.id, "premium", "active")
// //                                   }
// //                                 >
// //                                   <ArrowUpCircle className="mr-2 h-4 w-4 text-amber-500" />
// //                                   Upgrade to Premium
// //                                 </DropdownMenuItem>
// //                               )}

// //                               {sub.plan !== "pro" && (
// //                                 <DropdownMenuItem
// //                                   disabled={updateMutation.isPending}
// //                                   onClick={() =>
// //                                     handleUpdate(sub.id, "pro", "active")
// //                                   }
// //                                 >
// //                                 </DropdownMenuItem>
// //                               )}

// //                               <DropdownMenuSeparator />

// //                               {isRunning ? (
// //                                 <DropdownMenuItem
// //                                   className="text-destructive focus:text-destructive"
// //                                   disabled={updateMutation.isPending}
// //                                   onClick={() =>
// //                                     handleUpdate(sub.id, sub.plan, "cancelled")
// //                                   }
// //                                 >
// //                                   <XCircle className="mr-2 h-4 w-4" />
// //                                   Cancel Subscription
// //                                 </DropdownMenuItem>
// //                               ) : (
// //                                 <DropdownMenuItem
// //                                   className="text-emerald-600 focus:text-emerald-600"
// //                                   disabled={updateMutation.isPending}
// //                                   onClick={() =>
// //                                     handleUpdate(sub.id, sub.plan, "active")
// //                                   }
// //                                 >
// //                                   <CheckCircle className="mr-2 h-4 w-4" />
// //                                   Reactivate
// //                                 </DropdownMenuItem>
// //                               )}
// //                             </DropdownMenuContent>
// //                           </DropdownMenu>
// //                         </TableCell>
// //                       </TableRow>
// //                     )
// //                   })}

// //                 {/* ERROR */}
// //                 {!isLoading && error && (
// //                   <TableRow>
// //                     <TableCell colSpan={7} className="h-64">
// //                       <div className="flex flex-col items-center justify-center text-center">
// //                         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
// //                           <CreditCard className="h-7 w-7 text-red-500" />
// //                         </div>
// //                         <h3 className="text-base font-bold">
// //                           Failed to load subscriptions
// //                         </h3>
// //                         <p className="mt-1 max-w-md whitespace-normal text-sm text-muted-foreground">
// //                           There was a problem connecting to the API. Please
// //                           check your connection and try again.
// //                         </p>
// //                         <Button
// //                           variant="outline"
// //                           className="mt-4"
// //                           onClick={() =>
// //                             queryClient.invalidateQueries({
// //                               queryKey: getListSubscriptionsQueryKey(queryParams),
// //                             })
// //                           }
// //                         >
// //                           <RefreshCw className="mr-2 h-4 w-4" />
// //                           Try Again
// //                         </Button>
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 )}

// //                 {/* EMPTY */}
// //                 {!isLoading && !error && rows.length === 0 && (
// //                   <TableRow>
// //                     <TableCell colSpan={7} className="h-72">
// //                       <div className="flex flex-col items-center justify-center text-center">
// //                         <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
// //                           <CreditCard className="h-8 w-8 text-muted-foreground/50" />
// //                         </div>
// //                         <h3 className="text-base font-bold">
// //                           No subscriptions found
// //                         </h3>
// //                         <p className="mt-1 max-w-sm whitespace-normal text-sm text-muted-foreground">
// //                           {hasFilters
// //                             ? "No subscriptions match your current filters."
// //                             : "There are no subscriptions on the platform yet."}
// //                         </p>
// //                         {hasFilters && (
// //                           <Button
// //                             variant="outline"
// //                             className="mt-4"
// //                             onClick={clearFilters}
// //                           >
// //                             Clear Filters
// //                           </Button>
// //                         )}
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>

// //           {/* PAGINATION */}
// //           {response && !error && (
// //             <div className="border-t bg-muted/10">
// //               <Pagination
// //                 page={page}
// //                 limit={limit}
// //                 total={response.total}
// //                 onPageChange={setPage}
// //                 onLimitChange={(l) => {
// //                   setLimit(l)
// //                   setPage(1)
// //                 }}
// //               />
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// // /* =============================================================
// //    OVERVIEW CARD
// // ============================================================= */

// // function OverviewCard({
// //   title,
// //   value,
// //   description,
// //   icon: Icon,
// //   iconClassName = "text-primary",
// //   iconBgClassName = "bg-primary/10",
// // }: {
// //   title: string
// //   value: string | number | undefined
// //   description: string
// //   icon: React.ElementType
// //   iconClassName?: string
// //   iconBgClassName?: string
// // }) {
// //   return (
// //     <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
// //       <CardContent className="p-5">
// //         <div className="flex items-start justify-between">
// //           <div>
// //             <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
// //               {title}
// //             </p>
// //             <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
// //             <p className="mt-1 text-xs text-muted-foreground">{description}</p>
// //           </div>

// //           <div
// //             className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClassName}`}
// //           >
// //             <Icon className={`h-5 w-5 ${iconClassName}`} />
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// // /* =============================================================
// //    PLAN BADGE
// // ============================================================= */

// // function PlanBadge({ plan }: { plan: string }) {
// //   const p = plan?.toLowerCase()

// //   if (p === "premium") {
// //     return (
// //       <Badge
// //         variant="outline"
// //         className="border-amber-200 bg-amber-50 capitalize text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
// //       >
// //         Premium
// //       </Badge>
// //     )
// //   }

// //   if (p === "pro") {
// //     return (
// //       <Badge
// //         variant="outline"
// //         className="border-blue-200 bg-blue-50 capitalize text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
// //       >
// //         Pro
// //       </Badge>
// //     )
// //   }

// //   return (
// //     <Badge
// //       variant="outline"
// //       className="border-slate-200 bg-slate-50 capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
// //     >
// //       {plan || "Free"}
// //     </Badge>
// //   )
// // }

// // /* =============================================================
// //    STATUS BADGE
// // ============================================================= */

// // function StatusBadge({ status }: { status: string }) {
// //   const map: Record<string, { label: string; badge: string; dot: string }> = {
// //     active: {
// //       label: "Active",
// //       badge:
// //         "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400",
// //       dot: "bg-emerald-500",
// //     },
// //     trial: {
// //       label: "Trial",
// //       badge:
// //         "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400",
// //       dot: "bg-blue-500",
// //     },
// //     expired: {
// //       label: "Expired",
// //       badge:
// //         "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
// //       dot: "bg-amber-500",
// //     },
// //     cancelled: {
// //       label: "Cancelled",
// //       badge:
// //         "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400",
// //       dot: "bg-red-500",
// //     },
// //   }

// //   const s = map[status] ?? {
// //     label: status || "Unknown",
// //     badge:
// //       "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
// //     dot: "bg-slate-400",
// //   }

// //   return (
// //     <Badge variant="outline" className={`capitalize ${s.badge}`}>
// //       <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${s.dot}`} />
// //       {s.label}
// //     </Badge>
// //   )
// // }

// // /* =============================================================
// //    TABLE SKELETON
// // ============================================================= */

// // function SubscriptionSkeletonRow() {
// //   return (
// //     <TableRow>
// //       <TableCell className="overflow-hidden pl-5 pr-3">
// //         <div className="space-y-2">
// //           <Skeleton className="h-4 w-3/4" />
// //           <Skeleton className="h-3 w-1/2" />
// //         </div>
// //       </TableCell>
// //       <TableCell className="px-3">
// //         <Skeleton className="h-6 w-14 rounded-full" />
// //       </TableCell>
// //       <TableCell className="px-3">
// //         <Skeleton className="h-6 w-20 rounded-full" />
// //       </TableCell>
// //       <TableCell className="px-3">
// //         <Skeleton className="h-4 w-20" />
// //       </TableCell>
// //       <TableCell className="px-3">
// //         <div className="space-y-2">
// //           <Skeleton className="h-4 w-20" />
// //           <Skeleton className="h-3 w-16" />
// //         </div>
// //       </TableCell>
// //       <TableCell className="px-3">
// //         <Skeleton className="h-4 w-24" />
// //       </TableCell>
// //       <TableCell className="px-2">
// //         <Skeleton className="ml-auto h-8 w-8 rounded-md" />
// //       </TableCell>
// //     </TableRow>
// //   )
// // }

// import { useState } from "react"
// import {
//   useListSubscriptions,
//   getListSubscriptionsQueryKey,
//   useUpdateSubscription,
//   ListSubscriptionsPlan,
//   ListSubscriptionsStatus,
//   ListSubscriptionsBillingCycle,
// } from "@workspace/api-client-react"
// import { useQueryClient } from "@tanstack/react-query"

// import {
//   Card, CardContent, CardHeader, CardTitle, CardDescription,
// } from "@/components/ui/card"
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Pagination } from "@/components/ui/pagination"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
//   DialogDescription, DialogFooter,
// } from "@/components/ui/dialog"

// import {
//   CreditCard, MoreVertical, ArrowLeftRight, XCircle, CheckCircle,
//   Clock, Filter, X, RefreshCw, IndianRupee,
// } from "lucide-react"

// /* =============================================================
//    CONSTANTS
// ============================================================= */

// const BILLING_CYCLES: { value: ListSubscriptionsBillingCycle; label: string }[] = [
//   { value: "monthly", label: "Monthly" },
//   { value: "quarterly", label: "Quarterly" },
//   { value: "half_yearly", label: "Half-Yearly" },
//   { value: "yearly", label: "Yearly" },
// ]

// const PLANS: { value: ListSubscriptionsPlan; label: string }[] = [
//   { value: "pro", label: "Pro" },
//   { value: "premium", label: "Premium" },
// ]

// /* =============================================================
//    DATE / CURRENCY HELPERS
// ============================================================= */

// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

// const formatDate = (value?: string | null) => {
//   if (!value) return "—"
//   const d = new Date(value)
//   if (Number.isNaN(d.getTime())) return "—"
//   return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
// }

// const formatAmount = (value?: string | number | null) => {
//   if (value === undefined || value === null) return "—"
//   const n = typeof value === "string" ? parseFloat(value) : value
//   if (Number.isNaN(n)) return "—"
//   return `₹${n.toLocaleString("en-IN")}`
// }

// const getDaysLabel = (value?: string | null) => {
//   if (!value) return null
//   const end = new Date(value)
//   if (Number.isNaN(end.getTime())) return null
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)
//   end.setHours(0, 0, 0, 0)
//   const diff = Math.round((end.getTime() - today.getTime()) / 86400000)
//   if (diff === 0) return { text: "Ends today", urgent: true }
//   if (diff > 0) return { text: `${diff} day${diff === 1 ? "" : "s"} left`, urgent: diff <= 7 }
//   return { text: `Ended ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`, urgent: false }
// }

// const cycleLabel = (cycle?: string | null) =>
//   BILLING_CYCLES.find((c) => c.value === cycle)?.label ?? cycle ?? "—"

// export default function Subscriptions() {
//   const { toast } = useToast()
//   const queryClient = useQueryClient()

//   const [page, setPage] = useState(1)
//   const [limit, setLimit] = useState(20)
//   const [plan, setPlan] = useState<ListSubscriptionsPlan | undefined>()
//   const [status, setStatus] = useState<ListSubscriptionsStatus | undefined>()
//   const [billingCycle, setBillingCycle] = useState<ListSubscriptionsBillingCycle | undefined>()

//   // Change Plan/Cycle dialog state
//   const [changeTarget, setChangeTarget] = useState<{ id: number; plan: string; billingCycle: string } | null>(null)
//   const [newPlan, setNewPlan] = useState<ListSubscriptionsPlan | undefined>()
//   const [newCycle, setNewCycle] = useState<ListSubscriptionsBillingCycle | undefined>()

//   const queryParams = {
//     page,
//     limit,
//     ...(plan ? { plan } : {}),
//     ...(status ? { status } : {}),
//     ...(billingCycle ? { billing_cycle: billingCycle } : {}),
//   }

//   const {
//     data: response,
//     isLoading,
//     isFetching,
//     error,
//   } = useListSubscriptions(queryParams, {
//     query: { enabled: true, queryKey: getListSubscriptionsQueryKey(queryParams) },
//   })

//   const updateMutation = useUpdateSubscription()

//   const runUpdate = (
//     id: number,
//     data: Partial<{ plan: string; status: string; billing_cycle: string }>,
//     successMsg: string
//   ) => {
//     updateMutation.mutate(
//       { id, data: data as any },
//       {
//         onSuccess: () => {
//           toast({ title: "Subscription updated", description: successMsg })
//           queryClient.invalidateQueries({ queryKey: getListSubscriptionsQueryKey({}) })
//         },
//         onError: () => {
//           toast({ variant: "destructive", title: "Update failed", description: "Could not modify subscription." })
//         },
//       }
//     )
//   }

//   const openChangeDialog = (sub: { id: number; plan: string; billing_cycle: string }) => {
//     setChangeTarget({ id: sub.id, plan: sub.plan, billingCycle: sub.billing_cycle })
//     setNewPlan(sub.plan as ListSubscriptionsPlan)
//     setNewCycle(sub.billing_cycle as ListSubscriptionsBillingCycle)
//   }

//   const confirmChange = () => {
//     if (!changeTarget || !newPlan || !newCycle) return
//     runUpdate(
//       changeTarget.id,
//       { plan: newPlan, billing_cycle: newCycle },
//       "Plan and billing cycle updated. Amount and end date recalculated."
//     )
//     setChangeTarget(null)
//   }

//   const clearFilters = () => {
//     setPlan(undefined)
//     setStatus(undefined)
//     setBillingCycle(undefined)
//     setPage(1)
//   }

//   const hasFilters = Boolean(plan || status || billingCycle)
//   const total = response?.total ?? 0
//   const rows = response?.data ?? []
//   const countByStatus = (s: string) => rows.filter((r) => (r.status as string) === s).length

//   return (
//     <div className="-mt-6 min-h-full space-y-6 bg-background" style={{ fontFamily: "Times New Roman, Times, serif" }}>
//       {/* HEADER */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-start gap-4">
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
//             <CreditCard className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscriptions</h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Manage active plans, billing cycles, and renewals across all businesses.
//             </p>
//           </div>
//         </div>

//         {isFetching && !isLoading && (
//           <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
//             <RefreshCw className="h-4 w-4 animate-spin" />
//             Updating...
//           </div>
//         )}
//       </div>

//       {/* OVERVIEW */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//         <OverviewCard title="Total" value={isLoading ? "—" : total.toLocaleString()} description={hasFilters ? "Matching filters" : "All businesses"} icon={CreditCard} />
//         <OverviewCard title="Trial" value={isLoading ? "—" : countByStatus("trial").toLocaleString()} description="On current page" icon={Clock} iconClassName="text-blue-600" iconBgClassName="bg-blue-500/10" />
//         <OverviewCard title="Active" value={isLoading ? "—" : countByStatus("active").toLocaleString()} description="On current page" icon={CheckCircle} iconClassName="text-emerald-600" iconBgClassName="bg-emerald-500/10" />
//         <OverviewCard title="Expired" value={isLoading ? "—" : countByStatus("expired").toLocaleString()} description="On current page" icon={Clock} iconClassName="text-amber-600" iconBgClassName="bg-amber-500/10" />
//         <OverviewCard title="Cancelled" value={isLoading ? "—" : countByStatus("cancelled").toLocaleString()} description="On current page" icon={XCircle} iconClassName="text-red-600" iconBgClassName="bg-red-500/10" />
//       </div>

//       {/* MAIN CARD */}
//       <Card className="overflow-hidden border-border/70 shadow-sm">
//         <CardHeader className="border-b bg-card pb-5">
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <CardTitle className="text-xl font-bold">Subscription List</CardTitle>
//                 <CardDescription className="mt-1">
//                   Filter by plan, billing cycle or status. Change plan/cycle, cancel or reactivate.
//                 </CardDescription>
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 {/* Plan */}
//                 <Select
//                   value={plan || "all"}
//                   onValueChange={(val) => { setPlan(val === "all" ? undefined : (val as ListSubscriptionsPlan)); setPage(1) }}
//                 >
//                   <SelectTrigger className="h-10 w-full sm:w-[140px]">
//                     <div className="flex items-center gap-2">
//                       <Filter className="h-4 w-4 text-muted-foreground" />
//                       <SelectValue placeholder="Plan" />
//                     </div>
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Plans</SelectItem>
//                     {PLANS.map((p) => (
//                       <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Billing Cycle */}
//                 <Select
//                   value={billingCycle || "all"}
//                   onValueChange={(val) => { setBillingCycle(val === "all" ? undefined : (val as ListSubscriptionsBillingCycle)); setPage(1) }}
//                 >
//                   <SelectTrigger className="h-10 w-full sm:w-[155px]">
//                     <SelectValue placeholder="Billing Cycle" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Cycles</SelectItem>
//                     {BILLING_CYCLES.map((c) => (
//                       <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Status */}
//                 <Select
//                   value={status || "all"}
//                   onValueChange={(val) => { setStatus(val === "all" ? undefined : (val as ListSubscriptionsStatus)); setPage(1) }}
//                 >
//                   <SelectTrigger className="h-10 w-full sm:w-[140px]">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="trial">Trial</SelectItem>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="expired">Expired</SelectItem>
//                     <SelectItem value="cancelled">Cancelled</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 {hasFilters && (
//                   <Button variant="outline" className="h-10 gap-2" onClick={clearFilters}>
//                     <X className="h-4 w-4" /> Clear
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {hasFilters && (
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-xs font-semibold text-muted-foreground">Active filters:</span>
//                 {plan && (
//                   <Badge variant="secondary" className="gap-1 capitalize">
//                     Plan: {plan}
//                     <button type="button" onClick={() => { setPlan(undefined); setPage(1) }}><X className="h-3 w-3" /></button>
//                   </Badge>
//                 )}
//                 {billingCycle && (
//                   <Badge variant="secondary" className="gap-1 capitalize">
//                     Cycle: {cycleLabel(billingCycle)}
//                     <button type="button" onClick={() => { setBillingCycle(undefined); setPage(1) }}><X className="h-3 w-3" /></button>
//                   </Badge>
//                 )}
//                 {status && (
//                   <Badge variant="secondary" className="gap-1 capitalize">
//                     Status: {status}
//                     <button type="button" onClick={() => { setStatus(undefined); setPage(1) }}><X className="h-3 w-3" /></button>
//                   </Badge>
//                 )}
//               </div>
//             )}
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           <div className="w-full overflow-x-auto">
//             <Table className="min-w-[1100px] table-fixed">
//               <TableHeader>
//                 <TableRow className="bg-muted/30 hover:bg-muted/30">
//                   <TableHead className="w-[20%] pl-5 pr-3">Business</TableHead>
//                   <TableHead className="w-[9%] px-3">Plan</TableHead>
//                   <TableHead className="w-[11%] px-3">Billing Cycle</TableHead>
//                   <TableHead className="w-[10%] px-3">Status</TableHead>
//                   <TableHead className="w-[11%] px-3">Start Date</TableHead>
//                   <TableHead className="w-[13%] px-3">End Date</TableHead>
//                   <TableHead className="w-[10%] px-3">Amount</TableHead>
//                   <TableHead className="w-[13%] px-3">Ref ID</TableHead>
//                   <TableHead className="w-12 px-2"><span className="sr-only">Actions</span></TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {isLoading && Array.from({ length: 10 }).map((_, i) => <SubscriptionSkeletonRow key={`skel-${i}`} />)}

//                 {!isLoading && !error && rows.map((sub) => {
//                   const isRunning = sub.status === "active" || sub.status === "trial"
//                   const daysLabel = isRunning ? getDaysLabel(sub.end_date) : null

//                   return (
//                     <TableRow key={sub.id} className="group transition-colors hover:bg-muted/30">
//                       <TableCell className="overflow-hidden pl-5 pr-3">
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-bold text-foreground">{sub.business_name}</p>
//                           <p className="mt-0.5 truncate text-xs text-muted-foreground">Business ID: {sub.business_id}</p>
//                         </div>
//                       </TableCell>

//                       <TableCell className="px-3"><PlanBadge plan={sub.plan} /></TableCell>

//                       <TableCell className="whitespace-nowrap px-3 text-sm">{cycleLabel(sub.billing_cycle)}</TableCell>

//                       <TableCell className="px-3"><StatusBadge status={sub.status as string} /></TableCell>

//                       <TableCell className="whitespace-nowrap px-3 text-sm">{formatDate(sub.start_date)}</TableCell>

//                       <TableCell className="px-3">
//                         <div className="flex flex-col leading-tight">
//                           <span className="whitespace-nowrap text-sm font-medium text-foreground">{formatDate(sub.end_date)}</span>
//                           {daysLabel && (
//                             <span className={`whitespace-nowrap text-xs ${daysLabel.urgent ? "font-semibold text-red-600" : "text-muted-foreground"}`}>
//                               {daysLabel.text}
//                             </span>
//                           )}
//                         </div>
//                       </TableCell>

//                       <TableCell className="whitespace-nowrap px-3 text-sm font-medium">{formatAmount(sub.amount)}</TableCell>

//                       <TableCell className="px-3">
//                         <span className="block truncate font-mono text-xs text-muted-foreground" title={sub.payment_ref || undefined}>
//                           {sub.payment_ref || "—"}
//                         </span>
//                       </TableCell>

//                       <TableCell className="px-2 text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0 opacity-70 transition-opacity hover:opacity-100 group-hover:opacity-100">
//                               <span className="sr-only">Open menu</span>
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>

//                           <DropdownMenuContent align="end" className="w-56">
//                             <DropdownMenuLabel>Manage Subscription</DropdownMenuLabel>
//                             <DropdownMenuSeparator />

//                             <DropdownMenuItem
//                               disabled={updateMutation.isPending}
//                               onClick={() => openChangeDialog({ id: sub.id, plan: sub.plan, billing_cycle: sub.billing_cycle })}
//                             >
//                               <ArrowLeftRight className="mr-2 h-4 w-4 text-primary" />
//                               Change Plan / Billing Cycle
//                             </DropdownMenuItem>

//                             <DropdownMenuSeparator />

//                             {isRunning ? (
//                               <DropdownMenuItem
//                                 className="text-destructive focus:text-destructive"
//                                 disabled={updateMutation.isPending}
//                                 onClick={() => runUpdate(sub.id, { status: "cancelled" }, "Subscription cancelled.")}
//                               >
//                                 <XCircle className="mr-2 h-4 w-4" />
//                                 Cancel Subscription
//                               </DropdownMenuItem>
//                             ) : (
//                               <DropdownMenuItem
//                                 className="text-emerald-600 focus:text-emerald-600"
//                                 disabled={updateMutation.isPending}
//                                 onClick={() => runUpdate(sub.id, { status: "active" }, "Subscription reactivated.")}
//                               >
//                                 <CheckCircle className="mr-2 h-4 w-4" />
//                                 Reactivate
//                               </DropdownMenuItem>
//                             )}
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   )
//                 })}

//                 {!isLoading && error && (
//                   <TableRow>
//                     <TableCell colSpan={9} className="h-64">
//                       <div className="flex flex-col items-center justify-center text-center">
//                         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
//                           <CreditCard className="h-7 w-7 text-red-500" />
//                         </div>
//                         <h3 className="text-base font-bold">Failed to load subscriptions</h3>
//                         <p className="mt-1 max-w-md whitespace-normal text-sm text-muted-foreground">
//                           There was a problem connecting to the API. Please check your connection and try again.
//                         </p>
//                         <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: getListSubscriptionsQueryKey(queryParams) })}>
//                           <RefreshCw className="mr-2 h-4 w-4" /> Try Again
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!isLoading && !error && rows.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={9} className="h-72">
//                       <div className="flex flex-col items-center justify-center text-center">
//                         <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
//                           <CreditCard className="h-8 w-8 text-muted-foreground/50" />
//                         </div>
//                         <h3 className="text-base font-bold">No subscriptions found</h3>
//                         <p className="mt-1 max-w-sm whitespace-normal text-sm text-muted-foreground">
//                           {hasFilters ? "No subscriptions match your current filters." : "There are no subscriptions on the platform yet."}
//                         </p>
//                         {hasFilters && <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {response && !error && (
//             <div className="border-t bg-muted/10">
//               <Pagination page={page} limit={limit} total={response.total} onPageChange={setPage} onLimitChange={(l) => { setLimit(l); setPage(1) }} />
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* CHANGE PLAN / CYCLE DIALOG */}
//       <Dialog open={!!changeTarget} onOpenChange={(open) => !open && setChangeTarget(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Change Plan / Billing Cycle</DialogTitle>
//             <DialogDescription>
//               Amount and end date are recalculated automatically from the configured plan pricing.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-2">
//             <div className="space-y-1.5">
//               <label className="text-sm font-medium">Plan</label>
//               <Select value={newPlan} onValueChange={(v) => setNewPlan(v as ListSubscriptionsPlan)}>
//                 <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
//                 <SelectContent>
//                   {PLANS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm font-medium">Billing Cycle</label>
//               <Select value={newCycle} onValueChange={(v) => setNewCycle(v as ListSubscriptionsBillingCycle)}>
//                 <SelectTrigger><SelectValue placeholder="Select billing cycle" /></SelectTrigger>
//                 <SelectContent>
//                   {BILLING_CYCLES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <IndianRupee className="h-3.5 w-3.5" />
//               New amount will be pulled from the configured plan price for this cycle.
//             </p>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setChangeTarget(null)}>Cancel</Button>
//             <Button onClick={confirmChange} disabled={updateMutation.isPending || !newPlan || !newCycle}>
//               {updateMutation.isPending ? "Saving..." : "Confirm Change"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// /* =============================================================
//    OVERVIEW CARD
// ============================================================= */

// function OverviewCard({ title, value, description, icon: Icon, iconClassName = "text-primary", iconBgClassName = "bg-primary/10" }: {
//   title: string; value: string | number | undefined; description: string; icon: React.ElementType
//   iconClassName?: string; iconBgClassName?: string
// }) {
//   return (
//     <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
//       <CardContent className="p-5">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
//             <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
//             <p className="mt-1 text-xs text-muted-foreground">{description}</p>
//           </div>
//           <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClassName}`}>
//             <Icon className={`h-5 w-5 ${iconClassName}`} />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// /* =============================================================
//    PLAN BADGE  (no "free" fallback anymore)
// ============================================================= */

// function PlanBadge({ plan }: { plan: string }) {
//   const p = plan?.toLowerCase()
//   if (p === "premium") {
//     return <Badge variant="outline" className="border-amber-200 bg-amber-50 capitalize text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">Premium</Badge>
//   }
//   return <Badge variant="outline" className="border-blue-200 bg-blue-50 capitalize text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400">Pro</Badge>
// }

// /* =============================================================
//    STATUS BADGE
// ============================================================= */

// function StatusBadge({ status }: { status: string }) {
//   const map: Record<string, { label: string; badge: string; dot: string }> = {
//     active: { label: "Active", badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400", dot: "bg-emerald-500" },
//     trial: { label: "Trial", badge: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400", dot: "bg-blue-500" },
//     expired: { label: "Expired", badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400", dot: "bg-amber-500" },
//     cancelled: { label: "Cancelled", badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400", dot: "bg-red-500" },
//   }
//   const s = map[status] ?? { label: status || "Unknown", badge: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400", dot: "bg-slate-400" }
//   return (
//     <Badge variant="outline" className={`capitalize ${s.badge}`}>
//       <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${s.dot}`} />
//       {s.label}
//     </Badge>
//   )
// }

// /* =============================================================
//    TABLE SKELETON
// ============================================================= */

// function SubscriptionSkeletonRow() {
//   return (
//     <TableRow>
//       <TableCell className="pl-5 pr-3"><div className="space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></TableCell>
//       <TableCell className="px-3"><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
//       <TableCell className="px-3"><Skeleton className="h-4 w-20" /></TableCell>
//       <TableCell className="px-3"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//       <TableCell className="px-3"><Skeleton className="h-4 w-20" /></TableCell>
//       <TableCell className="px-3"><div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-16" /></div></TableCell>
//       <TableCell className="px-3"><Skeleton className="h-4 w-16" /></TableCell>
//       <TableCell className="px-3"><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell className="px-2"><Skeleton className="ml-auto h-8 w-8 rounded-md" /></TableCell>
//     </TableRow>
//   )
// }

import { useState } from "react"
import {
  useListSubscriptions,
  getListSubscriptionsQueryKey,
  useUpdateSubscription,
  ListSubscriptionsPlan,
  ListSubscriptionsStatus,
  ListSubscriptionsBillingCycle,
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"

import {
  CreditCard, MoreVertical, ArrowLeftRight, XCircle, CheckCircle,
  Clock, Filter, X, RefreshCw, IndianRupee,
} from "lucide-react"

/* =============================================================
   CONSTANTS
============================================================= */

const BILLING_CYCLES: { value: ListSubscriptionsBillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half-Yearly" },
  { value: "yearly", label: "Yearly" },
]

const PLANS: { value: ListSubscriptionsPlan; label: string }[] = [
  { value: "pro", label: "Pro" },
  { value: "premium", label: "Premium" },
]

/* =============================================================
   DATE / CURRENCY HELPERS
============================================================= */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const formatAmount = (value?: string | number | null) => {
  if (value === undefined || value === null) return "—"
  const n = typeof value === "string" ? parseFloat(value) : value
  if (Number.isNaN(n)) return "—"
  return `₹${n.toLocaleString("en-IN")}`
}

const getDaysLabel = (value?: string | null) => {
  if (!value) return null
  const end = new Date(value)
  if (Number.isNaN(end.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  const diff = Math.round((end.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return { text: "Ends today", urgent: true }
  if (diff > 0) return { text: `${diff} day${diff === 1 ? "" : "s"} left`, urgent: diff <= 7 }
  return { text: `Ended ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`, urgent: false }
}

const cycleLabel = (cycle?: string | null) =>
  BILLING_CYCLES.find((c) => c.value === cycle)?.label ?? cycle ?? "—"

export default function Subscriptions() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [plan, setPlan] = useState<ListSubscriptionsPlan | undefined>()
  const [status, setStatus] = useState<ListSubscriptionsStatus | undefined>()
  const [billingCycle, setBillingCycle] = useState<ListSubscriptionsBillingCycle | undefined>()

  // Change Plan/Cycle dialog state
  const [changeTarget, setChangeTarget] = useState<{ id: number; plan: string; billingCycle: string } | null>(null)
  const [newPlan, setNewPlan] = useState<ListSubscriptionsPlan | undefined>()
  const [newCycle, setNewCycle] = useState<ListSubscriptionsBillingCycle | undefined>()

  const queryParams = {
    page,
    limit,
    ...(plan ? { plan } : {}),
    ...(status ? { status } : {}),
    ...(billingCycle ? { billing_cycle: billingCycle } : {}),
  }

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useListSubscriptions(queryParams, {
    query: { enabled: true, queryKey: getListSubscriptionsQueryKey(queryParams) },
  })

  const updateMutation = useUpdateSubscription()

  const runUpdate = (
    id: number,
    data: Partial<{ plan: string; status: string; billing_cycle: string }>,
    successMsg: string
  ) => {
    updateMutation.mutate(
      { id, data: data as any },
      {
        onSuccess: () => {
          toast({ title: "Subscription updated", description: successMsg })
          queryClient.invalidateQueries({ queryKey: getListSubscriptionsQueryKey({}) })
        },
        onError: () => {
          toast({ variant: "destructive", title: "Update failed", description: "Could not modify subscription." })
        },
      }
    )
  }

  const openChangeDialog = (sub: { id: number; plan: string; billing_cycle: string }) => {
    setChangeTarget({ id: sub.id, plan: sub.plan, billingCycle: sub.billing_cycle })
    setNewPlan(sub.plan as ListSubscriptionsPlan)
    setNewCycle(sub.billing_cycle as ListSubscriptionsBillingCycle)
  }

  const confirmChange = () => {
    if (!changeTarget || !newPlan || !newCycle) return
    runUpdate(
      changeTarget.id,
      { plan: newPlan, billing_cycle: newCycle },
      "Plan and billing cycle updated. Amount and end date recalculated."
    )
    setChangeTarget(null)
  }

  const clearFilters = () => {
    setPlan(undefined)
    setStatus(undefined)
    setBillingCycle(undefined)
    setPage(1)
  }

  const hasFilters = Boolean(plan || status || billingCycle)
  const total = response?.total ?? 0
  const rows = response?.data ?? []
  const countByStatus = (s: string) => rows.filter((r) => (r.status as string) === s).length

  return (
    <div className="-mt-6 min-h-full space-y-6 bg-background" style={{ fontFamily: "Times New Roman, Times, serif" }}>
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscriptions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage active plans, billing cycles, and renewals across all businesses.
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

      {/* OVERVIEW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <OverviewCard title="Total" value={isLoading ? "—" : total.toLocaleString()} description={hasFilters ? "Matching filters" : "All businesses"} icon={CreditCard} />
        <OverviewCard title="Trial" value={isLoading ? "—" : countByStatus("trial").toLocaleString()} description="On current page" icon={Clock} iconClassName="text-blue-600" iconBgClassName="bg-blue-500/10" />
        <OverviewCard title="Active" value={isLoading ? "—" : countByStatus("active").toLocaleString()} description="On current page" icon={CheckCircle} iconClassName="text-emerald-600" iconBgClassName="bg-emerald-500/10" />
        <OverviewCard title="Expired" value={isLoading ? "—" : countByStatus("expired").toLocaleString()} description="On current page" icon={Clock} iconClassName="text-amber-600" iconBgClassName="bg-amber-500/10" />
        <OverviewCard title="Cancelled" value={isLoading ? "—" : countByStatus("cancelled").toLocaleString()} description="On current page" icon={XCircle} iconClassName="text-red-600" iconBgClassName="bg-red-500/10" />
      </div>

      {/* MAIN CARD */}
      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="border-b bg-card pb-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Subscription List</CardTitle>
                <CardDescription className="mt-1">
                  Filter by plan, billing cycle or status. Change plan/cycle, cancel or reactivate.
                </CardDescription>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Plan */}
                <Select
                  value={plan || "all"}
                  onValueChange={(val) => { setPlan(val === "all" ? undefined : (val as ListSubscriptionsPlan)); setPage(1) }}
                >
                  <SelectTrigger className="h-10 w-full sm:w-[140px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Plan" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {PLANS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Billing Cycle */}
                <Select
                  value={billingCycle || "all"}
                  onValueChange={(val) => { setBillingCycle(val === "all" ? undefined : (val as ListSubscriptionsBillingCycle)); setPage(1) }}
                >
                  <SelectTrigger className="h-10 w-full sm:w-[155px]">
                    <SelectValue placeholder="Billing Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cycles</SelectItem>
                    {BILLING_CYCLES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status */}
                <Select
                  value={status || "all"}
                  onValueChange={(val) => { setStatus(val === "all" ? undefined : (val as ListSubscriptionsStatus)); setPage(1) }}
                >
                  <SelectTrigger className="h-10 w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="outline" className="h-10 gap-2" onClick={clearFilters}>
                    <X className="h-4 w-4" /> Clear
                  </Button>
                )}
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Active filters:</span>
                {plan && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    Plan: {plan}
                    <button type="button" onClick={() => { setPlan(undefined); setPage(1) }}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {billingCycle && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    Cycle: {cycleLabel(billingCycle)}
                    <button type="button" onClick={() => { setBillingCycle(undefined); setPage(1) }}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {status && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    Status: {status}
                    <button type="button" onClick={() => { setStatus(undefined); setPage(1) }}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {/* =========================================================
            TABLE — no horizontal scroll: fixed layout, % widths,
            everything fits inside the card at any reasonable width.
        ========================================================= */}
        <CardContent className="p-0">
          <div className="w-full">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[21%] overflow-hidden truncate pl-5 pr-2 text-xs">Business</TableHead>
                  <TableHead className="w-[8%] overflow-hidden truncate px-2 text-xs">Plan</TableHead>
                  <TableHead className="w-[10%] overflow-hidden truncate px-2 text-xs">Cycle</TableHead>
                  <TableHead className="w-[9%] overflow-hidden truncate px-2 text-xs">Status</TableHead>
                  <TableHead className="w-[11%] overflow-hidden truncate px-2 text-xs">Start Date</TableHead>
                  <TableHead className="w-[12%] overflow-hidden truncate px-2 text-xs">End Date</TableHead>
                  <TableHead className="w-[9%] overflow-hidden truncate px-2 text-xs">Amount</TableHead>
                  <TableHead className="w-[16%] overflow-hidden truncate px-2 text-xs">Ref ID</TableHead>
                  <TableHead className="w-[4%] px-2"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && Array.from({ length: 10 }).map((_, i) => <SubscriptionSkeletonRow key={`skel-${i}`} />)}

                {!isLoading && !error && rows.map((sub) => {
                  const isRunning = sub.status === "active" || sub.status === "trial"
                  const daysLabel = isRunning ? getDaysLabel(sub.end_date) : null

                  return (
                    <TableRow key={sub.id} className="group transition-colors hover:bg-muted/30">
                      <TableCell className="overflow-hidden pl-5 pr-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">{sub.business_name}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">ID: {sub.business_id}</p>
                        </div>
                      </TableCell>

                      <TableCell className="overflow-hidden px-2"><PlanBadge plan={sub.plan} /></TableCell>

                      <TableCell className="overflow-hidden truncate whitespace-nowrap px-2 text-sm">{cycleLabel(sub.billing_cycle)}</TableCell>

                      <TableCell className="overflow-hidden px-2"><StatusBadge status={sub.status as string} /></TableCell>

                      <TableCell className="overflow-hidden truncate whitespace-nowrap px-2 text-sm">{formatDate(sub.start_date)}</TableCell>

                      <TableCell className="overflow-hidden px-2">
                        <div className="flex min-w-0 flex-col leading-tight">
                          <span className="truncate whitespace-nowrap text-sm font-medium text-foreground">{formatDate(sub.end_date)}</span>
                          {daysLabel && (
                            <span className={`truncate whitespace-nowrap text-xs ${daysLabel.urgent ? "font-semibold text-red-600" : "text-muted-foreground"}`}>
                              {daysLabel.text}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="overflow-hidden truncate whitespace-nowrap px-2 text-sm font-medium">{formatAmount(sub.amount)}</TableCell>

                      <TableCell className="overflow-hidden px-2">
                        <span className="block truncate font-mono text-xs text-muted-foreground" title={sub.payment_ref || undefined}>
                          {sub.payment_ref || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="px-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-70 transition-opacity hover:opacity-100 group-hover:opacity-100">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Manage Subscription</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              disabled={updateMutation.isPending}
                              onClick={() => openChangeDialog({ id: sub.id, plan: sub.plan, billing_cycle: sub.billing_cycle })}
                            >
                              <ArrowLeftRight className="mr-2 h-4 w-4 text-primary" />
                              Change Plan / Billing Cycle
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {isRunning ? (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                disabled={updateMutation.isPending}
                                onClick={() => runUpdate(sub.id, { status: "cancelled" }, "Subscription cancelled.")}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Subscription
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-emerald-600 focus:text-emerald-600"
                                disabled={updateMutation.isPending}
                                onClick={() => runUpdate(sub.id, { status: "active" }, "Subscription reactivated.")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                          <CreditCard className="h-7 w-7 text-red-500" />
                        </div>
                        <h3 className="text-base font-bold">Failed to load subscriptions</h3>
                        <p className="mt-1 max-w-md whitespace-normal text-sm text-muted-foreground">
                          There was a problem connecting to the API. Please check your connection and try again.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: getListSubscriptionsQueryKey(queryParams) })}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-72">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                          <CreditCard className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-base font-bold">No subscriptions found</h3>
                        <p className="mt-1 max-w-sm whitespace-normal text-sm text-muted-foreground">
                          {hasFilters ? "No subscriptions match your current filters." : "There are no subscriptions on the platform yet."}
                        </p>
                        {hasFilters && <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {response && !error && (
            <div className="border-t bg-muted/10">
              <Pagination page={page} limit={limit} total={response.total} onPageChange={setPage} onLimitChange={(l) => { setLimit(l); setPage(1) }} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* CHANGE PLAN / CYCLE DIALOG */}
      <Dialog open={!!changeTarget} onOpenChange={(open) => !open && setChangeTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Plan / Billing Cycle</DialogTitle>
            <DialogDescription>
              Amount and end date are recalculated automatically from the configured plan pricing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Plan</label>
              <Select value={newPlan} onValueChange={(v) => setNewPlan(v as ListSubscriptionsPlan)}>
                <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {PLANS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Billing Cycle</label>
              <Select value={newCycle} onValueChange={(v) => setNewCycle(v as ListSubscriptionsBillingCycle)}>
                <SelectTrigger><SelectValue placeholder="Select billing cycle" /></SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IndianRupee className="h-3.5 w-3.5" />
              New amount will be pulled from the configured plan price for this cycle.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeTarget(null)}>Cancel</Button>
            <Button onClick={confirmChange} disabled={updateMutation.isPending || !newPlan || !newCycle}>
              {updateMutation.isPending ? "Saving..." : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* =============================================================
   OVERVIEW CARD
============================================================= */

function OverviewCard({ title, value, description, icon: Icon, iconClassName = "text-primary", iconBgClassName = "bg-primary/10" }: {
  title: string; value: string | number | undefined; description: string; icon: React.ElementType
  iconClassName?: string; iconBgClassName?: string
}) {
  return (
    <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClassName}`}>
            <Icon className={`h-5 w-5 ${iconClassName}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* =============================================================
   PLAN BADGE  (no "free" fallback anymore)
============================================================= */

function PlanBadge({ plan }: { plan: string }) {
  const p = plan?.toLowerCase()
  if (p === "premium") {
    return <Badge variant="outline" className="border-amber-200 bg-amber-50 capitalize text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">Premium</Badge>
  }
  return <Badge variant="outline" className="border-blue-200 bg-blue-50 capitalize text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400">Pro</Badge>
}

/* =============================================================
   STATUS BADGE
============================================================= */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; badge: string; dot: string }> = {
    active: { label: "Active", badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400", dot: "bg-emerald-500" },
    trial: { label: "Trial", badge: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400", dot: "bg-blue-500" },
    expired: { label: "Expired", badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400", dot: "bg-amber-500" },
    cancelled: { label: "Cancelled", badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400", dot: "bg-red-500" },
  }
  const s = map[status] ?? { label: status || "Unknown", badge: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400", dot: "bg-slate-400" }
  return (
    <Badge variant="outline" className={`capitalize ${s.badge}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </Badge>
  )
}

/* =============================================================
   TABLE SKELETON
============================================================= */

function SubscriptionSkeletonRow() {
  return (
    <TableRow>
      <TableCell className="pl-5 pr-2"><div className="space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></TableCell>
      <TableCell className="px-2"><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
      <TableCell className="px-2"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="px-2"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="px-2"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="px-2"><div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-3 w-12" /></div></TableCell>
      <TableCell className="px-2"><Skeleton className="h-4 w-12" /></TableCell>
      <TableCell className="px-2"><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell className="px-2"><Skeleton className="ml-auto h-8 w-8 rounded-md" /></TableCell>
    </TableRow>
  )
}