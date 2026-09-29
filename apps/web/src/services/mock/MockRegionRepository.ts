import { sleep } from "@/shared/lib/sleep";
import type {
  City,
  District,
  Province,
  RegionRepository,
  ShippingOption,
} from "../repositories/RegionRepository";
import { cities, districts, provinces, shippingOptions } from "./data/region";

export class MockRegionRepository implements RegionRepository {
  constructor(private readonly options: { latency: number }) {}

  private async delay() {
    if (this.options.latency > 0) await sleep(this.options.latency);
  }

  async getProvinces(): Promise<Province[]> {
    await this.delay();
    return provinces;
  }

  async getCities(provinceId: string): Promise<City[]> {
    await this.delay();
    return cities.filter((c) => c.provinceId === provinceId);
  }

  async getDistricts(cityId: string): Promise<District[]> {
    await this.delay();
    return districts.filter((d) => d.cityId === cityId);
  }

  async getShippingOptions(): Promise<ShippingOption[]> {
    await this.delay();
    return shippingOptions;
  }
}
