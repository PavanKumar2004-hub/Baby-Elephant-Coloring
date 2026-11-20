import { ColoringSheet } from '../types';

export const INITIAL_SHEETS: ColoringSheet[] = [
  // Exclusive Baby Elephant Books: Tom & Jerry Series (From Reference PDF)
  {
    id: "tj-cheese-chase",
    title: "1. The Great Cheese Chase",
    category: "Cartoons & Storybooks",
    slug: "cartoons",
    age: "Preschool (3-5)",
    difficulty: "Easy",
    colorGuide: "/assets/sheets/tj_cheese_chase_color.jpg",
    outline: "/assets/sheets/tj_cheese_chase_line.jpg",
    description: "Tom the cat dashes frantically after Jerry who is balancing an enormous, delicious golden wedge of Swiss cheese!",
    tags: ["Tom & Jerry", "Cheese", "Playful", "Cartoon", "Cat & Mouse"],
    isExclusive: true,
    isFeatured: true,
    views: 14200,
    downloads: 3820,
    coloredOnlineCount: 2190,
    crayonGuide: [
      { name: "Slate Blue-Grey", hex: "#708090", usage: "Tom's fur, ears, and tail" },
      { name: "Warm Brown", hex: "#A0522D", usage: "Jerry's fur, wooden floor" },
      { name: "Sunny Yellow", hex: "#FFD700", usage: "Swiss cheese, balloons" },
      { name: "Berry Red", hex: "#DC143C", usage: "Strawberries, picnic blanket" }
    ]
  },
  {
    id: "tj-birthday-cake",
    title: "2. Birthday Cake Surprise",
    category: "Cartoons & Storybooks",
    slug: "cartoons",
    age: "Kids (6-9)",
    difficulty: "Medium",
    colorGuide: "/assets/sheets/tj_birthday_cake_color.jpg",
    outline: "/assets/sheets/tj_birthday_cake_line.jpg",
    description: "A gigantic three-tiered frosted birthday cake with strawberries on top, while Jerry peeks out with a party hat!",
    tags: ["Tom & Jerry", "Birthday", "Cake", "Party", "Celebration"],
    isExclusive: true,
    isFeatured: true,
    views: 12900,
    downloads: 2940,
    coloredOnlineCount: 1850,
    crayonGuide: [
      { name: "Frosting Pink", hex: "#FF69B4", usage: "Birthday cake icing" },
      { name: "Berry Red", hex: "#E63946", usage: "Juicy strawberries on top" },
      { name: "Candle Gold", hex: "#FFA500", usage: "Glowing candle flames" },
      { name: "Slate Blue", hex: "#4A6FA5", usage: "Tom peeking from behind" }
    ]
  },
  {
    id: "tj-park-picnic",
    title: "3. Sunny Park Picnic",
    category: "Cartoons & Storybooks",
    slug: "cartoons",
    age: "Preschool (3-5)",
    difficulty: "Easy",
    colorGuide: "/assets/sheets/tj_park_picnic_color.jpg",
    outline: "/assets/sheets/tj_park_picnic_line.jpg",
    description: "Enjoying a tranquil afternoon in the blooming city park with picnic basket, lemonade, and playful butterflies.",
    tags: ["Tom & Jerry", "Park", "Picnic", "Sunny", "Nature"],
    isExclusive: true,
    isFeatured: true,
    views: 11450,
    downloads: 2610,
    coloredOnlineCount: 1620,
    crayonGuide: [
      { name: "Leaf Green", hex: "#2E7D32", usage: "Park grass and shade trees" },
      { name: "Sky Blue", hex: "#87CEEB", usage: "Sunny sky, windows" },
      { name: "Picnic Red", hex: "#D32F2F", usage: "Checkered picnic blanket" },
      { name: "Warm Brown", hex: "#8D6E63", usage: "Wicker picnic basket" }
    ]
  },
  {
    id: "tj-cookie-sneak",
    title: "4. Midnight Cookie Sneak",
    category: "Cartoons & Storybooks",
    slug: "cartoons",
    age: "Kids (6-9)",
    difficulty: "Medium",
    colorGuide: "/assets/sheets/tj_cookie_sneak_color.jpg",
    outline: "/assets/sheets/tj_cookie_sneak_line.jpg",
    description: "Under the silver glow of the moon, little Jerry rolls a jumbo fresh-baked chocolate chip cookie across the kitchen counter.",
    tags: ["Tom & Jerry", "Cookies", "Midnight", "Kitchen", "Snack"],
    isExclusive: true,
    isFeatured: true,
    views: 9800,
    downloads: 2150,
    coloredOnlineCount: 1410,
    crayonGuide: [
      { name: "Cookie Golden Tan", hex: "#D4A373", usage: "Crisp baked cookie crust" },
      { name: "Chocolate Brown", hex: "#582F0E", usage: "Rich chocolate chips" },
      { name: "Moonlight Lilac", hex: "#BDB2FF", usage: "Kitchen night shadows" },
      { name: "Warm Beige", hex: "#FAEDCD", usage: "Kitchen tile floor" }
    ]
  },
  {
    id: "ben10-alien-force",
    title: "Ben 10 & The Omnitrix",
    category: "Cartoons & Storybooks",
    slug: "cartoons",
    age: "Kids (6-9)",
    difficulty: "Medium",
    colorGuide: "/assets/sheets/ben10_color.jpg",
    outline: "/assets/sheets/ben10_line.png",
    description: "Ben Tennyson activates the glowing Omnitrix! High-definition crisp studio outline ready for full interactive coloring.",
    tags: ["Ben 10", "Cartoon", "Omnitrix", "Hero", "Action"],
    isExclusive: true,
    isFeatured: true,
    views: 16500,
    downloads: 4200,
    coloredOnlineCount: 2980,
    crayonGuide: [
      { name: "Alien Green", hex: "#22C55E", usage: "Omnitrix glow & cargo pants" },
      { name: "Chestnut Brown", hex: "#78350F", usage: "Ben's hair" },
      { name: "Peach Skin", hex: "#FED7AA", usage: "Face & hands" },
      { name: "Electric Cyan", hex: "#06B6D4", usage: "Energy sparks" }
    ]
  },

  // Alphabet A to Z Collection
  {
    id: "alphabet-a-apple",
    title: "Letter A is for Apple & Ant",
    category: "Alphabet A to Z",
    slug: "alphabet",
    age: "Toddlers (1-3)",
    difficulty: "Easy",
    outline: "/assets/sheets/letter_a_apple.png",
    description: "Bold easy letter A with a crisp red apple and a friendly marching ant. Perfect for early phonics and fine motor skills.",
    tags: ["Alphabet", "Letter A", "Apple", "Phonics", "Preschool"],
    isExclusive: false,
    isFeatured: true,
    views: 18400,
    downloads: 5120,
    coloredOnlineCount: 3410,
    crayonGuide: [
      { name: "Candy Red", hex: "#DC2626", usage: "Crisp juicy apple" },
      { name: "Forest Green", hex: "#16A34A", usage: "Apple stem leaf" },
      { name: "Sunshine Yellow", hex: "#FBBF24", usage: "Letter A fill" }
    ]
  },
  {
    id: "alphabet-b-butterfly",
    title: "Letter B is for Butterfly & Bee",
    category: "Alphabet A to Z",
    slug: "alphabet",
    age: "Preschool (3-5)",
    difficulty: "Easy",
    outline: "/assets/sheets/letter_b_butterfly.png",
    description: "Fluttering butterfly with patterned wings and bumblebee buzzing near spring flowers.",
    tags: ["Alphabet", "Letter B", "Butterfly", "Bee", "Nature"],
    isExclusive: false,
    isFeatured: false,
    views: 15100,
    downloads: 4090,
    coloredOnlineCount: 2890,
    crayonGuide: [
      { name: "Violet Purple", hex: "#8B5CF6", usage: "Butterfly wings" },
      { name: "Bright Gold", hex: "#F59E0B", usage: "Honeybee stripes" },
      { name: "Pastel Pink", hex: "#F43F5E", usage: "Floral blossoms" }
    ]
  },
  {
    id: "alphabet-c-cat",
    title: "Letter C is for Cat & Cupcake",
    category: "Alphabet A to Z",
    slug: "alphabet",
    age: "Toddlers (1-3)",
    difficulty: "Easy",
    outline: "/assets/sheets/letter_c_cat.png",
    description: "Fluffy kitten curling comfortably near a swirl-frosted birthday cupcake with sprinkles.",
    tags: ["Alphabet", "Letter C", "Cat", "Cupcake", "Sweet"],
    isExclusive: false,
    isFeatured: false,
    views: 13700,
    downloads: 3650,
    coloredOnlineCount: 2420,
    crayonGuide: [
      { name: "Tiger Orange", hex: "#EA580C", usage: "Tabby cat fur stripes" },
      { name: "Vanilla Cream", hex: "#FEF08A", usage: "Cupcake frosting" },
      { name: "Berry Red", hex: "#E11D48", usage: "Cupcake cherry" }
    ]
  },

  // Animals & Wildlife
  {
    id: "bear-stretching",
    title: "Bear Stretching by the Morning Window",
    category: "Animals & Wildlife",
    slug: "animals",
    age: "Toddlers (1-3)",
    difficulty: "Easy",
    outline: "/assets/sheets/bear_stretching.png",
    description: "A snug teddy bear waking up with a cheerful big morning stretch beside his sunlit bedroom window.",
    tags: ["Bear", "Morning", "Sun", "Room", "Teddy"],
    isExclusive: false,
    isFeatured: true,
    views: 22100,
    downloads: 6400,
    coloredOnlineCount: 4180,
    crayonGuide: [
      { name: "Teddy Honey Brown", hex: "#C68B59", usage: "Bear fur" },
      { name: "Morning Sun Gold", hex: "#FCD34D", usage: "Window sunlight" },
      { name: "Sky Blue", hex: "#7DD3FC", usage: "Window curtains" },
      { name: "Mint Green", hex: "#86EFAC", usage: "Bedroom floor rug" }
    ]
  },
  {
    id: "bear-brushing-teeth",
    title: "Little Bear Brushing Teeth",
    category: "Animals & Wildlife",
    slug: "animals",
    age: "Toddlers (1-3)",
    difficulty: "Easy",
    outline: "/assets/sheets/bear_brushing_teeth.webp",
    description: "Cute daily habits routine! A little bear happily scrubbing his teeth clean at the bathroom washbasin.",
    tags: ["Bear", "Bedtime", "Hygiene", "Healthy Habits", "Bathroom"],
    isExclusive: false,
    isFeatured: false,
    views: 9400,
    downloads: 2310,
    coloredOnlineCount: 1540,
    crayonGuide: [
      { name: "Soft Caramel", hex: "#BA7A44", usage: "Bear fur" },
      { name: "Aquamarine", hex: "#5EEAD4", usage: "Toothbrush handle" },
      { name: "Bubble Blue", hex: "#93C5FD", usage: "Mirror glass and water bubbles" }
    ]
  },
  {
    id: "bear-riding-scooter",
    title: "Bear Riding a Winding Path Scooter",
    category: "Animals & Wildlife",
    slug: "animals",
    age: "Preschool (3-5)",
    difficulty: "Medium",
    outline: "/assets/sheets/bear_scooter.webp",
    description: "Zooming outdoors on a push scooter along a scenic parkway surrounded by wildflowers and butterflies.",
    tags: ["Bear", "Scooter", "Outdoor", "Active", "Play"],
    isExclusive: false,
    isFeatured: true,
    views: 16800,
    downloads: 4500,
    coloredOnlineCount: 3120,
    crayonGuide: [
      { name: "Racing Red", hex: "#EF4444", usage: "Scooter deck and wheels" },
      { name: "Warm Chestnut", hex: "#9A3412", usage: "Bear fur" },
      { name: "Meadow Green", hex: "#4ADE80", usage: "Park grass & foliage" }
    ]
  },
  {
    id: "elephant-river-splash",
    title: "Baby Elephant River Fountains",
    category: "Animals & Wildlife",
    slug: "animals",
    age: "Preschool (3-5)",
    difficulty: "Easy",
    outline: "/assets/sheets/elephant_river.webp",
    description: "Our beloved Baby Elephant mascot having the time of his life spraying sparkling water fountains with his trunk!",
    tags: ["Elephant", "Water", "River", "Playful", "Mascot"],
    isExclusive: true,
    isFeatured: true,
    views: 28900,
    downloads: 8700,
    coloredOnlineCount: 5930,
    crayonGuide: [
      { name: "Gentle Grey", hex: "#94A3B8", usage: "Elephant body & big floppy ears" },
      { name: "Soft Rosy Pink", hex: "#F472B6", usage: "Inner ears & cheerful cheeks" },
      { name: "Water Splash Cyan", hex: "#38BDF8", usage: "Cool river fountains" }
    ]
  },

  // Dinosaurs & Fantasy
  {
    id: "dino-friendly-hatch",
    title: "Friendly Baby Dinosaur Hatching",
    category: "Dinosaurs & Fantasy",
    slug: "dinosaurs",
    age: "Preschool (3-5)",
    difficulty: "Medium",
    outline: "/assets/sheets/dino_friendly.webp",
    description: "A smiling prehistoric baby dinosaur cracking through a speckled giant egg in the ancient fern forest.",
    tags: ["Dinosaur", "T-Rex", "Jurassic", "Egg", "Cute"],
    isExclusive: false,
    isFeatured: true,
    views: 19500,
    downloads: 5300,
    coloredOnlineCount: 3780,
    crayonGuide: [
      { name: "Lime Green", hex: "#84CC16", usage: "Baby dino skin" },
      { name: "Jungle Teal", hex: "#0D9488", usage: "Dino back spots" },
      { name: "Warm Eggshell", hex: "#FDE68A", usage: "Hatched dinosaur eggshell" }
    ]
  },

  // Vehicles & Action
  {
    id: "vehicle-fire-truck",
    title: "Brave Fire Rescue Engine",
    category: "Vehicles & Transport",
    slug: "vehicles",
    age: "Kids (6-9)",
    difficulty: "Medium",
    outline: "/assets/sheets/fire_truck.webp",
    description: "A bold rescue fire engine equipped with extension ladder, emergency sirens, hose reels, and chrome bumpers.",
    tags: ["Fire Truck", "Rescue", "Vehicle", "Emergency", "Heroes"],
    isExclusive: false,
    isFeatured: true,
    views: 17200,
    downloads: 4890,
    coloredOnlineCount: 3200,
    crayonGuide: [
      { name: "Engine Fire Red", hex: "#B91C1C", usage: "Fire truck body" },
      { name: "Warning Yellow", hex: "#EAB308", usage: "Flashing beacon and hose" },
      { name: "Steel Chrome", hex: "#94A3B8", usage: "Rescue ladder & wheel rims" }
    ]
  },

  // Space & Science
  {
    id: "space-astronaut-rocket",
    title: "Cosmic Rocket Exploring the Stars",
    category: "Space & Science",
    slug: "space",
    age: "Kids (6-9)",
    difficulty: "Medium",
    outline: "/assets/sheets/space_rocket.webp",
    description: "3, 2, 1, Lift off! A streamlined space shuttle zooming past Saturn's rings and playful smiling star constellations.",
    tags: ["Space", "Rocket", "Stars", "Astronaut", "Planets"],
    isExclusive: false,
    isFeatured: true,
    views: 14800,
    downloads: 3950,
    coloredOnlineCount: 2750,
    crayonGuide: [
      { name: "Cosmic Blue", hex: "#1E40AF", usage: "Rocket nosecone and fins" },
      { name: "Flame Orange", hex: "#F97316", usage: "Rocket booster flames" },
      { name: "Saturn Gold", hex: "#FACC15", usage: "Ringed planet & distant stars" }
    ]
  },

  // Holidays & Celebrations
  {
    id: "holiday-christmas-tree",
    title: "Festive Christmas Tree & Presents",
    category: "Holidays & Celebrations",
    slug: "holidays",
    age: "All Ages",
    difficulty: "Medium",
    outline: "/assets/sheets/christmas_tree.webp",
    description: "A tall evergreen pine crowned with a glowing Christmas star, glittering glass ornaments, and wrapped boxes below.",
    tags: ["Christmas", "Tree", "Holiday", "Winter", "Gifts"],
    isExclusive: false,
    isFeatured: true,
    views: 31200,
    downloads: 9200,
    coloredOnlineCount: 6800,
    crayonGuide: [
      { name: "Pine Needle Green", hex: "#15803D", usage: "Christmas pine branches" },
      { name: "Golden Star", hex: "#EAB308", usage: "Topper star and fairy lights" },
      { name: "Crimson Ribbon", hex: "#BE123C", usage: "Gift wrapping ribbons & ornaments" }
    ]
  }
];

