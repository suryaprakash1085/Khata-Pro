// // import { useLocation, useParams } from "wouter"
// // import { 
// //   useGetBusiness, 
// //   getGetBusinessQueryKey,
// //   useGetBusinessStats,
// //   getGetBusinessStatsQueryKey,
// //   useListTransactions,
// //   getListTransactionsQueryKey,
// //   useGetTopCustomers,
// //   getGetTopCustomersQueryKey,
// //   Transaction,
// //   TransactionType
// // } from "@workspace/api-client-react"
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Skeleton } from "@/components/ui/skeleton"
// // import { Button } from "@/components/ui/button"
// // import { formatCurrency, formatDateTime } from "@/lib/utils"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { 
// //   ArrowLeft, 
// //   Building2, 
// //   MapPin, 
// //   Phone, 
// //   ReceiptIndianRupee, 
// //   CreditCard,
// //   User,
// //   ArrowDownLeft,
// //   ArrowUpRight
// // } from "lucide-react"

// // export default function BusinessDetail() {
// //   const [location, setLocation] = useLocation()
// //   const params = useParams()
// //   const businessId = params.id ? parseInt(params.id) : 0

// //   const { data: business, isLoading: isBusinessLoading } = useGetBusiness(businessId, {
// //     query: { enabled: !!businessId, queryKey: getGetBusinessQueryKey(businessId) }
// //   })

// //   const { data: stats, isLoading: isStatsLoading } = useGetBusinessStats(businessId, {
// //     query: { enabled: !!businessId, queryKey: getGetBusinessStatsQueryKey(businessId) }
// //   })

// //   const { data: transactionsData, isLoading: isTxLoading } = useListTransactions({ business_id: businessId, limit: 10 }, {
// //     query: { enabled: !!businessId, queryKey: getListTransactionsQueryKey({ business_id: businessId, limit: 10 }) }
// //   })

// //   const { data: customersData, isLoading: isCustomersLoading } = useGetTopCustomers({ business_id: businessId, limit: 5 }, {
// //     query: { enabled: !!businessId, queryKey: getGetTopCustomersQueryKey({ business_id: businessId, limit: 5 }) }
// //   })

// //   const handleBack = () => {
// //     setLocation("/businesses")
// //   }

// //   if (isBusinessLoading && !business) {
// //     return (
// //       <div className="space-y-6">
// //         <div className="flex items-center gap-4">
// //           <Skeleton className="h-10 w-10 rounded-full" />
// //           <Skeleton className="h-8 w-64" />
// //         </div>
// //         <div className="grid gap-6 md:grid-cols-3">
// //           <Skeleton className="h-64 md:col-span-1" />
// //           <Skeleton className="h-64 md:col-span-2" />
// //         </div>
// //         <Skeleton className="h-96 w-full" />
// //       </div>
// //     )
// //   }

// //   if (!business) {
// //     return (
// //       <div className="flex flex-col items-center justify-center h-96 gap-4">
// //         <Building2 className="h-12 w-12 text-muted-foreground opacity-50" />
// //         <h2 className="text-xl font-bold">Business not found</h2>
// //         <Button onClick={handleBack} variant="outline">Back to Businesses</Button>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center gap-4">
// //         <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full h-10 w-10 bg-muted/50 hover:bg-muted">
// //           <ArrowLeft className="h-5 w-5" />
// //         </Button>
// //         <div>
// //           <div className="flex items-center gap-3">
// //             <h1 className="text-3xl font-bold tracking-tight text-foreground">{business.business_name}</h1>
// //             <Badge variant={business.plan as any || "outline"} className="capitalize">{business.plan}</Badge>
// //             {business.is_active ? (
// //               <Badge variant="success" className="bg-success/10 text-success border-success/20">Active</Badge>
// //             ) : (
// //               <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
// //             )}
// //           </div>
// //           <p className="text-muted-foreground mt-1 flex items-center gap-2">
// //             <span className="capitalize">{business.business_type}</span>
// //             <span>•</span>
// //             <span className="font-mono text-xs">ID: {business.id}</span>
// //           </p>
// //         </div>
// //       </div>

