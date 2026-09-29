export interface CartItem {
  productId: string;
  colorId: string;
  size: string;
  qty: number;
}

export interface Address {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  detail: string;
}

export type OrderStatus =
  "menunggu_pembayaran" | "dibayar" | "dikemas" | "dikirim" | "selesai";

export interface Order {
  id: string;
  items: (CartItem & { price: number; name: string; image: string })[];
  address: Address;
  courier: string;
  payment: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
