export interface Request {
  _id: string;
  name: string;
  dateAdded: string;
<<<<<<< HEAD
  description?: string;
=======
  itemType?: ItemType;
  description?: string;
  foodType?: FoodType;
>>>>>>> working-on-requestform
  selections?: string[];
  diaperSize?: string;
}