export const CATEGORIES_LIST = [
  { id: "all", name: "All Coloring Sheets", slug: "all", icon: "Sparkles", description: "Browse every free printable & digital coloring sheet", gradient: "from-amber-400 to-orange-500" },
  { id: "cartoons", name: "Cartoons & Storybooks", slug: "cartoons", icon: "BookOpen", description: "Exclusive Side-by-Side Color & Learn Series by Baby Elephant Books", gradient: "from-indigo-500 to-purple-600" },
  { id: "alphabet", name: "Alphabet A to Z", slug: "alphabet", icon: "GraduationCap", description: "Letter recognition & phonics fun from A to Z", gradient: "from-pink-500 to-rose-600" },
  { id: "animals", name: "Animals & Wildlife", slug: "animals", icon: "PawPrint", description: "Elephants, bears, puppies, kittens, and jungle friends", gradient: "from-emerald-400 to-teal-600" },
  { id: "dinosaurs", name: "Dinosaurs & Fantasy", slug: "dinosaurs", icon: "Flame", description: "Friendly prehistoric dinos, unicorns, and magical creatures", gradient: "from-lime-400 to-green-600" },
  { id: "vehicles", name: "Vehicles & Transport", slug: "vehicles", icon: "Car", description: "Fire engines, racing cars, planes, and trains", gradient: "from-blue-500 to-cyan-600" },
  { id: "space", name: "Space & Science", slug: "space", icon: "Rocket", description: "Planets, rockets, astronauts, and constellation adventures", gradient: "from-violet-500 to-indigo-700" },
  { id: "holidays", name: "Holidays & Celebrations", slug: "holidays", icon: "Gift", description: "Christmas, Halloween, Birthdays, Easter, and celebrations", gradient: "from-red-500 to-amber-500" },
];
