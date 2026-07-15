import { useState } from "react"
import { 
  useListSubscriptions, 
  getListSubscriptionsQueryKey,
  useUpdateSubscription,
  ListSubscriptionsPlan,
  ListSubscriptionsStatus
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { CreditCard, MoreVertical, ArrowUpCircle, ArrowDownCircle, XCircle } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function Subscriptions() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [plan, setPlan] = useState<ListSubscriptionsPlan | undefined>()
  const [status, setStatus] = useState<ListSubscriptionsStatus | undefined>()
  
  const queryParams = {
    page,
    limit,
    ...(plan ? { plan } : {}),
    ...(status ? { status } : {}),
  }

  const { data: response, isLoading } = useListSubscriptions(queryParams, {
    query: { enabled: true, queryKey: getListSubscriptionsQueryKey(queryParams) }
  })

  const updateMutation = useUpdateSubscription()

  const handleUpdate = (id: number, newPlan: string, newStatus: string) => {
    updateMutation.mutate(
      { 
        id, 
        data: { 
          plan: newPlan as any, 
          status: newStatus as any 
        } 
      },
      {
        onSuccess: () => {
          toast({
            title: "Subscription updated",
            description: "The subscription has been successfully modified.",
          })
          queryClient.invalidateQueries({ queryKey: getListSubscriptionsQueryKey({}) })
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Could not modify subscription.",
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
            <CreditCard className="h-8 w-8 text-primary" />
            Subscriptions
          </h1>
          <p className="text-muted-foreground mt-1">Manage active plans and upgrades across all businesses.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-end gap-2">
            <Select 
              value={plan || "all"} 
              onValueChange={(val) => {
                setPlan(val === "all" ? undefined : val as ListSubscriptionsPlan)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={status || "all"} 
              onValueChange={(val) => {
                setStatus(val === "all" ? undefined : val as ListSubscriptionsStatus)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Ref ID</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : response?.data && response.data.length > 0 ? (
                response.data.map((sub) => (
                  <TableRow key={sub.id} className="group">
                    <TableCell className="font-semibold">
                      {sub.business_name}
                      <div className="text-xs text-muted-foreground font-normal">Biz ID: {sub.business_id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.plan as any || 'outline'} className="capitalize">
                        {sub.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.status === 'active' && <Badge variant="success" className="bg-success/10 text-success border-success/20">Active</Badge>}
                      {sub.status === 'expired' && <Badge variant="warning" className="bg-warning/10 text-warning-foreground border-warning/20">Expired</Badge>}
                      {sub.status === 'cancelled' && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(sub.start_date)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatDate(sub.end_date)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {sub.payment_ref || '-'}
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
                          <DropdownMenuLabel>Manual Override</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {sub.plan !== 'premium' && (
                            <DropdownMenuItem onClick={() => handleUpdate(sub.id, 'premium', 'active')}>
                              <ArrowUpCircle className="mr-2 h-4 w-4 text-amber-500" /> Upgrade to Premium
                            </DropdownMenuItem>
                          )}
                          {sub.plan !== 'pro' && (
                            <DropdownMenuItem onClick={() => handleUpdate(sub.id, 'pro', 'active')}>
                              {sub.plan === 'free' ? (
                                <><ArrowUpCircle className="mr-2 h-4 w-4 text-blue-500" /> Upgrade to Pro</>
                              ) : (
                                <><ArrowDownCircle className="mr-2 h-4 w-4 text-blue-500" /> Downgrade to Pro</>
                              )}
                            </DropdownMenuItem>
                          )}
                          {sub.plan !== 'free' && (
                            <DropdownMenuItem onClick={() => handleUpdate(sub.id, 'free', 'active')}>
                              <ArrowDownCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Downgrade to Free
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {sub.status === 'active' ? (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleUpdate(sub.id, sub.plan, 'cancelled')}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Cancel Subscription
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-success focus:text-success"
                              onClick={() => handleUpdate(sub.id, sub.plan, 'active')}
                            >
                              <ArrowUpCircle className="mr-2 h-4 w-4" /> Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <CreditCard className="h-10 w-10 mb-4 opacity-20" />
                      <p>No subscriptions found</p>
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
