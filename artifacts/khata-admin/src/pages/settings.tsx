// import { useState } from "react"
// import {
//   Settings as SettingsIcon,
//   Save,
//   ShieldCheck,
//   CreditCard,
//   Bell,
//   Mail,
//   MessageSquare,
//   IndianRupee,
//   Users,
//   Receipt,
//   Wrench,
//   Database,
//   CheckCircle2,
// } from "lucide-react"

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// export default function Settings() {
//   const [maintenanceMode, setMaintenanceMode] = useState(false)
//   const [newBusinessRegistration, setNewBusinessRegistration] = useState(true)
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true)
//   const [auditLogging, setAuditLogging] = useState(true)

//   return (
//     <div
//       className="space-y-6 pb-8"
//       style={{ fontFamily: "'Times New Roman', Times, serif" }}
//     >
//       {/* Header */}
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div className="flex items-start gap-4">
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
//             <SettingsIcon className="h-6 w-6 text-primary" />
//           </div>

//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Platform Settings
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Configure global platform preferences, limits and integrations.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 shadow-sm">
//           <ShieldCheck className="h-5 w-5 text-emerald-600" />

//           <div>
//             <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
//               Platform Status
//             </p>

//             <p className="text-sm font-bold text-emerald-600">
//               Operational
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Overview */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardContent className="flex items-center gap-4 p-5">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <IndianRupee className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Alert Threshold
//               </p>

//               <p className="text-lg font-bold">
//                 ₹5,00,000
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center gap-4 p-5">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
//               <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Active Plans
//               </p>

//               <p className="text-lg font-bold">
//                 Pro + Premium
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center gap-4 p-5">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
//               <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Billing Cycles
//               </p>

//               <p className="text-lg font-bold">
//                 4 Available
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center gap-4 p-5">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
//               <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Audit Logging
//               </p>

//               <p className="text-lg font-bold">
//                 Enabled
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Global Thresholds */}
//       <Card>
//         <CardHeader className="border-b bg-muted/20">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <IndianRupee className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <CardTitle>Global Thresholds</CardTitle>

//               <CardDescription>
//                 System-wide limits and financial alert thresholds.
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="grid gap-6 p-6 md:grid-cols-3">
//           <div className="space-y-2">
//             <Label>High Volume Alert Threshold</Label>

//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                 ₹
//               </span>

//               <Input
//                 type="number"
//                 defaultValue="500000"
//                 className="pl-8"
//               />
//             </div>

//             <p className="text-xs text-muted-foreground">
//               Trigger an alert when transaction volume exceeds this amount.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label>Maximum Customers</Label>

//             <Input
//               type="number"
//               defaultValue="1000"
//             />

//             <p className="text-xs text-muted-foreground">
//               Default platform-level customer limit.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label>Maximum Transactions / Month</Label>

//             <Input
//               type="number"
//               defaultValue="5000"
//             />

//             <p className="text-xs text-muted-foreground">
//               Default monthly transaction threshold.
//             </p>
//           </div>
//         </CardContent>

//         <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
//           <Button>
//             <Save className="mr-2 h-4 w-4" />
//             Save Thresholds
//           </Button>
//         </div>
//       </Card>

//       {/* Subscription Defaults */}
//       <Card>
//         <CardHeader className="border-b bg-muted/20">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/30">
//               <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//             </div>

//             <div>
//               <CardTitle>Subscription Defaults</CardTitle>

//               <CardDescription>
//                 Configure default subscription and trial behaviour.
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
//           <div className="space-y-2">
//             <Label>Available Plans</Label>

//             <Select defaultValue="pro-premium">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="pro-premium">
//                   Pro + Premium
//                 </SelectItem>

//                 <SelectItem value="pro">
//                   Pro Only
//                 </SelectItem>

//                 <SelectItem value="premium">
//                   Premium Only
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Free Trial Period</Label>

//             <div className="relative">
//               <Input
//                 type="number"
//                 defaultValue="15"
//                 className="pr-14"
//               />

//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
//                 Days
//               </span>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Default Billing Cycle</Label>

