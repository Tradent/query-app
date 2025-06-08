"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const generalFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteDescription: z.string().optional(),
  siteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  maxSearchResults: z.coerce.number().min(5).max(100),
  enableAIAnalysis: z.boolean().default(true),
  defaultSearchMode: z.enum(["all", "images", "blockchain", "web"]),
})

const securityFormSchema = z.object({
  enableCaptcha: z.boolean().default(true),
  maxLoginAttempts: z.coerce.number().min(3).max(10),
  sessionTimeout: z.coerce.number().min(15).max(120),
  enableTwoFactor: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  moderationLevel: z.enum(["low", "medium", "high"]),
})

const blockchainFormSchema = z.object({
  networkEndpoint: z.string().url({
    message: "Please enter a valid URL.",
  }),
  validatorRequirement: z.coerce.number().min(1).max(100),
  minStakeAmount: z.coerce.number().min(0),
  validationReward: z.coerce.number().min(0),
  enableAutoValidation: z.boolean().default(true),
})

type GeneralFormValues = z.infer<typeof generalFormSchema>
type SecurityFormValues = z.infer<typeof securityFormSchema>
type BlockchainFormValues = z.infer<typeof blockchainFormSchema>

export function AdminSettingsForm() {
  const generalForm = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "Query-SE",
      siteDescription: "Blockchain-powered search engine with image verification",
      siteUrl: "https://query-se.vercel.app",
      contactEmail: "admin@query-se.com",
      maxSearchResults: 50,
      enableAIAnalysis: true,
      defaultSearchMode: "all",
    },
  })

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      enableCaptcha: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      enableTwoFactor: false,
      allowRegistration: true,
      moderationLevel: "medium",
    },
  })

  const blockchainForm = useForm<BlockchainFormValues>({
    resolver: zodResolver(blockchainFormSchema),
    defaultValues: {
      networkEndpoint: "https://api.mainnet-beta.solana.com",
      validatorRequirement: 10,
      minStakeAmount: 1,
      validationReward: 0.05,
      enableAutoValidation: true,
    },
  })

  function onGeneralSubmit(data: GeneralFormValues) {
    console.log("General settings updated:", data)
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    console.log("Security settings updated:", data)
  }

  function onBlockchainSubmit(data: BlockchainFormValues) {
    console.log("Blockchain settings updated:", data)
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic platform settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-8">
                <FormField
                  control={generalForm.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>The name of your search platform</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generalForm.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>A brief description of your platform</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={generalForm.control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The URL of your platform</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Primary contact email</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={generalForm.control}
                    name="maxSearchResults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Search Results</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Maximum number of search results per page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="defaultSearchMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Search Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default search mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="images">Images</SelectItem>
                            <SelectItem value="blockchain">Blockchain</SelectItem>
                            <SelectItem value="web">Web</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Default search mode for new users</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={generalForm.control}
                  name="enableAIAnalysis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable AI Analysis</FormLabel>
                        <FormDescription>Use AI to analyze and detect manipulated images</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit">Save General Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure platform security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={securityForm.control}
                    name="maxLoginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Login Attempts</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Maximum number of login attempts before lockout</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>User session timeout in minutes</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={securityForm.control}
                  name="moderationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Moderation Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select moderation level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Level of automatic content moderation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="enableCaptcha"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable CAPTCHA</FormLabel>
                          <FormDescription>Require CAPTCHA verification for forms</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="enableTwoFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Two-Factor Authentication</FormLabel>
                          <FormDescription>Require two-factor authentication for admin access</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow User Registration</FormLabel>
                          <FormDescription>Allow new users to register on the platform</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Save Security Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="blockchain">
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Settings</CardTitle>
            <CardDescription>Configure blockchain integration settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...blockchainForm}>
              <form onSubmit={blockchainForm.handleSubmit(onBlockchainSubmit)} className="space-y-8">
                <FormField
                  control={blockchainForm.control}
                  name="networkEndpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network Endpoint</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Blockchain network RPC endpoint</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={blockchainForm.control}
                    name="validatorRequirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validator Requirement</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Minimum validators required</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={blockchainForm.control}
                    name="minStakeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stake Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Minimum stake required for validators</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={blockchainForm.control}
                    name="validationReward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validation Reward</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Reward amount for successful validations</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={blockchainForm.control}
                  name="enableAutoValidation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Auto-Validation</FormLabel>
                        <FormDescription>Automatically submit validation requests to the network</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit">Save Blockchain Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure API access and rate limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              API settings content will be displayed here
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Configure advanced platform settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Advanced settings content will be displayed here
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
