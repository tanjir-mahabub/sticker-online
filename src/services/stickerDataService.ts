import type { StickerData } from "@/types/types";

const FALLBACK_DATA: StickerData = {
    options: { dimensions_rate: "10", api_username: "", api_password: "" },
    materials: [],
    antals: [],
    laminates: [],
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
        return await response.json() as StickerData;
    } catch {
        return FALLBACK_DATA;
    } finally {
        window.clearTimeout(timeout);
    }
};
