import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wand2, Save, Eye, Sparkles, Loader2, Plus, X } from 'lucide-react';
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
    textblock?: string[];
  };
  clicks: number;
  conversions: number;
  archived: boolean;
  landingPageUrl?: string;
}

interface CopyVariationEditorProps {
  campaign: Campaign | null;
  onSave: (campaign: Campaign) => Promise<void>;
  onCancel?: () => void;
}

export const CopyVariationEditor = ({ campaign, onSave }: CopyVariationEditorProps) => {
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [cta, setCta] = useState('');
  const [textblocks, setTextblocks] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (campaign) {
      setHeadline(campaign.copyVariations.headline);
      setSubheadline(campaign.copyVariations.subheadline);
      setCta(campaign.copyVariations.cta);
      setTextblocks(campaign.copyVariations.textblock || ['']);
    }
  }, [campaign]);

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
    if (campaign && !isSaving) {
      setIsSaving(true);
      try {
        await onSave({
          ...campaign,
          copyVariations: {
            headline,
            subheadline,
            cta,
            textblock: textblocks
          }
        });
        toast.success('Copy variations saved successfully!', { theme: 'colored' });
      } catch (error) {
        toast.error('Failed to save changes. Please try again.', { theme: 'colored' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const generateAISuggestions = () => {
    // Simulate AI suggestions - in real app this would call an AI API
    const suggestions = [
      "Transform Your Marketing ROI in 30 Days",
      "Double Your Conversion Rates with AI",
      "Stop Wasting Ad Spend on Generic Landing Pages"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setHeadline(randomSuggestion);
  };

  if (!campaign) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Campaign</h3>
            <p className="text-muted-foreground">Choose a campaign from the list to edit its copy variations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Editing: {campaign.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                UTM: {campaign.utmSource} / {campaign.utmMedium} / {campaign.utmCampaign}
              </CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Copy Editor</span>
            </CardTitle>
            <CardDescription>
              Customize your landing page copy for this UTM campaign
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Headline</label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateAISuggestions}
                  className="text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  AI Suggest
                </Button>
              </div>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter your compelling headline..."
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Character count: {headline.length}/60
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Character count: {subheadline.length}/160
              </p>
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
                Add up to 5 text blocks for additional content
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

            <Separator />

            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-success text-success-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>Live Preview</span>
            </CardTitle>
            <CardDescription>
              See how your copy will appear on the landing page
            </CardDescription>
          </CardHeader>
          
          <CardContent>
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
                  {cta || "Call to Action"}
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
                  Preview for UTM: {campaign.utmSource}/{campaign.utmMedium}/{campaign.utmCampaign}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};