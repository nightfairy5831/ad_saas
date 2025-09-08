'use client'

import { Home, BarChart3, Settings, Zap, Globe, Code, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Landing Pages', href: '/landing-pages', icon: Globe },
  { name: 'Integrations', href: '/integrations', icon: Code },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Zap },
  { name: 'Integration Guide', href: '/integration-guide', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Plan",
      description: "Upgrade functionality will be available soon. Contact support for enterprise options.",
    });
  };
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-bg border-r border-sidebar-border shadow-md">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CopyAI</h1>
              <p className="text-xs text-muted-foreground">Landing Page Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-success-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground truncate">
                john@company.com
              </p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full" onClick={handleUpgrade}>
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
};