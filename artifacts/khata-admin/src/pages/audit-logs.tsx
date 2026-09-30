import { useState } from "react"
import {
  useListAuditLogs,
  getListAuditLogsQueryKey,
} from "@workspace/api-client-react"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

import { formatDateTime } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

import {
  ShieldAlert,
  Search,
  Activity,
  Clock3,
  UserRound,
  Server,
  ArrowRight,
  FileText,
} from "lucide-react"

export default function AuditLogs() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 500)

  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { action: debouncedSearch } : {}),
  }

  const { data: response, isLoading } = useListAuditLogs(queryParams, {
    query: {
      enabled: true,
      queryKey: getListAuditLogsQueryKey(queryParams),
    },
  })

  const logs = response?.data || []

  const systemActions = logs.filter((log: any) => !log.user_id).length
  const userActions = logs.filter((log: any) => log.user_id).length

  const getActionStyle = (action: string) => {
    const value = action?.toLowerCase() || ""

    if (
      value.includes("delete") ||
      value.includes("remove") ||
      value.includes("cancel")
    ) {
      return {
        className:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400",
      }
    }

    if (
      value.includes("create") ||
      value.includes("add") ||
      value.includes("register")
    ) {
      return {
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400",
      }
    }

    if (
      value.includes("update") ||
      value.includes("edit") ||
      value.includes("change")
    ) {
      return {
        className:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400",
      }
    }

    if (
      value.includes("login") ||
      value.includes("logout") ||
      value.includes("auth")
    ) {
      return {
        className:
          "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-400",
      }
    }

    return {
      className:
        "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
  }

  return (
    <div
      className="space-y-6 pb-8"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
            <ShieldAlert className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Audit Trail
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor and review critical system activities and changes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 shadow-sm">
          <Activity className="h-4 w-4 text-primary" />

          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Total Records
            </p>

            <p className="text-lg font-bold leading-none">
              {response?.total ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Logs
              </p>

              <p className="mt-1 text-2xl font-bold">
                {response?.total ?? 0}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Recorded activities
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Page
              </p>

              <p className="mt-1 text-2xl font-bold">
                {logs.length}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Logs displayed
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Clock3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User Actions
              </p>

              <p className="mt-1 text-2xl font-bold">
                {userActions}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Actions by users
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <UserRound className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                System Actions
              </p>

              <p className="mt-1 text-2xl font-bold">
                {systemActions}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Automated activities
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <Server className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Activity */}
      <Card className="overflow-hidden">
        {/* Search Header */}
        <div className="border-b bg-muted/20 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Activity Log
              </h2>

              <p className="text-sm text-muted-foreground">
                Detailed history of system and user activities.
              </p>
            </div>

            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="search"
                placeholder="Search by action name..."
                className="h-10 pl-9 bg-background"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[180px] font-bold">
                    Timestamp
                  </TableHead>

                  <TableHead className="w-[190px] font-bold">
                    Action
                  </TableHead>

                  <TableHead className="w-[220px] font-bold">
                    User
                  </TableHead>

                  <TableHead className="w-[190px] font-bold">
                    Entity
                  </TableHead>

                  <TableHead className="font-bold">
                    Changes
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={`skel-${i}`}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-6 w-32 rounded-full" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-36" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-64" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : response?.data && response.data.length > 0 ? (
                  response.data.map((log: any) => {
                    const actionStyle = getActionStyle(log.action)

                    return (
                      <TableRow
                        key={log.id}
                        className="group transition-colors hover:bg-muted/20"
                      >
                        {/* Timestamp */}
                        <TableCell className="align-top">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                              <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>

                            <div>
                              <p className="whitespace-nowrap text-xs font-medium">
                                {formatDateTime(log.created_at)}
                              </p>

                              <p className="mt-0.5 text-[10px] text-muted-foreground">
                                Log #{log.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="align-top">
                          <Badge
                            variant="outline"
                            className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${actionStyle.className}`}
                          >
                            {log.action}
                          </Badge>
                        </TableCell>

                        {/* User */}
                        <TableCell className="align-top">
                          {log.user_name ? (
                            <div className="flex items-start gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <UserRound className="h-4 w-4 text-primary" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {log.user_name}
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                  User ID: {log.user_id}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                                <Server className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold">
                                  System
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                  Automated action
                                </p>
                              </div>
                            </div>
                          )}
                        </TableCell>

                        {/* Entity */}
                        <TableCell className="align-top">
                          <div>
                            <p className="text-sm font-semibold capitalize">
                              {log.entity_type}
                            </p>

                            {log.entity_id && (
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Entity ID: #{log.entity_id}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Changes */}
                        <TableCell className="align-top">
                          {log.old_value || log.new_value ? (
                            <div className="flex min-w-[260px] max-w-[500px] items-center gap-2 text-xs">
                              {log.old_value && (
                                <div className="min-w-0 flex-1 rounded-md border bg-red-50/50 px-2.5 py-2 dark:bg-red-950/10">
                                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-red-500">
                                    Previous
                                  </p>

                                  <p className="truncate font-mono text-[10px] text-muted-foreground line-through">
                                    {log.old_value}
                                  </p>
                                </div>
                              )}

                              {log.old_value && log.new_value && (
                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}

                              {log.new_value && (
                                <div className="min-w-0 flex-1 rounded-md border bg-emerald-50/50 px-2.5 py-2 dark:bg-emerald-950/10">
                                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                                    New
                                  </p>

                                  <p className="truncate font-mono text-[10px]">
                                    {log.new_value}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs italic text-muted-foreground">
                              No value changes recorded
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-[360px] text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                          <ShieldAlert className="h-8 w-8 text-muted-foreground/40" />
                        </div>

                        <h3 className="text-lg font-bold">
                          No Audit Logs Found
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          There are no audit activities matching your current
                          search.
                        </p>

                        {search && (
                          <button
                            type="button"
                            className="mt-4 text-sm font-semibold text-primary hover:underline"
                            onClick={() => {
                              setSearch("")
                              setPage(1)
                            }}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {response && (
            <div className="border-t">
              <Pagination
                page={page}
                limit={limit}
                total={response.total}
                onPageChange={setPage}
                onLimitChange={(l) => {
                  setLimit(l)
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