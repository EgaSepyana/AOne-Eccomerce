import type { Gender } from "@/entities/product";
import type { HomeContent } from "@/entities/content";
import { sleep } from "@/shared/lib/sleep";
import type { ContentRepository } from "../repositories/ContentRepository";
import { getHomeContent, lookbooks } from "./data/content";

export class MockContentRepository implements ContentRepository {
  constructor(private readonly options: { latency: number }) {}

  async getHomeContent(gender: Gender): Promise<HomeContent> {
    if (this.options.latency > 0) await sleep(this.options.latency);
    return getHomeContent(gender);
  }

  async getLookbook(
    slug: string,
  ): Promise<HomeContent["lookbooks"][number] | null> {
    if (this.options.latency > 0) await sleep(this.options.latency);
    return lookbooks.find((l) => l.slug === slug) ?? null;
  }
}
