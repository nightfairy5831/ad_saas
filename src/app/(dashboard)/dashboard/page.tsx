'use client'

import { useState, useEffect } from 'react';
import Request from '@/lib/request';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, Globe, Code, Zap, Grid3X3, List, Eye, EyeOff, Settings, Check, X } from 'lucide-react';
import { CampaignCard } from '@/components/CampaignCard';
import { CampaignRowView } from '@/components/CampaignRowView';
import { CampaignCreator } from '@/components/CampaignCreator';
import { CopyVariationEditor } from '@/components/CopyVariationEditor';
import { UTMGenerator } from '@/components/UTMGenerator';
import { toast } from 'react-toastify';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  copyVariations: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  clicks: number;
  conversions: number;
  archived: boolean;
  landingPageUrl?: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  timezone: string;
  projectName: string | null;
  primaryDomain: string | null;
  siteId: string | null;
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [hideTestCampaign, setHideTestCampaign] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [landingPageUrl, setLandingPageUrl] = useState('https://yourlandingpage.com');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load campaigns and user profile
  useEffect(() => {
    loadCampaigns();
    loadUserProfile();
    // Load saved landing page URL from localStorage
    const savedUrl = localStorage.getItem('landingPageUrl');
    if (savedUrl) {
      setLandingPageUrl(savedUrl);
    }
  }, []); 

  const loadUserProfile = async () => {
    try {
      const response = await Request.Get('/api/user/profile');
      setUserProfile(response);
      // Update landingPageUrl with primaryDomain if available
      if (response.primaryDomain) {
        setLandingPageUrl(response.primaryDomain);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };


  const loadCampaigns = async () => {
    try {
      // Load campaigns from API
      const userCampaigns: Campaign[] = await Request.Get('/api/campaigns');

      // Add demo test campaign if not hidden
      const testCampaign: Campaign = {
        id: 'test-campaign',
        name: 'Test Campaign',
        status: 'active',
        utmSource: 'demo',
        utmMedium: 'test',
        utmCampaign: 'example',
        copyVariations: {
          headline: 'This is a test campaign',
          subheadline: 'You can hide this demo campaign using the toggle above',
          cta: 'Try Demo'
        },
        clicks: 125,
        conversions: 12,
        archived: false
      };
      
      // Always put test campaign at the end
      setCampaigns([...userCampaigns, testCampaign]);
      console.log('Loaded campaigns:', [...userCampaigns, testCampaign]);
    } catch (error) {
      console.error('Error in loadCampaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true);
    setSelectedCampaign(null);
  };

  const handleSaveNewCampaign = async (newCampaign: Campaign) => {
    try {
      // Create campaign via API
      const savedCampaign: Campaign = await Request.Post('/api/campaigns', newCampaign);

      // Update state - keep test campaign at the end
      setCampaigns(prev => {
        const withoutTest = prev.filter(c => c.id !== 'test-campaign');
        const testCampaign = prev.find(c => c.id === 'test-campaign');
        return testCampaign ? [savedCampaign, ...withoutTest, testCampaign] : [savedCampaign, ...withoutTest];
      });
      
      setIsCreatingCampaign(false);
      setSelectedCampaign(savedCampaign);
      
      toast.success('Campaign created successfully!', {theme: 'colored'});
    } catch (error: any) {
      console.error('Error saving campaign:', error);
      
      // Handle duplicate UTM parameters error
      if (error?.response?.status === 409) {
        toast.error('A campaign with these UTM parameters already exists. Please use different values.', {theme: 'colored'});
      } else {
        toast.error('Failed to create campaign. Please try again.', {theme: 'colored'});
      }
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('editor');
  };

  const handleUpdateCampaign = async (updatedCampaign: Campaign) => {
    try {
      // Handle test campaign (local only)
      if (updatedCampaign.id === 'test-campaign') {
        setCampaigns(prev => prev.map(c => 
          c.id === updatedCampaign.id ? updatedCampaign : c
        ));
        setSelectedCampaign(updatedCampaign);
        return;
      }

      // Update campaign via API
      const savedCampaign: Campaign = await Request.Put('/api/campaigns', updatedCampaign);

      // Update state
      setCampaigns(prev => prev.map(c => 
        c.id === savedCampaign.id ? savedCampaign : c
      ));
      setSelectedCampaign(savedCampaign);
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleCancelCreateCampaign = () => {
    setIsCreatingCampaign(false);
  };

  const handleSaveLandingPageUrl = () => {
    localStorage.setItem('landingPageUrl', landingPageUrl);
    setIsEditingUrl(false);
  };

  const handleCancelEditUrl = () => {
    const savedUrl = localStorage.getItem('landingPageUrl') || 'https://yourlandingpage.com';
    setLandingPageUrl(savedUrl);
    setIsEditingUrl(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your UTM-driven copy personalization campaigns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Landing Page URL Configuration */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Funnel URL:</Label>
                  {isEditingUrl ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={landingPageUrl}
                        onChange={(e) => setLandingPageUrl(e.target.value)}
                        placeholder={userProfile?.primaryDomain || "https://yourlandingpage.com"}
                        className="text-sm font-mono h-8"
                      />
                      <Button size="sm" onClick={handleSaveLandingPageUrl} className="h-8 w-8 p-0">
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEditUrl} className="h-8 w-8 p-0">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded block flex-1 truncate">
                        {userProfile?.primaryDomain || landingPageUrl}
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingUrl(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Site ID Quick Access */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Site ID:</Label>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded block">
                    {userProfile?.siteId || 'Not configured'}
                  </code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const siteId = userProfile?.siteId || 'Not configured';
                    navigator.clipboard.writeText(siteId);
                    toast.success('Site ID copied to clipboard!', { theme: 'colored' });
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleCreateCampaign}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
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
            <div className="text-2xl font-bold text-foreground">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversions
            </CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
            </div>
            <p className="text-xs text-green-600">
              +8.3% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Variations
            </CardTitle>
            <Code className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {campaigns.filter(c => c.status === 'active').length * 3}
            </div>
            <p className="text-xs text-muted-foreground">
              3 variations per campaign
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {isCreatingCampaign ? (
        <CampaignCreator
          onSave={handleSaveNewCampaign}
          onCancel={handleCancelCreateCampaign}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="editor">Copy Editor</TabsTrigger>
            <TabsTrigger value="utm">UTM Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={hideTestCampaign ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => setHideTestCampaign(!hideTestCampaign)}
                    className="text-sm"
                  >
                    {hideTestCampaign ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {hideTestCampaign ? 'Show' : 'Hide'} Test Campaign
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'row' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('row')}
                >
                  <List className="w-4 h-4 mr-2" />
                  Row
                </Button>
              </div>
            </div>

            {/* Campaigns Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {campaigns
                  .filter(campaign => !(hideTestCampaign && campaign.id === 'test-campaign'))
                  .map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onClick={() => setSelectedCampaign(campaign)}
                      onEdit={() => handleEditCampaign(campaign)}
                      onViewAnalytics={() => {
                        window.location.href = '/analytics';
                      }}
                      baseUrl={campaign.landingPageUrl || landingPageUrl}
                    />
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Row View Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                  <div className="col-span-3">Campaign</div>
                  <div className="col-span-3">Copy Preview</div>
                  <div className="col-span-2 text-center">Clicks</div>
                  <div className="col-span-2 text-center">Conv. Rate</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>
                
                {campaigns
                  .filter(campaign => !(hideTestCampaign && campaign.id === 'test-campaign'))
                  .map((campaign) => (
                    <CampaignRowView
                      key={campaign.id}
                      campaign={campaign}
                      onClick={() => setSelectedCampaign(campaign)}
                      onEdit={() => handleEditCampaign(campaign)}
                      onViewAnalytics={() => {
                        window.location.href = '/analytics';
                      }}
                      baseUrl={campaign.landingPageUrl || landingPageUrl}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="editor">
            <CopyVariationEditor 
              campaign={selectedCampaign} 
              onSave={handleUpdateCampaign}
              onCancel={() => setSelectedCampaign(null)}
            />
          </TabsContent>

          <TabsContent value="utm">
            <UTMGenerator landingPageUrl={landingPageUrl} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}