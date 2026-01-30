export type Category = 'Barber' | 'Food' | 'Laundry' | 'Clinic' |'Other';

export interface Shop {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  avgWaitMinutes: number;
  image_url: string;
  owner_id: string;
  currentQueue: number;
}

export interface QueueTicket {
  shopId: string;
  shopName: string;
  position: number;
  estimatedWait: number;
  joinedAt: Date;
}

export interface Booking {
  id: string;
  created_at: string;
  shop_id: string;
  user_id: string;
  customer_name: string;
  status: 'waiting' | 'serving' | 'completed' | 'cancelled';
  shops?: {
    name: string;
    location: string;
  };
}