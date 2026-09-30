

import { useState, type ElementType } from "react"
import {
  useListSubscriptionPlans,
  getListSubscriptionPlansQueryKey,
  useUpdateSubscriptionPlan,
  useCreateSubscriptionPlan,
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

import {
  Layers,
  Pencil,
  Plus,
  Users,
  Building2,
  Package,
  Contact,
  Truck,
  ShoppingCart,
  Sparkles,
  IndianRupee,
  Save,
} from "lucide-react"

/* ============================================================
   FEATURE CONFIGURATION
============================================================ */

const FEATURE_KEYS: {
  key: string
  label: string
}[] = [
  {
    key: "aiChat",
    label: "AI Chat Assistant",
  },
  {
    key: "aiReminder",
    label: "AI Payment Reminders",
  },
  {
    key: "advancedReports",
    label: "Advanced Reports",
  },
]

/* ============================================================
   LIMIT CONFIGURATION
============================================================ */

type LimitKey =
  | "max_users"
  | "max_branches"
  | "max_products"
  | "max_customers"
  | "max_vendors"
  | "max_orders"

const LIMIT_FIELDS: {
  key: LimitKey
  label: string
  icon: ElementType
}[] = [
  {
    key: "max_users",
    label: "Users",
    icon: Users,
  },
  {
    key: "max_branches",
    label: "Branches",
    icon: Building2,
  },
  {
    key: "max_products",
    label: "Products",
    icon: Package,
  },
  {
    key: "max_customers",
    label: "Customers",
    icon: Contact,
  },
  {
    key: "max_vendors",
    label: "Vendors",
    icon: Truck,
  },
  {
    key: "max_orders",
    label: "Orders",
    icon: ShoppingCart,
  },
]

/* ============================================================
   PRICE CONFIGURATION
============================================================ */

type PriceKey =
  | "monthly_price"
  | "quarterly_price"
  | "half_yearly_price"
  | "yearly_price"

const PRICE_FIELDS: {
  key: PriceKey
  label: string
}[] = [
  {
    key: "monthly_price",
    label: "Monthly",
  },
  {
    key: "quarterly_price",
    label: "Quarterly",
  },
  {
    key: "half_yearly_price",
    label: "Half-Yearly",
  },
  {
    key: "yearly_price",
    label: "Yearly",
  },
]

/* ============================================================
   EMPTY CREATE FORM
============================================================ */

const EMPTY_CREATE_FORM = {
  plan: "",

  monthly_price: "",
  quarterly_price: "",
  half_yearly_price: "",
  yearly_price: "",

  trial_days: "15",

  max_users: "",
  max_branches: "",
  max_products: "",
  max_customers: "",
  max_vendors: "",
  max_orders: "",

  features: {
    aiChat: false,
    aiReminder: false,
    advancedReports: false,
  },

  is_active: true,
}

/* ============================================================
   FORMAT AMOUNT
============================================================ */

const formatAmount = (
  value?: string | number | null
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "—"
  }

  const amount =
    typeof value === "string"
      ? parseFloat(value)
      : value

  if (Number.isNaN(amount)) {
    return "—"
  }

  return `₹${amount.toLocaleString("en-IN")}`
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function SubscriptionPlans() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  /* ==========================================================
     GET PLANS
  ========================================================== */

  const {
    data: response,
    isLoading,
    error,
  } = useListSubscriptionPlans({
    query: {
      queryKey:
        getListSubscriptionPlansQueryKey(),
    },
  })

  const plans = response?.data ?? []

  /* ==========================================================
     EDIT STATE
  ========================================================== */

  const [editingPlan, setEditingPlan] =
    useState<any | null>(null)

  const [form, setForm] =
    useState<Record<string, any>>({})

  /* ==========================================================
     CREATE STATE
  ========================================================== */

  const [isCreateOpen, setIsCreateOpen] =
    useState(false)

  const [createForm, setCreateForm] =
    useState<Record<string, any>>({
      ...EMPTY_CREATE_FORM,

      features: {
        ...EMPTY_CREATE_FORM.features,
      },
    })

  /* ==========================================================
     MUTATIONS
  ========================================================== */

  const updateMutation =
    useUpdateSubscriptionPlan()

  const createMutation =
    useCreateSubscriptionPlan()

  /* ==========================================================
     OPEN EDIT
  ========================================================== */

  const openEdit = (plan: any) => {
    setEditingPlan(plan)

    setForm({
      monthly_price:
        plan.monthly_price ?? "",

      quarterly_price:
        plan.quarterly_price ?? "",

      half_yearly_price:
        plan.half_yearly_price ?? "",

      yearly_price:
        plan.yearly_price ?? "",

      trial_days:
        plan.trial_days ?? 15,

      max_users:
        plan.max_users ?? "",

      max_branches:
        plan.max_branches ?? "",

      max_products:
        plan.max_products ?? "",

      max_customers:
        plan.max_customers ?? "",

      max_vendors:
        plan.max_vendors ?? "",

      max_orders:
        plan.max_orders ?? "",

      features: {
        ...(plan.features ?? {}),
      },

      is_active:
        plan.is_active ?? true,
    })
  }

  /* ==========================================================
     CLOSE EDIT
  ========================================================== */

  const closeEdit = () => {
    setEditingPlan(null)
    setForm({})
  }

  /* ==========================================================
     EDIT FIELD
  ========================================================== */

  const updateField = (
    key: string,
    value: any
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  /* ==========================================================
     EDIT FEATURE
  ========================================================== */

  const toggleFeature = (
    key: string
  ) => {
    setForm((current) => ({
      ...current,

      features: {
        ...(current.features ?? {}),
        [key]:
          !current.features?.[key],
      },
    }))
  }

  /* ==========================================================
     SAVE EDIT
  ========================================================== */

  const saveChanges = () => {
    if (!editingPlan) return

    updateMutation.mutate(
      {
        id: editingPlan.id,

        data: {
          monthly_price: Number(
            form.monthly_price
          ),

          quarterly_price: Number(
            form.quarterly_price
          ),

          half_yearly_price: Number(
            form.half_yearly_price
          ),

          yearly_price: Number(
            form.yearly_price
          ),

          trial_days: Number(
            form.trial_days
          ),

          max_users: Number(
            form.max_users
          ),

          max_branches: Number(
            form.max_branches
          ),

          max_products: Number(
            form.max_products
          ),

          max_customers: Number(
            form.max_customers
          ),

          max_vendors: Number(
            form.max_vendors
          ),

          max_orders: Number(
            form.max_orders
          ),

          features:
            form.features ?? {},

          is_active:
            Boolean(form.is_active),
        } as any,
      },

      {
        onSuccess: () => {
          toast({
            title: "Plan updated",
            description:
              `${editingPlan.plan} plan updated successfully.`,
          })

          queryClient.invalidateQueries({
            queryKey:
              getListSubscriptionPlansQueryKey(),
          })

          closeEdit()
        },

        onError: (error: any) => {
          toast({
            variant: "destructive",

            title: "Update failed",

            description:
              error?.message ??
              "Could not update the plan.",
          })
        },
      }
    )
  }

  /* ==========================================================
     OPEN CREATE
  ========================================================== */

  const openCreate = () => {
    setCreateForm({
      ...EMPTY_CREATE_FORM,

      features: {
        ...EMPTY_CREATE_FORM.features,
      },
    })

    setIsCreateOpen(true)
  }

  /* ==========================================================
     CLOSE CREATE
  ========================================================== */

  const closeCreate = () => {
    setIsCreateOpen(false)

    setCreateForm({
      ...EMPTY_CREATE_FORM,

      features: {
        ...EMPTY_CREATE_FORM.features,
      },
    })
  }

  /* ==========================================================
     CREATE FIELD UPDATE

     IMPORTANT:
     Only Monthly is entered manually.

     Quarterly   = Monthly × 3
     Half-Yearly = Monthly × 6
     Yearly      = Monthly × 12
  ========================================================== */

  const updateCreateField = (
    key: string,
    value: any
  ) => {
    setCreateForm((current) => {
      const updated = {
        ...current,
        [key]: value,
      }

      /* ----------------------------------------------
         AUTO CALCULATE BILLING CYCLES
      ---------------------------------------------- */

      if (key === "monthly_price") {
        const monthly =
          Number(value) || 0

        if (monthly > 0) {
          updated.quarterly_price =
            String(monthly * 3)

          updated.half_yearly_price =
            String(monthly * 6)

          updated.yearly_price =
            String(monthly * 12)
        } else {
          updated.quarterly_price = ""
          updated.half_yearly_price = ""
          updated.yearly_price = ""
        }
      }

      return updated
    })
  }

  /* ==========================================================
     CREATE FEATURE
  ========================================================== */

  const toggleCreateFeature = (
    key: string
  ) => {
    setCreateForm((current) => ({
      ...current,

      features: {
        ...(current.features ?? {}),
        [key]:
          !current.features?.[key],
      },
    }))
  }

  /* ==========================================================
     CREATE PLAN
  ========================================================== */

  const createPlan = () => {
    const planName =
      String(createForm.plan ?? "")
        .trim()
        .toLowerCase()

    /* ----------------------------------------------
       PLAN NAME
    ---------------------------------------------- */

    if (!planName) {
      toast({
        variant: "destructive",
        title: "Plan name required",
        description:
          "Please enter a plan name.",
      })

      return
    }

    /* ----------------------------------------------
       DUPLICATE CHECK
    ---------------------------------------------- */

    const duplicate =
      plans.some(
        (plan: any) =>
          String(plan.plan)
            .trim()
            .toLowerCase() ===
          planName
      )

    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Plan already exists",
        description:
          "A plan with this name already exists.",
      })

      return
    }

    /* ----------------------------------------------
       MONTHLY PRICE
    ---------------------------------------------- */

    if (
      createForm.monthly_price === "" ||
      Number(createForm.monthly_price) <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Monthly price required",
        description:
          "Please enter a valid monthly price.",
      })

      return
    }

    /* ----------------------------------------------
       AUTO CALCULATED PRICE CHECK
    ---------------------------------------------- */

    const monthly =
      Number(createForm.monthly_price)

    const quarterly =
      monthly * 3

    const halfYearly =
      monthly * 6

    const yearly =
      monthly * 12

    /* ----------------------------------------------
       REQUIRED LIMITS
    ---------------------------------------------- */

    const limitFields = [
      "max_users",
      "max_branches",
      "max_products",
      "max_customers",
      "max_vendors",
      "max_orders",
    ]

    const missingLimit =
      limitFields.some(
        (key) =>
          createForm[key] === "" ||
          createForm[key] === undefined ||
          createForm[key] === null
      )

    if (missingLimit) {
      toast({
        variant: "destructive",
        title: "Usage limits required",
        description:
          "Please fill all usage limit fields.",
      })

      return
    }

    /* ----------------------------------------------
       CREATE API
    ---------------------------------------------- */

    createMutation.mutate(
      {
        data: {
          plan: planName,

          monthly_price:
            monthly,

          quarterly_price:
            quarterly,

          half_yearly_price:
            halfYearly,

          yearly_price:
            yearly,

          trial_days:
            Number(
              createForm.trial_days || 15
            ),

          max_users:
            Number(
              createForm.max_users
            ),

          max_branches:
            Number(
              createForm.max_branches
            ),

          max_products:
            Number(
              createForm.max_products
            ),

          max_customers:
            Number(
              createForm.max_customers
            ),

          max_vendors:
            Number(
              createForm.max_vendors
            ),

          max_orders:
            Number(
              createForm.max_orders
            ),

          features:
            createForm.features ?? {},

          is_active:
            Boolean(
              createForm.is_active
            ),
        } as any,
      },

      {
        onSuccess: () => {
          toast({
            title: "Plan created",

            description:
              `${planName} plan created successfully.`,
          })

          queryClient.invalidateQueries({
            queryKey:
              getListSubscriptionPlansQueryKey(),
          })

          closeCreate()
        },

        onError: (error: any) => {
          toast({
            variant: "destructive",

            title: "Create failed",

            description:
              error?.response?.data?.message ??
              error?.message ??
              "Could not create the plan.",
          })
        },
      }
    )
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div
      className="-mt-6 min-h-full space-y-6 bg-background"
      style={{
        fontFamily:
          "Times New Roman, Times, serif",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Plans Management
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure Pro & Premium pricing,
              limits and feature access.
              Changes apply platform-wide.
            </p>
          </div>
        </div>

        {/* ADD PLAN BUTTON */}

        <Button
          onClick={openCreate}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-7 w-32" />
              </CardHeader>

              <CardContent className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!isLoading && error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Layers className="mb-4 h-10 w-10 text-destructive" />

            <h3 className="text-lg font-bold">
              Failed to load plans
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Please check the subscription
              plans API.
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey:
                    getListSubscriptionPlansQueryKey(),
                })
              }
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* =====================================================
          PLAN CARDS
      ===================================================== */}

      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan: any) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() =>
                openEdit(plan)
              }
            />
          ))}

          {plans.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="mb-4 h-12 w-12 text-muted-foreground/40" />

                <h3 className="text-lg font-bold">
                  No plans configured
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first
                  subscription plan.
                </p>

                <Button
                  className="mt-5 gap-2"
                  onClick={openCreate}
                >
                  <Plus className="h-4 w-4" />
                  Add New Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* =====================================================
          ADD NEW PLAN DIALOG
      ===================================================== */}

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCreate()
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />

              Add New Subscription Plan
            </DialogTitle>

            <DialogDescription>
              Create a new plan with pricing,
              limits and feature access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">

            {/* =================================================
                PLAN NAME
            ================================================= */}

            <div className="space-y-1.5">
              <Label
                htmlFor="create-plan"
                className="text-xs font-semibold uppercase tracking-wide"
              >
                Plan Name
              </Label>

              <Input
                id="create-plan"
                placeholder="Example: Enterprise"
                value={
                  createForm.plan ?? ""
                }
                onChange={(e) =>
                  updateCreateField(
                    "plan",
                    e.target.value
                  )
                }
              />

              <p className="text-xs text-muted-foreground">
                Plan name must be unique.
              </p>
            </div>

            {/* =================================================
                BILLING PRICING
            ================================================= */}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Billing Cycle Pricing
              </Label>

              <p className="text-xs text-muted-foreground">
                Enter the monthly price.
                Other billing cycles will be
                calculated automatically.
              </p>

              <div className="grid grid-cols-2 gap-3">

                {/* MONTHLY */}

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Monthly
                  </Label>

                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="number"
                      min={0}
                      className="pl-8"
                      placeholder="799"
                      value={
                        createForm.monthly_price ??
                        ""
                      }
                      onChange={(e) =>
                        updateCreateField(
                          "monthly_price",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Enter manually
                  </p>
                </div>

                {/* QUARTERLY */}

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Quarterly
                  </Label>

                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="number"
                      readOnly
                      className="bg-muted/40 pl-8"
                      value={
                        createForm.quarterly_price ??
                        ""
                      }
                      placeholder="Auto"
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Monthly × 3
                  </p>
                </div>

                {/* HALF YEARLY */}

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Half-Yearly
                  </Label>

                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="number"
                      readOnly
                      className="bg-muted/40 pl-8"
                      value={
                        createForm.half_yearly_price ??
                        ""
                      }
                      placeholder="Auto"
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Monthly × 6
                  </p>
                </div>

                {/* YEARLY */}

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Yearly
                  </Label>

                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="number"
                      readOnly
                      className="bg-muted/40 pl-8"
                      value={
                        createForm.yearly_price ??
                        ""
                      }
                      placeholder="Auto"
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Monthly × 12
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                TRIAL
            ================================================= */}

            <div className="space-y-1.5">
              <Label
                htmlFor="create-trial-days"
                className="text-xs font-semibold uppercase tracking-wide"
              >
                Free Trial (days)
              </Label>

              <Input
                id="create-trial-days"
                type="number"
                min={0}
                className="w-32"
                value={
                  createForm.trial_days ??
                  "15"
                }
                onChange={(e) =>
                  updateCreateField(
                    "trial_days",
                    e.target.value
                  )
                }
              />
            </div>

            {/* =================================================
                USAGE LIMITS
            ================================================= */}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Usage Limits
              </Label>

              <p className="text-xs text-muted-foreground">
                Use -1 for unlimited.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {LIMIT_FIELDS.map((field) => {
                  const Icon =
                    field.icon

                  return (
                    <div
                      key={field.key}
                      className="space-y-1.5"
                    >
                      <Label className="flex items-center gap-1.5 text-xs">
                        <Icon className="h-3.5 w-3.5" />

                        {field.label}
                      </Label>

                      <Input
                        type="number"
                        value={
                          createForm[
                            field.key
                          ] ?? ""
                        }
                        onChange={(e) =>
                          updateCreateField(
                            field.key,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Feature Access
              </Label>

              <div className="space-y-2 rounded-lg border p-3">
                {FEATURE_KEYS.map(
                  (feature) => (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">
                        {feature.label}
                      </span>

                      <Switch
                        checked={
                          Boolean(
                            createForm
                              .features?.[
                              feature.key
                            ]
                          )
                        }
                        onCheckedChange={() =>
                          toggleCreateFeature(
                            feature.key
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* =================================================
                ACTIVE
            ================================================= */}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">
                  Plan Active
                </p>

                <p className="text-xs text-muted-foreground">
                  Inactive plans cannot be
                  selected for new
                  subscriptions.
                </p>
              </div>

              <Switch
                checked={Boolean(
                  createForm.is_active
                )}
                onCheckedChange={(value) =>
                  updateCreateField(
                    "is_active",
                    value
                  )
                }
              />
            </div>
          </div>

          {/* =================================================
              CREATE FOOTER
          ================================================= */}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCreate}
              disabled={
                createMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              onClick={createPlan}
              disabled={
                createMutation.isPending
              }
              className="gap-2"
            >
              <Save className="h-4 w-4" />

              {createMutation.isPending
                ? "Creating..."
                : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          EDIT PLAN DIALOG
      ===================================================== */}

      <Dialog
        open={Boolean(editingPlan)}
        onOpenChange={(open) => {
          if (!open) {
            closeEdit()
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Edit{" "}
              {editingPlan?.plan}

              {editingPlan?.plan ===
                "premium" && (
                <Sparkles className="h-4 w-4 text-amber-500" />
              )}
            </DialogTitle>

            <DialogDescription>
              Update pricing, trial length,
              usage limits and feature
              access for this plan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">

            {/* PRICING */}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Billing Cycle Pricing
              </Label>

              <div className="grid grid-cols-2 gap-3">
                {PRICE_FIELDS.map(
                  (field) => (
                    <div
                      key={field.key}
                      className="space-y-1.5"
                    >
                      <Label className="text-xs">
                        {field.label}
                      </Label>

                      <div className="relative">
                        <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          type="number"
                          min={0}
                          className="pl-8"
                          value={
                            form[
                              field.key
                            ] ?? ""
                          }
                          onChange={(e) =>
                            updateField(
                              field.key,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* TRIAL */}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Free Trial (days)
              </Label>

              <Input
                type="number"
                min={0}
                className="w-32"
                value={
                  form.trial_days ?? ""
                }
                onChange={(e) =>
                  updateField(
                    "trial_days",
                    e.target.value
                  )
                }
              />
            </div>

            {/* LIMITS */}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Usage Limits
              </Label>

              <p className="text-xs text-muted-foreground">
                Use -1 for unlimited.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {LIMIT_FIELDS.map(
                  (field) => {
                    const Icon =
                      field.icon

                    return (
                      <div
                        key={field.key}
                        className="space-y-1.5"
                      >
                        <Label className="flex items-center gap-1.5 text-xs">
                          <Icon className="h-3.5 w-3.5" />

                          {field.label}
                        </Label>

                        <Input
                          type="number"
                          value={
                            form[
                              field.key
                            ] ?? ""
                          }
                          onChange={(e) =>
                            updateField(
                              field.key,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )
                  }
                )}
              </div>
            </div>

            {/* FEATURES */}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Feature Access
              </Label>

              <div className="space-y-2 rounded-lg border p-3">
                {FEATURE_KEYS.map(
                  (feature) => (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">
                        {feature.label}
                      </span>

                      <Switch
                        checked={
                          Boolean(
                            form.features?.[
                              feature.key
                            ]
                          )
                        }
                        onCheckedChange={() =>
                          toggleFeature(
                            feature.key
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ACTIVE */}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">
                  Plan Active
                </p>

                <p className="text-xs text-muted-foreground">
                  Inactive plans cannot be
                  selected for new
                  subscriptions.
                </p>
              </div>

              <Switch
                checked={Boolean(
                  form.is_active
                )}
                onCheckedChange={(value) =>
                  updateField(
                    "is_active",
                    value
                  )
                }
              />
            </div>
          </div>

          {/* EDIT FOOTER */}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEdit}
            >
              Cancel
            </Button>

            <Button
              onClick={saveChanges}
              disabled={
                updateMutation.isPending
              }
              className="gap-2"
            >
              <Save className="h-4 w-4" />

              {updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ============================================================
   PLAN CARD
============================================================ */

function PlanCard({
  plan,
  onEdit,
}: {
  plan: any
  onEdit: () => void
}) {
  const isPremium =
    plan.plan === "premium"

  return (
    <Card
      className={`overflow-hidden border-border/70 shadow-sm ${
        isPremium
          ? "ring-1 ring-amber-300/60"
          : ""
      }`}
    >
      {/* HEADER */}

      <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold capitalize">
            {plan.plan}

            {isPremium && (
              <Sparkles className="h-4 w-4 text-amber-500" />
            )}
          </CardTitle>

          <CardDescription className="mt-1">
            {plan.trial_days ?? 15}-day free trial
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              plan.is_active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }
          >
            {plan.is_active
              ? "Active"
              : "Inactive"}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* CONTENT */}

      <CardContent className="space-y-5 pt-5">

        {/* PRICING */}

        <div className="grid grid-cols-2 gap-3">
          {PRICE_FIELDS.map(
            (field) => (
              <div
                key={field.key}
                className="rounded-lg border bg-muted/20 p-3"
              >
                <p className="text-xs text-muted-foreground">
                  {field.label}
                </p>

                <p className="mt-1 text-lg font-bold">
                  {formatAmount(
                    plan[field.key]
                  )}
                </p>
              </div>
            )
          )}
        </div>

        {/* LIMITS */}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Limits
          </p>

          <div className="grid grid-cols-3 gap-2">
            {LIMIT_FIELDS.map(
              (field) => {
                const Icon =
                  field.icon

                const value =
                  Number(
                    plan[field.key]
                  ) === -1
                    ? "∞"
                    : plan[field.key]

                return (
                  <div
                    key={field.key}
                    className="flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                    <span className="truncate text-muted-foreground">
                      {field.label}:
                    </span>

                    <span className="font-semibold">
                      {value}
                    </span>
                  </div>
                )
              }
            )}
          </div>
        </div>

        {/* FEATURES */}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Features
          </p>

          <div className="flex flex-wrap gap-1.5">
            {FEATURE_KEYS.map(
              (feature) => {
                const enabled =
                  Boolean(
                    plan.features?.[
                      feature.key
                    ]
                  )

                return (
                  <Badge
                    key={feature.key}
                    variant="outline"
                    className={
                      enabled
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-400 line-through"
                    }
                  >
                    {feature.label}
                  </Badge>
                )
              }
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}