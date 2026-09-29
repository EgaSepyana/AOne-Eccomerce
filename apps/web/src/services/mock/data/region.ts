import type {
  City,
  District,
  Province,
  ShippingOption,
} from "@/services/repositories/RegionRepository";

export const provinces: Province[] = [
  { id: "prov-dki", name: "DKI Jakarta" },
  { id: "prov-jabar", name: "Jawa Barat" },
  { id: "prov-jatim", name: "Jawa Timur" },
  { id: "prov-bali", name: "Bali" },
  { id: "prov-sumut", name: "Sumatera Utara" },
];

export const cities: City[] = [
  { id: "city-jaksel", provinceId: "prov-dki", name: "Jakarta Selatan" },
  { id: "city-jakpus", provinceId: "prov-dki", name: "Jakarta Pusat" },
  { id: "city-jaktim", provinceId: "prov-dki", name: "Jakarta Timur" },

  { id: "city-bandung", provinceId: "prov-jabar", name: "Bandung" },
  { id: "city-bekasi", provinceId: "prov-jabar", name: "Bekasi" },
  { id: "city-depok", provinceId: "prov-jabar", name: "Depok" },

  { id: "city-surabaya", provinceId: "prov-jatim", name: "Surabaya" },
  { id: "city-malang", provinceId: "prov-jatim", name: "Malang" },

  { id: "city-denpasar", provinceId: "prov-bali", name: "Denpasar" },
  { id: "city-badung", provinceId: "prov-bali", name: "Badung" },

  { id: "city-medan", provinceId: "prov-sumut", name: "Medan" },
];

export const districts: District[] = [
  { id: "dist-kebayoran-baru", cityId: "city-jaksel", name: "Kebayoran Baru" },
  { id: "dist-tebet", cityId: "city-jaksel", name: "Tebet" },
  { id: "dist-pancoran", cityId: "city-jaksel", name: "Pancoran" },

  { id: "dist-menteng", cityId: "city-jakpus", name: "Menteng" },
  { id: "dist-gambir", cityId: "city-jakpus", name: "Gambir" },

  { id: "dist-cakung", cityId: "city-jaktim", name: "Cakung" },
  { id: "dist-duren-sawit", cityId: "city-jaktim", name: "Duren Sawit" },

  { id: "dist-coblong", cityId: "city-bandung", name: "Coblong" },
  { id: "dist-sukajadi", cityId: "city-bandung", name: "Sukajadi" },

  { id: "dist-bekasi-timur", cityId: "city-bekasi", name: "Bekasi Timur" },
  { id: "dist-bekasi-barat", cityId: "city-bekasi", name: "Bekasi Barat" },

  { id: "dist-beji", cityId: "city-depok", name: "Beji" },
  { id: "dist-cimanggis", cityId: "city-depok", name: "Cimanggis" },

  { id: "dist-gubeng", cityId: "city-surabaya", name: "Gubeng" },
  { id: "dist-rungkut", cityId: "city-surabaya", name: "Rungkut" },

  { id: "dist-klojen", cityId: "city-malang", name: "Klojen" },

  {
    id: "dist-denpasar-selatan",
    cityId: "city-denpasar",
    name: "Denpasar Selatan",
  },
  {
    id: "dist-denpasar-barat",
    cityId: "city-denpasar",
    name: "Denpasar Barat",
  },

  { id: "dist-kuta", cityId: "city-badung", name: "Kuta" },
  { id: "dist-mengwi", cityId: "city-badung", name: "Mengwi" },

  { id: "dist-medan-baru", cityId: "city-medan", name: "Medan Baru" },
  { id: "dist-medan-timur", cityId: "city-medan", name: "Medan Timur" },
];

export const shippingOptions: ShippingOption[] = [
  {
    id: "ship-reguler",
    label: "Reguler",
    price: 15000,
    etaLabel: "2-4 hari kerja",
  },
  {
    id: "ship-express",
    label: "Express",
    price: 29000,
    etaLabel: "1-2 hari kerja",
  },
  {
    id: "ship-instan",
    label: "Instan",
    price: 45000,
    etaLabel: "Sampai hari ini",
  },
];