//             <Select defaultValue="monthly">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="monthly">
//                   Monthly
//                 </SelectItem>

//                 <SelectItem value="quarterly">
//                   Quarterly
//                 </SelectItem>

//                 <SelectItem value="half_yearly">
//                   Half-Yearly
//                 </SelectItem>

//                 <SelectItem value="yearly">
//                   Yearly
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Trial After Expiry</Label>

//             <Select defaultValue="disabled">
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="disabled">
//                   Disabled
//                 </SelectItem>

//                 <SelectItem value="enabled">
//                   Enabled
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Integrations */}
//       <Card>
//         <CardHeader className="border-b bg-muted/20">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
//               <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//             </div>

//             <div>
//               <CardTitle>API & Integrations</CardTitle>

//               <CardDescription>
//                 Configure external communication and payment services.
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="grid gap-5 p-6 md:grid-cols-2">
//           {/* SMS */}
//           <div className="rounded-xl border p-4">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
//                   <MessageSquare className="h-4 w-4" />
//                 </div>

//                 <div>
//                   <p className="font-bold">
//                     SMS Gateway
//                   </p>

//                   <p className="text-xs text-muted-foreground">
//                     Transactional SMS provider
//                   </p>
//                 </div>
//               </div>

//               <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
//                 <CheckCircle2 className="h-3.5 w-3.5" />
//                 Connected
//               </span>
//             </div>

//             <div className="mt-4">
//               <Input
//                 defaultValue="Twilio"
//                 disabled
//                 className="bg-muted"
//               />
//             </div>
//           </div>

//           {/* Payment */}
//           <div className="rounded-xl border p-4">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
//                   <CreditCard className="h-4 w-4" />
//                 </div>

//                 <div>
//                   <p className="font-bold">
//                     Payment Gateway
//                   </p>

//                   <p className="text-xs text-muted-foreground">
//                     Subscription payment provider
//                   </p>
//                 </div>
//               </div>

//               <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
//                 <CheckCircle2 className="h-3.5 w-3.5" />
//                 Connected
//               </span>
//             </div>

//             <div className="mt-4">
//               <Input
//                 defaultValue="Razorpay"
//                 disabled
//                 className="bg-muted"
//               />
//             </div>
//           </div>

//           {/* Support Email */}
//           <div className="space-y-2">
//             <Label>Support Email Address</Label>

//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//               <Input
//                 defaultValue="support@khatapro.in"
//                 className="pl-9"
//               />
//             </div>
//           </div>

//           {/* Notification Email */}
//           <div className="space-y-2">
//             <Label>Notification Email</Label>

//             <div className="relative">
//               <Bell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//               <Input
//                 defaultValue="notifications@khatapro.in"
//                 className="pl-9"
//               />
//             </div>
//           </div>
//         </CardContent>

//         <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
//           <Button variant="outline">
//             Update Integrations
//           </Button>
//         </div>
//       </Card>

//       {/* Platform Controls */}
//       <Card>
//         <CardHeader className="border-b bg-muted/20">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/30">
//               <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
//             </div>

//             <div>
//               <CardTitle>Platform Controls</CardTitle>

//               <CardDescription>
//                 Manage important platform-wide behaviour.
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="divide-y p-0">
//           {/* Maintenance */}
//           <div className="flex items-center justify-between gap-4 px-6 py-5">
//             <div className="flex items-start gap-3">
//               <Wrench className="mt-1 h-5 w-5 text-muted-foreground" />

//               <div>
//                 <p className="font-bold">
//                   Maintenance Mode
//                 </p>

//                 <p className="text-sm text-muted-foreground">
//                   Temporarily restrict platform access during maintenance.
//                 </p>
//               </div>
//             </div>

//             <Switch
//               checked={maintenanceMode}
//               onCheckedChange={setMaintenanceMode}
//             />
//           </div>

//           {/* Business Registration */}
//           <div className="flex items-center justify-between gap-4 px-6 py-5">
//             <div className="flex items-start gap-3">
//               <Users className="mt-1 h-5 w-5 text-muted-foreground" />

