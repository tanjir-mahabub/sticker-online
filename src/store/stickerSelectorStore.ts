export interface Sticker {
    id: number;
    title: string;
    price: number;
    img: string;
    altTxt: string;
    width: number;
  }
  
export const stickerSelectorStore = [
    {
        id: 1,
        title: "Die cut stickers",
        price: 10.00,
        img: "/homepage/hero/cut.svg",
        altTxt: "cut-icon",
        width: 120        
    },
    {
        id: 2,
        title: "Fyrkantiga",
        price: 8.00,
        img: "/homepage/hero/square.svg",
        altTxt: "square-icon",
        width: 100  
    },
    {
        id: 3,
        title: "Runda",
        price: 7.00,
        img: "/homepage/hero/circle.svg",
        altTxt: "circle-icon",
        width: 100
    },
    {
        id: 4,
        title: "Runda hörn",
        price: 6.00,
        img: "/homepage/hero/square-2.svg",
        altTxt: "squareTwoIcon",
        width: 90
    }
]