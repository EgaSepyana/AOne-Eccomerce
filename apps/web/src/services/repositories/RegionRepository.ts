export interface Province {
  id: string;
  name: string;
}
export interface City {
  id: string;
  provinceId: string;
  name: string;
}
export interface District {
  id: string;
  cityId: string;
  name: string;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  etaLabel: string;
}

export interface RegionRepository {
  getProvinces(): Promise<Province[]>;
  getCities(provinceId: string): Promise<City[]>;
  getDistricts(cityId: string): Promise<District[]>;
  getShippingOptions(addressKey: string): Promise<ShippingOption[]>;
}
