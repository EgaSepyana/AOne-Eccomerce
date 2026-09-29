"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getActiveVariant,
  isSoldOut,
  ProductCarousel,
  ProductGallery,
  useCompleteTheLook,
  useRelatedProducts,
  type Product,
} from "@/entities/product";
import { useReviews } from "@/entities/review";
import { AddToCartButton, useCartStore } from "@/features/cart";
import {
  useRecentStore,
  useRecentlyViewedProducts,
} from "@/features/recently-viewed";
import { NotifyMeModal } from "@/features/notify-me";
import { SizeFinderDrawer, SizeGuideModal } from "@/features/size-finder";
import { useWishlistStore, WishlistProductCarousel } from "@/features/wishlist";
import { useDisclosure } from "@/shared/hooks/useDisclosure";
import { useOnScreen } from "@/shared/hooks/useOnScreen";
import { useUIStore } from "@/shared/model/useUIStore";
import {
  Accordion,
  Breadcrumb,
  Button,
  Icon,
  Price,
  QuantityStepper,
  Rating,
  shakeElement,
  SizeSelector,
  SwatchGroup,
} from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { formatRupiah } from "@/shared/lib/format";
import { CompleteTheLook } from "./CompleteTheLook";
import { ReviewsSection } from "./ReviewsSection";

const GENDER_LABEL: Record<Product["gender"], string> = {
  wanita: "Wanita",
  pria: "Pria",
  anak: "Anak",
};

