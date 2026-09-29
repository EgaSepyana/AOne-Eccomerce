import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: () => repositories.region.getProvinces(),
  });
}

export function useCities(provinceId: string) {
  return useQuery({
    queryKey: ["cities", provinceId],
    queryFn: () => repositories.region.getCities(provinceId),
    enabled: !!provinceId,
  });
}

export function useDistricts(cityId: string) {
  return useQuery({
    queryKey: ["districts", cityId],
    queryFn: () => repositories.region.getDistricts(cityId),
    enabled: !!cityId,
  });
}

export function useShippingOptions(addressKey: string) {
  return useQuery({
    queryKey: ["shipping-options", addressKey],
    queryFn: () => repositories.region.getShippingOptions(),
    enabled: !!addressKey,
  });
}
