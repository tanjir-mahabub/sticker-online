export interface Sticker {
    id: number;
    title: string;
    price: number;
    img: string;
    altTxt: string;
    width: number;
  }
  
export const StickerSelectorStore = [
    {
        id: 1,
        title: "Die cut stickers",
        price: 10.00,
        img: "/homepage/hero/cut.svg",
        altTxt: "Die cut stickers",
        width: 120,
        padding: 5,        
    },
    {
        id: 2,
        title: "Fyrkantiga",
        price: 8.00,
        img: "/homepage/hero/square-2.svg",
        altTxt: "square-icon",
        width: 90,
        padding: 28,  
    },
    {
        id: 3,
        title: "Runda",
        price: 7.00,
        img: "/homepage/hero/circle.svg",
        altTxt: "circle-icon",
        width: 100,
        padding: 18,
    },
    {
        id: 4,
        title: "Runda hörn",
        price: 6.00,
        img: "/homepage/hero/square.svg",
        altTxt: "Runda hörn",
        width: 100,
        padding: 20,
    }
]