// //       <div className="grid gap-6 md:grid-cols-3">
// //         {/* Info Card */}
// //         <Card className="md:col-span-1">
// //           <CardHeader>
// //             <CardTitle className="text-lg flex items-center gap-2">
// //               <Building2 className="h-5 w-5 text-muted-foreground" />
// //               Business Info
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="grid gap-1">
// //               <div className="text-sm font-medium text-muted-foreground">Owner</div>
// //               <div className="font-medium flex items-center gap-2">
// //                 <User className="h-4 w-4 text-muted-foreground" />
// //                 {business.owner_id} {/* Assuming we don't have owner name directly on this model */}
// //               </div>
// //             </div>
            
// //             {business.address && (
// //               <div className="grid gap-1">
// //                 <div className="text-sm font-medium text-muted-foreground">Address</div>
// //                 <div className="text-sm flex items-start gap-2">
// //                   <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
// //                   <span>{business.address}</span>
// //                 </div>
// //               </div>
// //             )}
            
// //             {business.gstin && (
// //               <div className="grid gap-1">
// //                 <div className="text-sm font-medium text-muted-foreground">GSTIN</div>
// //                 <div className="text-sm font-mono bg-muted p-1 rounded px-2 w-fit">
// //                   {business.gstin}
// //                 </div>
// //               </div>
// //             )}
            
// //             <div className="grid gap-1">
// //               <div className="text-sm font-medium text-muted-foreground">Currency</div>
// //               <div className="text-sm font-mono">
// //                 {business.currency}
// //               </div>
// //             </div>

// //             <div className="grid gap-1">
// //               <div className="text-sm font-medium text-muted-foreground">Registered On</div>
// //               <div className="text-sm">
// //                 {formatDateTime(business.created_at)}
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Stats Grid */}
// //         <div className="md:col-span-2 grid grid-cols-2 gap-4">
// //           <Card className="col-span-2 sm:col-span-1 bg-success/5 border-success/20">
// //             <CardHeader className="pb-2">
// //               <CardTitle className="text-sm font-medium text-success flex items-center gap-2">
// //                 <ArrowDownLeft className="h-4 w-4" />
// //                 Total to Collect (You Got)
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
// //                 <div className="text-3xl font-bold font-mono text-success">
// //                   {formatCurrency(stats?.total_to_collect || 0)}
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
          
// //           <Card className="col-span-2 sm:col-span-1 bg-destructive/5 border-destructive/20">
// //             <CardHeader className="pb-2">
// //               <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
// //                 <ArrowUpRight className="h-4 w-4" />
// //                 Total to Pay (You Gave)
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
// //                 <div className="text-3xl font-bold font-mono text-destructive">
// //                   {formatCurrency(stats?.total_to_pay || 0)}
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
          
// //           <Card className="col-span-2 sm:col-span-1">
// //             <CardHeader className="pb-2">
// //               <CardTitle className="text-sm font-medium text-muted-foreground">
// //                 Net Balance
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
// //                 <div className={`text-2xl font-bold font-mono ${(stats?.net_balance || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
// //                   {formatCurrency(stats?.net_balance || 0)}
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>

// //           <Card className="col-span-2 sm:col-span-1">
// //             <CardHeader className="pb-2">
// //               <CardTitle className="text-sm font-medium text-muted-foreground">
// //                 Activity
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
// //                 <div className="flex items-center gap-4 text-sm">
// //                   <div className="flex flex-col">
// //                     <span className="font-mono text-xl font-bold">{stats?.customer_count || 0}</span>
// //                     <span className="text-muted-foreground">Customers</span>
// //                   </div>
// //                   <div className="w-px h-8 bg-border"></div>
// //                   <div className="flex flex-col">
// //                     <span className="font-mono text-xl font-bold">{stats?.transaction_count || 0}</span>
// //                     <span className="text-muted-foreground">Transactions</span>
// //                   </div>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>

