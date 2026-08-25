import type { StickerData } from "@/types/types";
import materialStore from "@/store/materialStore";

export const stickerCatalog: StickerData = {
  options: { dimensions_rate: "10", api_username: "", api_password: "" },
  materials: materialStore,
  antals: [
    { id: 1, object_id: 1, st: "500 pcs", cost: 4990, rate: "10", value: "500-st" },
    { id: 2, object_id: 2, st: "200 pcs", cost: 2590, rate: "13.5", value: "200-st" },
    { id: 3, object_id: 3, st: "100 pcs", cost: 1490, rate: "14.9", value: "100-st" },
    { id: 4, object_id: 4, st: "50 pcs", cost: 890, rate: "17.8", value: "50-st" },
    { id: 5, object_id: 5, st: "25 pcs", cost: 490, rate: "19.9", value: "25-st" },
    { id: 6, object_id: 6, st: "10 pcs", cost: 240, rate: "24.5", value: "10-st" },
  ],
  laminates: [
    { id: 1, object_id: 1, st: "Glossy", value: "glossy", cost: 5 },
    { id: 2, object_id: 2, st: "Matte", value: "matte", cost: 10 },
    { id: 3, object_id: 3, st: "Soft touch", value: "soft-touch", cost: 15 },
  ],
};

export const findCatalogItem = <T extends { id: number }>(items: T[], id: number) =>
  items.find((item) => item.id === id);
