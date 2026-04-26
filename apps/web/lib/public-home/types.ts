export interface PublicHomeHighlight {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  badge?: string;
}

export interface PublicHomeViewModel {
  slug: string;
  restaurantName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
  cartCount: number;
  info: Array<{
    label: string;
    value: string;
  }>;
  highlights: PublicHomeHighlight[];
  storyTitle: string;
  storyBody: string;
  contact: {
    phone: string;
    address: string;
    hours: string;
  };
}
