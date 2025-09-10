'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Globe,
  Save,
  Trash2,
  CreditCard,
  Loader2
} from 'lucide-react';
import Request from '@/lib/request';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    campaigns: true,
    analytics: true
  });

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@company.com',
    company: 'Acme Marketing',
    timezone: 'America/New_York'
  });

  const [projectInfo, setProjectInfo] = useState({
    name: 'My Marketing Campaigns',
    domain: 'https://mylandingpage.com',
    siteId: '',
    createdAt: ''
  });

  const [landingPages, setLandingPages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'production' | 'development'>('production');

  // Load saved project information and landing pages on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load project info from localStorage
      const savedProjectInfo = localStorage.getItem('projectInfo');
      if (savedProjectInfo) {
        try {
          const parsed = JSON.parse(savedProjectInfo);
          setProjectInfo(parsed);
        } catch (error) {
          console.error('Failed to parse saved project info:', error);
        }
      }

      // Load landing pages from API
      try {
        const data = await Request.Get('/api/landing-pages');
        setLandingPages(data.landingPages || []);
      } catch (error) {
        console.error('Failed to load landing pages:', error);
      }

      // Load API keys
      try {
        const data = await Request.Get('/api/api-keys');
        setApiKeys(data.apiKeys || []);
      } catch (error) {
        console.error('Failed to load API keys:', error);
      }
    };

    loadData();
  }, []);

  const generateSiteId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `proj_${random}_${timestamp}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    
    // Generate site ID and created date only if not exists
    const updatedProjectInfo = { ...projectInfo };
    
    if (!updatedProjectInfo.siteId) {
      updatedProjectInfo.siteId = generateSiteId();
    }
    
    if (!updatedProjectInfo.createdAt) {
      updatedProjectInfo.createdAt = new Date().toISOString();
    }

    try {
      // Save to database via API
      await Request.Put('/api/user/profile', {
        projectName: updatedProjectInfo.name,
        primaryDomain: updatedProjectInfo.domain,
        siteId: updatedProjectInfo.siteId
      });

      // Update state to trigger re-render
      setProjectInfo(updatedProjectInfo);

      // Keep localStorage as backup
      localStorage.setItem('projectInfo', JSON.stringify(updatedProjectInfo));
      
      // Show success toast
      toast.success('Project details saved successfully!', {theme: 'colored'});
      
      console.log('Project saved to database with Site ID:', updatedProjectInfo.siteId);
    } catch (error) {
      console.error('Failed to save project info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key', { theme: 'colored' });
      return;
    }

    setIsGeneratingKey(true);
    try {
      const response = await Request.Post('/api/api-keys', {
        name: newKeyName.trim(),
        type: newKeyType
      });

      // Check if API key of same type already exists and replace it
      setApiKeys(prev => {
        const existingKeyIndex = prev.findIndex(key => key.type === newKeyType);
        if (existingKeyIndex !== -1) {
          // Replace existing key of same type
          const updated = [...prev];
          updated[existingKeyIndex] = response.apiKey;
          return updated;
        } else {
          // Add new key if no existing key of this type
          return [...prev, response.apiKey];
        }
      });
      
      toast.success('API key generated successfully!', { theme: 'colored' });
      setShowNewKeyDialog(false);
      setNewKeyName('');
      setNewKeyType('production');
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error('Failed to generate API key. Please try again.', { theme: 'colored' });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      await Request.Delete(`/api/api-keys?id=${keyId}`);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success('API key deleted successfully!', { theme: 'colored' });
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key. Please try again.', { theme: 'colored' });
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!', { theme: 'colored' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* Project Details */}
        <TabsContent value="project">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-primary" />
                  <span>Site ID & Integration</span>
                </CardTitle>
                <CardDescription>
                  Your unique Site ID for embed code integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-base font-semibold text-primary">Your Site ID</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(projectInfo.siteId || 'No Site ID yet');
                      }}
                      disabled={!projectInfo.siteId}
                    >
                      Copy
                    </Button>
                  </div>
                  <code className="text-lg font-mono bg-muted px-3 py-2 rounded border block">
                    {projectInfo.siteId || 'No Site ID - Save project details first'}
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    {projectInfo.siteId ? 
                      '⚠️ Use this exact ID in your embed code on all landing pages' :
                      '💡 Set project name and primary domain, then save to generate Site ID'
                    }
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Quick Setup Guide:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Copy your Site ID above</li>
                    <li>2. Go to Integration Guide in sidebar</li>
                    <li>3. Replace YOUR_SITE_ID with your actual ID</li>
                    <li>4. Add embed code to your funnel pages</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Project Information</span>
                </CardTitle>
                <CardDescription>
                  Basic details about your CopyAI project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectInfo.name}
                    onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-url">Primary Domain</Label>
                  <Select 
                    value={projectInfo.domain} 
                    onValueChange={(value) => setProjectInfo({...projectInfo, domain: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {landingPages.length > 0 ? (
                        landingPages.map((url) => (
                          <SelectItem key={url} value={url}>
                            {url}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="https://yourdomain.com">
                          No landing pages available - Create one first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select from your created landing pages
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Created</Label>
                    <p className="font-medium">{formatDate(projectInfo.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <Badge variant="default" className="bg-green-600 text-white">
                      {projectInfo.siteId ? 'Active' : 'Setup Required'}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSaveProject}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Project Details'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Auto-save Campaigns</Label>
                      <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Advanced Features</Label>
                      <p className="text-sm text-muted-foreground">Show advanced configuration options</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Campaign Updates</Label>
                    <p className="text-sm text-muted-foreground">Notifications about campaign performance</p>
                  </div>
                  <Switch 
                    checked={notifications.campaigns}
                    onCheckedChange={(checked) => setNotifications({...notifications, campaigns: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Analytics Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly performance reports</p>
                  </div>
                  <Switch 
                    checked={notifications.analytics}
                    onCheckedChange={(checked) => setNotifications({...notifications, analytics: checked})}
                  />
                </div>
              </div>
              
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Password & Security</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button variant="outline" className="w-full">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base">2FA Status</Label>
                    <span className="text-sm text-muted-foreground">Disabled</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Secure your account with two-factor authentication using an authenticator app.
                  </p>
                  <Button variant="outline" className="w-full">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Subscription</span>
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-primary">Pro Plan</h3>
                    <span className="text-2xl font-bold text-primary">$49/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Advanced features, unlimited campaigns, priority support
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next billing date:</span>
                    <span>March 15, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment method:</span>
                    <span>•••• 1234</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>
                  Track your current usage against plan limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Campaigns</span>
                    <span className="text-sm font-medium">12 / Unlimited</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">AI Generations</span>
                    <span className="text-sm font-medium">47 / 500</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '9.4%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">API Calls</span>
                    <span className="text-sm font-medium">1,234 / 10,000</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '12.3%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api">
          <Card className="shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-primary" />
                <span>API Keys</span>
              </CardTitle>
              <CardDescription>
                Manage API keys for integrating with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showNewKeyDialog ? (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  onClick={() => setShowNewKeyDialog(true)}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Generate New API Key
                </Button>
              ) : (
                <div className="p-4 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Generate New API Key</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setShowNewKeyDialog(false);
                        setNewKeyName('');
                        setNewKeyType('production');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="key-name">API Key Name</Label>
                      <Input
                        id="key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Production API Key"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="key-type">Environment</Label>
                      <Select value={newKeyType} onValueChange={(value: 'production' | 'development') => setNewKeyType(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production (sk_live_)</SelectItem>
                          <SelectItem value="development">Development (sk_test_)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateApiKey}
                    disabled={isGeneratingKey}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {isGeneratingKey ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4 mr-2" />
                    )}
                    {isGeneratingKey ? 'Generating...' : 'Generate API Key'}
                  </Button>
                </div>
              )}
              
              <div className="space-y-4">
                {apiKeys && apiKeys.length > 0 ? (
                  apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{apiKey.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date(apiKey.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-muted p-3 rounded font-mono text-sm flex-1">
                          {apiKey.key.substring(0, 12)}••••••••••••••••••••{apiKey.key.slice(-4)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyApiKey(apiKey.key)}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>
                          Last used: {apiKey.lastUsedAt ? 
                            new Date(apiKey.lastUsedAt).toLocaleDateString() : 
                            'Never'
                          }
                        </span>
                        <span>{apiKey.requestCount} requests total</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">Production API Key</h3>
                          <p className="text-sm text-muted-foreground">Created on Feb 15, 2024</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        sk_live_••••••••••••••••••••••••1234
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Last used: 2 hours ago</span>
                        <span>1,234 requests this month</span>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">Development API Key</h3>
                          <p className="text-sm text-muted-foreground">Created on Jan 10, 2024</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        sk_test_••••••••••••••••••••••••5678
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Last used: 1 day ago</span>
                        <span>89 requests this month</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}