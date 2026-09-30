import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  useBroadcastNotification,
  BroadcastInputChannel,
} from "@workspace/api-client-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useToast } from "@/hooks/use-toast"

import {
  Send,
  Smartphone,
  BellRing,
  Users,
  Crown,
  Radio,
  MessageSquare,
  Megaphone,
  CheckCircle2,
  Info,
} from "lucide-react"

/* =========================================================
   FORM SCHEMA
========================================================= */

const broadcastSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required")
    .max(60, "Title is too long"),

  body: z
    .string()
    .min(10, "Message body needs to be at least 10 characters")
    .max(200, "Message is too long"),

  channel: z.enum(["push", "sms", "all"] as const),

  target_plan: z
    .enum(["pro", "premium", "all"] as const)
    .optional(),
})

type BroadcastFormValues = z.infer<typeof broadcastSchema>

/* =========================================================
   PAGE
========================================================= */

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

  const title = form.watch("title")
  const body = form.watch("body")
  const channel = form.watch("channel")
  const targetPlan = form.watch("target_plan")

  /* =========================================================
     CHARACTER COUNT
  ========================================================= */

  const bodyLength = body?.length || 0
  const titleLength = title?.length || 0

  const channelLabel = useMemo(() => {
    switch (channel) {
      case "push":
        return "Push Notification"

      case "sms":
        return "SMS"

      case "all":
        return "Push + SMS"

      default:
        return "Push Notification"
    }
  }, [channel])

  const audienceLabel = useMemo(() => {
    switch (targetPlan) {
      case "pro":
        return "Pro Users"

      case "premium":
        return "Premium Users"

      default:
        return "All Users"
    }
  }, [targetPlan])

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = (values: BroadcastFormValues) => {
    broadcastMutation.mutate(
      {
        data: values as any,
      },
      {
        onSuccess: () => {
          toast({
            title: "Broadcast Initiated",
            description:
              "Your notification is being queued for delivery.",
          })

          form.reset()
        },

        onError: () => {
          toast({
            variant: "destructive",
            title: "Broadcast Failed",
            description:
              "Could not initiate the broadcast. Please try again.",
          })
        },
      }
    )
  }

  return (
    <div className="space-y-6 pb-8" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-primary/10">
            <Megaphone className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Broadcast Notification
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Send announcements and notifications to KhataPro users.
            </p>
          </div>

        </div>

        {/* Current Selection Summary */}

        <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-4 py-2.5">

          <Radio className="h-4 w-4 text-primary" />

          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Current Audience
            </p>

            <p className="text-sm font-semibold">
              {audienceLabel}
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

        {/* ===================================================
            COMPOSE CARD
        =================================================== */}

        <Card className="overflow-hidden border-border/70 shadow-sm">

          <CardHeader className="border-b bg-muted/20 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Compose Message
                </h2>

                <p className="text-sm text-muted-foreground">
                  Create your notification before sending.
                </p>
              </div>

            </div>

          </CardHeader>

          <CardContent className="p-6">

            <Form {...form}>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >

                {/* =================================================
                    TITLE
                ================================================= */}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>

                      <div className="flex items-center justify-between">
                        <FormLabel>
                          Notification Title
                        </FormLabel>

                        <span className="text-xs text-muted-foreground">
                          {titleLength}/60
                        </span>
                      </div>

                      <FormControl>
                        <Input
                          placeholder="Important Platform Update"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />

                    </FormItem>
                  )}
                />

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>

                      <div className="flex items-center justify-between">

                        <FormLabel>
                          Message
                        </FormLabel>

                        <span
                          className={`text-xs ${
                            bodyLength > 180
                              ? "font-medium text-amber-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {bodyLength}/200
                        </span>

                      </div>

                      <FormControl>
                        <textarea
                          className="flex min-h-[145px] w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Type your announcement or message here..."
                          {...field}
                        />
                      </FormControl>

                      <FormDescription className="flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        Keep the message short and clear for mobile users.
                      </FormDescription>

                      <FormMessage />

                    </FormItem>
                  )}
                />

                {/* =================================================
                    CHANNEL + AUDIENCE
                ================================================= */}

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* CHANNEL */}

                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>

                        <FormLabel>
                          Delivery Channel
                        </FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >

                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>

                            <SelectItem value="push">
                              <div className="flex items-center gap-2">
                                <BellRing className="h-4 w-4" />
                                Push Notification
                              </div>
                            </SelectItem>

                            <SelectItem value="sms">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                SMS
                              </div>
                            </SelectItem>

                            <SelectItem value="all">
                              <div className="flex items-center gap-2">
                                <Radio className="h-4 w-4" />
                                All Channels
                              </div>
                            </SelectItem>

                          </SelectContent>

                        </Select>

                        <FormMessage />

                      </FormItem>
                    )}
                  />

                  {/* TARGET */}

                  <FormField
                    control={form.control}
                    name="target_plan"
                    render={({ field }) => (
                      <FormItem>

                        <FormLabel>
                          Target Audience
                        </FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >

                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>

                            <SelectItem value="all">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                All Users
                              </div>
                            </SelectItem>

                            <SelectItem value="pro">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Pro Users
                              </div>
                            </SelectItem>

                            <SelectItem value="premium">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4" />
                                Premium Users
                              </div>
                            </SelectItem>

                          </SelectContent>

                        </Select>

                        <FormMessage />

                      </FormItem>
                    )}
                  />

                </div>

                {/* =================================================
                    SEND SUMMARY
                ================================================= */}

                <div className="rounded-xl border bg-muted/20 p-4">

                  <div className="grid gap-4 sm:grid-cols-3">

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Channel
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {channelLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Audience
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {audienceLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Message Length
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {bodyLength} characters
                      </p>
                    </div>

                  </div>

                </div>

                {/* =================================================
                    SUBMIT
                ================================================= */}

                <Button
                  type="submit"
                  className="h-11 w-full text-base font-semibold"
                  disabled={broadcastMutation.isPending}
                >

                  {broadcastMutation.isPending ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Broadcast
                    </>
                  )}

                </Button>

              </form>

            </Form>

          </CardContent>
        </Card>

        {/* ===================================================
            PREVIEW SIDE
        =================================================== */}

        <div className="space-y-6">

          {/* =================================================
              PUSH PREVIEW
          ================================================= */}

          <Card className="overflow-hidden border-border/70 shadow-sm">

            <CardHeader className="border-b bg-muted/20 px-5 py-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Push Notification
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      Live preview
                    </p>
                  </div>

                </div>

                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

              </div>

            </CardHeader>

            <CardContent className="flex justify-center bg-muted/10 p-8">

              {/* PHONE */}

              <div className="relative w-[310px] overflow-hidden rounded-[2rem] border-[6px] border-foreground/10 bg-background shadow-2xl">

                {/* Notch */}

                <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-foreground/10" />

                {/* Status */}

                <div className="flex items-center justify-between px-5 pb-2 pt-5 text-[10px] text-muted-foreground">
                  <span>10:41</span>

                  <div className="flex gap-1">
                    <span>●</span>
                    <span>●</span>
                    <span>▮</span>
                  </div>
                </div>

                {/* Notification */}

                <div className="m-3 rounded-2xl border bg-background p-4 shadow-sm">

                  <div className="flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                      <span className="text-xs font-bold text-primary-foreground">
                        K
                      </span>
                    </div>

                    <div className="flex-1">

                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        KhataPro
                      </p>

                      <p className="text-[9px] text-muted-foreground">
                        now
                      </p>

                    </div>

                  </div>

                  <div className="mt-3">

                    <h4 className="line-clamp-2 text-sm font-bold">
                      {title || "Notification Title"}
                    </h4>

                    <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
                      {body ||
                        "This is how your notification will appear to users. Create a short and actionable message."}
                    </p>

                  </div>

                </div>

                {/* Bottom */}

                <div className="flex justify-center pb-2 pt-5">
                  <div className="h-1 w-24 rounded-full bg-foreground/10" />
                </div>

              </div>

            </CardContent>
          </Card>

          {/* =================================================
              SMS PREVIEW
          ================================================= */}

          <Card className="overflow-hidden border-border/70 shadow-sm">

            <CardHeader className="border-b bg-muted/20 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <BellRing className="h-4 w-4 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    SMS Preview
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Message preview
                  </p>
                </div>

              </div>

            </CardHeader>

            <CardContent className="bg-muted/10 p-6">

              <div className="mx-auto max-w-[360px] rounded-2xl border bg-background p-4 shadow-sm">

                <div className="mb-4 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Today 10:41 AM
                </div>

                <div className="flex items-end gap-2">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <span className="text-xs font-bold text-primary-foreground">
                      K
                    </span>
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3">

                    <p className="text-xs font-semibold text-foreground">
                      KhataPro
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {title ? `${title} - ` : ""}
                      {body ||
                        "Your SMS message will appear here."}
                    </p>

                  </div>

                </div>

              </div>

            </CardContent>
          </Card>

          {/* =================================================
              DELIVERY INFO
          ================================================= */}

          <div className="rounded-xl border bg-primary/[0.03] p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Info className="h-4 w-4 text-primary" />
              </div>

              <div>

                <p className="text-sm font-medium">
                  Broadcast delivery
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Your message will be sent to the selected audience
                  through the selected delivery channel.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