//               <div>
//                 <p className="font-bold">
//                   New Business Registration
//                 </p>

//                 <p className="text-sm text-muted-foreground">
//                   Allow new businesses to register on the platform.
//                 </p>
//               </div>
//             </div>

//             <Switch
//               checked={newBusinessRegistration}
//               onCheckedChange={setNewBusinessRegistration}
//             />
//           </div>

//           {/* Notifications */}
//           <div className="flex items-center justify-between gap-4 px-6 py-5">
//             <div className="flex items-start gap-3">
//               <Bell className="mt-1 h-5 w-5 text-muted-foreground" />

//               <div>
//                 <p className="font-bold">
//                   Platform Notifications
//                 </p>

//                 <p className="text-sm text-muted-foreground">
//                   Enable system-wide notifications and alerts.
//                 </p>
//               </div>
//             </div>

//             <Switch
//               checked={notificationsEnabled}
//               onCheckedChange={setNotificationsEnabled}
//             />
//           </div>

//           {/* Audit */}
//           <div className="flex items-center justify-between gap-4 px-6 py-5">
//             <div className="flex items-start gap-3">
//               <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />

//               <div>
//                 <p className="font-bold">
//                   Audit Logging
//                 </p>

//                 <p className="text-sm text-muted-foreground">
//                   Record important platform and administrative activities.
//                 </p>
//               </div>
//             </div>

//             <Switch
//               checked={auditLogging}
//               onCheckedChange={setAuditLogging}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Bottom Information */}
//       <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
//         <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

//         <div>
//           <p className="text-sm font-bold">
//             Platform configuration
//           </p>

//           <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
//             These settings are intended for Super Admin configuration.
//             Changes to platform-wide settings may affect all businesses,
//             users and subscriptions.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from "react"
import {
  Settings as SettingsIcon,
  Save,
  ShieldCheck,
  CreditCard,
  Bell,
  Mail,
  MessageSquare,
  IndianRupee,
  Users,
  Wrench,
  Database,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner" // shadcn toast. Vera toast library use panna ithai maathunga

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


/* ------------------------------------------------------------------ */
/* API layer: unga backend-ku match aaga ithai mattum maathunga        */
/* ------------------------------------------------------------------ */

// Settings.tsx-la irukkura "API layer" section-ah (API_BASE ... settingsApi) idhaala replace pannunga.

const API_BASE = import.meta.env.VITE_API_URL ?? ""
const SETTINGS_URL = `${API_BASE}/api/admin/settings` // unga router mount path-ku match pannunga

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token") // unga admin login token key-ku maathunga
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: authHeaders() })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.message || body?.error || `Request failed (${res.status})`)
  return body as T
}

// camelCase (frontend) <-> snake_case (backend)
const FIELD_MAP: Record<string, string> = {
  highVolumeAlertThreshold: "high_volume_alert_threshold",
  maxCustomers: "max_customers",
  maxTransactionsPerMonth: "max_transactions_per_month",
  availablePlans: "available_plans",
  freeTrialDays: "free_trial_days",
  defaultBillingCycle: "default_billing_cycle",
  trialAfterExpiry: "trial_after_expiry",
  smsGateway: "sms_gateway",
  paymentGateway: "payment_gateway",
  smsConnected: "sms_connected",
  paymentConnected: "payment_connected",
  supportEmail: "support_email",
  notificationEmail: "notification_email",
  maintenanceMode: "maintenance_mode",
  newBusinessRegistration: "new_business_registration",
  notificationsEnabled: "notifications_enabled",
  auditLogging: "audit_logging",
}

const fromApi = (raw: Record<string, any>): PlatformSettings => {
  const out: Record<string, any> = {}
  for (const [camel, snake] of Object.entries(FIELD_MAP)) {
    if (raw[snake] !== undefined) out[camel] = raw[snake]
  }
  return out as PlatformSettings
}

const toApi = (patch: Partial<PlatformSettings>) => {
  const out: Record<string, any> = {}
  for (const [camel, value] of Object.entries(patch)) {
    const snake = FIELD_MAP[camel]
    if (snake) out[snake] = value
  }
  return out
}

