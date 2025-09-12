'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Wand2, 
  TrendingUp, 
  Target, 
  MessageSquare,
  Lightbulb,
  Zap
} from 'lucide-react';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: 'headline',
      name: 'Compelling Headlines',
      description: 'Generate attention-grabbing headlines for your campaigns',
      icon: Target,
      prompt: 'Create 5 compelling headlines for a [PRODUCT/SERVICE] targeting [AUDIENCE]. The headlines should focus on [MAIN BENEFIT] and create urgency.'
    },
    {
      id: 'cta',
      name: 'Call-to-Action Buttons',
      description: 'Create high-converting CTA text that drives action',
      icon: Zap,
      prompt: 'Generate 10 high-converting call-to-action button texts for a [PRODUCT/SERVICE]. The CTAs should encourage [DESIRED ACTION] and appeal to [TARGET AUDIENCE].'
    },
    {
      id: 'subheadline',
      name: 'Supporting Subheadlines',
      description: 'Craft subheadlines that reinforce your main value proposition',
      icon: MessageSquare,
      prompt: 'Write 5 supporting subheadlines for a [PRODUCT/SERVICE]. Each should elaborate on the main headline: "[MAIN HEADLINE]" and highlight [KEY BENEFITS].'
    },
    {
      id: 'optimization',
      name: 'Copy Optimization',
      description: 'Improve existing copy for better performance',
      icon: TrendingUp,
      prompt: 'Optimize this existing copy for better conversion rates: "[EXISTING COPY]". Focus on improving clarity, urgency, and emotional appeal for [TARGET AUDIENCE].'
    }
  ];

  const suggestions = [
    {
      text: "Create headlines for SaaS productivity tool targeting busy entrepreneurs",
      category: "Headlines"
    },
    {
      text: "Generate CTAs for email marketing course targeting small business owners",
      category: "CTAs"
    },
    {
      text: "Write subheadlines for fitness program targeting working professionals",
      category: "Subheadlines"
    },
    {
      text: "Optimize landing page copy for better conversion rates",
      category: "Optimization"
    }
  ];

  const recentGenerations = [
    {
      id: '1',
      prompt: 'Create headlines for marketing automation software',
      result: 'Transform Your Marketing ROI in 30 Days with AI-Powered Automation',
      timestamp: '2 hours ago',
      campaign: 'Facebook Lead Gen'
    },
    {
      id: '2',
      prompt: 'Generate CTAs for enterprise demo requests',
      result: 'Schedule Your Custom Demo Today',
      timestamp: '1 day ago',
      campaign: 'Google Ads - Enterprise'
    },
    {
      id: '3',
      prompt: 'Optimize subheadline for better clarity',
      result: 'Join 10,000+ marketers who increased conversions by 45% using our platform',
      timestamp: '2 days ago',
      campaign: 'Email Campaign'
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const useTemplate = (template: any) => {
    setPrompt(template.prompt);
    setSelectedTemplate(template.id);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-primary" />
          AI Copy Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate and optimize high-converting copy for your UTM campaigns using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Generation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Generator */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5 text-primary" />
                <span>AI Copy Generator</span>
              </CardTitle>
              <CardDescription>
                Describe what you need and let AI create compelling copy for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe your copy needs
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create 5 compelling headlines for a SaaS productivity tool targeting busy entrepreneurs. Focus on time-saving benefits..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 flex-1"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Copy
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setPrompt('')}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Copy Templates</CardTitle>
              <CardDescription>
                Quick-start templates for common copy generation tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => useTemplate(template)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">
                            {template.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Generations */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Generations</CardTitle>
              <CardDescription>
                Your latest AI-generated copy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGenerations.map((generation) => (
                  <div key={generation.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          Prompt: {generation.prompt}
                        </p>
                        <p className="font-medium">
                          "{generation.result}"
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Used in: {generation.campaign}</span>
                      <span>{generation.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Suggestions */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <span>Suggestions</span>
              </CardTitle>
              <CardDescription>
                Try these popular prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setPrompt(suggestion.text)}
                >
                  <Badge variant="outline" className="mb-2 text-xs">
                    {suggestion.category}
                  </Badge>
                  <p className="text-sm">
                    {suggestion.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Generations</span>
                <span className="font-semibold">47 / 100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '47%' }}></div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Headlines</span>
                  <span>23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTAs</span>
                  <span>15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Optimizations</span>
                  <span>9</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}