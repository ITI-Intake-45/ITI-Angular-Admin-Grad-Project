import { OrderItemDTO } from './OrderItemDTO';
import { OrderStatus } from './OrderStatus';

export interface OrderDTO {
  orderId: number;
  userId: number;
  email: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItemDTO[];
}