// //       <div className="grid gap-6 md:grid-cols-3">
// //         {/* Recent Transactions */}
// //         <Card className="md:col-span-2">
// //           <CardHeader>
// //             <CardTitle>Recent Transactions</CardTitle>
// //             <CardDescription>Latest platform activity for this business</CardDescription>
// //           </CardHeader>
// //           <CardContent className="p-0">
// //             <Table>
// //               <TableHeader>
// //                 <TableRow>
// //                   <TableHead>Date</TableHead>
// //                   <TableHead>Customer</TableHead>
// //                   <TableHead>Type</TableHead>
// //                   <TableHead>Mode</TableHead>
// //                   <TableHead className="text-right">Amount</TableHead>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {isTxLoading ? (
// //                   Array(5).fill(0).map((_, i) => (
// //                     <TableRow key={`tx-skel-${i}`}>
// //                       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
// //                       <TableCell><Skeleton className="h-4 w-32" /></TableCell>
// //                       <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
// //                       <TableCell><Skeleton className="h-4 w-16" /></TableCell>
// //                       <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
// //                     </TableRow>
// //                   ))
// //                 ) : transactionsData?.data && transactionsData.data.length > 0 ? (
// //                   transactionsData.data.map((tx: Transaction) => (
// //                     <TableRow key={tx.id}>
// //                       <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
// //                         {formatDateTime(tx.entry_date)}
// //                       </TableCell>
// //                       <TableCell className="font-medium">
// //                         {tx.customer_name || `Customer #${tx.customer_id}`}
// //                       </TableCell>
// //                       <TableCell>
// //                         {tx.type === "you_got" ? (
// //                           <Badge variant="success" className="bg-success/10 text-success border-success/20">Got (Cr)</Badge>
// //                         ) : (
// //                           <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Gave (Dr)</Badge>
// //                         )}
// //                       </TableCell>
// //                       <TableCell className="capitalize text-xs">
// //                         {tx.payment_mode || "Cash"}
// //                       </TableCell>
// //                       <TableCell className="text-right font-mono font-medium">
// //                         <span className={tx.type === "you_got" ? "text-success" : "text-destructive"}>
// //                           {tx.type === "you_got" ? "+" : "-"}
// //                           {formatCurrency(tx.amount)}
// //                         </span>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))
// //                 ) : (
// //                   <TableRow>
// //                     <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
// //                       No transactions found
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </CardContent>
// //         </Card>

// //         {/* Top Customers */}
// //         <Card className="md:col-span-1">
// //           <CardHeader>
// //             <CardTitle>Top Customers</CardTitle>
// //             <CardDescription>By transaction volume</CardDescription>
// //           </CardHeader>
// //           <CardContent className="p-0">
// //             <div className="divide-y">
// //               {isCustomersLoading ? (
// //                 Array(4).fill(0).map((_, i) => (
// //                   <div key={`cust-skel-${i}`} className="p-4 flex items-center justify-between">
// //                     <div className="space-y-2">
// //                       <Skeleton className="h-4 w-32" />
// //                       <Skeleton className="h-3 w-24" />
// //                     </div>
// //                     <Skeleton className="h-6 w-20" />
// //                   </div>
// //                 ))
// //               ) : customersData && customersData.length > 0 ? (
// //                 customersData.map((customer: any) => (
// //                   <div key={customer.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
// //                     <div>
// //                       <div className="font-medium text-sm">{customer.name}</div>
// //                       <div className="text-xs text-muted-foreground font-mono mt-1">{customer.phone}</div>
// //                     </div>
// //                     <div className="text-right">
// //                       <div className={`font-mono text-sm font-bold ${customer.current_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
// //                         {formatCurrency(Math.abs(customer.current_balance))}
// //                         <span className="text-[10px] ml-1 opacity-70">
// //                           {customer.current_balance >= 0 ? 'Cr' : 'Dr'}
// //                         </span>
// //                       </div>
// //                       <div className="text-xs text-muted-foreground mt-1">
// //                         {customer.transaction_count} txns
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="p-8 text-center text-muted-foreground">
// //                   No customers found
// //                 </div>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }
// import { useLocation, useParams } from "wouter"
// import { 
//   useGetBusiness, 
//   getGetBusinessQueryKey,
//   useGetBusinessStats,
//   getGetBusinessStatsQueryKey,
//   useListTransactions,
//   getListTransactionsQueryKey,
//   useGetTopCustomers,
//   getGetTopCustomersQueryKey,
//   Transaction,
//   TransactionType
// } from "@workspace/api-client-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Button } from "@/components/ui/button"
// import { formatCurrency, formatDateTime } from "@/lib/utils"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { 
//   ArrowLeft, 
//   Building2, 
//   MapPin, 
//   Phone, 
//   ReceiptIndianRupee, 
//   CreditCard,
//   User,
//   ArrowDownLeft,
//   ArrowUpRight
// } from "lucide-react"

// // NEW: users of this business (adjust the path if you saved the file elsewhere)
// import BusinessUsers from "../pages/users"

