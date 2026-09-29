import type { Address } from "@/entities/order";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserState {
  user: User | null;
  addresses: Address[];
}
