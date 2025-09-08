'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, Eye, Edit3, Copy, ExternalLink, Monitor, Smartphone, Tablet, Archive, ArchiveRestore, EyeOff } from 'lucide-react';

export default function LandingPages() {
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showArchived, setShowArchived] = useState(false);
  
  const campaigns = [
    {
      id: '1',
      name: 'Facebook Lead Gen Campaign',
      status: 'active',
      utm_source: 'facebook',
      utm_medium: 'social',
      utm_campaign: 'lead-gen-q1',
      clicks: 1250,
      conversions: 89,
      archived: false
    },
    {
      id: '2',
      name: 'Google Ads Enterprise',
      status: 'active',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'enterprise-solution',
      clicks: 890,
      conversions: 67,
      archived: false
    },
    {
      id: '3',
      name: 'Email Newsletter Campaign',
      status: 'paused',
      utm_source: 'email',
      utm_medium: 'newsletter',
      utm_campaign: 'monthly-update',
      clicks: 456,
      conversions: 34,
      archived: false
    }
  ];
  
  const filteredCampaigns = showArchived 
    ? campaigns.filter(c => c.archived) 
    : campaigns.filter(c => !c.archived);
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active' && !c.archived);
  const totalVisitors = campaigns.filter(c => !c.archived).reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.filter(c => !c.archived).reduce((sum, c) => sum + c.conversions, 0);
  const avgConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 text-white';
      case 'draft':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Landing Pages</h1>
          <p className="text-muted-foreground mt-2">
            Manage and optimize your landing pages with UTM-based copy personalization
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? <EyeOff className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Landing Page
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => !c.archived).length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.archived).length} archived
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Conv. Rate
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversions
            </CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              {totalVisitors} total visitors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {showArchived ? 'Archived Campaigns' : 'Active Campaigns'}
            </h2>
          </div>
          
          <div className="space-y-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {showArchived ? 'No archived campaigns found.' : 'No active campaigns found.'}
                </p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <h3 className="font-semibold">{campaign.name}</h3>
                      </div>
                      {campaign.archived && (
                        <Badge variant="outline" className="text-xs">
                          Archived
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Source:</p>
                        <p className="font-medium">{campaign.utm_source}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Medium:</p>
                        <p className="font-medium">{campaign.utm_medium}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Campaign:</p>
                        <p className="font-medium">{campaign.utm_campaign}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Clicks:</p>
                        <p className="font-bold">{campaign.clicks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions:</p>
                        <p className="font-bold text-green-600">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conv. Rate:</p>
                        <p className="font-bold">
                          {campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : '0.0'}%
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy UTM
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Live Preview & Setup Guide */}
        <div className="space-y-6">
          {/* Live Preview */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <CardDescription>Preview how your landing pages look across devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Selector */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant={selectedDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice('desktop')}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={selectedDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice('tablet')}
                >
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </Button>
                <Button
                  variant={selectedDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
              </div>

              {/* Preview Frame */}
              <div className="flex justify-center">
                <div 
                  className={`
                    bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg
                    ${selectedDevice === 'desktop' ? 'w-full h-96' : ''}
                    ${selectedDevice === 'tablet' ? 'w-80 h-96' : ''}
                    ${selectedDevice === 'mobile' ? 'w-64 h-96' : ''}
                  `}
                >
                  <iframe
                    src="/demo-funnel.html"
                    className="w-full h-full border-0"
                    title="Landing Page Preview"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Guide */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">How To Make It Work</CardTitle>
              <CardDescription>Follow these steps to set up copy personalization on your landing pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Add Widget Script</h4>
                    <p className="text-sm text-muted-foreground">Include our script in your landing page HTML</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Tag Elements</h4>
                    <p className="text-sm text-muted-foreground">Add data-copy attributes to personalize text</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Use UTM Links</h4>
                    <p className="text-sm text-muted-foreground">Drive traffic using your campaign UTM links</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Test Demo
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Copy Widget Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}