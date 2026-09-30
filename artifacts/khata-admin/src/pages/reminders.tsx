// import { useState } from "react"
// import { 
//   useListReminders, 
//   getListRemindersQueryKey,
//   useSendReminder,
//   ListRemindersStatus
// } from "@workspace/api-client-react"
// import { useQueryClient } from "@tanstack/react-query"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
// import { formatDateTime, formatCurrency } from "@/lib/utils"
// import { BellRing, Send } from "lucide-react"

// export default function Reminders() {
//   const { toast } = useToast()
//   const queryClient = useQueryClient()
  
//   const [status, setStatus] = useState<ListRemindersStatus | undefined>()
  
//   const queryParams = {
//     business_id: 0, // Using 0 to fetch platform-wide if API allows, or need specific biz
//     ...(status ? { status } : {}),
//   }

//   // Note: For a real admin panel, this endpoint might need to support fetching across all businesses
//   // Currently the API spec requires business_id. For the mockup we pass 0 or a placeholder.
//   const { data: reminders, isLoading } = useListReminders(queryParams, {
//     query: { enabled: true, queryKey: getListRemindersQueryKey(queryParams) }
//   })

//   const sendMutation = useSendReminder()

//   const handleSend = (id: number) => {
//     sendMutation.mutate(
//       { id },
//       {
//         onSuccess: () => {
//           toast({
//             title: "Reminder Sent",
//             description: "The payment reminder has been dispatched.",
//           })
//           queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey(queryParams) })
//         },
//         onError: () => {
//           toast({
//             variant: "destructive",
//             title: "Send failed",
//             description: "Failed to dispatch reminder. Please try again.",
//           })
//         }
//       }
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
//             <BellRing className="h-8 w-8 text-primary" />
//             Payment Reminders
//           </h1>
//           <p className="text-muted-foreground mt-1">Monitor automated payment reminders platform-wide.</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex justify-end gap-2">
//             <Select 
//               value={status || "all"} 
//               onValueChange={(val) => setStatus(val === "all" ? undefined : val as ListRemindersStatus)}
//             >
//               <SelectTrigger className="w-[160px]">
//                 <SelectValue placeholder="Filter Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="sent">Sent</SelectItem>
//                 <SelectItem value="failed">Failed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Business</TableHead>
//                 <TableHead className="text-right">Amount</TableHead>
//                 <TableHead>Channel</TableHead>
//                 <TableHead>Scheduled Date</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="w-[100px] text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 Array(10).fill(0).map((_, i) => (
//                   <TableRow key={`skel-${i}`}>
//                     <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
//                     <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
//                     <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
//                     <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//                     <TableCell><Skeleton className="h-4 w-32" /></TableCell>
//                     <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//                     <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
//                   </TableRow>
//                 ))
//               ) : reminders && reminders.length > 0 ? (
//                 reminders.map((reminder: any) => (
//                   <TableRow key={reminder.id} className="group">
//                     <TableCell className="font-medium">
//                       {reminder.customer_name || `Customer #${reminder.customer_id}`}
//                     </TableCell>
//                     <TableCell className="text-sm text-muted-foreground">
//                       Business #{reminder.business_id}
//                     </TableCell>
//                     <TableCell className="text-right font-mono text-destructive">
//                       {reminder.amount ? formatCurrency(reminder.amount) : '-'}
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="capitalize text-xs">
//                         {reminder.channel}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-sm">
//                       {formatDateTime(reminder.reminder_date)}
//                     </TableCell>
//                     <TableCell>
//                       {reminder.status === 'pending' && <Badge variant="warning" className="bg-warning/10 text-warning-foreground border-warning/20">Pending</Badge>}
//                       {reminder.status === 'sent' && <Badge variant="success" className="bg-success/10 text-success border-success/20">Sent</Badge>}
//                       {reminder.status === 'failed' && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {reminder.status === 'pending' && (
//                         <Button 
//                           size="sm" 
//                           variant="outline" 
//                           onClick={() => handleSend(reminder.id)}
//                           disabled={sendMutation.isPending}
//                         >
//                           <Send className="mr-2 h-3 w-3" />
//                           Send Now
//                         </Button>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={7} className="h-48 text-center">
//                     <div className="flex flex-col items-center justify-center text-muted-foreground">
//                       <BellRing className="h-10 w-10 mb-4 opacity-20" />
//                       <p>No reminders found</p>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

