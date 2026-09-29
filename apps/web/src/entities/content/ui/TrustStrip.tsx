import { Icon } from "@/shared/ui";

const ITEMS = [
  {
    icon: "local_shipping",
    title: "Gratis ongkir",
    description: "Min. belanja Rp300.000",
  },
  {
    icon: "sync_alt",
    title: "Retur mudah",
    description: "Tukar ukuran gratis 14 hari",
  },
  {
    icon: "lock",
    title: "Pembayaran aman",
    description: "COD, VA, e-wallet, cicilan 0%",
  },
  {
    icon: "chat",
    title: "CS WhatsApp",
    description: "Setiap hari 08.00–22.00 WIB",
  },
];

export function TrustStrip() {
  return (
    <section className="border-border grid grid-cols-2 gap-6 border-y px-4 py-10 lg:grid-cols-4 lg:px-10">
      {ITEMS.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <Icon name={item.icon} size={32} />
          <div className="flex flex-col gap-1">
            <span className="text-h3 text-ink font-bold">{item.title}</span>
            <span className="text-body text-muted">{item.description}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
