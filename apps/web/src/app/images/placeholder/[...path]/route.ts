import { NextResponse } from "next/server";

function isSquarePath(fullPath: string): boolean {
  return (
    fullPath.includes("/1:1/") ||
    fullPath.includes("tile") ||
    fullPath.startsWith("category/") ||
    fullPath.startsWith("ugc/")
  );
}

function isWidePath(fullPath: string): boolean {
  return (
    fullPath.startsWith("hero/") ||
    fullPath.startsWith("lookbook/") ||
    fullPath.startsWith("banner/") ||
    fullPath.startsWith("collab/")
  );
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/images/placeholder/[...path]">,
) {
  const { path } = await params;
  const fullPath = path.join("/");
  const width = 1200;
  const height = isSquarePath(fullPath)
    ? 1200
    : isWidePath(fullPath)
      ? 514
      : 1600;

  const seed = fullPath.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/\//g, "-");
  const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

  const upstream = await fetch(picsumUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Failed to fetch placeholder image", { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
