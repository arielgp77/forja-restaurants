export interface MenuCategoryVM {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItemVM {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  priceLabel: string;
  priceValue: number;
  badge?: string;
  available: boolean;
  imageUrl?: string;
}

export interface MenuPageVM {
  slug: string;
  restaurantName: string;
  tagline: string;
  categories: MenuCategoryVM[];
  items: MenuItemVM[];
}
