"use client";

import Image from "next/image";
import { useState } from "react";
import {
  fitDistribution,
  ratingDistribution,
  type Review,
} from "@/entities/review";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

const FIT_LABEL: Record<Review["fit"], string> = {
  kekecilan: "Kekecilan",
  pas: "Pas",
  kebesaran: "Kebesaran",
};

export function ReviewsSection({
  rating,
  reviewCount,
  reviews,
}: {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [photoOnly, setPhotoOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const distribution = ratingDistribution(reviews);
  const fit = fitDistribution(reviews);

  const filtered = reviews.filter((r) => {
    if (ratingFilter && r.rating !== ratingFilter) return false;
    if (photoOnly && (!r.photos || r.photos.length === 0)) return false;
    return true;
  });

  const visibleReviews = filtered.slice(0, visibleCount);
  const withPhotoCount = reviews.filter(
    (r) => r.photos && r.photos.length > 0,
  ).length;

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-6">
        <h2 className="text-h2 text-ink lg:text-h2-lg font-bold">Ulasan</h2>
        <div className="flex items-end gap-3">
          <span className="text-display leading-none font-bold">
            {rating.toFixed(1)}
          </span>
          <div className="flex flex-col gap-0.5 pb-1">
            <span className="tracking-widest">
              {"★".repeat(Math.round(rating))}
            </span>
            <span className="text-small text-muted">{reviewCount} ulasan</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {distribution.map((row) => (
            <div
              key={row.star}
              className="text-small tabular flex items-center gap-3"
            >
              <span className="w-6">{row.star}★</span>
              <span className="bg-border relative h-1 flex-1">
                <span
                  className="bg-ink absolute inset-y-0 left-0"
                  style={{ width: `${row.percent}%` }}
                />
              </span>
              <span className="text-muted w-6 text-right">{row.count}</span>
            </div>
          ))}
        </div>
        {reviews.length > 0 && (
          <div className="border-border flex flex-col gap-3 border-t pt-6">
            <span className="text-body font-bold">Ukuran</span>
            <div className="relative h-3">
              <span className="bg-border absolute inset-x-0 top-1.5 h-0.5" />
              <span className="bg-border absolute top-0.5 left-0 size-2.5 rounded-full" />
              <span
                className="bg-ink absolute top-0 size-3 rounded-full"
                style={{ left: `calc(${fit.pas}% - 6px)` }}
              />
              <span className="bg-border absolute top-0.5 right-0 size-2.5 rounded-full" />
            </div>
            <div className="text-caption text-muted flex justify-between">
              <span>Kekecilan</span>
              <span className="text-ink font-medium">
                {FIT_LABEL[fit.dominant]} ({fit[fit.dominant]}%)
              </span>
              <span>Kebesaran</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setRatingFilter(null);
              setPhotoOnly(false);
            }}
            className={cn(
              "text-small flex h-9 items-center border px-3.5",
              !ratingFilter && !photoOnly
                ? "border-ink bg-ink text-white"
                : "border-border",
            )}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setPhotoOnly((v) => !v)}
            className={cn(
              "text-small flex h-9 items-center border px-3.5",
              photoOnly ? "border-ink bg-ink text-white" : "border-border",
            )}
          >
            Dengan foto ({withPhotoCount})
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                setRatingFilter(ratingFilter === star ? null : star)
              }
              className={cn(
                "text-small flex h-9 items-center border px-3.5",
                ratingFilter === star
                  ? "border-ink bg-ink text-white"
                  : "border-border",
              )}
            >
              {star}★
            </button>
          ))}
        </div>

        {visibleReviews.length === 0 ? (
          <p className="text-body text-muted">
            Belum ada ulasan yang cocok dengan filter ini.
          </p>
        ) : (
          visibleReviews.map((review) => (
            <div
              key={review.id}
              className="border-border flex flex-col gap-2.5 border-t pt-6"
            >
              <div className="text-small flex justify-between">
                <span className="tracking-widest">
                  {"★".repeat(review.rating)}
                </span>
                <span className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <span className="text-h3 text-ink font-bold">{review.title}</span>
              <p className="text-body text-ink line-clamp-4 max-w-[720px]">
                {review.body}
              </p>
              <span className="text-caption text-muted">
                {review.author}
                {review.heightCm ? ` · Tinggi ${review.heightCm} cm` : ""} ·
                Beli {review.sizeBought} · {FIT_LABEL[review.fit]}
              </span>
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2">
                  {review.photos.map((photo) => (
                    <div key={photo} className="bg-subtle relative size-18">
                      <Image
                        src={photo}
                        alt="Foto ulasan"
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="text-small flex items-center gap-1.5 self-start"
              >
                <Icon name="thumb_up" size={18} />
                Membantu ({review.helpful})
              </button>
            </div>
          ))
        )}

        {visibleCount < filtered.length && (
          <Button
            variant="secondary"
            onClick={() => setVisibleCount((c) => c + 5)}
            className="self-start"
          >
            LIHAT SEMUA {reviewCount} ULASAN
          </Button>
        )}
      </div>
    </section>
  );
}
