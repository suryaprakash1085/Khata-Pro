import { useState } from "react"
import { 
  useListAuditLogs, 
  getListAuditLogsQueryKey 
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateTime } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { ShieldAlert, Search } from "lucide-react"

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
    query: { enabled: true, queryKey: getListAuditLogsQueryKey(queryParams) }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            Audit Trail
          </h1>
          <p className="text-muted-foreground mt-1">Immutable log of critical system actions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by action name..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(15).fill(0).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  </TableRow>
                ))
              ) : response?.data && response.data.length > 0 ? (
                response.data.map((log: any) => (
                  <TableRow key={log.id} className="text-xs">
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px] font-semibold text-foreground">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.user_name ? (
                        <div className="font-medium">{log.user_name} <span className="text-muted-foreground font-normal">(ID: {log.user_id})</span></div>
                      ) : (
                        <span className="text-muted-foreground italic">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{log.entity_type}</span>
                      {log.entity_id && <span className="text-muted-foreground ml-1">#{log.entity_id}</span>}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground truncate max-w-xs">
                      {log.old_value && <span className="line-through mr-2 opacity-50">{log.old_value}</span>}
                      {log.new_value && <span className="text-foreground">{log.new_value}</span>}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ShieldAlert className="h-10 w-10 mb-4 opacity-20" />
                      <p>No audit logs found</p>
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
