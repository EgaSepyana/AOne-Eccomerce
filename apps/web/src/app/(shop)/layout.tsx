import { AnnouncementBar, Footer, Header, MobileMenu } from "@/features/layout";
import { CartDrawer } from "@/features/cart";
import { SearchOverlay } from "@/features/search";
import { ToastViewport } from "@/shared/ui";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <div className="sticky top-0 z-40 bg-white">
        <Header />
      </div>
      {children}
      <Footer />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <ToastViewport />
    </>
  );
}
