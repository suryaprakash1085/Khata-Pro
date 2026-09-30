// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Settings as SettingsIcon, Save } from "lucide-react"

// export default function Settings() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
//             <SettingsIcon className="h-8 w-8 text-primary" />
//             Platform Settings
//           </h1>
//           <p className="text-muted-foreground mt-1">Configure global CRM parameters and defaults.</p>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Global Thresholds</CardTitle>
//             <CardDescription>System-wide limits and alert thresholds.</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label>High Volume Alert Threshold (INR)</Label>
//               <Input type="number" defaultValue="500000" />
//             </div>
//             <div className="space-y-2">
//               <Label>Free Plan Max Customers</Label>
//               <Input type="number" defaultValue="100" />
//             </div>
//             <div className="space-y-2">
//               <Label>Free Plan Max Transactions/Month</Label>
//               <Input type="number" defaultValue="500" />
//             </div>
//             <Button className="mt-2 w-full">
//               <Save className="mr-2 h-4 w-4" /> Save Thresholds
//             </Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>API Configuration</CardTitle>
//             <CardDescription>External service integration settings.</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label>SMS Gateway Provider</Label>
//               <Input defaultValue="Twilio" disabled className="bg-muted" />
//             </div>
//             <div className="space-y-2">
//               <Label>Payment Gateway</Label>
//               <Input defaultValue="Razorpay" disabled className="bg-muted" />
//             </div>
//             <div className="space-y-2">
//               <Label>Support Email Address</Label>
//               <Input defaultValue="support@khatapro.in" />
//             </div>
//             <Button variant="outline" className="mt-2 w-full">
//               Update Integrations
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
import { useState } from "react"
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
  Receipt,
  Wrench,
  Database,
  CheckCircle2,
} from "lucide-react"

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

export default function Settings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [newBusinessRegistration, setNewBusinessRegistration] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [auditLogging, setAuditLogging] = useState(true)

  return (
    <div
      className="space-y-6 pb-8"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Platform Settings
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure global platform preferences, limits and integrations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />

          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Platform Status
            </p>

            <p className="text-sm font-bold text-emerald-600">
              Operational
            </p>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Alert Threshold
              </p>

              <p className="text-lg font-bold">
                ₹5,00,000
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Active Plans
              </p>

              <p className="text-lg font-bold">
                Pro + Premium
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Billing Cycles
              </p>

              <p className="text-lg font-bold">
                4 Available
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Audit Logging
              </p>

              <p className="text-lg font-bold">
                Enabled
              </p>
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

              <CardDescription>
                System-wide limits and financial alert thresholds.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>High Volume Alert Threshold</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>

              <Input
                type="number"
                defaultValue="500000"
                className="pl-8"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Trigger an alert when transaction volume exceeds this amount.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Maximum Customers</Label>

            <Input
              type="number"
              defaultValue="1000"
            />

            <p className="text-xs text-muted-foreground">
              Default platform-level customer limit.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Maximum Transactions / Month</Label>

            <Input
              type="number"
              defaultValue="5000"
            />

            <p className="text-xs text-muted-foreground">
              Default monthly transaction threshold.
            </p>
          </div>
        </CardContent>

        <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Thresholds
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

              <CardDescription>
                Configure default subscription and trial behaviour.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Available Plans</Label>

            <Select defaultValue="pro-premium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pro-premium">
                  Pro + Premium
                </SelectItem>

                <SelectItem value="pro">
                  Pro Only
                </SelectItem>

                <SelectItem value="premium">
                  Premium Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Free Trial Period</Label>

            <div className="relative">
              <Input
                type="number"
                defaultValue="15"
                className="pr-14"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Days
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Billing Cycle</Label>

            <Select defaultValue="monthly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="monthly">
                  Monthly
                </SelectItem>

                <SelectItem value="quarterly">
                  Quarterly
                </SelectItem>

                <SelectItem value="half_yearly">
                  Half-Yearly
                </SelectItem>

                <SelectItem value="yearly">
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trial After Expiry</Label>

            <Select defaultValue="disabled">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="disabled">
                  Disabled
                </SelectItem>

                <SelectItem value="enabled">
                  Enabled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
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

              <CardDescription>
                Configure external communication and payment services.
              </CardDescription>
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
                  <p className="font-bold">
                    SMS Gateway
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Transactional SMS provider
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connected
              </span>
            </div>

            <div className="mt-4">
              <Input
                defaultValue="Twilio"
                disabled
                className="bg-muted"
              />
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
                  <p className="font-bold">
                    Payment Gateway
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Subscription payment provider
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connected
              </span>
            </div>

            <div className="mt-4">
              <Input
                defaultValue="Razorpay"
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Support Email */}
          <div className="space-y-2">
            <Label>Support Email Address</Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                defaultValue="support@khatapro.in"
                className="pl-9"
              />
            </div>
          </div>

          {/* Notification Email */}
          <div className="space-y-2">
            <Label>Notification Email</Label>

            <div className="relative">
              <Bell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                defaultValue="notifications@khatapro.in"
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <Button variant="outline">
            Update Integrations
          </Button>
        </div>
      </Card>

      {/* Platform Controls */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/30">
              <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>

            <div>
              <CardTitle>Platform Controls</CardTitle>

              <CardDescription>
                Manage important platform-wide behaviour.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y p-0">
          {/* Maintenance */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-start gap-3">
              <Wrench className="mt-1 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="font-bold">
                  Maintenance Mode
                </p>

                <p className="text-sm text-muted-foreground">
                  Temporarily restrict platform access during maintenance.
                </p>
              </div>
            </div>

            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          {/* Business Registration */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="font-bold">
                  New Business Registration
                </p>

                <p className="text-sm text-muted-foreground">
                  Allow new businesses to register on the platform.
                </p>
              </div>
            </div>

            <Switch
              checked={newBusinessRegistration}
              onCheckedChange={setNewBusinessRegistration}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-start gap-3">
              <Bell className="mt-1 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="font-bold">
                  Platform Notifications
                </p>

                <p className="text-sm text-muted-foreground">
                  Enable system-wide notifications and alerts.
                </p>
              </div>
            </div>

            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          {/* Audit */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="font-bold">
                  Audit Logging
                </p>

                <p className="text-sm text-muted-foreground">
                  Record important platform and administrative activities.
                </p>
              </div>
            </div>

            <Switch
              checked={auditLogging}
              onCheckedChange={setAuditLogging}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Information */}
      <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

        <div>
          <p className="text-sm font-bold">
            Platform configuration
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            These settings are intended for Super Admin configuration.
            Changes to platform-wide settings may affect all businesses,
            users and subscriptions.
          </p>
        </div>
      </div>
    </div>
  )
}