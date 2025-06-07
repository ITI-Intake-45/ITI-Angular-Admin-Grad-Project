export interface Order {
  id: number;
  userId: number;
  items: any[];
  total: number;
  status: string;
  createdAt: Date;
  shippingAddress: any;
}
