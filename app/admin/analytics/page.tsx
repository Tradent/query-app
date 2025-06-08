import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminChart } from "@/components/admin/admin-chart"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"

export default function AdminAnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <AdminHeader title="Analytics" description="Detailed platform analytics and insights" />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminMetricCard
              title="Total Searches"
              value="245,721"
              description="+12.5% from last month"
              trend="up"
              percentage={12.5}
            />
            <AdminMetricCard
              title="Active Users"
              value="32,489"
              description="+8.2% from last month"
              trend="up"
              percentage={8.2}
            />
            <AdminMetricCard
              title="Verification Rate"
              value="78.3%"
              description="+5.7% from last month"
              trend="up"
              percentage={5.7}
            />
            <AdminMetricCard
              title="Avg. Response Time"
              value="235ms"
              description="-15.3% from last month"
              trend="down"
              percentage={15.3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Platform Usage</CardTitle>
                <CardDescription>Daily active users and searches over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AdminChart
                  type="line"
                  height={350}
                  data={[
                    { name: "Active Users", data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 95, 110, 130] },
                    { name: "Searches", data: [144, 155, 141, 167, 122, 143, 173, 189, 156, 178, 194, 215] },
                  ]}
                  categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Verification Distribution</CardTitle>
                <CardDescription>Distribution of verification results</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminChart
                  type="pie"
                  height={350}
                  data={[
                    { name: "Verified", data: [65] },
                    { name: "Suspicious", data: [25] },
                    { name: "Manipulated", data: [10] },
                  ]}
                  categories={["Distribution"]}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AdminChart
                  type="area"
                  height={300}
                  data={[{ name: "New Users", data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 106] }]}
                  categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Search Categories</CardTitle>
                <CardDescription>Distribution of search categories</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminChart
                  type="bar"
                  height={300}
                  data={[
                    { name: "Images", data: [44, 55, 57, 56, 61, 58] },
                    { name: "Blockchain", data: [76, 85, 101, 98, 87, 105] },
                    { name: "Web", data: [35, 41, 36, 26, 45, 48] },
                    { name: "News", data: [25, 31, 26, 36, 25, 28] },
                  ]}
                  categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                  stacked={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Analytics</CardTitle>
              <CardDescription>Detailed search metrics and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Search analytics content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Analytics</CardTitle>
              <CardDescription>Image verification metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Verification analytics content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Analytics</CardTitle>
              <CardDescription>Blockchain validation metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Blockchain analytics content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>User behavior and demographic insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                User analytics content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
