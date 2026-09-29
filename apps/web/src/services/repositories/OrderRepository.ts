import type { Address, Order } from "@/entities/order";
import type { CartItem } from "@/entities/order";

export interface CreateOrderPayload {
  items: (CartItem & { price: number; name: string; image: string })[];
  address: Address;
  courier: string;
  payment: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface OrderRepository {
  create(payload: CreateOrderPayload): Promise<Order>;
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
}
