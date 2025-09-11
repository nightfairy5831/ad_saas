import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Link, QrCode, Share, Code, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

interface UTMGeneratorProps {
  landingPageUrl?: string;
}

export const UTMGenerator = ({ landingPageUrl = 'https://yoursite.com/landing' }: UTMGeneratorProps) => {
  const [baseUrl, setBaseUrl] = useState(landingPageUrl);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  

  useEffect(() => {
    setBaseUrl(landingPageUrl);
  }, [landingPageUrl]);

  const generateUrl = () => {
    if (!baseUrl || !utmSource || !utmMedium || !utmCampaign) {
      return baseUrl;
    }

    const params = new URLSearchParams();
    params.append('utm_source', utmSource);
    params.append('utm_medium', utmMedium);
    params.append('utm_campaign', utmCampaign);
    if (utmTerm) params.append('utm_term', utmTerm);
    if (utmContent) params.append('utm_content', utmContent);

    return `${baseUrl}?${params.toString()}`;
  };

  const generatedUrl = generateUrl();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast.success('UTM link copied to clipboard!', {theme: 'colored'});
    } catch (err) {
      toast.error('Failed to copy to clipboard', {theme: 'colored'});
    }
  };

  const generateEmbedCode = () => {
    return `<!-- CopyAI Landing Page Pro Embed -->
<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.copyai-pro.com/widget.js';
    script.setAttribute('data-site-id', 'YOUR_SITE_ID');
    document.head.appendChild(script);
  })();
</script>`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UTM Builder */}
        <Card className="shadow-professional-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link className="w-5 h-5 text-primary" />
              <span>UTM Link Builder</span>
            </CardTitle>
            <CardDescription>
              Generate trackable UTM links for your campaigns
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Base URL *
              </label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://yoursite.com/landing"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Source * <Badge variant="outline">utm_source</Badge>
                </label>
                <Input
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="facebook, google, newsletter"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Medium * <Badge variant="outline">utm_medium</Badge>
                </label>
                <Input
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="cpc, email, social"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Campaign * <Badge variant="outline">utm_campaign</Badge>
              </label>
              <Input
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="spring_sale, product_launch"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Term <Badge variant="outline">utm_term</Badge>
                </label>
                <Input
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  placeholder="marketing+automation"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Content <Badge variant="outline">utm_content</Badge>
                </label>
                <Input
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  placeholder="headerlink, sidebar"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated URL & Actions */}
        <Card className="shadow-professional-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share className="w-5 h-5 text-success" />
              <span>Generated UTM Link</span>
            </CardTitle>
            <CardDescription>
              Your trackable campaign link is ready
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Generated URL
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 p-3 bg-accent/50 rounded-md border border-border">
                  <p className="text-sm text-foreground break-all">
                    {generatedUrl}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>Generate QR</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share Link</span>
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-foreground mb-2">Quick Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use consistent naming conventions</li>
                <li>• Keep parameters lowercase</li>
                <li>• Use underscores instead of spaces</li>
                <li>• Test links before launching campaigns</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed Code Section */}
      <Card className="shadow-professional-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-primary" />
            <span>Funnel Builder Integration</span>
          </CardTitle>
          <CardDescription>
            Add this code to your funnel builder to enable dynamic copy personalization
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {generateEmbedCode()}
            </pre>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Paste this code in your funnel builder's header section
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generateEmbedCode());
                  toast("Copied! Embed code copied to clipboard");
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Need help with integration?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Check our step-by-step guides for GoHighLevel, ClickFunnels, Leadpages, and more.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/integration-guide">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Integration Guide
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};