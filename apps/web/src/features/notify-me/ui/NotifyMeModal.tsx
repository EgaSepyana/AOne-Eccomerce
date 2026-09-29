"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUIStore } from "@/shared/model/useUIStore";
import { Button, Input, Modal } from "@/shared/ui";

const schema = z.object({
  email: z.email("Format email tidak valid"),
});

type FormValues = z.infer<typeof schema>;

export interface NotifyMeModalProps {
  open: boolean;
  onClose: () => void;
  size: string;
}

export function NotifyMeModal({ open, onClose, size }: NotifyMeModalProps) {
  const showToast = useUIStore((s) => s.showToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 400));
    showToast(`Kami akan kabari saat ukuran ${size} tersedia`);
    reset();
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title="Beri Tahu Saya">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
        <p className="text-body text-muted">
          Ukuran {size} sedang habis. Masukkan email untuk mendapat notifikasi
          saat tersedia kembali.
        </p>
        <Input
          type="email"
          label="Email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" loading={isSubmitting}>
          KIRIM
        </Button>
      </form>
    </Modal>
  );
}
