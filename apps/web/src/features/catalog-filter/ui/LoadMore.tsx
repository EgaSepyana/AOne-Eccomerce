import { Button, ProgressBar } from "@/shared/ui";

export function LoadMore({
  shown,
  total,
  onLoadMore,
  loading,
}: {
  shown: number;
  total: number;
  onLoadMore: () => void;
  loading?: boolean;
}) {
  if (shown >= total) return null;

  return (
    <div className="flex flex-col items-center gap-4 pt-16">
      <span className="text-body text-muted">
        Menampilkan {shown} dari {total}
      </span>
      <ProgressBar value={shown} max={total} className="w-60" />
      <Button
        variant="secondary"
        onClick={onLoadMore}
        loading={loading}
        className="mt-2 w-80 max-w-full"
      >
        MUAT LEBIH BANYAK
      </Button>
    </div>
  );
}
