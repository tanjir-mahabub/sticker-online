import {
  Red_Hat_Display,
  Ravi_Prakash,
  Reenie_Beanie,
  Ropa_Sans,
  Russo_One,
  Rock_Salt,
  Rouge_Script,
  Saira,
  Sansita,
} from 'next/font/google';

const RedHatDisplay = Red_Hat_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
});

const RaviPrakash = Ravi_Prakash({
  weight: ["400"],
  subsets: ["latin"],
});

const ReenieBeanie = Reenie_Beanie({
  weight: ["400"],
  subsets: ["latin"],
});

const RopaSans = Ropa_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

const RussoOne = Russo_One({
  weight: ["400"],
  subsets: ["latin"],
});

const RockSalt = Rock_Salt({
  weight: ["400"],
  subsets: ["latin"],
});

const RougeScript = Rouge_Script({
  weight: ["400"],
  subsets: ["latin"],
});

const SairaFont = Saira({
  weight: ["400"],
  subsets: ["latin"],
});

const SansitaFont = Sansita({
  weight: ["400"],
  subsets: ["latin"],
})


export const customizeFonts = [
  {
    id: 1,
    font: RedHatDisplay,
    fontName: 'Red Hat Display',
    path: '/fonts/Red_Hat_Display/RedHatDisplay-VariableFont_wght.ttf'
  },
  {
    id: 2,
    font: RaviPrakash,
    fontName: 'Ravi Prakash',
    path: '/fonts/Ravi_Prakash/RaviPrakash-Regular.ttf'
  },
  {
    id: 3,
    font: ReenieBeanie,
    fontName: 'Reenie Beanie',
    path: '/fonts/Reenie_Beanie/ReenieBeanie-Regular.ttf'
  },
  {
    id: 4,
    font: RopaSans,
    fontName: 'Ropa Sans',
    path: '/fonts/Ropa_Sans/RopaSans-Regular.ttf'
  },
  {
    id: 5,
    font: RussoOne,
    fontName: 'Russo One',
    path: '/fonts/Russo_One/RussoOne-Regular.ttf'
  },
  {
    id: 6,
    font: RockSalt,
    fontName: 'Rock Salt',
    path: '/fonts/Rock_Salt/RockSalt-Regular.ttf'
  },
  {
    id: 7,
    font: RougeScript,
    fontName: 'Rouge Script',
    path: '/fonts/Rouge_Script/RougeScript-Regular.ttf'
  },
  {
    id: 8,
    font: SairaFont,
    fontName: 'Saira',
    path: '/fonts/Saira/Saira-VariableFont_wdth,wght.ttf'
  },
  {
    id: 9,
    font: SansitaFont,
    fontName: 'Sansita',
    path: '/fonts/Sansita/Sansita-Regular.ttf'
  },
];


export const fontMapping: Record<string, string> = {};

customizeFonts.forEach((fontObj) => {
  fontMapping[fontObj.fontName] = fontObj.path;
});

// console.log(fontMapping);