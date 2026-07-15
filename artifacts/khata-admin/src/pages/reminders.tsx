import { useState } from "react"
import { 
  useListReminders, 
  getListRemindersQueryKey,
  useSendReminder,
  ListRemindersStatus
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatCurrency } from "@/lib/utils"
import { BellRing, Send } from "lucide-react"

export default function Reminders() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [status, setStatus] = useState<ListRemindersStatus | undefined>()
  
  const queryParams = {
    business_id: 0, // Using 0 to fetch platform-wide if API allows, or need specific biz
    ...(status ? { status } : {}),
  }

  // Note: For a real admin panel, this endpoint might need to support fetching across all businesses
  // Currently the API spec requires business_id. For the mockup we pass 0 or a placeholder.
  const { data: reminders, isLoading } = useListReminders(queryParams, {
    query: { enabled: true, queryKey: getListRemindersQueryKey(queryParams) }
  })

  const sendMutation = useSendReminder()

  const handleSend = (id: number) => {
    sendMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Reminder Sent",
            description: "The payment reminder has been dispatched.",
          })
          queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey(queryParams) })
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Send failed",
            description: "Failed to dispatch reminder. Please try again.",
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
            <BellRing className="h-8 w-8 text-primary" />
            Payment Reminders
          </h1>
          <p className="text-muted-foreground mt-1">Monitor automated payment reminders platform-wide.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-end gap-2">
            <Select 
              value={status || "all"} 
              onValueChange={(val) => setStatus(val === "all" ? undefined : val as ListRemindersStatus)}
            >
              <SelectTrigger className="w-[160px]">
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
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Business</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : reminders && reminders.length > 0 ? (
                reminders.map((reminder: any) => (
                  <TableRow key={reminder.id} className="group">
                    <TableCell className="font-medium">
                      {reminder.customer_name || `Customer #${reminder.customer_id}`}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Business #{reminder.business_id}
                    </TableCell>
                    <TableCell className="text-right font-mono text-destructive">
                      {reminder.amount ? formatCurrency(reminder.amount) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {reminder.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(reminder.reminder_date)}
                    </TableCell>
                    <TableCell>
                      {reminder.status === 'pending' && <Badge variant="warning" className="bg-warning/10 text-warning-foreground border-warning/20">Pending</Badge>}
                      {reminder.status === 'sent' && <Badge variant="success" className="bg-success/10 text-success border-success/20">Sent</Badge>}
                      {reminder.status === 'failed' && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {reminder.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSend(reminder.id)}
                          disabled={sendMutation.isPending}
                        >
                          <Send className="mr-2 h-3 w-3" />
                          Send Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <BellRing className="h-10 w-10 mb-4 opacity-20" />
                      <p>No reminders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}