// export default function BusinessDetail() {
//   const [location, setLocation] = useLocation()
//   const params = useParams()
//   const businessId = params.id ? parseInt(params.id) : 0

//   const { data: business, isLoading: isBusinessLoading } = useGetBusiness(businessId, {
//     query: { enabled: !!businessId, queryKey: getGetBusinessQueryKey(businessId) }
//   })

//   const { data: stats, isLoading: isStatsLoading } = useGetBusinessStats(businessId, {
//     query: { enabled: !!businessId, queryKey: getGetBusinessStatsQueryKey(businessId) }
//   })

//   const { data: transactionsData, isLoading: isTxLoading } = useListTransactions({ business_id: businessId, limit: 10 }, {
//     query: { enabled: !!businessId, queryKey: getListTransactionsQueryKey({ business_id: businessId, limit: 10 }) }
//   })

//   const { data: customersData, isLoading: isCustomersLoading } = useGetTopCustomers({ business_id: businessId, limit: 5 }, {
//     query: { enabled: !!businessId, queryKey: getGetTopCustomersQueryKey({ business_id: businessId, limit: 5 }) }
//   })

//   const handleBack = () => {
//     setLocation("/businesses")
//   }

//   if (isBusinessLoading && !business) {
//     return (
//       <div className="-mt-6 space-y-6">
//         <div className="flex items-center gap-4">
//           <Skeleton className="h-10 w-10 rounded-full" />
//           <Skeleton className="h-8 w-64" />
//         </div>
//         <div className="grid gap-6 md:grid-cols-3">
//           <Skeleton className="h-64 md:col-span-1" />
//           <Skeleton className="h-64 md:col-span-2" />
//         </div>
//         <Skeleton className="h-96 w-full" />
//       </div>
//     )
//   }

//   if (!business) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 gap-4">
//         <Building2 className="h-12 w-12 text-muted-foreground opacity-50" />
//         <h2 className="text-xl font-bold">Business not found</h2>
//         <Button onClick={handleBack} variant="outline">Back to Businesses</Button>
//       </div>
//     )
//   }

//   return (
//     // NOTE: "-mt-6" removes the top gap (same as Businesses page).
//     // If you already reduced the padding in AppLayout.tsx, remove "-mt-6".
//     <div className="-mt-6 space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full h-10 w-10 bg-muted/50 hover:bg-muted">
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <div>
//           <div className="flex items-center gap-3">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">{business.business_name}</h1>
//             <Badge variant={business.plan as any || "outline"} className="capitalize">{business.plan}</Badge>
//             {business.is_active ? (
//               <Badge variant="success" className="bg-success/10 text-success border-success/20">Active</Badge>
//             ) : (
//               <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
//             )}
//           </div>
//           <p className="text-muted-foreground mt-1 flex items-center gap-2">
//             <span className="capitalize">{business.business_type}</span>
//             <span>•</span>
//             <span className="font-mono text-xs">ID: {business.id}</span>
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         {/* Info Card */}
//         <Card className="md:col-span-1">
//           <CardHeader>
//             <CardTitle className="text-lg flex items-center gap-2">
//               <Building2 className="h-5 w-5 text-muted-foreground" />
//               Business Info
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid gap-1">
//               <div className="text-sm font-medium text-muted-foreground">Owner</div>
//               <div className="font-medium flex items-center gap-2">
//                 <User className="h-4 w-4 text-muted-foreground" />
//                 {business.owner_id} {/* Assuming we don't have owner name directly on this model */}
//               </div>
//             </div>
            
//             {business.address_line1 && (
//               <div className="grid gap-1">
//                 <div className="text-sm font-medium text-muted-foreground">Address</div>
//                 <div className="text-sm flex items-start gap-2">
//                   <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
//                   <span>{business.address_line1}</span>
//                 </div>
//               </div>
//             )}
            
//             {business.gstin && (
//               <div className="grid gap-1">
//                 <div className="text-sm font-medium text-muted-foreground">GSTIN</div>
//                 <div className="text-sm font-mono bg-muted p-1 rounded px-2 w-fit">
//                   {business.gstin}
//                 </div>
//               </div>
//             )}
            
//             <div className="grid gap-1">
//               <div className="text-sm font-medium text-muted-foreground">Currency</div>
//               <div className="text-sm font-mono">
//                 {business.currency}
//               </div>
//             </div>

