export type Segment = {
  id: string
  name: string
  utm_source?: string
  utm_campaign?: string
  utm_content?: string
  gclid?: boolean
  fbclid?: boolean
  created_at: string
}

export type Variant = {
  id: string
  segment_name: string
  headline: string
  sub: string
  bullets?: string[]
  cta: string
  created_at: string
}

export const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'summer_shoppers',
    utm_campaign: 'summer_sale',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'shoe_buyers',
    utm_source: 'google',
    utm_content: 'shoes',
    created_at: '2024-01-16'
  },
  {
    id: '3',
    name: 'facebook_visitors',
    fbclid: true,
    created_at: '2024-01-17'
  },
  {
    id: '4',
    name: 'google_ads_users',
    gclid: true,
    created_at: '2024-01-18'
  },
  {
    id: '5',
    name: 'email_subscribers',
    utm_source: 'email',
    utm_campaign: 'newsletter',
    created_at: '2024-01-19'
  }
]

export const mockVariants: Variant[] = [
  {
    id: '1',
    segment_name: 'summer_shoppers',
    headline: 'Hot Summer Deals Just for You!',
    sub: 'Save up to 50% on our summer collection.',
    bullets: [
      'Free shipping on orders over $50',
      'Extended returns until September',
      'Exclusive early access to new arrivals'
    ],
    cta: 'Shop the Sale',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    segment_name: 'shoe_buyers',
    headline: 'Step into Style with Our Shoe Collection',
    sub: 'Discover the perfect pair for every occasion.',
    bullets: [
      'Premium leather and materials',
      'Comfort technology in every pair',
      'Size exchange guarantee'
    ],
    cta: 'Browse Shoes',
    created_at: '2024-01-16'
  },
  {
    id: '3',
    segment_name: 'facebook_visitors',
    headline: 'Welcome Facebook Friends!',
    sub: 'Enjoy an exclusive 20% discount just for you.',
    cta: 'Claim Your Discount',
    created_at: '2024-01-17'
  },
  {
    id: '4',
    segment_name: 'google_ads_users',
    headline: 'You Found Us! Here\'s 15% Off',
    sub: 'Thank you for clicking through. Enjoy this special offer.',
    bullets: [
      'Valid on your first purchase',
      'No minimum order required'
    ],
    cta: 'Start Shopping',
    created_at: '2024-01-18'
  },
  {
    id: '5',
    segment_name: 'email_subscribers',
    headline: 'VIP Access for Our Subscribers',
    sub: 'Early access to sales and new products.',
    cta: 'Shop VIP Collection',
    created_at: '2024-01-19'
  }
]