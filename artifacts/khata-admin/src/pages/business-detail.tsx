import { useLocation, useParams } from "wouter"
import { 
  useGetBusiness, 
  getGetBusinessQueryKey,
  useGetBusinessStats,
  getGetBusinessStatsQueryKey,
  useListTransactions,
  getListTransactionsQueryKey,
  useGetTopCustomers,
  getGetTopCustomersQueryKey,
  Transaction,
  TransactionType
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  ReceiptIndianRupee, 
  CreditCard,
  User,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react"

export default function BusinessDetail() {
  const [location, setLocation] = useLocation()
  const params = useParams()
  const businessId = params.id ? parseInt(params.id) : 0

  const { data: business, isLoading: isBusinessLoading } = useGetBusiness(businessId, {
    query: { enabled: !!businessId, queryKey: getGetBusinessQueryKey(businessId) }
  })

  const { data: stats, isLoading: isStatsLoading } = useGetBusinessStats(businessId, {
    query: { enabled: !!businessId, queryKey: getGetBusinessStatsQueryKey(businessId) }
  })

  const { data: transactionsData, isLoading: isTxLoading } = useListTransactions({ business_id: businessId, limit: 10 }, {
    query: { enabled: !!businessId, queryKey: getListTransactionsQueryKey({ business_id: businessId, limit: 10 }) }
  })

  const { data: customersData, isLoading: isCustomersLoading } = useGetTopCustomers({ business_id: businessId, limit: 5 }, {
    query: { enabled: !!businessId, queryKey: getGetTopCustomersQueryKey({ business_id: businessId, limit: 5 }) }
  })

  const handleBack = () => {
    setLocation("/businesses")
  }

  if (isBusinessLoading && !business) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-1" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Building2 className="h-12 w-12 text-muted-foreground opacity-50" />
        <h2 className="text-xl font-bold">Business not found</h2>
        <Button onClick={handleBack} variant="outline">Back to Businesses</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full h-10 w-10 bg-muted/50 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{business.business_name}</h1>
            <Badge variant={business.plan as any || "outline"} className="capitalize">{business.plan}</Badge>
            {business.is_active ? (
              <Badge variant="success" className="bg-success/10 text-success border-success/20">Active</Badge>
            ) : (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="capitalize">{business.business_type}</span>
            <span>•</span>
            <span className="font-mono text-xs">ID: {business.id}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Business Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">Owner</div>
              <div className="font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {business.owner_id} {/* Assuming we don't have owner name directly on this model */}
              </div>
            </div>
            
            {business.address && (
              <div className="grid gap-1">
                <div className="text-sm font-medium text-muted-foreground">Address</div>
                <div className="text-sm flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{business.address}</span>
                </div>
              </div>
            )}
            
            {business.gstin && (
              <div className="grid gap-1">
                <div className="text-sm font-medium text-muted-foreground">GSTIN</div>
                <div className="text-sm font-mono bg-muted p-1 rounded px-2 w-fit">
                  {business.gstin}
                </div>
              </div>
            )}
            
            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">Currency</div>
              <div className="text-sm font-mono">
                {business.currency}
              </div>
            </div>

            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">Registered On</div>
              <div className="text-sm">
                {formatDateTime(business.created_at)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card className="col-span-2 sm:col-span-1 bg-success/5 border-success/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Total to Collect (You Got)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
                <div className="text-3xl font-bold font-mono text-success">
                  {formatCurrency(stats?.total_to_collect || 0)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-2 sm:col-span-1 bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Total to Pay (You Gave)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
                <div className="text-3xl font-bold font-mono text-destructive">
                  {formatCurrency(stats?.total_to_pay || 0)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
                <div className={`text-2xl font-bold font-mono ${(stats?.net_balance || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(stats?.net_balance || 0)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-mono text-xl font-bold">{stats?.customer_count || 0}</span>
                    <span className="text-muted-foreground">Customers</span>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xl font-bold">{stats?.transaction_count || 0}</span>
                    <span className="text-muted-foreground">Transactions</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest platform activity for this business</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTxLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={`tx-skel-${i}`}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : transactionsData?.data && transactionsData.data.length > 0 ? (
                  transactionsData.data.map((tx: Transaction) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(tx.entry_date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.customer_name || `Customer #${tx.customer_id}`}
                      </TableCell>
                      <TableCell>
                        {tx.type === "you_got" ? (
                          <Badge variant="success" className="bg-success/10 text-success border-success/20">Got (Cr)</Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Gave (Dr)</Badge>
                        )}
                      </TableCell>
                      <TableCell className="capitalize text-xs">
                        {tx.payment_mode || "Cash"}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        <span className={tx.type === "you_got" ? "text-success" : "text-destructive"}>
                          {tx.type === "you_got" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>By transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {isCustomersLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={`cust-skel-${i}`} className="p-4 flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              ) : customersData && customersData.length > 0 ? (
                customersData.map((customer: any) => (
                  <div key={customer.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{customer.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-sm font-bold ${customer.current_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(Math.abs(customer.current_balance))}
                        <span className="text-[10px] ml-1 opacity-70">
                          {customer.current_balance >= 0 ? 'Cr' : 'Dr'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {customer.transaction_count} txns
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No customers found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
