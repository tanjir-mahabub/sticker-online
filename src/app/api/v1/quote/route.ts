import { NextRequest, NextResponse } from "next/server";
import { findCatalogItem, stickerCatalog } from "@/data/stickerCatalog";

interface QuoteRequest {
  widthCm: number;
  heightCm: number;
  materialId: number;
  laminateId: number;
  quantityId: number;
}

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<QuoteRequest> | null;
  if (!body || !isPositiveNumber(body.widthCm) || !isPositiveNumber(body.heightCm)) {
    return NextResponse.json({ error: "Width and height must be positive numbers." }, { status: 400 });
  }
  if (body.widthCm > 100 || body.heightCm > 100) {
    return NextResponse.json({ error: "Maximum supported dimension is 100 cm." }, { status: 422 });
  }

  const material = findCatalogItem(stickerCatalog.materials, Number(body.materialId));
  const laminate = findCatalogItem(stickerCatalog.laminates, Number(body.laminateId));
  const quantity = findCatalogItem(stickerCatalog.antals, Number(body.quantityId));
  if (!material || !laminate || !quantity) {
    return NextResponse.json({ error: "Unknown material, laminate, or quantity option." }, { status: 422 });
  }

  const quantityCount = Number.parseInt(quantity.st, 10);
  const areaFactor = Math.max(1, (body.widthCm * body.heightCm) / 100);
  const subtotal = quantity.cost + material.cost * areaFactor + laminate.cost * areaFactor;
  const total = Math.round(subtotal * 100) / 100;

  return NextResponse.json({
    currency: "SEK",
    quantity: quantityCount,
    unitPrice: Math.round((total / quantityCount) * 100) / 100,
    subtotal: total,
    total,
    breakdown: { base: quantity.cost, material: material.cost * areaFactor, laminate: laminate.cost * areaFactor },
    selection: { material: material.label, laminate: laminate.st, dimensions: `${body.widthCm} × ${body.heightCm} cm` },
    generatedAt: new Date().toISOString(),
  });
}
