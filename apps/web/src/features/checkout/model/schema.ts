import { z } from "zod";

export const shippingFormSchema = z.object({
  email: z.email("Format email tidak valid"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z
    .string()
    .min(10, "Nomor HP harus diawali 08 atau +62, minimal 10 digit")
    .regex(
      /^(\+62|0)[0-9]{9,14}$/,
      "Nomor HP harus diawali 08 atau +62, minimal 10 digit",
    ),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  provinceId: z.string().min(1, "Pilih provinsi"),
  cityId: z.string().min(1, "Pilih kota/kabupaten"),
  districtId: z.string().min(1, "Pilih kecamatan"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Kode pos harus 5 digit angka"),
});

export type ShippingFormSchema = z.infer<typeof shippingFormSchema>;