export function PdpView({ product }: { product: Product }) {
  const router = useRouter();
  const [colorId, setColorId] = useState(product.variants[0]!.color.id);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [shakeSize, setShakeSize] = useState(false);
  const sizeGroupRef = useRef<HTMLDivElement>(null);

  const sizeGuide = useDisclosure();
  const sizeFinder = useDisclosure();
  const notifyMe = useDisclosure();
  const [notifySize, setNotifySize] = useState("");
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaVisible = useOnScreen(ctaRef);

  const addToCart = useCartStore((s) => s.add);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const showToast = useUIStore((s) => s.showToast);
  const addRecentlyViewed = useRecentStore((s) => s.addRecentlyViewed);

  const variant = getActiveVariant(product, colorId);
  const soldOut = isSoldOut(variant);
  const sizeStock = variant.sizes.find((s) => s.label === size);

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const { data: related } = useRelatedProducts(product.id);
  const { data: completeTheLook } = useCompleteTheLook(product.id);
  const { data: reviewData } = useReviews(product.id);
  const recentlyViewed = useRecentlyViewedProducts(product.id);

  function handleAddToCart(): boolean {
    if (!size) {
      setShakeSize(true);
      if (sizeGroupRef.current) shakeElement(sizeGroupRef.current);
      setTimeout(() => setShakeSize(false), 600);
      return false;
    }
    addToCart({ productId: product.id, colorId, size, qty });
    setCartDrawerOpen(true);
    return true;
  }

  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  function handleToggleWishlist() {
    toggleWishlist(product.id);
    if (!isWishlisted) {
      showToast("Ditambahkan ke wishlist", {
        label: "Lihat",
        onClick: () => router.push("/wishlist"),
      });
    } else {
      showToast("Dihapus dari wishlist");
    }
  }

  return (
    <div className="pb-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 pt-6 sm:gap-12 lg:grid-cols-[3fr_2fr] lg:px-10">
        <ProductGallery images={variant.images} />

        <div className="flex flex-col gap-6 lg:sticky lg:top-[100px]">
          <div className="flex flex-col gap-2">
            <Breadcrumb
              items={[
                { label: "Beranda", href: "/" },
                {
                  label: GENDER_LABEL[product.gender],
                  href: `/c/${product.gender}`,
                },
                {
                  label: product.category,
                  href: `/c/${product.gender}/${product.category}`,
                },
              ]}
            />
            <h1 className="text-h1 text-ink pt-2 font-bold text-balance">
              {product.name}
            </h1>
            <span className="text-caption text-muted">
              Kode produk: {product.code}
            </span>
            <a href="#ulasan" className="text-body flex items-center gap-1.5">
              <Rating value={product.rating} />
              <span className="text-muted underline underline-offset-4">
                {product.reviewCount} ulasan
              </span>
            </a>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="tabular flex items-center gap-3">
              <span className="text-ink text-[28px] leading-[34px] font-bold">
                {formatRupiah(product.price)}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <>
                    <span className="text-muted text-[16px] line-through">
                      {formatRupiah(product.compareAtPrice)}
                    </span>
                    <span className="bg-ink px-1.5 py-1 text-[11px] font-bold text-white">
                      -
                      {Math.round(
                        (1 - product.price / product.compareAtPrice) * 100,
                      )}
                      %
                    </span>
                  </>
                )}
            </div>
            <span className="text-caption text-muted">
              atau 3×{" "}
              <span className="text-ink font-medium">
                {formatRupiah(product.price / 3)}
              </span>{" "}
              cicilan 0% ·{" "}
              <span className="underline underline-offset-4">Lihat detail</span>
            </span>
          </div>

          <div className="border-border flex flex-col gap-3 border-t pt-6">
            <span className="text-body">
              <span className="font-bold">Warna:</span> {variant.color.name}
            </span>
            <SwatchGroup
              colors={product.variants.map((v) => ({
                id: v.color.id,
                name: v.color.name,
                hex: v.color.hex,
                soldOut: isSoldOut(v),
              }))}
              selectedId={colorId}
              onSelect={(id) => {
                setColorId(id);
                setSize(undefined);
              }}
              max={product.variants.length}
              size="lg"
            />
          </div>

          <div ref={sizeGroupRef} className="flex flex-col gap-3">
            <div className="text-body flex items-center gap-4">
              <span className="flex-1">
                <span className="font-bold">Ukuran:</span>{" "}
                {size ?? "Pilih ukuran"}
              </span>
              <button
                type="button"
                onClick={sizeGuide.open}
                className="flex items-center gap-1 underline underline-offset-4"
              >
                <Icon name="straighten" size={18} />
                Panduan ukuran
              </button>
              <button
                type="button"
                onClick={sizeFinder.open}
                className="underline underline-offset-4"
              >
                Cari ukuranmu
              </button>
            </div>
            <SizeSelector
              sizes={variant.sizes}
              selected={size}
              size="lg"
              wrap
              onSelect={setSize}
              onSelectSoldOut={(label) => {
                setNotifySize(label);
                notifyMe.open();
              }}
            />
            {shakeSize && (
              <span className="text-caption text-ink font-medium">
                Pilih ukuran dulu
              </span>
            )}
            {sizeStock && sizeStock.stock > 0 && sizeStock.stock <= 3 && (
              <span className="text-small text-ink flex items-center gap-1.5 font-medium">
                <Icon name="error" size={18} />
                Sisa {sizeStock.stock} untuk ukuran {size}
              </span>
            )}
          </div>

          <div ref={ctaRef} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <QuantityStepper value={qty} onChange={setQty} />
              <AddToCartButton
                className="flex-1"
                disabled={soldOut}
                onAddToCart={handleAddToCart}
                idleLabel={soldOut ? "STOK HABIS" : "TAMBAH KE KERANJANG"}
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleToggleWishlist}
              className="h-12 w-full gap-2 text-[14px] font-bold tracking-[0.04em]"
            >
              <Icon
                name="favorite"
                size={20}
                className={cn(
                  isWishlisted && "[font-variation-settings:'FILL'_1]",
                )}
              />
              {isWishlisted ? "DI WISHLIST" : "TAMBAH KE WISHLIST"}
            </Button>
          </div>

          <div className="bg-subtle flex flex-col gap-3 p-4">
            <div className="text-small flex items-center gap-3">
              <Icon name="local_shipping" size={22} />
              <span>Gratis ongkir min. Rp300.000 · Estimasi tiba 2–4 hari</span>
            </div>
            <div className="text-small flex items-center gap-3">
              <Icon name="sync_alt" size={22} />
              <span>Tukar ukuran gratis 14 hari</span>
            </div>
            <div className="text-small flex items-center gap-3">
              <Icon name="credit_card" size={22} />
              <span>COD, transfer, e-wallet, cicilan 0%</span>
            </div>
          </div>

          <Accordion defaultOpen={["deskripsi"]}>
            <Accordion.Item id="deskripsi">
              <Accordion.Trigger>Deskripsi</Accordion.Trigger>
              <Accordion.Content>
                <p className="mb-2">{product.description}</p>
                <ul className="flex flex-col gap-1">
                  {product.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="bahan">
              <Accordion.Trigger>Bahan &amp; Perawatan</Accordion.Trigger>
              <Accordion.Content>
                <p className="mb-2">{product.material}</p>
                <ul className="flex flex-col gap-1">
                  {product.care.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="ukuran-fit">
              <Accordion.Trigger>Ukuran &amp; Fit</Accordion.Trigger>
              <Accordion.Content>
                <p>
                  Fit: {product.fit ?? "Regular"}. Lihat panduan ukuran untuk
                  detail pengukuran.
                </p>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="pengiriman">
              <Accordion.Trigger>
                Pengiriman &amp; Pengembalian
              </Accordion.Trigger>
              <Accordion.Content>
                <p>
                  Dikirim dalam 1-2 hari kerja. Pengembalian gratis dalam 14
                  hari jika ukuran tidak sesuai.
                </p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>

      {!ctaVisible && (
        <div className="border-border shadow-overlay fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t bg-white p-4 lg:hidden">
          <div className="flex-1">
            <Price
              amount={product.price}
              compareAtAmount={product.compareAtPrice}
            />
          </div>
          <AddToCartButton
            disabled={soldOut}
            onAddToCart={handleAddToCart}
            idleLabel={soldOut ? "STOK HABIS" : "TAMBAH KE KERANJANG"}
          />
        </div>
      )}

      {completeTheLook && completeTheLook.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-4 pt-24 lg:px-10">
          <CompleteTheLook mainProduct={product} items={completeTheLook} />
        </div>
      )}

      <div id="ulasan" className="mx-auto max-w-[1440px] px-4 pt-24 lg:px-10">
        <ReviewsSection
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviews={reviewData?.items ?? []}
        />
      </div>

      {related && related.length > 0 && (
        <div className="mx-auto max-w-[1440px] pt-24">
          <ProductCarousel title="Produk Serupa" products={related} />
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="mx-auto max-w-[1440px] pt-24">
          <WishlistProductCarousel
            title="Terakhir Dilihat"
            products={recentlyViewed}
          />
        </div>
      )}

      <SizeGuideModal open={sizeGuide.isOpen} onClose={sizeGuide.close} />
      <SizeFinderDrawer
        open={sizeFinder.isOpen}
        onClose={sizeFinder.close}
        availableSizes={variant.sizes
          .filter((s) => s.stock > 0)
          .map((s) => s.label)}
        onSelectSize={setSize}
      />
      <NotifyMeModal
        open={notifyMe.isOpen}
        onClose={notifyMe.close}
        size={notifySize}
      />
    </div>
  );
}
