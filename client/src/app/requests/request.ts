export interface Request {
  _id: string;
  name: string;
  // in the future income will be required
  incomeValid: string;
  dateAdded: string;
  description?: string;
  selections?: string[];
  fulfilled?: string[];
  diaperSize?: string;
}
