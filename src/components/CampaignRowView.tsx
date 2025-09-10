import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Edit3, Copy, ExternalLink, Archive, ArchiveRestore } from 'lucide-react';
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

interface CampaignRowViewProps {
  campaign: Campaign;
  onClick: () => void;
  onEdit: () => void;
  onViewAnalytics: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  baseUrl?: string;
}

export const CampaignRowView = ({ campaign, onClick, onEdit, onViewAnalytics, onArchive, onUnarchive, baseUrl = 'https://yourlandingpage.com' }: CampaignRowViewProps) => {
  const conversionRate = ((campaign.conversions / campaign.clicks) * 100).toFixed(1);
  
  // Generate UTM link for this campaign
  const generateUTMLink = () => {
    const params = new URLSearchParams({
      utm_source: campaign.utmSource,
      utm_medium: campaign.utmMedium,
      utm_campaign: campaign.utmCampaign,
      utm_content: 'campaign_' + campaign.id
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
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Campaign Name & Status */}
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
              <h3 className="font-semibold text-foreground truncate">{campaign.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {campaign.utmSource} • {campaign.utmMedium}
            </p>
          </div>

          {/* Copy Preview */}
          <div className="col-span-3">
            <p className="text-sm text-foreground font-medium truncate">
              {campaign.copyVariations.headline}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {campaign.copyVariations.subheadline}
            </p>
          </div>

          {/* Metrics */}
          <div className="col-span-2 text-center">
            <div className="text-lg font-bold text-foreground">{campaign.clicks.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Clicks</div>
          </div>

          <div className="col-span-2 text-center">
            <div className="text-lg font-bold text-success">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Conv. Rate</div>
          </div>

          {/* Actions */}
          <div className="col-span-2 flex justify-end space-x-1">
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              copyUTMLink();
            }} className="h-8 w-8 p-0">
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              window.open(utmLink, '_blank');
            }} className="h-8 w-8 p-0">
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }} className="h-8 w-8 p-0">
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onViewAnalytics();
            }} className="h-8 w-8 p-0">
              <BarChart3 className="w-3 h-3" />
            </Button>
            {campaign.status === 'paused' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (campaign.archived) {
                    onUnarchive?.();
                  } else {
                    onArchive?.();
                  }
                }} 
                className="h-8 w-8 p-0"
              >
                {campaign.archived ? (
                  <ArchiveRestore className="w-3 h-3" />
                ) : (
                  <Archive className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};