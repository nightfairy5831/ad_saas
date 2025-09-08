import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, MousePointerClick, Eye, Zap } from 'lucide-react';

const Analytics = () => {
  const campaignMetrics = [
    {
      name: 'Facebook Lead Gen',
      source: 'facebook',
      clicks: 1250,
      conversions: 89,
      conversionRate: 7.1,
      revenue: 4450,
      trend: '+12%'
    },
    {
      name: 'Google Ads - Enterprise',
      source: 'google',
      clicks: 890,
      conversions: 67,
      conversionRate: 7.5,
      revenue: 6700,
      trend: '+8%'
    },
    {
      name: 'Email Campaign',
      source: 'email',
      clicks: 456,
      conversions: 34,
      conversionRate: 7.5,
      revenue: 1700,
      trend: '+15%'
    }
  ];

  const totalClicks = campaignMetrics.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaignMetrics.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = campaignMetrics.reduce((sum, c) => sum + c.revenue, 0);
  const avgConversionRate = (totalConversions / totalClicks * 100).toFixed(1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track performance across all your UTM campaigns
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalConversions}</div>
            <p className="text-xs text-green-600">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Conv. Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgConversionRate}%</div>
            <p className="text-xs text-green-600">+2.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">+24% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="copy">Copy Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Detailed metrics for each UTM campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignMetrics.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {campaign.source}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-8 text-right">
                      <div>
                        <div className="text-sm text-muted-foreground">Clicks</div>
                        <div className="font-semibold">{campaign.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Conversions</div>
                        <div className="font-semibold">{campaign.conversions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Conv. Rate</div>
                        <div className="font-semibold text-green-600">{campaign.conversionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                        <div className="font-semibold text-green-600">${campaign.revenue.toLocaleString()}</div>
                        <div className="text-xs text-green-600">{campaign.trend}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Breakdown by UTM source and medium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-accent/50 rounded-lg">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">42%</div>
                    <div className="text-sm text-muted-foreground">Facebook Ads</div>
                  </div>
                  <div className="text-center p-6 bg-accent/50 rounded-lg">
                    <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">31%</div>
                    <div className="text-sm text-muted-foreground">Google Ads</div>
                  </div>
                  <div className="text-center p-6 bg-accent/50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">27%</div>
                    <div className="text-sm text-muted-foreground">Email</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copy">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Copy Variation Performance</CardTitle>
              <CardDescription>
                Which headlines and CTAs perform best
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">"Transform Your Marketing ROI in 30 Days"</h3>
                    <Badge className="bg-green-600 text-white">Best Performer</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-semibold ml-2 text-green-600">8.2%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Clicks:</span>
                      <span className="font-semibold ml-2">1,250</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-semibold ml-2 text-green-600">$4,450</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">"Enterprise-Grade Landing Page Optimization"</h3>
                    <Badge variant="outline">High Performer</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-semibold ml-2">7.5%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Clicks:</span>
                      <span className="font-semibold ml-2">890</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-semibold ml-2">$6,700</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;