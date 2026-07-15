import { useForm } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  useBroadcastNotification,
  BroadcastInputChannel,
  BroadcastInputTargetPlan
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Send, Smartphone, BellRing } from "lucide-react"

const broadcastSchema = z.object({
  title: z.string().min(2, "Title is required").max(60, "Title is too long"),
  body: z.string().min(10, "Message body needs to be at least 10 characters").max(200, "Message is too long"),
  channel: z.enum(["push", "sms", "all"] as const),
  target_plan: z.enum(["free", "pro", "premium", "all"] as const).optional(),
})

type BroadcastFormValues = z.infer<typeof broadcastSchema>

export default function Broadcast() {
  const { toast } = useToast()
  const broadcastMutation = useBroadcastNotification()

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      body: "",
      channel: "push",
      target_plan: "all",
    },
  })

  const onSubmit = (values: BroadcastFormValues) => {
    broadcastMutation.mutate(
      { data: values as any },
      {
        onSuccess: () => {
          toast({
            title: "Broadcast Initiated",
            description: "Notifications are being queued for delivery.",
          })
          form.reset()
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Broadcast Failed",
            description: "Could not initiate the broadcast. Check system logs.",
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
            <Send className="h-8 w-8 text-primary" />
            Broadcast Notification
          </h1>
          <p className="text-muted-foreground mt-1">Send mass communications to platform users.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>Draft your push notification or SMS.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Important Platform Update" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Body</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          placeholder="Type your message here..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Keep it concise. SMS has 160 char limit.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Channel</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="push">Push Notification</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="all">All Channels</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="target_plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select segment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="free">Free Plan Only</SelectItem>
                            <SelectItem value="pro">Pro Plan Only</SelectItem>
                            <SelectItem value="premium">Premium Plan Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold"
                  disabled={broadcastMutation.isPending}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {broadcastMutation.isPending ? "Dispatching..." : "Send Broadcast"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Live Preview Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notification Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-[300px] h-[150px] bg-background border rounded-[1.5rem] shadow-xl p-4 flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">K</span>
                  </div>
                  <span className="text-xs font-medium opacity-60 uppercase tracking-wide">KhataPro</span>
                  <span className="text-xs ml-auto opacity-40">now</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground leading-tight truncate">
                    {form.watch("title") || "Notification Title"}
                  </h4>
                  <p className="text-xs text-foreground/80 mt-1 line-clamp-3 leading-snug">
                    {form.watch("body") || "This is how your message will appear on a user's lock screen. It should be concise and actionable."}
                  </p>
                </div>
                <div className="absolute bottom-1.5 w-[30%] h-[4px] bg-foreground/10 rounded-full left-1/2 -translate-x-1/2"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                SMS Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-[300px] bg-background border rounded-[1.5rem] shadow-xl p-4 relative">
                <div className="text-[10px] text-center text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Today 10:41 AM</div>
                <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-sm leading-snug text-foreground">
                  KhataPro: {form.watch("title") ? form.watch("title") + " - " : ""}{form.watch("body") || "Your SMS message text will appear here."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
