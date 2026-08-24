import { stickerCatalog } from "@/data/stickerCatalog";
import type { StickerData } from "@/types/types";

const isStickerData = (value: unknown): value is StickerData => {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<StickerData>;
  return Boolean(
    data.options?.dimensions_rate &&
      Array.isArray(data.materials) && data.materials.length > 0 &&
      Array.isArray(data.antals) && data.antals.length > 0 &&
      Array.isArray(data.laminates) && data.laminates.length > 0,
  );
};

export async function fetchStickerData(): Promise<StickerData> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch("/api/v1/sticker-data", {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Catalogue request failed (${response.status})`);
    const data: unknown = await response.json();
    return isStickerData(data) ? data : stickerCatalog;
  } catch {
    return stickerCatalog;
  } finally {
    window.clearTimeout(timeout);
  }
}
