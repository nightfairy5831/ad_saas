'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Code,
  Globe,
  Zap,
  Settings,
  Play,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { VideoTutorial } from '@/components/VideoTutorial';

interface TutorialStep {
  title: string;
  description: string;
  details: string[];
  code?: string;
  isVideoTutorial?: boolean;
}

interface Platform {
  name: string;
  icon: any;
  difficulty: string;
  time: string;
  color: string;
  steps: TutorialStep[];
}

export default function IntegrationGuide() {
  const [activeTab, setActiveTab] = useState('gohighlevel');

  const embedCode = `<!-- Ad SaaS Landing Page Embed -->
<script src="https://your-domain.com/widget.js" data-site-id="YOUR_SITE_ID"></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!', {theme: 'colored'});
  };

  const platforms = {
    gohighlevel: {
      name: "GoHighLevel",
      icon: Globe,
      difficulty: "Easy",
      time: "5-10 minutes",
      color: "text-blue-500",
      steps: [
        {
          title: "Access Your Funnel",
          description: "Log into your GoHighLevel account and navigate to the funnel you want to enhance",
          details: [
            "Go to Marketing > Funnels/Websites",
            "Select the funnel you want to edit",
            "Click 'Edit' to open the funnel builder"
          ]
        },
        {
          title: "Add Custom Code",
          description: "Insert the embed code in the funnel's header section",
          details: [
            "Click on 'Settings' in the funnel builder",
            "Navigate to 'Custom Code' or 'Tracking Code'",
            "Paste the embed code in the 'Header Code' section",
            "Save your changes"
          ]
        },
        {
          title: "Mark Dynamic Content (Video Tutorial)",
          description: "Watch this step-by-step video guide to set up dynamic content in GoHighLevel",
          details: [
            "📹 INTERACTIVE VIDEO TUTORIAL: Follow along with the visual guide below",
            "🎯 Learn exactly where to click in the GoHighLevel interface",
            "⚙️ See real screenshots of the element settings panels",
            "📝 Watch how to add data-copy-element attributes step by step",
            "✅ Get confirmation when you complete each step",
            "💡 TIP: You can pause, rewind, and replay any section"
          ],
          isVideoTutorial: true
        },
        {
          title: "Test Your Integration",
          description: "Verify the integration is working correctly",
          details: [
            "Publish your funnel",
            "Create a UTM link with our generator",
            "Visit your funnel using the UTM link",
            "Check if content changes based on UTM parameters"
          ]
        }
      ]
    },
    clickfunnels: {
      name: "ClickFunnels",
      icon: Zap,
      difficulty: "Easy",
      time: "5-10 minutes",
      color: "text-orange-500",
      steps: [
        {
          title: "Open Your Funnel",
          description: "Access the ClickFunnels editor for your target funnel",
          details: [
            "Login to ClickFunnels dashboard",
            "Select your funnel from the list",
            "Click 'Edit Funnel' then 'Edit Page'"
          ]
        },
        {
          title: "Access Page Settings",
          description: "Navigate to the tracking code section",
          details: [
            "Click 'Settings' in the page editor",
            "Go to 'Tracking Code' tab",
            "Select 'Head Tracking Code' section"
          ]
        },
        {
          title: "Insert Embed Code",
          description: "Add the Ad SaaS embed script to your page",
          details: [
            "Paste the embed code in the 'Head Tracking Code' field",
            "Replace 'YOUR_SITE_ID' with your actual site ID",
            "Click 'Save' to apply changes"
          ],
          code: `<!-- Example ClickFunnels integration -->
<h1 data-copy-element="headline">Default Headline</h1>
<button data-copy-element="cta-button">Default Button</button>`
        },
        {
          title: "Configure Dynamic Elements (Step-by-Step)",
          description: "Make your page content change automatically based on UTM parameters",
          details: [
            "🎯 STEP 1: In ClickFunnels editor, click on your headline text",
            "⚙️ STEP 2: In right panel, click 'Settings' then 'Advanced' tab",
            "📝 STEP 3: Scroll to 'Custom Attributes' section",
            "➕ STEP 4: Click 'Add Attribute'",
            "✏️ STEP 5: Enter: Attribute='data-copy-element' Value='headline'",
            "✅ STEP 6: Click 'Save' to apply changes",
            "🔄 STEP 7: Repeat for other elements:",
            "   • Button text → Value: 'cta-button'",
            "   • Description → Value: 'description'",
            "💡 Alternative: Use 'Custom HTML' element for full control"
          ],
          code: `<!-- WHAT YOU'RE BUILDING: -->
<!-- Regular ClickFunnels elements become dynamic -->

<!-- Your headline element gets this attribute: -->
<h1 data-copy-element="headline">Default Headline</h1>

<!-- Your button gets this attribute: -->
<button data-copy-element="cta-button">Default Button</button>

<!-- OR use Custom HTML Element: -->
<div class="my-dynamic-section">
  <h2 data-copy-element="special-offer">Limited Time Offer!</h2>
  <button data-copy-element="urgent-cta">Act Now - Save 40%</button>
</div>`
        },
        {
          title: "Publish and Test",
          description: "Deploy your changes and verify functionality",
          details: [
            "Click 'Publish' to make changes live",
            "Generate UTM links for testing",
            "Test with different UTM parameters",
            "Monitor console for any JavaScript errors"
          ]
        }
      ]
    },
    leadpages: {
      name: "Leadpages",
      icon: Globe,
      difficulty: "Medium",
      time: "10-15 minutes",
      color: "text-green-500",
      steps: [
        {
          title: "Access Page Builder",
          description: "Open your Leadpages page in the editor",
          details: [
            "Log into your Leadpages account",
            "Navigate to 'Landing Pages'",
            "Select your page and click 'Edit'"
          ]
        },
        {
          title: "Open Page Settings",
          description: "Navigate to the advanced settings section",
          details: [
            "Click the gear icon (Settings) in the top menu",
            "Select 'Advanced' from the dropdown menu",
            "Find the 'Custom HTML/CSS' section"
          ]
        },
        {
          title: "Add Tracking Code",
          description: "Insert the embed code in the header section",
          details: [
            "Scroll to 'Header HTML' section",
            "Paste the embed code",
            "Ensure proper formatting and syntax",
            "Click 'Apply' to save"
          ]
        },
        {
          title: "Setup Dynamic Content (Step-by-Step)",
          description: "Add smart content that changes based on where visitors come from",
          details: [
            "🎯 STEP 1: In Leadpages editor, drag an 'HTML' widget to your page",
            "📝 STEP 2: Double-click the HTML widget to open the code editor",
            "✏️ STEP 3: Replace the placeholder with your dynamic content code:",
            "💡 STEP 4: Copy this template and customize the text:",
            "🔄 STEP 5: Add multiple HTML widgets for different sections",
            "✅ STEP 6: Preview your page to ensure widgets display correctly",
            "📱 STEP 7: Test on mobile view as well",
            "💾 STEP 8: Save your changes before publishing"
          ],
          code: `<!-- PASTE THIS into Leadpages HTML Widget: -->
<div class="dynamic-content" style="text-align: center; padding: 20px;">
  <!-- Main Headline -->
  <h1 data-copy-element="headline" style="font-size: 36px; margin-bottom: 15px;">
    Your Default Headline Here
  </h1>
  
  <!-- Description -->
  <p data-copy-element="description" style="font-size: 18px; margin-bottom: 20px;">
    Your default description text goes here
  </p>
  
  <!-- Call-to-Action Button -->
  <button data-copy-element="cta-button" 
          style="background: #ff6b35; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer;">
    Your Default CTA Button
  </button>
</div>

<!-- TIP: Create separate HTML widgets for each dynamic section -->`
        },
        {
          title: "Publish and Validate",
          description: "Make your page live and test the integration",
          details: [
            "Click 'Publish' to deploy changes",
            "Test with various UTM combinations",
            "Use browser developer tools to debug",
            "Verify all dynamic elements are working"
          ]
        }
      ]
    },
    wordpress: {
      name: "WordPress/Custom Sites",
      icon: Code,
      difficulty: "Advanced",
      time: "15-30 minutes", 
      color: "text-purple-500",
      steps: [
        {
          title: "Access Your Site",
          description: "Get ready to modify your WordPress site or custom HTML",
          details: [
            "Log into WordPress admin or access your site files",
            "For WordPress: Go to Appearance > Theme Editor",
            "For custom sites: Access your HTML files via FTP/hosting panel"
          ]
        },
        {
          title: "Add to Header",
          description: "Insert the embed code in your site's <head> section",
          details: [
            "WordPress: Edit header.php file or use a plugin",
            "Add code before closing </head> tag",
            "For WordPress, consider using 'Insert Headers and Footers' plugin",
            "Save changes and backup your site first"
          ]
        },
        {
          title: "Prepare HTML Elements (Step-by-Step)",
          description: "Edit your HTML to make specific text change based on visitor's UTM links",
          details: [
            "🎯 STEP 1: Find your page's main content file (index.html, page.php, etc.)",
            "🔍 STEP 2: Locate the headline text in your HTML code",
            "✏️ STEP 3: Add data-copy-element='headline' inside the opening tag:",
            "   BEFORE: <h1 class='title'>Welcome to Our Site</h1>",
            "   AFTER:  <h1 class='title' data-copy-element='headline'>Welcome to Our Site</h1>",
            "🔄 STEP 4: Do the same for buttons and descriptions:",
            "   • Button: data-copy-element='cta-button'",
            "   • Description: data-copy-element='description'",
            "💾 STEP 5: Save the file and upload if needed",
            "💡 WordPress Tip: Use 'Insert Headers and Footers' plugin for easier editing"
          ],
          code: `<!-- COMPLETE EXAMPLE: -->
<!DOCTYPE html>
<html>
<head>
  <title>My Landing Page</title>
  <!-- Your CopyAI embed script goes here -->
</head>
<body>
  <!-- HERO SECTION with dynamic content -->
  <div class="hero">
    <!-- This headline will change based on UTM parameters -->
    <h1 class="hero-title" data-copy-element="main-headline">
      Default: Transform Your Business Today
    </h1>
    
    <!-- This description will also be dynamic -->
    <p class="hero-subtitle" data-copy-element="hero-description">
      Default: Join thousands of satisfied customers
    </p>
    
    <!-- This button text changes too -->
    <button class="cta-btn" data-copy-element="primary-cta">
      Default: Get Started Free
    </button>
  </div>
</body>
</html>`
        },
        {
          title: "Testing & Debugging",
          description: "Thoroughly test your implementation",
          details: [
            "Use browser developer tools",
            "Test with various UTM parameter combinations",
            "Check console for JavaScript errors",
            "Validate HTML and ensure proper loading"
          ]
        }
      ]
    }
  };

  const currentPlatform = platforms[activeTab as keyof typeof platforms];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Integration Guide</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to integrate Ad SaaS with your funnel builder in minutes
        </p>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-6 h-6 text-primary" />
              <span>Integration Tutorial</span>
            </CardTitle>
            <CardDescription>
              Step-by-step guides for integrating Ad SaaS with popular funnel builders and websites
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Embed Code Reference */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Your Embed Code</CardTitle>
            <CardDescription>
              You'll need this code for all integrations below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
              <pre className="whitespace-pre-wrap overflow-x-auto">{embedCode}</pre>
            </div>
            
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>About Your Site ID</AlertTitle>
              <AlertDescription>
                <strong>YOUR_SITE_ID</strong> is your unique project identifier. Find it here:
                <br />• <strong>Dashboard:</strong> Top-right corner next to "New Campaign" button
                <br />• <strong>Settings:</strong> Go to Settings → Project tab → "Site ID & Integration" section
                <br />• Example: "proj_ad_saas_main_2024"
              </AlertDescription>
            </Alert>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Replace <code className="bg-muted px-1 rounded">YOUR_SITE_ID</code> with your actual site ID
                </p>
                <p className="text-xs text-muted-foreground">
                  💡 Don't have a site ID yet? Create one in your Dashboard first
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gohighlevel">GoHighLevel</TabsTrigger>
            <TabsTrigger value="clickfunnels">ClickFunnels</TabsTrigger>
            <TabsTrigger value="leadpages">Leadpages</TabsTrigger>
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <currentPlatform.icon className={`w-8 h-8 ${currentPlatform.color}`} />
                    <div>
                      <CardTitle className="text-xl">{currentPlatform.name} Integration</CardTitle>
                      <CardDescription>Complete setup guide for {currentPlatform.name}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={currentPlatform.difficulty === 'Easy' ? 'default' : 'secondary'}>
                      {currentPlatform.difficulty}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{currentPlatform.time}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Prerequisites Alert */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Before You Start</AlertTitle>
                  <AlertDescription>
                    Make sure you have admin access to your {currentPlatform.name} account and have copied the embed code above.
                  </AlertDescription>
                </Alert>

                {/* Steps */}
                <div className="space-y-6">
                  {currentPlatform.steps.map((step, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      
                      {'isVideoTutorial' in step && step.isVideoTutorial && activeTab === 'gohighlevel' ? (
                        <div className="mb-4">
                          <VideoTutorial />
                        </div>
                      ) : (
                        <>
                          <ul className="space-y-2 mb-4">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                <span className="text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>

                          {'code' in step && step.code && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Code Example:</h4>
                              <div className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                                <pre className="whitespace-pre-wrap overflow-x-auto">{'code' in step ? step.code : ''}</pre>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Testing Section */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Testing Your Integration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Quick Test Steps:</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Generate a UTM link with our tool</li>
                        <li>• Visit your page using the UTM link</li>
                        <li>• Check browser console for errors</li>
                        <li>• Verify content changes occur</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Common Issues:</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Script blocked by ad blockers</li>
                        <li>• Missing data-copy-element attributes</li>
                        <li>• Incorrect site ID in embed code</li>
                        <li>• Content Security Policy restrictions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open {currentPlatform.name}
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Test Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}