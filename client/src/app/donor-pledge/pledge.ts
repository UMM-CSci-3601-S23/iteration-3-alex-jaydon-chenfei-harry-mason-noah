export interface Pledge {
  _id: string;
  comment?: string;
  timeSlot: TimeSlot;
  name: string;
  amount: number;
}


export type TimeSlot = '' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
