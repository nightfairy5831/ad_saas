import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Edit3, ExternalLink, Copy, Archive, ArchiveRestore } from 'lucide-react';
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
}

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
  onEdit: () => void;
  onViewAnalytics: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  baseUrl?: string;
}

export const CampaignCard = ({ campaign, onClick, onEdit, onViewAnalytics, onArchive, onUnarchive, baseUrl = 'https://yourlandingpage.com' }: CampaignCardProps) => {
  const conversionRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : '0.0';
  
  // Generate UTM link for this campaign
  const generateUTMLink = () => {
    const params = new URLSearchParams({
      utm_source: campaign.utmSource,
      utm_medium: campaign.utmMedium,
      utm_campaign: campaign.utmCampaign
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const utmLink = generateUTMLink();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const copyUTMLink = () => {
    navigator.clipboard.writeText(utmLink);
    toast.success('UTM Link copied to clipboard!', {theme: 'colored'});
  };

  return (
    <Card className="shadow-professional-sm hover:shadow-professional-md transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {campaign.name}
          </CardTitle>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {campaign.utmSource} • {campaign.utmMedium} • {campaign.utmCampaign}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Copy Preview */}
        <div className="bg-accent/50 p-3 rounded-md">
          <h4 className="font-medium text-sm text-foreground mb-1">Current Copy:</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {campaign.copyVariations.headline}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{campaign.clicks.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Conv. Rate</div>
          </div>
        </div>

        {/* UTM Link */}
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-xs text-foreground">Live UTM Link:</h4>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                copyUTMLink();
              }} className="h-6 w-6 p-0">
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                window.open(utmLink, '_blank');
              }} className="h-6 w-6 p-0">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono line-clamp-1" title={utmLink}>
            {utmLink}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}>
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
            e.stopPropagation();
            onViewAnalytics();
          }}>
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Button>
          {campaign.status === 'paused' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={(e) => {
                e.stopPropagation();
                if (campaign.archived) {
                  onUnarchive?.();
                } else {
                  onArchive?.();
                }
              }}
            >
              {campaign.archived ? (
                <>
                  <ArchiveRestore className="w-3 h-3 mr-1" />
                  Restore
                </>
              ) : (
                <>
                  <Archive className="w-3 h-3 mr-1" />
                  Archive
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};