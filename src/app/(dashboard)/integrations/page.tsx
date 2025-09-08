'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Settings, 
  Zap,
  Globe,
  Mail,
  BarChart3,
  Webhook
} from 'lucide-react';

export default function Integrations() {
  const [activeTab, setActiveTab] = useState('all');

  const integrations = [
    {
      id: '1',
      name: 'GoHighLevel',
      description: 'Connect your funnels and landing pages with UTM-based copy personalization',
      category: 'funnel-builder',
      status: 'connected',
      icon: Globe,
      setupSteps: ['Add tracking code', 'Configure webhooks', 'Test integration'],
      features: ['Dynamic copy swapping', 'UTM parameter detection', 'Conversion tracking']
    },
    {
      id: '2', 
      name: 'ClickFunnels',
      description: 'Seamlessly integrate with ClickFunnels for personalized funnel experiences',
      category: 'funnel-builder',
      status: 'available',
      icon: Zap,
      setupSteps: ['Install widget', 'Map UTM parameters', 'Configure variations'],
      features: ['Real-time personalization', 'A/B testing', 'Analytics integration']
    },
    {
      id: '3',
      name: 'Leadpages',
      description: 'Enhance your Leadpages with intelligent copy personalization',
      category: 'funnel-builder', 
      status: 'available',
      icon: Globe,
      setupSteps: ['Add JavaScript code', 'Set up UTM tracking', 'Define copy rules'],
      features: ['Drag-and-drop integration', 'Mobile optimization', 'Performance tracking']
    },
    {
      id: '4',
      name: 'Google Analytics',
      description: 'Track UTM campaign performance and conversion attribution',
      category: 'analytics',
      status: 'connected',
      icon: BarChart3,
      setupSteps: ['Connect GA account', 'Set up goals', 'Configure UTM tracking'],
      features: ['Campaign attribution', 'Conversion tracking', 'Custom dimensions']
    },
    {
      id: '5',
      name: 'Facebook Pixel',
      description: 'Track Facebook ad performance and optimize for better targeting',
      category: 'analytics',
      status: 'available',
      icon: BarChart3,
      setupSteps: ['Add Pixel ID', 'Configure events', 'Test tracking'],
      features: ['Conversion tracking', 'Custom audiences', 'Lookalike audiences']
    },
    {
      id: '6',
      name: 'Zapier',
      description: 'Connect with 5000+ apps to automate your marketing workflows',
      category: 'automation',
      status: 'connected',
      icon: Zap,
      setupSteps: ['Create Zap', 'Set triggers', 'Configure actions'],
      features: ['Workflow automation', 'Data synchronization', 'Multi-app connections']
    },
    {
      id: '7',
      name: 'Webhooks',
      description: 'Send real-time data to your custom endpoints and systems',
      category: 'developer',
      status: 'available',
      icon: Webhook,
      setupSteps: ['Configure endpoint', 'Set up authentication', 'Test webhook'],
      features: ['Real-time notifications', 'Custom payloads', 'Retry logic']
    },
    {
      id: '8',
      name: 'Mailchimp',
      description: 'Sync lead data and create targeted email campaigns',
      category: 'email',
      status: 'available',
      icon: Mail,
      setupSteps: ['Connect account', 'Map fields', 'Set up automation'],
      features: ['List segmentation', 'Automated campaigns', 'Performance tracking']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-600 text-white';
      case 'available':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'connected' ? CheckCircle : AlertCircle;
  };

  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect Ad SaaS with your favorite tools and platforms
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
            <Plug className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.length - connectedCount}
            </div>
            <p className="text-xs text-muted-foreground">Ready to connect</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Integration types</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Data Synced
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4K</div>
            <p className="text-xs text-green-600">Events today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="funnel-builder">Funnel Builders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              const StatusIcon = getStatusIcon(integration.status);
              
              return (
                <Card key={integration.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {integration.name}
                          </CardTitle>
                          <Badge className={getStatusColor(integration.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {integration.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Setup Steps */}
                    {integration.status === 'available' && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Setup:</h4>
                        <ol className="text-xs text-muted-foreground space-y-1">
                          {integration.setupSteps.map((step, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-4 h-4 bg-muted rounded-full flex items-center justify-center text-xs mr-2">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="w-3 h-3 mr-1" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                          size="sm"
                        >
                          <Plug className="w-3 h-3 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}