// lib/fonts.js

import {
  Georama,
  ABeeZee,
  Albert_Sans,
  Inter,
  Alatsi,
  Assistant,
  Oxanium,
  Work_Sans,
  Encode_Sans,
  Poppins,
  Public_Sans,
  Anek_Latin,
} from "next/font/google";

export const georama = Georama({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const abeezee = ABeeZee({
  subsets: ["latin"],
  weight: ["400"],
});

export const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const alatsi = Alatsi({
  subsets: ["latin"],
  weight: ["400"],
});

export const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const worksans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const encodesans = Encode_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const publicsans = Public_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const anekLatin = Anek_Latin({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});