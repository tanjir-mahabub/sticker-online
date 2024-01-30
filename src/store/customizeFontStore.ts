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
    },
    {
      id: 2,      
      font: RaviPrakash,
      fontName: 'Ravi Prakash', 
    },
    {
      id: 3,      
      font: ReenieBeanie,
      fontName: 'Reenie Beanie', 
    },
    {
      id: 4,      
      font: RopaSans,
      fontName: 'Ropa Sans', 
    },
    {
      id: 5,      
      font: RussoOne,
      fontName: 'Russo One', 
    },
    {
      id: 6,      
      font: RockSalt,
      fontName: 'Rock Salt', 
    },
    {
      id: 7,      
      font: RougeScript,
      fontName: 'Rouge Script', 
    },
    {
      id: 8,      
      font: SairaFont,
      fontName: 'Saira', 
    },
    {
      id: 9,      
      font: SansitaFont,
      fontName: 'Sansita', 
    },
  ];
  