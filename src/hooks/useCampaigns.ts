import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Campaign {
  id: string;
  name: string;
  status: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  headline: string;
  subheadline?: string;
  cta: string;
  copy_variations?: any;
  landing_page_url?: string;
  clicks: number;
  conversions: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    if (!user) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          copy_variations:copy_variations
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include copy_variations properly
      const transformedData = (data || []).map(campaign => ({
        ...campaign,
        copy_variations: {
          headline: campaign.headline,
          subheadline: campaign.subheadline,
          cta: campaign.cta,
          ...(campaign.copy_variations && typeof campaign.copy_variations === 'object' ? campaign.copy_variations : {})
        }
      }));

      setCampaigns(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'clicks' | 'conversions'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        ...campaignData,
        user_id: user.id,
        // Transform copy_variations from object to individual fields for backward compatibility
        headline: campaignData.copy_variations?.headline || campaignData.headline,
        subheadline: campaignData.copy_variations?.subheadline || campaignData.subheadline,
        cta: campaignData.copy_variations?.cta || campaignData.cta || 'Get Started'
      }])
      .select()
      .single();

    if (error) throw error;

    setCampaigns(prev => [data, ...prev]);
    return data;
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setCampaigns(prev => prev.map(c => c.id === id ? data : c));
    return data;
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const archiveCampaign = async (id: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setCampaigns(prev => prev.map(c => c.id === id ? data : c));
    return data;
  };

  const unarchiveCampaign = async (id: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ archived: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setCampaigns(prev => prev.map(c => c.id === id ? data : c));
    return data;
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    archiveCampaign,
    unarchiveCampaign,
    refetch: fetchCampaigns
  };
};