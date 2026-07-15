import { useState } from "react"
import { 
  useListAdminUsers, 
  getListAdminUsersQueryKey,
  useUpdateUserStatus,
  ListAdminUsersRole
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Users, Search, MoreVertical, Shield, User as UserIcon, Store } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function UsersList() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<ListAdminUsersRole | undefined>()
  const [isActive, setIsActive] = useState<string>("all")
  
  const debouncedSearch = useDebounce(search, 500)
  
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(role ? { role } : {}),
    ...(isActive !== "all" ? { is_active: isActive === "true" } : {}),
  }

  const { data: response, isLoading } = useListAdminUsers(queryParams, {
    query: { enabled: true, queryKey: getListAdminUsersQueryKey(queryParams) }
  })

  const updateStatus = useUpdateUserStatus()

  const handleStatusChange = (id: number, active: boolean) => {
    updateStatus.mutate(
      { id, data: { is_active: active } },
      {
        onSuccess: () => {
          toast({
            title: `User ${active ? 'activated' : 'suspended'}`,
            description: "The user account status has been updated.",
          })
          queryClient.invalidateQueries({ queryKey: getListAdminUsersQueryKey({}) })
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Failed to update user status.",
          })
        }
      }
    )
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'admin': return <Shield className="h-4 w-4 text-destructive" />
      case 'owner': return <Store className="h-4 w-4 text-primary" />
      default: return <UserIcon className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'admin': return 'destructive'
      case 'owner': return 'default'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Users
          </h1>
          <p className="text-muted-foreground mt-1">Manage global user accounts across the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email or phone..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select 
                value={role || "all"} 
                onValueChange={(val) => {
                  setRole(val === "all" ? undefined : val as ListAdminUsersRole)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={isActive} 
                onValueChange={(val) => {
                  setIsActive(val)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : response?.data && response.data.length > 0 ? (
                response.data.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{user.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">ID: {user.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{user.phone}</span>
                        {user.email && (
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role) as any} className="capitalize flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge variant="success" className="bg-success/10 text-success border-success/20">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDateTime(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role !== 'admin' && (
                            user.is_active ? (
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleStatusChange(user.id, false)}
                              >
                                Suspend Account
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                className="text-success focus:text-success"
                                onClick={() => handleStatusChange(user.id, true)}
                              >
                                Activate Account
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-10 w-10 mb-4 opacity-20" />
                      <p>No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {response && (
            <Pagination 
              page={page} 
              limit={limit} 
              total={response.total} 
              onPageChange={setPage} 
              onLimitChange={(l) => { setLimit(l); setPage(1); }} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
