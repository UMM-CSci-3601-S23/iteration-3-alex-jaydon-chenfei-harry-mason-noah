export interface Request {
  _id: string;
  name: string;
  // income
  dateAdded: string;
  description?: string;
  selections?: string[];
  diaperSize?: string;
}
