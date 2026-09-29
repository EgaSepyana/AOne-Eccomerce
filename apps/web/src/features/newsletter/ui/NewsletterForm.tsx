"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUIStore } from "@/shared/model/useUIStore";

const schema = z.object({
  email: z.email("Format email tidak valid"),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const showToast = useUIStore((s) => s.showToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 400));
    showToast("Berhasil daftar! Cek email untuk kode diskonmu.");
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex max-w-[380px] flex-col gap-2">
      <div className="flex">
        <input
          type="email"
          placeholder="Alamat email kamu"
          aria-label="Email"
          className="border-muted text-body placeholder:text-disabled h-12 flex-1 border border-r-0 bg-transparent px-3.5 text-white focus-visible:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-button text-ink h-12 shrink-0 bg-white px-6 font-bold tracking-[0.04em] uppercase disabled:opacity-60"
        >
          DAFTAR
        </button>
      </div>
      {errors.email?.message && (
        <span className="text-caption text-disabled">
          {errors.email.message}
        </span>
      )}
    </form>
  );
}
