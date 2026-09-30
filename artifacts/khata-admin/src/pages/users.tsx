import { useState } from "react"
import {
  useListAdminUsers,
  getListAdminUsersQueryKey,
  useUpdateUserStatus,
  ListAdminUsersRole,
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
import { useDebounce } from "@/hooks/use-debounce"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Search, MoreVertical, Store, User as UserIcon, X } from "lucide-react"

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

/* =============================================================
   BUSINESS USERS  (use inside the Business Details page)

   <BusinessUsers businessId={business.id} />
============================================================= */

export default function BusinessUsers({ businessId }: { businessId: number }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<ListAdminUsersRole | undefined>()

  const debouncedSearch = useDebounce(search, 500)

  // business_id => only this business's users (backend must support this filter)
  const queryParams = {
    page,
    limit,
    business_id: businessId,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(role ? { role } : {}),
  }

  const { data: response, isLoading } = useListAdminUsers(queryParams, {
    query: {
      enabled: true,
      queryKey: getListAdminUsersQueryKey(queryParams),
    },
  })

  const updateStatus = useUpdateUserStatus()

  const handleStatusChange = (id: number, active: boolean) => {
    updateStatus.mutate(
      { id, data: { is_active: active } },
      {
        onSuccess: () => {
          toast({
            title: `User ${active ? "activated" : "suspended"}`,
            description: "The user account status has been updated.",
          })
          queryClient.invalidateQueries({
            queryKey: getListAdminUsersQueryKey({}),
          })
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Failed to update user status.",
          })
        },
      }
    )
  }

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="border-b bg-card pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Users
                {response && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({response.total})
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-0.5">
                Owner and staff accounts of this business.
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search name, email or phone..."
                className="h-10 pl-9 pr-9 text-sm"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select
              value={role || "all"}
              onValueChange={(val) => {
                setRole(val === "all" ? undefined : (val as ListAdminUsersRole))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-10 w-full sm:w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[28%] overflow-hidden truncate pl-5 pr-3">
                  User
                </TableHead>
                <TableHead className="w-[28%] overflow-hidden truncate px-3">
                  Contact
                </TableHead>
                <TableHead className="w-[12%] overflow-hidden truncate px-3">
                  Role
                </TableHead>
                <TableHead className="w-[12%] overflow-hidden truncate px-3">
                  Status
                </TableHead>
                <TableHead className="w-[14%] overflow-hidden truncate px-3">
                  Joined
                </TableHead>
                <TableHead className="w-12 px-2">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell className="pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3">
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                    <TableCell className="px-3">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="px-3">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="px-3">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="px-2">
                      <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : response?.data && response.data.length > 0 ? (
                response.data.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-muted/30">
                    {/* User */}
                    <TableCell className="overflow-hidden pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="overflow-hidden px-3">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-sm">
                          {user.phone}
                        </p>
                        {user.email && (
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="overflow-hidden px-3">
                      {user.role === "owner" ? (
                        <Badge className="gap-1 capitalize">
                          <Store className="h-3.5 w-3.5" />
                          Owner
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 capitalize">
                          <UserIcon className="h-3.5 w-3.5" />
                          {user.role}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="overflow-hidden px-3">
                      {user.is_active ? (
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

                    {/* Joined */}
                    <TableCell className="overflow-hidden px-3">
                      <div className="flex flex-col leading-tight">
                        <span className="whitespace-nowrap text-sm font-medium text-foreground">
                          {formatDate(user.created_at)}
                        </span>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatTime(user.created_at)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-2 text-right">
                      {user.role !== "admin" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-70 transition-opacity hover:opacity-100 group-hover:opacity-100"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.is_active ? (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                disabled={updateStatus.isPending}
                                onClick={() =>
                                  handleStatusChange(user.id, false)
                                }
                              >
                                Suspend Account
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-emerald-600 focus:text-emerald-600"
                                disabled={updateStatus.isPending}
                                onClick={() =>
                                  handleStatusChange(user.id, true)
                                }
                              >
                                Activate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                      <Users className="mb-3 h-10 w-10 opacity-20" />
                      <p className="text-sm font-medium">No users found</p>
                      <p className="mt-1 whitespace-normal text-xs">
                        {search || role
                          ? "No users match your search or filter."
                          : "This business has no users yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {response && response.total > 0 && (
          <div className="border-t bg-muted/10">
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
  )
}