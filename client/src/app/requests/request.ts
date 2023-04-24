export interface Request {
  _id: string;
  itemType: ItemType;
  description: string;
  foodType: FoodType;
  comment?: string;
  timeSlot?: TimeSlot;
}

export type ItemType = 'food' | 'toiletries' | 'other';
export type FoodType = '' | 'dairy' | 'grain' | 'meat' | 'fruit' | 'vegetable';
export type TimeSlot = '' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
