import { env } from "@/shared/config/env";
import { MockCategoryRepository } from "./mock/MockCategoryRepository";
import { MockContentRepository } from "./mock/MockContentRepository";
import { MockOrderRepository } from "./mock/MockOrderRepository";
import { MockPromoRepository } from "./mock/MockPromoRepository";
import { MockProductRepository } from "./mock/MockProductRepository";
import { MockRegionRepository } from "./mock/MockRegionRepository";
import { MockReviewRepository } from "./mock/MockReviewRepository";

function liveNotAvailable(): never {
  throw new Error("Live API belum tersedia");
}

const latency = env.NEXT_PUBLIC_MOCK_LATENCY;
const isLive = env.NEXT_PUBLIC_API_MODE === "live";

export const repositories = {
  product: isLive ? liveNotAvailable() : new MockProductRepository({ latency }),
  category: isLive
    ? liveNotAvailable()
    : new MockCategoryRepository({ latency }),
  content: isLive ? liveNotAvailable() : new MockContentRepository({ latency }),
  review: isLive ? liveNotAvailable() : new MockReviewRepository({ latency }),
  promo: isLive ? liveNotAvailable() : new MockPromoRepository({ latency }),
  region: isLive ? liveNotAvailable() : new MockRegionRepository({ latency }),
  order: isLive ? liveNotAvailable() : new MockOrderRepository({ latency }),
} as const;
