export interface Request {
  _id: string;
  name?: string;
  dateAdded: string;
  itemType?: ItemType;
  description: string;
  foodType?: FoodType;
  selections?: string[];
  diaperSize?: string;
}

export type ItemType = 'food' | 'toiletries' | 'other';
export type FoodType = '' | 'dairy' | 'grain' | 'meat' | 'fruit' | 'vegetable';
