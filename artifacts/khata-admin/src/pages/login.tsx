import { useState } from "react"
import { useLocation } from "wouter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useLogin } from "@workspace/api-client-react"
import { setToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          setToken(data.token)
          toast({
            title: "Welcome back",
            description: "Successfully logged into KhataPro CRM.",
          })
          setLocation("/dashboard")
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
          })
        },
      }
    )
  }

  return (
    <div
      className="flex min-h-screen w-full bg-background"
      style={{ fontFamily: "Times New Roman, Times, serif" }}
    >
      {/* =========================================================
          LEFT — BRAND PANEL (matches Sidebar's dark navy theme)
          Hidden on small screens, shown from md breakpoint up.
      ========================================================= */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0b1120] p-12 text-white lg:flex">
        {/* subtle background glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Logo / brand mark */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/30">
            K
          </div>
          <div className="leading-tight">
            <p className="text-lg font-bold tracking-tight">KhataPro</p>
            <p className="text-xs uppercase tracking-widest text-white/50">
              Admin Console
            </p>
          </div>
        </div>

        {/* Middle — headline + feature highlights */}
        <div className="relative space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-snug">
              Run the entire platform<br /> from one console.
            </h2>
            <p className="max-w-sm text-sm text-white/60">
              Manage businesses, subscriptions, reports and platform activity
              across every KhataPro workspace — securely, in one place.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureRow
              icon={Building2}
              title="Business Oversight"
              desc="Monitor every registered store on the platform"
            />
            <FeatureRow
              icon={CreditCard}
              title="Subscription Control"
              desc="Track plans, billing cycles and renewals"
            />
            <FeatureRow
              icon={LayoutDashboard}
              title="Unified Dashboard"
              desc="Real-time reports and platform-wide insights"
            />
          </div>
        </div>

        {/* Footer — trust signal */}
        <div className="relative flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck className="h-4 w-4" />
          Access restricted to authorized platform operators.
        </div>
      </div>

      {/* =========================================================
          RIGHT — LOGIN FORM
      ========================================================= */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand mark (shown when left panel is hidden) */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
              K
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">KhataPro</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Admin Console
              </p>
            </div>
          </div>

          <div className="mb-8 space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to your console
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your admin credentials to continue.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Admin Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="admin@khatapro.in"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-11 pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-11 w-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Sign into CRM"}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <ShieldCheck className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
            Protected admin area. All access is logged.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =============================================================
   FEATURE ROW — small icon + title + description used in the
   left brand panel.
============================================================= */

function FeatureRow({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType
  title: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/50">{desc}</p>
      </div>
    </div>
  )
}