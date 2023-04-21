export interface Request {
  _id: string;
  name: string;
  dateAdded: string;
  description?: string;
  selections?: string[];
  diaperSize?: string;
}
