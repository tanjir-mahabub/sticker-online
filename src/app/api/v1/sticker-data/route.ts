import { NextResponse } from "next/server";
import { stickerCatalog } from "@/data/stickerCatalog";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(stickerCatalog, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-API-Version": "1.0",
    },
  });
}
