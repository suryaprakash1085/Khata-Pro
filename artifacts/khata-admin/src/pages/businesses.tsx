import { useState } from "react"
import { useLocation } from "wouter"
import { 
  useListAdminBusinesses, 
  getListAdminBusinessesQueryKey,
  useUpdateBusinessStatus,
  ListAdminBusinessesStatus,
  ListAdminBusinessesPlan
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Eye, Ban, CheckCircle, Store } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export default function Businesses() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ListAdminBusinessesStatus | undefined>()
  const [plan, setPlan] = useState<ListAdminBusinessesPlan | undefined>()
  
  const debouncedSearch = useDebounce(search, 500)
  
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(status ? { status } : {}),
    ...(plan ? { plan } : {}),
  }

  const { data: response, isLoading } = useListAdminBusinesses(queryParams, {
    query: { enabled: true, queryKey: getListAdminBusinessesQueryKey(queryParams) }
  })

  const updateStatus = useUpdateBusinessStatus()

  const handleStatusChange = (id: number, isActive: boolean) => {
    updateStatus.mutate(
      { id, data: { is_active: isActive } },
      {
        onSuccess: () => {
          toast({
            title: `Business ${isActive ? 'activated' : 'suspended'}`,
            description: "The business status has been updated successfully.",
          })
          queryClient.invalidateQueries({ queryKey: getListAdminBusinessesQueryKey({}) })
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Failed to update business status. Please try again.",
          })
        }
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Store className="h-8 w-8 text-primary" />
            Businesses
          </h1>
          <p className="text-muted-foreground mt-1">Manage all businesses on the KhataPro platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, owner, or phone..."
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
                value={status || "all"} 
                onValueChange={(val) => {
                  setStatus(val === "all" ? undefined : val as ListAdminBusinessesStatus)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={plan || "all"} 
                onValueChange={(val) => {
                  setPlan(val === "all" ? undefined : val as ListAdminBusinessesPlan)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Details</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : response?.data && response.data.length > 0 ? (
                response.data.map((business) => (
                  <TableRow key={business.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => setLocation(`/businesses/${business.id}`)}>
                          {business.business_name}
                        </span>
                        <span className="text-xs text-muted-foreground">{business.business_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{business.owner_name}</span>
                        {business.owner_phone && (
                          <span className="text-xs text-muted-foreground font-mono">{business.owner_phone}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={business.plan as any || "outline"} className="capitalize">
                        {business.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {business.customer_count?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {business.transaction_count?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      {business.is_active ? (
                        <Badge variant="success" className="bg-success/10 text-success border-success/20">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDateTime(business.created_at)}
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
                          <DropdownMenuItem onClick={() => setLocation(`/businesses/${business.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {business.is_active ? (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleStatusChange(business.id, false)}
                            >
                              <Ban className="mr-2 h-4 w-4" /> Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-success focus:text-success"
                              onClick={() => handleStatusChange(business.id, true)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Store className="h-10 w-10 mb-4 opacity-20" />
                      <p>No businesses found</p>
                      {search && <p className="text-sm">Try clearing your search filters</p>}
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
