import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import Request from '@/lib/request';

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
    textblock?: string[];
  };
  clicks: number;
  conversions: number;
  archived: boolean;
  landingPageUrl?: string;
}

interface CampaignCreatorProps {
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

export const CampaignCreator = ({ onSave, onCancel }: CampaignCreatorProps) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'paused'>('draft');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [cta, setCta] = useState('');
  const [textblocks, setTextblocks] = useState<string[]>(['']);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [availableUrls, setAvailableUrls] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Load available URLs from landing pages API
  useEffect(() => {
    const loadLandingPages = async () => {
      try {
        const data = await Request.Get('/api/landing-pages');
        const urls = data.landingPages || [];
        
        // Add fallback if no landing pages exist
        if (urls.length === 0) {
          urls.push('https://yourlandingpage.com');
        }
        
        setAvailableUrls(urls);
        setSelectedUrl(urls[0]); // Select first URL by default
      } catch (error) {
        console.error('Failed to load landing pages:', error);
        // Fallback to default
        setAvailableUrls(['https://yourlandingpage.com']);
        setSelectedUrl('https://yourlandingpage.com');
      }
    };

    loadLandingPages();
  }, []);

  const addTextblock = () => {
    if (textblocks.length < 5) {
      setTextblocks([...textblocks, '']);
    }
  };

  const removeTextblock = (index: number) => {
    setTextblocks(textblocks.filter((_, i) => i !== index));
  };

  const updateTextblock = (index: number, value: string) => {
    const updated = [...textblocks];
    updated[index] = value;
    setTextblocks(updated);
  };

  const handleSave = async () => {
    if (!name || !utmSource || !utmMedium || !utmCampaign || !headline || !selectedUrl) {
      return; // Basic validation
    }

    setIsCreating(true);

    try {
      const newCampaign: Campaign = {
        id: Date.now().toString(), // Simple ID generation
        name,
        status,
        utmSource,
        utmMedium,
        utmCampaign,
        copyVariations: {
          headline,
          subheadline,
          cta: cta || 'Get Started',
          textblock: textblocks
        },
        clicks: 0,
        conversions: 0,
        archived: false,
        landingPageUrl: selectedUrl
      };

      await onSave(newCampaign);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="shadow-professional-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Create New Campaign</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Set up a new UTM-based copy personalization campaign
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Campaign Basic Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Campaign Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Facebook Lead Gen Q1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Status
              </label>
              <Select value={status} onValueChange={(value: 'active' | 'draft' | 'paused') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Landing Page URL Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Landing Page URL *
            </label>
            <Select value={selectedUrl} onValueChange={setSelectedUrl}>
              <SelectTrigger>
                <SelectValue placeholder="Select your landing page URL" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {availableUrls.map((url) => (
                  <SelectItem key={url} value={url}>
                    {url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Create landing pages in Landing Pages section
            </p>
          </div>
        </div>

        <Separator />

        {/* UTM Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">UTM Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Source * (utm_source)
              </label>
              <Input
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="facebook, google, email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Medium * (utm_medium)
              </label>
              <Input
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="cpc, social, newsletter"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Campaign * (utm_campaign)
              </label>
              <Input
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="spring_sale, leadgen"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Copy Variations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Copy Variations</h3>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Headline *
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Your compelling headline here..."
              className="text-lg font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Subheadline
            </label>
            <Textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="Supporting text that elaborates on your value proposition..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Call to Action
            </label>
            <Input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Get Started Free"
              className="font-medium"
            />
          </div>

          {/* Text Blocks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Text Blocks (Optional)
              </label>
              <Button
                type="button"
                size="sm"
                onClick={addTextblock}
                disabled={textblocks.length >= 5}
                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Block
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Add up to 5 text blocks for additional content (matches custome-textblock1 to custome-textblock5)
            </p>
            <div className="space-y-3">
              {textblocks.map((block, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={block}
                      onChange={(e) => updateTextblock(index, e.target.value)}
                      placeholder={`Text block ${index + 1} content...`}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  {textblocks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTextblock(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Preview</h3>
          <div className="bg-gradient-subtle border border-border rounded-lg p-6 space-y-4">
            <div className="text-center space-y-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {headline || "Your Headline Here"}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                {subheadline || "Your supporting subheadline will appear here to elaborate on your value proposition."}
              </p>
              
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-professional-md"
              >
                {cta || "Get Started Free"}
              </Button>

              {/* Text Blocks Preview */}
              {textblocks.length > 0 && (
                <div className="mt-6 space-y-3">
                  {textblocks.map((block, index) => (
                    <div key={index} className="text-sm text-muted-foreground bg-background/50 p-3 rounded border">
                      <div className="text-xs font-medium mb-1">Text Block {index + 1}:</div>
                      <div>{block}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Preview for: {selectedUrl || 'Select URL'}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                UTM: {utmSource || 'source'}/{utmMedium || 'medium'}/{utmCampaign || 'campaign'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-success text-success-foreground hover:opacity-90"
            disabled={!name || !utmSource || !utmMedium || !utmCampaign || !headline || !selectedUrl || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Campaign
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};