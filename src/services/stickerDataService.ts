import type { StickerData } from "@/types/types";
import materialStore from "@/store/materialStore";

const FALLBACK_DATA: StickerData = {
    options: { dimensions_rate: "10", api_username: "", api_password: "" },
    materials: materialStore,
    antals: [
        { id: 1, object_id: 1, st: "500 st", cost: 4990, rate: "10", value: "500-st" },
        { id: 2, object_id: 2, st: "200 st", cost: 2590, rate: "13.5", value: "200-st" },
        { id: 3, object_id: 3, st: "100 st", cost: 1490, rate: "14.9", value: "100-st" },
        { id: 4, object_id: 4, st: "50 st", cost: 890, rate: "17.8", value: "50-st" },
        { id: 5, object_id: 5, st: "25 st", cost: 490, rate: "19.9", value: "25-st" },
        { id: 6, object_id: 6, st: "10 st", cost: 240, rate: "24.5", value: "10-st" },
    ],
    laminates: [
        { id: 1, object_id: 1, st: "Glossy", value: "glossy", cost: 5 },
        { id: 2, object_id: 2, st: "Matte", value: "matte", cost: 10 },
        { id: 3, object_id: 3, st: "Soft touch", value: "soft-touch", cost: 15 },
    ],
};

const isStickerData = (value: unknown): value is StickerData => {
    if (!value || typeof value !== "object") return false;
    const data = value as Partial<StickerData>;
    return Boolean(
        data.options?.dimensions_rate &&
        Array.isArray(data.materials) && data.materials.length > 0 &&
        Array.isArray(data.antals) && data.antals.length > 0 &&
        Array.isArray(data.laminates) && data.laminates.length > 0
    );
};

export const fetchStickerData = async (): Promise<StickerData> => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL;
    if (!endpoint) return FALLBACK_DATA;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        const data: unknown = await response.json();
        return isStickerData(data) ? data : FALLBACK_DATA;
    } catch {
        return FALLBACK_DATA;
    } finally {
        window.clearTimeout(timeout);
    }
};
