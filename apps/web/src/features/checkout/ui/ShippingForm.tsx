"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select } from "@/shared/ui";
import { formatRupiah } from "@/shared/lib/format";
import { shippingFormSchema, type ShippingFormSchema } from "../model/schema";
import { useCheckoutStore } from "../model/useCheckoutStore";
import {
  useCities,
  useDistricts,
  useProvinces,
  useShippingOptions,
} from "../api/useRegion";

export function ShippingForm({ onContinue }: { onContinue: () => void }) {
  const savedShipping = useCheckoutStore((s) => s.shipping);
  const setShipping = useCheckoutStore((s) => s.setShipping);
  const courierId = useCheckoutStore((s) => s.courierId);
  const setCourierId = useCheckoutStore((s) => s.setCourierId);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormSchema>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: savedShipping ?? {
      email: "",
      name: "",
      phone: "",
      address: "",
      provinceId: "",
      cityId: "",
      districtId: "",
      postalCode: "",
    },
  });

  const provinceId = watch("provinceId");
  const cityId = watch("cityId");

  const { data: provinces } = useProvinces();
  const { data: cities } = useCities(provinceId);
  const { data: districts } = useDistricts(cityId);
  const { data: shippingOptions } = useShippingOptions(cityId);

  useEffect(() => {
    if (!courierId && shippingOptions && shippingOptions.length > 0) {
      setCourierId(shippingOptions[0]!.id);
    }
  }, [shippingOptions, courierId, setCourierId]);

  const onSubmit = handleSubmit((values) => {
    if (!courierId) return;
    setShipping(values);
    onContinue();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="bg-subtle text-body flex items-center justify-between gap-4 p-4">
        <span>Sudah punya akun? Masuk untuk memakai alamat tersimpan.</span>
        <Link href="/login" className="font-bold underline underline-offset-4">
          Masuk
        </Link>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-h3 text-ink font-bold">Kontak</h2>
        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h3 text-ink font-bold">Alamat pengiriman</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nama lengkap"
            placeholder="Contoh: Nadia Putri"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Nomor HP"
            placeholder="08123456789"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <div className="sm:col-span-2">
            <Input
              label="Alamat lengkap"
              placeholder="Nama jalan, nomor rumah, RT/RW"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
          <Controller
            control={control}
            name="provinceId"
            render={({ field }) => (
              <Select
                label="Provinsi"
                error={errors.provinceId?.message}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue("cityId", "");
                  setValue("districtId", "");
                }}
              >
                <option value="">Pilih provinsi</option>
                {provinces?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            )}
          />
          <Controller
            control={control}
            name="cityId"
            render={({ field }) => (
              <Select
                label="Kota / Kabupaten"
                error={errors.cityId?.message}
                value={field.value}
                disabled={!provinceId}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue("districtId", "");
                }}
              >
                <option value="">Pilih kota/kabupaten</option>
                {cities?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          />
          <Controller
            control={control}
            name="districtId"
            render={({ field }) => (
              <Select
                label="Kecamatan"
                error={errors.districtId?.message}
                value={field.value}
                disabled={!cityId}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <option value="">Pilih kecamatan</option>
                {districts?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            )}
          />
          <Input
            label="Kode pos"
            placeholder="12345"
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />
        </div>
      </section>

      {shippingOptions && shippingOptions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-h3 text-ink font-bold">Metode pengiriman</h2>
          <div className="flex flex-col">
            {shippingOptions.map((option) => {
              const selected = courierId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCourierId(option.id)}
                  className={`-mt-px flex items-center gap-3.5 border p-4 text-left ${
                    selected
                      ? "border-ink z-10 border-[1.5px]"
                      : "border-border"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                      selected ? "border-ink" : "border-border"
                    }`}
                  >
                    {selected && (
                      <span className="bg-ink size-2.5 rounded-full" />
                    )}
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-body font-medium">
                      {option.label}
                    </span>
                    <span className="text-caption text-muted">
                      Estimasi tiba {option.etaLabel}
                    </span>
                  </div>
                  <span className="tabular text-body font-bold">
                    {formatRupiah(option.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Button type="submit" disabled={!courierId}>
        LANJUT KE PEMBAYARAN
      </Button>
    </form>
  );
}