import { useMemo, useState } from "react"
import {
  useListReminders,
  getListRemindersQueryKey,
  useSendReminder,
  ListRemindersStatus,
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatCurrency } from "@/lib/utils"

import {
  BellRing,
  Send,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MessageCircle,
  Building2,
  UserRound,
  IndianRupee,
  CalendarDays,
} from "lucide-react"

export default function Reminders() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [status, setStatus] = useState<ListRemindersStatus | undefined>()
  const [search, setSearch] = useState("")

  const queryParams = {
    business_id: 0,
    ...(status ? { status } : {}),
  }

  const {
    data: reminders,
    isLoading,
    isFetching,
  } = useListReminders(queryParams, {
    query: {
      enabled: true,
      queryKey: getListRemindersQueryKey(queryParams),
    },
  })

  const sendMutation = useSendReminder()

  const handleSend = (id: number) => {
    sendMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Reminder Sent",
            description: "The payment reminder has been dispatched successfully.",
          })

          queryClient.invalidateQueries({
            queryKey: getListRemindersQueryKey(queryParams),
          })
        },

        onError: () => {
          toast({
            variant: "destructive",
            title: "Send Failed",
            description: "Failed to dispatch reminder. Please try again.",
          })
        },
      }
    )
  }

  const reminderList = reminders || []

  const summary = useMemo(() => {
    return {
      total: reminderList.length,
      pending: reminderList.filter((item: any) => item.status === "pending")
        .length,
      sent: reminderList.filter((item: any) => item.status === "sent").length,
      failed: reminderList.filter((item: any) => item.status === "failed")
        .length,
    }
  }, [reminderList])

  const filteredReminders = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return reminderList

    return reminderList.filter((reminder: any) => {
      const customer = String(
        reminder.customer_name ||
          `Customer #${reminder.customer_id || ""}`
      ).toLowerCase()

      const business = String(
        reminder.business_name ||
          `Business #${reminder.business_id || ""}`
      ).toLowerCase()

      const channel = String(reminder.channel || "").toLowerCase()

      return (
        customer.includes(value) ||
        business.includes(value) ||
        channel.includes(value)
      )
    })
  }, [reminderList, search])

  return (
    <div className="space-y-6 pb-8">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-primary/10">
            <BellRing className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Reminders
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor and manage payment reminders across all businesses.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: getListRemindersQueryKey(queryParams),
            })
          }
          disabled={isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reminders
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    summary.total
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Platform-wide reminders
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <BellRing className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border-amber-200/70 bg-amber-50/30 shadow-sm dark:bg-amber-950/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-amber-600">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    summary.pending
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Waiting to be sent
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/30">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sent */}
        <Card className="border-emerald-200/70 bg-emerald-50/30 shadow-sm dark:bg-emerald-950/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sent
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    summary.sent
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Successfully dispatched
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Failed */}
        <Card className="border-red-200/70 bg-red-50/30 shadow-sm dark:bg-red-950/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Failed
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-red-600">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    summary.failed
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Need attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/30">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================
          REMINDERS TABLE
      ========================================================= */}
      <Card className="overflow-hidden border-border/70 shadow-sm">

        {/* Toolbar */}
        <div className="border-b bg-muted/20 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Reminder Activity
              </h2>

              <p className="text-sm text-muted-foreground">
                View scheduled and dispatched payment reminders.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* Search */}
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer or business..."
                  className="h-10 bg-background pl-9"
                />
              </div>

              {/* Status */}
              <Select
                value={status || "all"}
                onValueChange={(value) =>
                  setStatus(
                    value === "all"
                      ? undefined
                      : (value as ListRemindersStatus)
                  )
                }
              >
                <SelectTrigger className="h-10 w-full bg-background sm:w-[160px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>

              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">

                  <TableHead className="h-12 pl-6">
                    Customer
                  </TableHead>

                  <TableHead className="h-12">
                    Business
                  </TableHead>

                  <TableHead className="h-12 text-right">
                    Amount
                  </TableHead>

                  <TableHead className="h-12">
                    Channel
                  </TableHead>

                  <TableHead className="h-12">
                    Scheduled
                  </TableHead>

                  <TableHead className="h-12">
                    Status
                  </TableHead>

                  <TableHead className="h-12 pr-6 text-right">
                    Action
                  </TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {/* Loading */}
                {isLoading &&
                  Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>

                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-20" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>

                      <TableCell className="pr-6">
                        <Skeleton className="ml-auto h-8 w-24" />
                      </TableCell>

                    </TableRow>
                  ))}

                {/* Data */}
                {!isLoading &&
                  filteredReminders.length > 0 &&
                  filteredReminders.map((reminder: any) => {

                    const customerName =
                      reminder.customer_name ||
                      `Customer #${reminder.customer_id}`

                    const businessName =
                      reminder.business_name ||
                      `Business #${reminder.business_id}`

                    return (
                      <TableRow
                        key={reminder.id}
                        className="group transition-colors hover:bg-muted/30"
                      >

                        {/* Customer */}
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <UserRound className="h-4 w-4 text-primary" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {customerName}
                              </p>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Customer ID #{reminder.customer_id}
                              </p>
                            </div>

                          </div>
                        </TableCell>

                        {/* Business */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />

                            <span className="text-sm font-medium">
                              {businessName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-1 font-mono font-semibold text-red-600">
                            <IndianRupee className="h-3.5 w-3.5" />

                            {reminder.amount
                              ? formatCurrency(reminder.amount).replace(
                                  "₹",
                                  ""
                                )
                              : "0"}
                          </div>
                        </TableCell>

                        {/* Channel */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="gap-1.5 capitalize font-medium"
                          >
                            <MessageCircle className="h-3 w-3" />
                            {reminder.channel || "N/A"}
                          </Badge>
                        </TableCell>

                        {/* Scheduled */}
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />

                            <span>
                              {reminder.reminder_date
                                ? formatDateTime(reminder.reminder_date)
                                : "-"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {reminder.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                            >
                              <Clock3 className="mr-1.5 h-3 w-3" />
                              Pending
                            </Badge>
                          )}

                          {reminder.status === "sent" && (
                            <Badge
                              variant="outline"
                              className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                            >
                              <CheckCircle2 className="mr-1.5 h-3 w-3" />
                              Sent
                            </Badge>
                          )}

                          {reminder.status === "failed" && (
                            <Badge
                              variant="outline"
                              className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                            >
                              <XCircle className="mr-1.5 h-3 w-3" />
                              Failed
                            </Badge>
                          )}
                        </TableCell>

                        {/* Action */}
                        <TableCell className="pr-6 text-right">

                          {reminder.status === "pending" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                              onClick={() => handleSend(reminder.id)}
                              disabled={sendMutation.isPending}
                            >
                              <Send className="h-3.5 w-3.5" />

                              {sendMutation.isPending
                                ? "Sending..."
                                : "Send Now"}
                            </Button>
                          ) : reminder.status === "sent" ? (
                            <span className="text-xs text-muted-foreground">
                              Completed
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-red-600">
                              Failed
                            </span>
                          )}

                        </TableCell>

                      </TableRow>
                    )
                  })}

                {/* Empty */}
                {!isLoading && filteredReminders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-[360px]"
                    >
                      <div className="flex flex-col items-center justify-center text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                          <BellRing className="h-7 w-7 text-muted-foreground" />
                        </div>

                        <h3 className="mt-4 text-base font-semibold">
                          {search
                            ? "No reminders found"
                            : "No payment reminders"}
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          {search
                            ? "Try changing your search or status filter."
                            : "Payment reminders will appear here when they are created."}
                        </p>

                        {search && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setSearch("")}
                          >
                            Clear Search
                          </Button>
                        )}

                      </div>
                    </TableCell>
                  </TableRow>
                )}

              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Footer */}
        {!isLoading && filteredReminders.length > 0 && (
          <div className="flex items-center justify-between border-t bg-muted/10 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredReminders.length}
              </span>{" "}
              reminder{filteredReminders.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Sent
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                Pending
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
                Failed
              </span>
            </div>
          </div>
        )}

      </Card>
    </div>
  )
}

