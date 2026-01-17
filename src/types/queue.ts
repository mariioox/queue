export type Category = 'Barber' | 'Food' | 'Laundry' | 'Clinic' |'Other';

export interface Shop {
  id: string;
  name: string;
  category: Category;
  description: string;
  avgWaitMinutes: number; // in minutes
  currentQueue: number;
  imageUrl: string;
}

export interface QueueTicket {
  shopId: string;
  shopName: string;
  position: number;
  estimatedWait: number;
  joinedAt: Date;
}