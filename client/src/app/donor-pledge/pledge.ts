export interface Pledge {
  _id: string;
  comment: string;
  timeSlot: TimeSlot;
  name: string;
  amount: number;
  itemName: string;
}

export type TimeSlot = '' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