const settingsApi = {
  get: async () => fromApi(await request<Record<string, any>>(SETTINGS_URL)),
  update: async (patch: Partial<PlatformSettings>) =>
    fromApi(
      await request<Record<string, any>>(SETTINGS_URL, {
        method: "PATCH",
        body: JSON.stringify(toApi(patch)),
      })
    ),
}

/* ------------------------------------------------------------------ */
/* Types + defaults                                                    */
/* ------------------------------------------------------------------ */
type PlatformSettings = {
  highVolumeAlertThreshold: number
  maxCustomers: number
  maxTransactionsPerMonth: number

  availablePlans: "pro-premium" | "pro" | "premium"
  freeTrialDays: number
  defaultBillingCycle: "monthly" | "quarterly" | "half_yearly" | "yearly"
  trialAfterExpiry: "enabled" | "disabled"

  smsGateway: string
  paymentGateway: string
  smsConnected: boolean
  paymentConnected: boolean
  supportEmail: string
  notificationEmail: string

  maintenanceMode: boolean
  newBusinessRegistration: boolean
  notificationsEnabled: boolean
  auditLogging: boolean
}

const DEFAULTS: PlatformSettings = {
  highVolumeAlertThreshold: 0,
  maxCustomers: 0,
  maxTransactionsPerMonth: 0,
  availablePlans: "pro-premium",
  freeTrialDays: 0,
  defaultBillingCycle: "monthly",
  trialAfterExpiry: "disabled",
  smsGateway: "",
  paymentGateway: "",
  smsConnected: false,
  paymentConnected: false,
  supportEmail: "",
  notificationEmail: "",
  maintenanceMode: false,
  newBusinessRegistration: true,
  notificationsEnabled: true,
  auditLogging: true,
}

const PLAN_LABELS: Record<PlatformSettings["availablePlans"], string> = {
  "pro-premium": "Pro + Premium",
  pro: "Pro Only",
  premium: "Premium Only",
}

const BILLING_CYCLES: { value: PlatformSettings["defaultBillingCycle"]; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half-Yearly" },
  { value: "yearly", label: "Yearly" },
]

type SectionKey = "thresholds" | "subscription" | "integrations" | "controls"

const SECTION_FIELDS: Record<SectionKey, (keyof PlatformSettings)[]> = {
  thresholds: ["highVolumeAlertThreshold", "maxCustomers", "maxTransactionsPerMonth"],
  subscription: ["availablePlans", "freeTrialDays", "defaultBillingCycle", "trialAfterExpiry"],
  integrations: ["supportEmail", "notificationEmail"],
  controls: ["maintenanceMode", "newBusinessRegistration", "notificationsEnabled", "auditLogging"],
}

