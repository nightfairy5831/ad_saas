export interface TextWithStyle {
  text: string;
  styles?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
  copyVariations: {
    headline: TextWithStyle | string;
    subheadline: TextWithStyle | string;
    cta: TextWithStyle | string;
    textblock?: (TextWithStyle | string)[];
  };
  clicks: number;
  conversions: number;
  archived: boolean;
  landingPageUrl?: string;
}

// Helper functions for backward compatibility
export const normalizeText = (value: TextWithStyle | string): TextWithStyle => {
  if (typeof value === 'string') {
    return { text: value, styles: '' };
  }
  return value;
};

export const normalizeTextArray = (value?: (TextWithStyle | string)[]): TextWithStyle[] => {
  if (!value || value.length === 0) return [{ text: '', styles: '' }];
  return value.map(normalizeText);
};

export const getText = (value: TextWithStyle | string): string => {
  return typeof value === 'string' ? value : value.text;
};

export const parseStylesAsReactStyle = (styleString?: string) => {
  if (!styleString) return {};
  return styleString.split(';').reduce((acc, style) => {
    const [property, value] = style.split(':').map(s => s.trim());
    if (property && value) {
      acc[property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    }
    return acc;
  }, {} as any);
};