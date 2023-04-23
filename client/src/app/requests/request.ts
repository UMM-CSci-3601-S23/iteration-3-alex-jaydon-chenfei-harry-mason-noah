export interface Request {
  _id: string;
  name: string;
  // in the future income will be required
  income?: string;
  dateAdded: string;
  description?: string;
  selections?: string[];
  diaperSize?: string;
}
