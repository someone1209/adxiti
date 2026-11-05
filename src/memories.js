const photo1 = {
  src: new URL("../images/photo1-720.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo1-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo1-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo1-720.webp", import.meta.url).href} 720w`,
};
const photo2 = {
  src: new URL("../images/photo2-899.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo2-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo2-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo2-899.webp", import.meta.url).href} 899w`,
};
const photo3 = {
  src: new URL("../images/photo3-1024.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo3-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo3-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo3-1024.webp", import.meta.url).href} 1024w`,
};
const photo4 = {
  src: new URL("../images/photo4-899.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo4-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo4-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo4-899.webp", import.meta.url).href} 899w`,
};
const photo5 = {
  src: new URL("../images/photo5-1024.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo5-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo5-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo5-1024.webp", import.meta.url).href} 1024w`,
};
const photo6 = {
  src: new URL("../images/photo6-1024.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo6-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo6-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo6-1024.webp", import.meta.url).href} 1024w`,
};
const photo7 = {
  src: new URL("../images/photo7-1024.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo7-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo7-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo7-1024.webp", import.meta.url).href} 1024w`,
};
const photo8 = {
  src: new URL("../images/photo8-1024.webp", import.meta.url).href,
  srcSet: `${new URL("../images/photo8-320.webp", import.meta.url).href} 320w, ${new URL("../images/photo8-640.webp", import.meta.url).href} 640w, ${new URL("../images/photo8-1024.webp", import.meta.url).href} 1024w`,
};

// Keep captions and alt text grounded in supplied content; dates and notes stay blank until provided.
export const memories = [
  { ...photo1, title: "A little hello", caption: "a face i adore", alt: "A close-up portrait", date: "", note: "", layout: "tall", width: 720, height: 1280 },
  { ...photo2, title: "A playful moment", caption: "a little playful", alt: "A playful moment", date: "", note: "", layout: "short", width: 899, height: 1599, rotate: true, rotation: Math.PI / 2 },
  { ...photo3, title: "In your colors", caption: "you, in your element", alt: "A lovely day out", date: "", note: "", layout: "mid", width: 1080, height: 1440 },
  { ...photo4, title: "Framed with love", caption: "a soft little moment", alt: "A quiet selfie", date: "", note: "", layout: "tall", width: 899, height: 1599 },
  { ...photo5, title: "Sunday glow", caption: "just another sunday", alt: "A relaxed Sunday portrait", date: "", note: "", layout: "short", width: 1080, height: 1440 },
  { ...photo6, title: "That bright smile", caption: "that lovely smile", alt: "Smiling in a favorite place", date: "", note: "", layout: "mid", width: 1080, height: 1920, featured: true, heroCaption: "a little moment i keep close" },
  { ...photo7, title: "A favorite laugh", caption: "one for the heart", alt: "A favorite close-up", date: "", note: "", layout: "short", width: 1080, height: 1920 },
  { ...photo8, title: "A soft little pause", caption: "a moment to keep", alt: "A favorite portrait", date: "", note: "", layout: "mid", width: 1080, height: 1920, rotate: true, rotation: Math.PI / 2 },
];
