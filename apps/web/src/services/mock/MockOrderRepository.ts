import type { Order } from "@/entities/order";
import { sleep } from "@/shared/lib/sleep";
import type {
  CreateOrderPayload,
  OrderRepository,
} from "../repositories/OrderRepository";

const STORAGE_KEY = "aone-orders";

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export class MockOrderRepository implements OrderRepository {
  constructor(private readonly options: { latency: number }) {}

  private async delay() {
    if (this.options.latency > 0) await sleep(this.options.latency);
  }

  async create(payload: CreateOrderPayload): Promise<Order> {
    await this.delay();
    const order: Order = {
      id: `AONE-${Math.floor(100000 + Math.random() * 900000)}`,
      ...payload,
      status: "menunggu_pembayaran",
      createdAt: new Date().toISOString(),
    };
    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);
    return order;
  }

  async getAll(): Promise<Order[]> {
    await this.delay();
    return readOrders();
  }

  async getById(id: string): Promise<Order | null> {
    await this.delay();
    return readOrders().find((o) => o.id === id) ?? null;
  }
}
