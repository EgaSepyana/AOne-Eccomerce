"use client";

import { Modal } from "@/shared/ui";

const SIZE_TABLE = [
  { size: "XS", chest: "82-86", waist: "62-66", length: "62" },
  { size: "S", chest: "87-91", waist: "67-71", length: "64" },
  { size: "M", chest: "92-96", waist: "72-77", length: "66" },
  { size: "L", chest: "97-102", waist: "78-84", length: "68" },
  { size: "XL", chest: "103-109", waist: "85-92", length: "70" },
  { size: "XXL", chest: "110-117", waist: "93-101", length: "72" },
];

export function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Panduan Ukuran">
      <div className="overflow-x-auto p-4">
        <table className="text-body w-full min-w-[420px] border-collapse">
          <thead>
            <tr className="border-border text-small border-b text-left font-bold uppercase">
              <th className="py-3">Ukuran</th>
              <th className="py-3">Lingkar Dada (cm)</th>
              <th className="py-3">Lingkar Pinggang (cm)</th>
              <th className="py-3">Panjang (cm)</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_TABLE.map((row) => (
              <tr key={row.size} className="border-border tabular border-b">
                <td className="py-3 font-bold">{row.size}</td>
                <td className="py-3">{row.chest}</td>
                <td className="py-3">{row.waist}</td>
                <td className="py-3">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-caption text-muted pt-4">
          Pengukuran dalam sentimeter. Jika berada di antara dua ukuran,
          disarankan memilih ukuran yang lebih besar.
        </p>
      </div>
    </Modal>
  );
}
