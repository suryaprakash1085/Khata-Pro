import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings as SettingsIcon, Save } from "lucide-react"

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Platform Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure global CRM parameters and defaults.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Global Thresholds</CardTitle>
            <CardDescription>System-wide limits and alert thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>High Volume Alert Threshold (INR)</Label>
              <Input type="number" defaultValue="500000" />
            </div>
            <div className="space-y-2">
              <Label>Free Plan Max Customers</Label>
              <Input type="number" defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label>Free Plan Max Transactions/Month</Label>
              <Input type="number" defaultValue="500" />
            </div>
            <Button className="mt-2 w-full">
              <Save className="mr-2 h-4 w-4" /> Save Thresholds
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>External service integration settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>SMS Gateway Provider</Label>
              <Input defaultValue="Twilio" disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <Input defaultValue="Razorpay" disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Support Email Address</Label>
              <Input defaultValue="support@khatapro.in" />
            </div>
            <Button variant="outline" className="mt-2 w-full">
              Update Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
