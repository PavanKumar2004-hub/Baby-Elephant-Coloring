export interface ColoringBookData {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  badge: string;
  pageCount: number;
  targetAge: string;
  description: string;
  theme: string;
  sheetIds: string[];
  features: string[];
}

export const COLORING_BOOKS: ColoringBookData[] = [
  {
    id: "book-tom-jerry-vol1",
    title: "Tom & Jerry Coloring Book",
    subtitle: "Side-by-Side Color & Learn Edition",
    coverImage: "/assets/branding/book_cover_banner.jpg",
    badge: "Official Publication",
    pageCount: 7,
    targetAge: "Ages 3-9",
    description: "Filled color picture on the left side and matching black-and-white outline on the right side — designed to make coloring fun and easy for kids! Published by Baby Elephant Books.",
    theme: "from-amber-400 via-orange-400 to-indigo-600",
    sheetIds: [
      "tj-cheese-chase",
      "tj-birthday-cake",
      "tj-park-picnic",
      "tj-cookie-sneak"
    ],
    features: [
      "Side-by-side color reference guides",
      "Little Artist's Crayon Guide with 6-color palette",
      "Thick child-friendly ink outlines",
      "Personalized 'This Book Belongs To' dedication page",
      "Certificate of Creativity Diploma on the back cover"
    ]
  },
  {
    id: "book-animals-world",
    title: "Baby Elephant & Wild Friends",
    subtitle: "A Joyful Safari Coloring Adventure",
    coverImage: "/assets/sheets/elephant_river.webp",
    badge: "Bestseller",
    pageCount: 8,
    targetAge: "Ages 2-7",
    description: "Join our happy mascot Baby Elephant as he splashes in jungle rivers, meets cozy teddy bears, and explores the great outdoors with friendly animals.",
    theme: "from-emerald-400 to-teal-600",
    sheetIds: [
      "elephant-river-splash",
      "bear-stretching",
      "bear-brushing-teeth",
      "bear-scooter",
      "alphabet-c-cat",
      "alphabet-b-butterfly"
    ],
    features: [
      "Large, friendly animal illustrations",
      "Healthy daily routines (brushing teeth, morning stretch)",
      "Ink-saver printable pages",
      "Animal fun facts on every spread"
    ]
  },
  {
    id: "book-alphabet-phonics",
    title: "Alphabet A to Z Phonics Book",
    subtitle: "Color, Trace & Learn Your ABCs",
    coverImage: "/assets/sheets/letter_a_apple.png",
    badge: "Preschool & Kindergarten",
    pageCount: 10,
    targetAge: "Ages 2-5",
    description: "Master early reading and letter recognition! Features bold uppercase and lowercase letters paired with cute fruits, animals, and phonetic objects to color.",
    theme: "from-pink-500 to-purple-600",
    sheetIds: [
      "alphabet-a-apple",
      "alphabet-b-butterfly",
      "alphabet-c-cat"
    ],
    features: [
      "Phonics association on every letter",
      "Handwriting muscle memory development",
      "Approved for preschool & kindergarten curriculum",
      "Complete A to Z printable award certificate"
    ]
  },
  {
    id: "book-heroes-space-dinos",
    title: "Rockets, Rescues & Prehistoric Dinos",
    subtitle: "Action & Adventure Coloring Volume",
    coverImage: "/assets/sheets/space_rocket.webp",
    badge: "Action Pack",
    pageCount: 8,
    targetAge: "Ages 5-10",
    description: "Blast off into space with cosmic rockets, rescue cities with brave fire trucks, and hatch baby dinosaurs in Jurassic fern forests!",
    theme: "from-blue-500 via-indigo-600 to-amber-500",
    sheetIds: [
      "vehicle-fire-truck",
      "space-astronaut-rocket",
      "dino-friendly-hatch",
      "holiday-christmas-tree"
    ],
    features: [
      "High-energy rescue engines and space shuttles",
      "Cute prehistoric dinosaurs",
      "Detailed scenery to spark imagination",
      "Classroom set 2-up half sheets included"
    ]
  }
];