//             <div className="grid gap-1">
//               <div className="text-sm font-medium text-muted-foreground">Registered On</div>
//               <div className="text-sm">
//                 {formatDateTime(business.created_at)}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats Grid */}
//         <div className="md:col-span-2 grid grid-cols-2 gap-4">
//           <Card className="col-span-2 sm:col-span-1 bg-success/5 border-success/20">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-success flex items-center gap-2">
//                 <ArrowDownLeft className="h-4 w-4" />
//                 Total to Collect (You Got)
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
//                 <div className="text-3xl font-bold font-mono text-success">
//                   {formatCurrency(stats?.total_to_collect || 0)}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
          
//           <Card className="col-span-2 sm:col-span-1 bg-destructive/5 border-destructive/20">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
//                 <ArrowUpRight className="h-4 w-4" />
//                 Total to Pay (You Gave)
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
//                 <div className="text-3xl font-bold font-mono text-destructive">
//                   {formatCurrency(stats?.total_to_pay || 0)}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
          
//           <Card className="col-span-2 sm:col-span-1">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Net Balance
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
//                 <div className={`text-2xl font-bold font-mono ${(stats?.net_balance || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
//                   {formatCurrency(stats?.net_balance || 0)}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card className="col-span-2 sm:col-span-1">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isStatsLoading ? <Skeleton className="h-8 w-32" /> : (
//                 <div className="flex items-center gap-4 text-sm">
//                   <div className="flex flex-col">
//                     <span className="font-mono text-xl font-bold">{stats?.customer_count || 0}</span>
//                     <span className="text-muted-foreground">Customers</span>
//                   </div>
//                   <div className="w-px h-8 bg-border"></div>
//                   <div className="flex flex-col">
//                     <span className="font-mono text-xl font-bold">{stats?.transaction_count || 0}</span>
//                     <span className="text-muted-foreground">Transactions</span>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Users of this business (owner + staff) */}
//       <BusinessUsers businessId={businessId} />

//       <div className="grid gap-6 md:grid-cols-3">
//         {/* Recent Transactions */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Recent Transactions</CardTitle>
//             <CardDescription>Latest platform activity for this business</CardDescription>
//           </CardHeader>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Mode</TableHead>
//                   <TableHead className="text-right">Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isTxLoading ? (
//                   Array(5).fill(0).map((_, i) => (
//                     <TableRow key={`tx-skel-${i}`}>
//                       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//                       <TableCell><Skeleton className="h-4 w-32" /></TableCell>
//                       <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//                       <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//                       <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
//                     </TableRow>
//                   ))
//                 ) : transactionsData?.data && transactionsData.data.length > 0 ? (
//                   transactionsData.data.map((tx: Transaction) => (
//                     <TableRow key={tx.id}>
//                       <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
//                         {formatDateTime(tx.entry_date)}
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {tx.customer_name || `Customer #${tx.customer_id}`}
//                       </TableCell>
//                       <TableCell>
//                         {tx.type === "you_got" ? (
//                           <Badge variant="success" className="bg-success/10 text-success border-success/20">Got (Cr)</Badge>
//                         ) : (
//                           <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Gave (Dr)</Badge>
//                         )}
//                       </TableCell>
//                       <TableCell className="capitalize text-xs">
//                         {tx.payment_mode || "Cash"}
//                       </TableCell>
//                       <TableCell className="text-right font-mono font-medium">
//                         <span className={tx.type === "you_got" ? "text-success" : "text-destructive"}>
//                           {tx.type === "you_got" ? "+" : "-"}
//                           {formatCurrency(tx.amount)}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
//                       No transactions found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Top Customers */}
//         <Card className="md:col-span-1">
//           <CardHeader>
//             <CardTitle>Top Customers</CardTitle>
//             <CardDescription>By transaction volume</CardDescription>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="divide-y">
//               {isCustomersLoading ? (
//                 Array(4).fill(0).map((_, i) => (
//                   <div key={`cust-skel-${i}`} className="p-4 flex items-center justify-between">
//                     <div className="space-y-2">
//                       <Skeleton className="h-4 w-32" />
//                       <Skeleton className="h-3 w-24" />
//                     </div>
//                     <Skeleton className="h-6 w-20" />
//                   </div>
//                 ))
//               ) : customersData && customersData.length > 0 ? (
//                 customersData.map((customer: any) => (
//                   <div key={customer.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
//                     <div>
//                       <div className="font-medium text-sm">{customer.name}</div>
//                       <div className="text-xs text-muted-foreground font-mono mt-1">{customer.phone}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`font-mono text-sm font-bold ${customer.current_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
//                         {formatCurrency(Math.abs(customer.current_balance))}
//                         <span className="text-[10px] ml-1 opacity-70">
//                           {customer.current_balance >= 0 ? 'Cr' : 'Dr'}
//                         </span>
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-1">
//                         {customer.transaction_count} txns
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-8 text-center text-muted-foreground">
//                   No customers found
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
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
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Store,
  MapPin,
  Landmark,
  Calendar,
  User,
  Crown,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  BarChart3,
  Users as UsersIcon,
  ArrowLeftRight,
  ChevronRight,
  Pencil,
  MoreVertical,
  Ban,
  Trash2,
} from "lucide-react"