const formatINR = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Settings() {
  // saved = server-la irukkura latest value, draft = user edit panra value
  const [saved, setSaved] = useState<PlatformSettings>(DEFAULTS)
  const [draft, setDraft] = useState<PlatformSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null)

  const loadSettings = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await settingsApi.get()
      const merged = { ...DEFAULTS, ...data }
      setSaved(merged)
      setDraft(merged)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const setField = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const isDirty = (section: SectionKey) =>
    SECTION_FIELDS[section].some((k) => draft[k] !== saved[k])

  const validate = (section: SectionKey): string | null => {
    if (section === "thresholds") {
      if (draft.highVolumeAlertThreshold <= 0) return "Alert threshold must be greater than 0"
      if (draft.maxCustomers <= 0) return "Maximum customers must be greater than 0"
      if (draft.maxTransactionsPerMonth <= 0) return "Maximum transactions must be greater than 0"
    }
    if (section === "subscription" && draft.freeTrialDays < 0) {
      return "Free trial days cannot be negative"
    }
    if (section === "integrations") {
      if (!isEmail(draft.supportEmail)) return "Enter a valid support email"
      if (!isEmail(draft.notificationEmail)) return "Enter a valid notification email"
    }
    return null
  }

  const saveSection = async (section: SectionKey, successMsg: string) => {
    const error = validate(section)
    if (error) {
      toast.error(error)
      return
    }

    const patch = SECTION_FIELDS[section].reduce(
      (acc, k) => ({ ...acc, [k]: draft[k] }),
      {} as Partial<PlatformSettings>
    )

    setSavingSection(section)
    try {
      const updated = await settingsApi.update(patch)
      const merged = { ...saved, ...patch, ...updated }
      setSaved(merged)
      setDraft((d) => ({ ...d, ...patch }))
      toast.success(successMsg)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings")
    } finally {
      setSavingSection(null)
    }
  }

  // Toggles: udane save aagum (optimistic), fail aanaa rollback
  const toggleControl = async (
    key: (typeof SECTION_FIELDS.controls)[number],
    value: boolean
  ) => {
    const previous = saved[key]
    setDraft((d) => ({ ...d, [key]: value }))
    setSaved((s) => ({ ...s, [key]: value }))
    try {
      await settingsApi.update({ [key]: value })
      toast.success("Setting updated")
    } catch (err) {
      setDraft((d) => ({ ...d, [key]: previous }))
      setSaved((s) => ({ ...s, [key]: previous }))
      toast.error(err instanceof Error ? err.message : "Could not update setting")
    }
  }

  const numberChange =
    (key: "highVolumeAlertThreshold" | "maxCustomers" | "maxTransactionsPerMonth" | "freeTrialDays") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setField(key, e.target.value === "" ? 0 : Number(e.target.value))

  // Quick overview ippo SAVED data-la irundhu render aagum
  const overview = useMemo(
    () => ({
      threshold: formatINR(saved.highVolumeAlertThreshold),
      plans: PLAN_LABELS[saved.availablePlans],
      cycles: `${BILLING_CYCLES.length} Available`,
      audit: saved.auditLogging ? "Enabled" : "Disabled",
    }),
    [saved]
  )

  const platformStatus = saved.maintenanceMode ? "Maintenance" : "Operational"

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading settings...
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">{loadError}</p>
        <Button variant="outline" onClick={loadSettings}>
          Retry
        </Button>
      </div>
    )
  }

  const SaveLabel = ({ section, text }: { section: SectionKey; text: string }) =>
    savingSection === section ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Save className="mr-2 h-4 w-4" />
        {text}
      </>
    )

  return (
    <div className="space-y-6 pb-8" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure global platform preferences, limits and integrations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 shadow-sm">
          <ShieldCheck
            className={`h-5 w-5 ${saved.maintenanceMode ? "text-orange-600" : "text-emerald-600"}`}
          />
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Platform Status
            </p>
            <p
              className={`text-sm font-bold ${
                saved.maintenanceMode ? "text-orange-600" : "text-emerald-600"
              }`}
            >
              {platformStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Overview (saved data-la irundhu) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alert Threshold</p>
              <p className="text-lg font-bold">{overview.threshold}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Plans</p>
              <p className="text-lg font-bold">{overview.plans}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Billing Cycles</p>
              <p className="text-lg font-bold">{overview.cycles}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Audit Logging</p>
              <p className="text-lg font-bold">{overview.audit}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Thresholds */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Global Thresholds</CardTitle>
              <CardDescription>System-wide limits and financial alert thresholds.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="alertThreshold">High Volume Alert Threshold</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>
              <Input
                id="alertThreshold"
                type="number"
                min={0}
                value={draft.highVolumeAlertThreshold}
                onChange={numberChange("highVolumeAlertThreshold")}
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Trigger an alert when transaction volume exceeds this amount.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCustomers">Maximum Customers</Label>
            <Input
              id="maxCustomers"
              type="number"
              min={0}
              value={draft.maxCustomers}
              onChange={numberChange("maxCustomers")}
            />
            <p className="text-xs text-muted-foreground">Default platform-level customer limit.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTx">Maximum Transactions / Month</Label>
            <Input
              id="maxTx"
              type="number"
              min={0}
              value={draft.maxTransactionsPerMonth}
              onChange={numberChange("maxTransactionsPerMonth")}
            />
            <p className="text-xs text-muted-foreground">Default monthly transaction threshold.</p>
          </div>
        </CardContent>

        <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <Button
            onClick={() => saveSection("thresholds", "Thresholds saved")}
            disabled={!isDirty("thresholds") || savingSection === "thresholds"}
          >
            <SaveLabel section="thresholds" text="Save Thresholds" />
          </Button>
        </div>
      </Card>

      {/* Subscription Defaults */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/30">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>Subscription Defaults</CardTitle>
              <CardDescription>Configure default subscription and trial behaviour.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Available Plans</Label>
            <Select
              value={draft.availablePlans}
              onValueChange={(v) => setField("availablePlans", v as PlatformSettings["availablePlans"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PLAN_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trialDays">Free Trial Period</Label>
            <div className="relative">
              <Input
                id="trialDays"
                type="number"
                min={0}
                value={draft.freeTrialDays}
                onChange={numberChange("freeTrialDays")}
                className="pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Days
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Billing Cycle</Label>
            <Select
              value={draft.defaultBillingCycle}
              onValueChange={(v) =>
                setField("defaultBillingCycle", v as PlatformSettings["defaultBillingCycle"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BILLING_CYCLES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trial After Expiry</Label>
            <Select
              value={draft.trialAfterExpiry}
              onValueChange={(v) => setField("trialAfterExpiry", v as PlatformSettings["trialAfterExpiry"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <Button
            onClick={() => saveSection("subscription", "Subscription defaults saved")}
            disabled={!isDirty("subscription") || savingSection === "subscription"}
          >
            <SaveLabel section="subscription" text="Save Defaults" />
          </Button>
        </div>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>Configure external communication and payment services.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5 p-6 md:grid-cols-2">
          {/* SMS */}
          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold">SMS Gateway</p>
                  <p className="text-xs text-muted-foreground">Transactional SMS provider</p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${
                  saved.smsConnected ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {saved.smsConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="mt-4">
              <Input value={draft.smsGateway || "Not configured"} disabled className="bg-muted" />
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold">Payment Gateway</p>
                  <p className="text-xs text-muted-foreground">Subscription payment provider</p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${
                  saved.paymentConnected ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {saved.paymentConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="mt-4">
              <Input value={draft.paymentGateway || "Not configured"} disabled className="bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="supportEmail"
                type="email"
                value={draft.supportEmail}
                onChange={(e) => setField("supportEmail", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationEmail">Notification Email</Label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="notificationEmail"
                type="email"
                value={draft.notificationEmail}
                onChange={(e) => setField("notificationEmail", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => saveSection("integrations", "Integrations updated")}
            disabled={!isDirty("integrations") || savingSection === "integrations"}
          >
            {savingSection === "integrations" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Integrations"
            )}
          </Button>
        </div>
      </Card>

      {/* Platform Controls (toggle panna udane save aagum) */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/30">
              <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle>Platform Controls</CardTitle>
              <CardDescription>Manage important platform-wide behaviour.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y p-0">
          {[
            {
              key: "maintenanceMode" as const,
              icon: Wrench,
              title: "Maintenance Mode",
              desc: "Temporarily restrict platform access during maintenance.",
            },
            {
              key: "newBusinessRegistration" as const,
              icon: Users,
              title: "New Business Registration",
              desc: "Allow new businesses to register on the platform.",
            },
            {
              key: "notificationsEnabled" as const,
              icon: Bell,
              title: "Platform Notifications",
              desc: "Enable system-wide notifications and alerts.",
            },
            {
              key: "auditLogging" as const,
              icon: ShieldCheck,
              title: "Audit Logging",
              desc: "Record important platform and administrative activities.",
            },
          ].map(({ key, icon: Icon, title, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-start gap-3">
                <Icon className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
              <Switch checked={draft[key]} onCheckedChange={(v) => toggleControl(key, v)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bottom Information */}
      <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-bold">Platform configuration</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            These settings are intended for Super Admin configuration. Changes to platform-wide
            settings may affect all businesses, users and subscriptions.
          </p>
        </div>
      </div>
    </div>
  )
}