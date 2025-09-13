'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, MousePointerClick, Eye, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import Request from '@/lib/request';

interface CampaignMetric {
  name: string;
  source: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  headline?: string;
  subheadline?: string;
  cta?: string;
}

const Analytics = () => {
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Request.Get('/api/analytics')
      .then(data => {
        setCampaignMetrics(data.campaignMetrics || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, []);

  const totalClicks = campaignMetrics.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaignMetrics.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = campaignMetrics.reduce((sum, c) => sum + c.revenue, 0);
  const avgConversionRate = (totalConversions / totalClicks * 100).toFixed(1);

  // Calculate traffic sources breakdown
  const sourceGroups = campaignMetrics.reduce((acc, campaign) => {
    const source = campaign.source || 'Unknown';
    if (!acc[source]) {
      acc[source] = 0;
    }
    acc[source] += campaign.clicks;
    return acc;
  }, {} as Record<string, number>);

  const trafficSources = Object.entries(sourceGroups)
    .map(([source, clicks]) => ({
      source,
      clicks,
      percentage: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3); // Top 3 sources

  // Calculate copy performance (campaigns with headlines/copy)
  const copyPerformance = campaignMetrics
    .filter(campaign => campaign.headline || campaign.subheadline || campaign.cta)
    .map(campaign => ({
      headline: campaign.headline || campaign.name,
      subheadline: campaign.subheadline,
      cta: campaign.cta,
      conversionRate: campaign.conversionRate,
      clicks: campaign.clicks,
      conversions: campaign.conversions,
      revenue: campaign.revenue
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate);

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
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : campaignMetrics.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No campaign data yet</div>
              ) : (
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : trafficSources.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No traffic source data yet</div>
                ) : (
                  <div className="grid grid-cols-3 gap-6">
                    {trafficSources.map((source, index) => {
                      const icons = [Users, Eye, BarChart3];
                      const IconComponent = icons[index] || BarChart3;
                      return (
                        <div key={source.source} className="text-center p-6 bg-accent/50 rounded-lg">
                          <IconComponent className="w-8 h-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">{source.percentage}%</div>
                          <div className="text-sm text-muted-foreground">{source.source}</div>
                          <div className="text-xs text-muted-foreground mt-1">{source.clicks} clicks</div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : copyPerformance.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No copy performance data yet</div>
              ) : (
                <div className="space-y-4">
                  {copyPerformance.map((copy, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">"{copy.headline}"</h3>
                        <Badge className={index === 0 ? "bg-green-600 text-white" : "variant-outline"}>
                          {index === 0 ? "Best Performer" : "High Performer"}
                        </Badge>
                      </div>
                      {copy.subheadline && (
                        <p className="text-sm text-muted-foreground mb-3">"{copy.subheadline}"</p>
                      )}
                      {copy.cta && (
                        <p className="text-sm text-blue-600 mb-3">CTA: "{copy.cta}"</p>
                      )}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Conversion Rate:</span>
                          <span className={`font-semibold ml-2 ${copy.conversionRate > 0 ? 'text-green-600' : ''}`}>
                            {copy.conversionRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clicks:</span>
                          <span className="font-semibold ml-2">{copy.clicks.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className={`font-semibold ml-2 ${copy.revenue > 0 ? 'text-green-600' : ''}`}>
                            ${copy.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;