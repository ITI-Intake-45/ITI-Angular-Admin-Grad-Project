import { OrderItemDTO } from './OrderItemDTO';

export interface OrderDTO {
  orderId: number;
  userId: number;
  email: string;
  status: string;
  totalPrice: number;
  items: OrderItemDTO[];
}
