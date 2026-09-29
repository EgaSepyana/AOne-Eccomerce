import type { Gender } from "@/entities/product";
import type { HomeContent } from "@/entities/content";

export interface ContentRepository {
  getHomeContent(gender: Gender): Promise<HomeContent>;
  getLookbook(slug: string): Promise<HomeContent["lookbooks"][number] | null>;
}
