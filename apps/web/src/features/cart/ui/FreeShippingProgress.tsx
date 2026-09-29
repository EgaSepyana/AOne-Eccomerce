import { Icon, ProgressBar } from "@/shared/ui";
import { formatRupiah } from "@/shared/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "../lib/constants";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const eligible = remaining === 0;

  return (
    <div className="bg-subtle flex flex-col gap-2.5 p-4">
      <div className="text-body flex items-center gap-2">
        <Icon
          name="check_circle"
          size={20}
          className={eligible ? undefined : "!text-muted"}
        />
        {eligible ? (
          <span>
            Pesananmu dapat <span className="font-bold">gratis ongkir</span>
          </span>
        ) : (
          <span>
            Tambah <span className="font-bold">{formatRupiah(remaining)}</span>{" "}
            lagi untuk gratis ongkir
          </span>
        )}
      </div>
      <ProgressBar value={subtotal} max={FREE_SHIPPING_THRESHOLD} />
    </div>
  );
}
