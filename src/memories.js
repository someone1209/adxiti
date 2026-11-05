import photo1 from "../images/photo1.jpg";
import photo2 from "../images/photo2.jpg";
import photo3 from "../images/photo3.jpg";
import photo4 from "../images/photo4.jpg";
import photo5 from "../images/photo5.jpg";
import photo6 from "../images/photo6.jpg";
import photo7 from "../images/photo7.jpg";
import photo8 from "../images/photo8.jpg";

// Keep captions and alt text grounded in supplied content; dates and notes stay blank until provided.
export const memories = [
  { src: photo1, title: "A little hello", caption: "a face i adore", alt: "A close-up portrait", date: "", note: "", layout: "tall", width: 720, height: 1280 },
  { src: photo2, title: "A playful moment", caption: "a little playful", alt: "A playful moment", date: "", note: "", layout: "short", width: 899, height: 1599, rotate: true, rotation: Math.PI / 2 },
  { src: photo3, title: "In your colors", caption: "you, in your element", alt: "A lovely day out", date: "", note: "", layout: "mid", width: 1080, height: 1440 },
  { src: photo4, title: "Framed with love", caption: "a soft little moment", alt: "A quiet selfie", date: "", note: "", layout: "tall", width: 899, height: 1599 },
  { src: photo5, title: "Sunday glow", caption: "just another sunday", alt: "A relaxed Sunday portrait", date: "", note: "", layout: "short", width: 1080, height: 1440 },
  { src: photo6, title: "That bright smile", caption: "that lovely smile", alt: "Smiling in a favorite place", date: "", note: "", layout: "mid", width: 1080, height: 1920, featured: true, heroCaption: "a little moment i keep close" },
  { src: photo7, title: "A favorite laugh", caption: "one for the heart", alt: "A favorite close-up", date: "", note: "", layout: "short", width: 1080, height: 1920 },
  { src: photo8, title: "A soft little pause", caption: "a moment to keep", alt: "A favorite portrait", date: "", note: "", layout: "mid", width: 1080, height: 1920, rotate: true, rotation: Math.PI / 2 },
];