// Users of this business (owner + staff) — adjust the path if you saved the file elsewhere
import BusinessUsers from "../pages/users"

export default function BusinessDetail() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const params = useParams()
  const businessId = params.id ? parseInt(params.id) : 0

  const { data: business, isLoading: isBusinessLoading } = useGetBusiness(businessId, {
    query: { enabled: !!businessId, queryKey: getGetBusinessQueryKey(businessId) },
  })

  const { data: stats, isLoading: isStatsLoading } = useGetBusinessStats(businessId, {
    query: { enabled: !!businessId, queryKey: getGetBusinessStatsQueryKey(businessId) },
  })

  const { data: transactionsData, isLoading: isTxLoading } = useListTransactions(
    { business_id: businessId, limit: 10 },
    { query: { enabled: !!businessId, queryKey: getListTransactionsQueryKey({ business_id: businessId, limit: 10 }) } }
  )

  const { data: customersData, isLoading: isCustomersLoading } = useGetTopCustomers(
    { business_id: businessId, limit: 5 },
    { query: { enabled: !!businessId, queryKey: getGetTopCustomersQueryKey({ business_id: businessId, limit: 5 }) } }
  )

  const handleBack = () => setLocation("/businesses")

  const handleEdit = () => {
    toast({ title: "Edit Business", description: "Editing this business is coming soon." })
  }

  if (isBusinessLoading && !business) {
    return (
      <div className="-mt-6 space-y-6">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Store className="h-12 w-12 text-muted-foreground opacity-50" />
        <h2 className="text-xl font-bold">Business not found</h2>
        <Button onClick={handleBack} variant="outline">Back to Businesses</Button>
      </div>
    )
  }

  return (
    <div
      className="-mt-6 space-y-6 bg-background"
      style={{ fontFamily: "Times New Roman, Times, serif" }}
    >
      {/* =========================================================
          BACK LINK
      ========================================================= */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Businesses
      </button>

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
            <Store className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {business.business_name}
              </h1>
              <Badge className="gap-1 border-amber-200 bg-amber-50 capitalize text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400" variant="outline">
                <Crown className="h-3 w-3" />
                {business.plan}
              </Badge>
              {business.is_active ? (
                <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Suspended
                </Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{business.business_type}</span>
              <span>•</span>
              <span className="font-mono text-xs">ID: {business.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
            Edit Business
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => toast({ title: business.is_active ? "Business suspended" : "Business activated" })}>
                <Ban className="mr-2 h-4 w-4" />
                {business.is_active ? "Suspend Business" : "Activate Business"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* =========================================================
          OVERVIEW ROW — Business Info / Subscription / Stat stack / Activity
      ========================================================= */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Business Overview */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Store className="h-4 w-4 text-muted-foreground" />
              Business Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={User} label="Owner" value={String(business.owner_id)} />
            {business.address_line1 && (
              <InfoRow icon={MapPin} label="Address" value={business.address_line1} />
            )}
            <InfoRow icon={Landmark} label="Currency" value={business.currency} mono />
            <InfoRow icon={Calendar} label="Registered On" value={formatDateTime(business.created_at)} />
          </CardContent>
        </Card>

        {/* Subscription Summary */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Crown className="h-4 w-4 text-amber-500" />
                Subscription Summary
              </CardTitle>
              <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 capitalize text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                {business.plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {business.is_active ? "Active" : "Inactive"}
            </Badge>

            <div className="divide-y divide-border/60 pt-1">
              <SubRow icon={Landmark} label="Plan Name" value={business.plan} capitalize />
              <SubRow icon={Calendar} label="Billing Cycle" value="Monthly" />
              <SubRow icon={Calendar} label="Renewal Date" value="—" />
              <SubRow icon={Clock} label="Trial Period" value="—" />
            </div>
          </CardContent>
        </Card>

        {/* Stat stack */}
        <div className="flex flex-col gap-3">
          <StatMiniCard
            icon={ArrowDownLeft}
            label="Total to Collect (You Got)"
            value={formatCurrency(stats?.total_to_collect || 0)}
            isLoading={isStatsLoading}
            tone="success"
          />
          <StatMiniCard
            icon={ArrowUpRight}
            label="Total to Pay (You Gave)"
            value={formatCurrency(stats?.total_to_pay || 0)}
            isLoading={isStatsLoading}
            tone="destructive"
          />
          <StatMiniCard
            icon={Scale}
            label="Net Balance"
            value={formatCurrency(stats?.net_balance || 0)}
            isLoading={isStatsLoading}
            tone={(stats?.net_balance || 0) >= 0 ? "success" : "destructive"}
          />
        </div>

        {/* Activity Summary */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            <ActivityRow
              icon={UsersIcon}
              label="Customers"
              value={stats?.customer_count ?? 0}
              isLoading={isStatsLoading}
            />
            <ActivityRow
              icon={ArrowLeftRight}
              label="Transactions"
              value={stats?.transaction_count ?? 0}
              isLoading={isStatsLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* =========================================================
          USERS OF THIS BUSINESS (owner + staff)
      ========================================================= */}
      <BusinessUsers businessId={businessId} />

      {/* =========================================================
          RECENT TRANSACTIONS + TOP CUSTOMERS
      ========================================================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/70 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
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
                      <TableCell><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : transactionsData?.data && transactionsData.data.length > 0 ? (
                  transactionsData.data.map((tx: Transaction) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(tx.entry_date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.customer_name || `Customer #${tx.customer_id}`}
                      </TableCell>
                      <TableCell>
                        {tx.type === "you_got" ? (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                            Got (Cr)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                            Gave (Dr)
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs capitalize">{tx.payment_mode || "Cash"}</TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        <span className={tx.type === "you_got" ? "text-emerald-600" : "text-red-600"}>
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

        <Card className="border-border/70 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Customers</CardTitle>
            <CardDescription>By transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {isCustomersLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={`cust-skel-${i}`} className="flex items-center justify-between p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              ) : customersData && customersData.length > 0 ? (
                customersData.map((customer: any) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <div className="text-sm font-medium">{customer.name}</div>
                      <div className="mt-1 font-mono text-xs text-muted-foreground">{customer.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-sm font-bold ${customer.current_balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(customer.current_balance))}
                        <span className="ml-1 text-[10px] opacity-70">
                          {customer.current_balance >= 0 ? "Cr" : "Dr"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{customer.transaction_count} txns</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">No customers found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* =============================================================
   INFO ROW — icon + label above, value below (Business Overview)
============================================================= */

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  )
}

/* =============================================================
   SUB ROW — icon + label on left, value on right (Subscription Summary)
============================================================= */

function SubRow({
  icon: Icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  capitalize?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className={`text-sm font-semibold text-foreground ${capitalize ? "capitalize" : ""}`}>{value}</span>
    </div>
  )
}

/* =============================================================
   STAT MINI CARD — compact colored card used in the stacked column
============================================================= */

function StatMiniCard({
  icon: Icon,
  label,
  value,
  isLoading,
  tone,
}: {
  icon: React.ElementType
  label: string
  value: string
  isLoading: boolean
  tone: "success" | "destructive"
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
      : "bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400"

  const iconBg = tone === "success" ? "bg-emerald-500/15" : "bg-red-500/15"

  return (
    <Card className={`flex-1 border shadow-sm ${toneClasses}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium opacity-80">{label}</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-5 w-20" />
            ) : (
              <p className="font-mono text-lg font-bold">{value}</p>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 opacity-40" />
      </CardContent>
    </Card>
  )
}

/* =============================================================
   ACTIVITY ROW — icon + label + value + chevron (Activity Summary)
============================================================= */

function ActivityRow({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ElementType
  label: string
  value: number
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? <Skeleton className="h-5 w-8" /> : <span className="font-mono text-lg font-bold">{value}</span>}
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
      </div>
    </div>
  )
}