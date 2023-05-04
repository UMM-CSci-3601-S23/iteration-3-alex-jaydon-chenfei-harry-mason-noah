export interface Request {
  _id: string;
  name: string;
  diaperSize?: string;
  incomeValid: string;
  dateAdded: string;
  description?: string;
  selections?: string[];
  fulfilled: string[];
  priority: number;
  archived: string;
}
