export interface Pledge {
  _id?: string;
  comment: string;
  timeSlot: TimeSlot;
  name: string;
  amount: number;
}

export type TimeSlot = '' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
