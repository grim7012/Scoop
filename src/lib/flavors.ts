export interface FlavorMetrics { sweetness: number; richness: number; umami: number; intensity: number; }
export interface FlavorPairings { beverage: string; topping: string; dessert: string; }
export interface DietaryFlags { vegan: boolean; gluten_free: boolean; nut_free: boolean; dairy_free: boolean; alcohol_free: boolean; egg_free: boolean; }

export interface Flavor {
  id: string;
  flavor_name: string;
  hex_color: string;
  image_emoji: string;
  image_url: string; // Unsplash photo URL
  aroma_profile: string[];
  metrics: FlavorMetrics;
  pairings: FlavorPairings;
  pairing_logic: "Complementary" | "Contrasting";
  mood_tag: string;
  sommelier_note: string;
  use_cases: string[];
  dietary: DietaryFlags;
  avoid_with: string[];
  serve_temp: string;
  texture: string;
}

export const flavors: Flavor[] = [
  {
    id: "v2-salted-honey-truffle",
    flavor_name: "Salted Honey & Black Truffle",
    hex_color: "#C4A27A",
    image_emoji: "🍯",
    image_url: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&q=80",
    aroma_profile: ["Earthy", "Floral Honey", "Mushroom"],
    metrics: { sweetness: 55, richness: 90, umami: 85, intensity: 4 },
    pairings: { beverage: "Oloroso Sherry", topping: "Maldon Sea Salt Flakes", dessert: "Poached Bosc Pear" },
    pairing_logic: "Complementary",
    mood_tag: "Indulgent",
    sommelier_note: "Earthy truffle meets gentle sea salt and wildflower honey. Slow melt, long finish.",
    use_cases: ["romantic", "wine_pairing", "special_occasion"],
    dietary: { vegan: false, gluten_free: true, nut_free: true, dairy_free: false, alcohol_free: true, egg_free: false },
    avoid_with: ["citrus", "lemon", "orange juice"],
    serve_temp: "Slightly soft — rest 3 min before serving",
    texture: "Dense and velvety"
  },
  {
    id: "v3-brown-butter-miso",
    flavor_name: "Brown Butter & Miso Caramel",
    hex_color: "#C47E5A",
    image_emoji: "🧈",
    image_url: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=400&q=80",
    aroma_profile: ["Nutty", "Savory Caramel", "Toasted Grain"],
    metrics: { sweetness: 75, richness: 95, umami: 80, intensity: 5 },
    pairings: { beverage: "Barrel-Aged Rye Whiskey", topping: "Salted Caramel Crunch", dessert: "Dark Chocolate Tart" },
    pairing_logic: "Complementary",
    mood_tag: "Sophisticated",
    sommelier_note: "Nutty brown butter meets miso caramel. Savory-sweet and completely addictive.",
    use_cases: ["whiskey_pairing", "bold_experiment", "chef_table"],
    dietary: { vegan: false, gluten_free: false, nut_free: true, dairy_free: false, alcohol_free: false, egg_free: false },
    avoid_with: ["citrus", "light fruit sorbets", "lemon"],
    serve_temp: "Slightly soft — best at room temp 2 min",
    texture: "Silky and rich"
  },
  {
    id: "v4-cold-brew-cardamom",
    flavor_name: "Cold Brew & Cardamom",
    hex_color: "#5C4033",
    image_emoji: "☕",
    image_url: "https://images.unsplash.com/photo-1464976562417-c0f690a7b3e0?w=400&q=80",
    aroma_profile: ["Roasted Coffee", "Spiced Citrus", "Woody"],
    metrics: { sweetness: 40, richness: 55, umami: 15, intensity: 3 },
    pairings: { beverage: "Espresso", topping: "Candied Orange Peel", dessert: "Almond Biscotti" },
    pairing_logic: "Complementary",
    mood_tag: "Alert",
    sommelier_note: "Cold brew clarity with a whisper of cardamom. Clean, aromatic, just right.",
    use_cases: ["coffee_pairing", "after_dinner", "afternoon_pickup"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["heavy dairy", "vanilla"],
    serve_temp: "Straight from freezer",
    texture: "Clean and smooth"
  },
  {
    id: "v7-lavender-honeycomb",
    flavor_name: "Lavender & Honeycomb",
    hex_color: "#D6CDEA",
    image_emoji: "🌸",
    image_url: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",
    aroma_profile: ["Floral", "Sweet Beeswax", "Herbal"],
    metrics: { sweetness: 80, richness: 60, umami: 5, intensity: 2 },
    pairings: { beverage: "Earl Grey Tea", topping: "Honeycomb Crystals", dessert: "Madeleine Cookies" },
    pairing_logic: "Complementary",
    mood_tag: "Soothing",
    sommelier_note: "Delicate floral lavender with honeycomb shards that shatter into sweetness.",
    use_cases: ["afternoon_tea", "romantic", "spring"],
    dietary: { vegan: false, gluten_free: true, nut_free: true, dairy_free: false, alcohol_free: true, egg_free: false },
    avoid_with: ["strong spices", "coffee", "citrus acids", "lemon"],
    serve_temp: "Slightly soft",
    texture: "Creamy with crunchy shards"
  },
  {
    id: "v8-ube-coconut",
    flavor_name: "Ube & Coconut",
    hex_color: "#C084B5",
    image_emoji: "💜",
    image_url: "https://images.unsplash.com/photo-1558024920-b41e1887dc32?w=400&q=80",
    aroma_profile: ["Nutty Vanilla", "Tropical", "Earthy"],
    metrics: { sweetness: 75, richness: 80, umami: 10, intensity: 2 },
    pairings: { beverage: "Champagne", topping: "Toasted Coconut Flakes", dessert: "Mochi Doughnuts" },
    pairing_logic: "Complementary",
    mood_tag: "Nostalgic",
    sommelier_note: "Vibrant purple yam and coconut cream — velvety, exotic, and naturally stunning.",
    use_cases: ["summer", "tropical_theme", "celebration"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["coffee", "dark chocolate", "citrus"],
    serve_temp: "Semi-frozen, slightly chewy",
    texture: "Velvety and smooth"
  },
  {
    id: "v9-strawberry-balsamic-pepper",
    flavor_name: "Strawberry Balsamic & Black Pepper",
    hex_color: "#D43F34",
    image_emoji: "🍓",
    image_url: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80",
    aroma_profile: ["Ripe Berry", "Vinegar", "Spice"],
    metrics: { sweetness: 70, richness: 25, umami: 15, intensity: 3 },
    pairings: { beverage: "Rosé Champagne", topping: "Fresh Basil", dessert: "Vanilla Panna Cotta" },
    pairing_logic: "Contrasting",
    mood_tag: "Vibrant",
    sommelier_note: "Peak strawberries, aged balsamic depth, a peppery sting at the finish. Summer, elevated.",
    use_cases: ["palate_cleanser", "summer", "wine_pairing"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["milk ice cream", "heavy dairy", "chocolate"],
    serve_temp: "Straight from freezer",
    texture: "Light and refreshing"
  },
  {
    id: "v11-mango-chili-lime",
    flavor_name: "Mango & Chili Lime",
    hex_color: "#F4A261",
    image_emoji: "🥭",
    image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80",
    aroma_profile: ["Tropical", "Citrus Zest", "Spice"],
    metrics: { sweetness: 85, richness: 20, umami: 5, intensity: 3 },
    pairings: { beverage: "Mexican Lager", topping: "Tajín", dessert: "Grilled Pineapple" },
    pairing_logic: "Contrasting",
    mood_tag: "Fiery",
    sommelier_note: "Sweet Alphonso mango, bright lime, and a slow chili burn that makes you go back for more.",
    use_cases: ["summer", "poolside", "spicy_lovers"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["dairy", "heavy caramel", "chocolate"],
    serve_temp: "Straight from freezer",
    texture: "Icy and vibrant"
  },
  {
    id: "v12-tonka-smoked-maple",
    flavor_name: "Tonka Bean & Smoked Maple",
    hex_color: "#9B7654",
    image_emoji: "🪵",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    aroma_profile: ["Vanilla Spice", "Woodsy Smoke", "Almond"],
    metrics: { sweetness: 78, richness: 88, umami: 25, intensity: 4 },
    pairings: { beverage: "Bourbon", topping: "Pecan Praline", dessert: "Bacon Pecan Pie" },
    pairing_logic: "Complementary",
    mood_tag: "Campfire",
    sommelier_note: "Tonka bean has this wild mix of vanilla, almond, and clove. Add smoked maple and it's a campfire in a scoop.",
    use_cases: ["whiskey_pairing", "autumn", "fireside"],
    dietary: { vegan: false, gluten_free: true, nut_free: false, dairy_free: false, alcohol_free: false, egg_free: false },
    avoid_with: ["citrus", "light fruit", "tropical"],
    serve_temp: "Slightly soft",
    texture: "Velvety and smoky"
  },
  {
    id: "v15-hazelnut-frangelico",
    flavor_name: "Hazelnut & Frangelico",
    hex_color: "#B87C4F",
    image_emoji: "🌰",
    image_url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
    aroma_profile: ["Toasted Nut", "Sweet Liqueur", "Vanilla"],
    metrics: { sweetness: 82, richness: 95, umami: 15, intensity: 4 },
    pairings: { beverage: "Espresso", topping: "Chocolate Hazelnut Crunch", dessert: "Flourless Chocolate Cake" },
    pairing_logic: "Complementary",
    mood_tag: "Decadent",
    sommelier_note: "Roasted Piedmont hazelnuts and Frangelico liqueur. Like a Ferrero Rocher, but grown up.",
    use_cases: ["coffee_pairing", "romantic", "special_occasion"],
    dietary: { vegan: false, gluten_free: true, nut_free: false, dairy_free: false, alcohol_free: false, egg_free: false },
    avoid_with: ["citrus", "lemon", "bright fruit"],
    serve_temp: "Slightly soft",
    texture: "Dense and luxurious"
  },
  {
    id: "v16-blueberry-lavender",
    flavor_name: "Blueberry & Lavender",
    hex_color: "#6A4E9B",
    image_emoji: "🫐",
    image_url: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=400&q=80",
    aroma_profile: ["Wild Berry", "Floral", "Citrus"],
    metrics: { sweetness: 72, richness: 45, umami: 5, intensity: 2 },
    pairings: { beverage: "Lemonade", topping: "Lemon Zest", dessert: "Shortbread Cookies" },
    pairing_logic: "Complementary",
    mood_tag: "Peaceful",
    sommelier_note: "Tart wild blueberries softened by lavender's floral hug. Peaceful and elegant.",
    use_cases: ["summer", "afternoon_tea", "light_dessert"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["heavy chocolate", "strong spices"],
    serve_temp: "Straight from freezer",
    texture: "Light and refreshing"
  },
  {
    id: "v22-yuzu-juniper",
    flavor_name: "Yuzu & Juniper",
    hex_color: "#F0E68C",
    image_emoji: "🍋",
    image_url: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80",
    aroma_profile: ["Citrus", "Pine", "Floral"],
    metrics: { sweetness: 45, richness: 20, umami: 5, intensity: 3 },
    pairings: { beverage: "Japanese Gin", topping: "Yuzu Zest", dessert: "Pavlova" },
    pairing_logic: "Complementary",
    mood_tag: "Bright",
    sommelier_note: "Yuzu's tart floral punch meets woodsy juniper. Wakes you right up.",
    use_cases: ["palate_cleanser", "cocktail_pairing", "summer"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: false, egg_free: true },
    avoid_with: ["dairy", "rich caramel", "chocolate", "miso"],
    serve_temp: "Straight from freezer",
    texture: "Bright and icy"
  },
  {
    id: "v23-matcha-azuki",
    flavor_name: "Matcha & Azuki Bean",
    hex_color: "#7C9A5E",
    image_emoji: "🍵",
    image_url: "https://images.unsplash.com/photo-1542438756-3e6d9d4cbb77?w=400&q=80",
    aroma_profile: ["Grassy Tea", "Sweet Bean", "Earthy"],
    metrics: { sweetness: 55, richness: 68, umami: 60, intensity: 3 },
    pairings: { beverage: "Hojicha Tea", topping: "Sweet Azuki Paste", dessert: "Dorayaki" },
    pairing_logic: "Complementary",
    mood_tag: "Earthy",
    sommelier_note: "Ceremonial matcha, slightly bitter and grassy, with sweet azuki swirls. A Japanese classic.",
    use_cases: ["tea_pairing", "asian_fusion", "afternoon_dessert"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["citrus", "tropical fruit", "heavy spice"],
    serve_temp: "Slightly soft",
    texture: "Creamy with bean texture"
  },
  {
    id: "v24-pistachio-rose",
    flavor_name: "Pistachio & Rose Water",
    hex_color: "#D4E2C4",
    image_emoji: "🌹",
    image_url: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&q=80",
    aroma_profile: ["Nutty", "Floral Perfume", "Almond"],
    metrics: { sweetness: 75, richness: 82, umami: 10, intensity: 3 },
    pairings: { beverage: "Turkish Coffee", topping: "Crushed Pistachios", dessert: "Baklava" },
    pairing_logic: "Complementary",
    mood_tag: "Romantic",
    sommelier_note: "Bronte pistachio with a whisper of rose water. Delicate, nutty, and just a little perfumed.",
    use_cases: ["romantic", "coffee_pairing", "middle_eastern_theme"],
    dietary: { vegan: false, gluten_free: true, nut_free: false, dairy_free: false, alcohol_free: true, egg_free: false },
    avoid_with: ["coffee ice cream", "dark chocolate", "strong spice"],
    serve_temp: "Slightly soft",
    texture: "Creamy with crunch"
  },
  {
    id: "v26-passionfruit-vanilla",
    flavor_name: "Passionfruit & Vanilla",
    hex_color: "#F4C542",
    image_emoji: "🌟",
    image_url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80",
    aroma_profile: ["Tart Tropical", "Sweet Orchid", "Citrus"],
    metrics: { sweetness: 75, richness: 25, umami: 5, intensity: 3 },
    pairings: { beverage: "Prosecco", topping: "Passionfruit Seeds", dessert: "Meringue Nests" },
    pairing_logic: "Contrasting",
    mood_tag: "Tropical",
    sommelier_note: "Punchy passionfruit and warm Madagascar vanilla. Tropical, bright, and just a little bit romantic.",
    use_cases: ["summer", "celebration", "palate_cleanser"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["milk chocolate", "heavy dairy", "miso"],
    serve_temp: "Straight from freezer",
    texture: "Light and tropical"
  },
  {
    id: "v30-saffron-orange-blossom",
    flavor_name: "Saffron & Orange Blossom",
    hex_color: "#F5C542",
    image_emoji: "✨",
    image_url: "https://images.unsplash.com/photo-1602663491496-73f07481dbea?w=400&q=80",
    aroma_profile: ["Floral Spice", "Citrus Flower", "Honey"],
    metrics: { sweetness: 65, richness: 68, umami: 10, intensity: 3 },
    pairings: { beverage: "Persian Tea", topping: "Saffron Threads", dessert: "Orange & Almond Cake" },
    pairing_logic: "Complementary",
    mood_tag: "Exotic",
    sommelier_note: "Real saffron gives it this golden, hay-like warmth. Orange blossom adds a heady floral note.",
    use_cases: ["tea_pairing", "exotic_theme", "romantic"],
    dietary: { vegan: false, gluten_free: true, nut_free: true, dairy_free: false, alcohol_free: true, egg_free: false },
    avoid_with: ["strong coffee", "dark chocolate", "heavy spice"],
    serve_temp: "Slightly soft",
    texture: "Airy and delicate"
  },
  {
    id: "v34-blood-orange-rosemary",
    flavor_name: "Blood Orange & Rosemary",
    hex_color: "#C73F2D",
    image_emoji: "🍊",
    image_url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80",
    aroma_profile: ["Citrus", "Herbal Pine", "Berry"],
    metrics: { sweetness: 68, richness: 30, umami: 5, intensity: 3 },
    pairings: { beverage: "Aperol Spritz", topping: "Rosemary Sprig", dessert: "Olive Oil Cake" },
    pairing_logic: "Contrasting",
    mood_tag: "Vibrant",
    sommelier_note: "Sicilian blood oranges — tart and berry-like — with a woodsy rosemary lift. Very Italian.",
    use_cases: ["cocktail_pairing", "summer", "palate_cleanser"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["dairy", "heavy caramel", "chocolate"],
    serve_temp: "Straight from freezer",
    texture: "Bright and clean"
  },
  {
    id: "v40-raspberry-rose-champagne",
    flavor_name: "Raspberry Rose Champagne",
    hex_color: "#E68A8A",
    image_emoji: "🥂",
    image_url: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&q=80",
    aroma_profile: ["Red Berry", "Floral Perfume", "Sparkling Wine"],
    metrics: { sweetness: 74, richness: 40, umami: 5, intensity: 3 },
    pairings: { beverage: "Champagne", topping: "Freeze-Dried Raspberries", dessert: "Macarons" },
    pairing_logic: "Complementary",
    mood_tag: "Celebratory",
    sommelier_note: "Raspberries, real Champagne, and rose water. This one's made for celebrations.",
    use_cases: ["celebration", "romantic", "bridal_shower"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: false, egg_free: true },
    avoid_with: ["dairy", "chocolate", "heavy spice"],
    serve_temp: "Straight from freezer",
    texture: "Airy and sparkling"
  },
  {
    id: "v44-brown-sugar-cinnamon",
    flavor_name: "Brown Sugar Cinnamon Toast",
    hex_color: "#E3C194",
    image_emoji: "🍞",
    image_url: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&q=80",
    aroma_profile: ["Caramelized Sugar", "Warm Spice", "Baked Bread"],
    metrics: { sweetness: 82, richness: 75, umami: 10, intensity: 2 },
    pairings: { beverage: "Chai Latte", topping: "Cinnamon Crumb", dessert: "Apple Turnover" },
    pairing_logic: "Complementary",
    mood_tag: "Nostalgic",
    sommelier_note: "Brown sugar, Ceylon cinnamon, brioche crumbs. Like a warm hug in frozen form.",
    use_cases: ["brunch", "comfort_food", "coffee_pairing"],
    dietary: { vegan: false, gluten_free: false, nut_free: true, dairy_free: false, alcohol_free: true, egg_free: false },
    avoid_with: ["citrus", "sour flavors", "tropical"],
    serve_temp: "Slightly soft",
    texture: "Buttery and comforting"
  },
  {
    id: "v17-miso-butterscotch",
    flavor_name: "Miso Butterscotch",
    hex_color: "#C46B3E",
    image_emoji: "🍮",
    image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
    aroma_profile: ["Salted Caramel", "Savory Umami", "Brown Sugar"],
    metrics: { sweetness: 82, richness: 78, umami: 72, intensity: 4 },
    pairings: { beverage: "Milk Stout", topping: "Miso Caramel Swirl", dessert: "Apple Crisp" },
    pairing_logic: "Contrasting",
    mood_tag: "Umami",
    sommelier_note: "Butterscotch with a savory miso backbone. It shouldn't work — but it absolutely does.",
    use_cases: ["bold_experiment", "beer_pairing", "autumn"],
    dietary: { vegan: false, gluten_free: false, nut_free: true, dairy_free: false, alcohol_free: true, egg_free: false },
    avoid_with: ["citrus", "fruit sorbets", "tropical"],
    serve_temp: "Slightly soft",
    texture: "Silky and complex"
  },
  {
    id: "v5-goat-cheese-cherry",
    flavor_name: "Goat Cheese & Roasted Cherry",
    hex_color: "#C58F6D",
    image_emoji: "🍒",
    image_url: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80",
    aroma_profile: ["Tangy Cheese", "Jammy Fruit", "Balsamic"],
    metrics: { sweetness: 65, richness: 70, umami: 55, intensity: 3 },
    pairings: { beverage: "Sauternes", topping: "Toasted Hazelnuts", dessert: "Walnut Bread" },
    pairing_logic: "Contrasting",
    mood_tag: "Refined",
    sommelier_note: "Tangy goat cheese meets jammy, balsamic-kissed cherries. Light and surprisingly addictive.",
    use_cases: ["wine_pairing", "cheese_alternative", "elegant_gathering"],
    dietary: { vegan: false, gluten_free: true, nut_free: false, dairy_free: false, alcohol_free: true, egg_free: true },
    avoid_with: ["chocolate", "heavy caramel", "milk"],
    serve_temp: "Slightly soft",
    texture: "Airy and light"
  },
  {
    id: "v6-olive-oil-sea-salt",
    flavor_name: "Olive Oil & Sea Salt",
    hex_color: "#D4C4A8",
    image_emoji: "🫒",
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    aroma_profile: ["Grassy", "Brine", "Fresh Herbs"],
    metrics: { sweetness: 35, richness: 80, umami: 25, intensity: 2 },
    pairings: { beverage: "Vermentino", topping: "Fleur de Sel", dessert: "Fresh Strawberries" },
    pairing_logic: "Contrasting",
    mood_tag: "Mediterranean",
    sommelier_note: "Extra-virgin olive oil, grassy and lush, with flaky sea salt. Minimalist and completely indulgent.",
    use_cases: ["summer", "palate_cleanser", "light_dessert"],
    dietary: { vegan: true, gluten_free: true, nut_free: true, dairy_free: true, alcohol_free: true, egg_free: true },
    avoid_with: ["chocolate", "heavy spices", "citrus"],
    serve_temp: "Slightly soft",
    texture: "Silky and clean"
  },
];

export function searchFlavors(query: string): Flavor[] {
  if (!query || query.trim().length < 2) return flavors.slice(0, 5);
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const scored = flavors.map(f => {
    const blob = [f.flavor_name, f.mood_tag, ...f.aroma_profile, ...f.use_cases, f.sommelier_note, f.pairings.beverage, f.texture].join(" ").toLowerCase();
    return { f, score: terms.reduce((s, t) => s + (blob.includes(t) ? 1 : 0), 0) };
  });
  const hits = scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  const result = hits.length > 0 ? hits.slice(0, 4) : flavors.slice(0, 4).map(f => ({ f, score: 0 }));
  return result.map(x => x.f);
}

// Add this to your flavors.ts file - a safer version if needed
export function buildFlavorContextSafe(query: string): string {
  try {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      // Return some default flavors if no query
      return flavors.slice(0, 3).map(f =>
        `[${f.flavor_name}] hex:${f.hex_color} emoji:${f.image_emoji} mood:${f.mood_tag} texture:"${f.texture}" serve:"${f.serve_temp}" sweet:${f.metrics.sweetness} rich:${f.metrics.richness} umami:${f.metrics.umami} intensity:${f.metrics.intensity}/5 aroma:${f.aroma_profile.join(",")} drink:"${f.pairings.beverage}" topping:"${f.pairings.topping}" dessert:"${f.pairings.dessert}" dietary:${Object.entries(f.dietary).filter(([,v])=>v).map(([k])=>k).join(",")} avoid:${f.avoid_with.join(",")} note:"${f.sommelier_note}"`
      ).join("\n");
    }
    
    const relevant = searchFlavors(query);
    return relevant.map(f =>
      `[${f.flavor_name}] hex:${f.hex_color} emoji:${f.image_emoji} mood:${f.mood_tag} texture:"${f.texture}" serve:"${f.serve_temp}" sweet:${f.metrics.sweetness} rich:${f.metrics.richness} umami:${f.metrics.umami} intensity:${f.metrics.intensity}/5 aroma:${f.aroma_profile.join(",")} drink:"${f.pairings.beverage}" topping:"${f.pairings.topping}" dessert:"${f.pairings.dessert}" dietary:${Object.entries(f.dietary).filter(([,v])=>v).map(([k])=>k).join(",")} avoid:${f.avoid_with.join(",")} note:"${f.sommelier_note}"`
    ).join("\n");
  } catch (error) {
    console.error("Error in buildFlavorContext:", error);
    return flavors.slice(0, 3).map(f => `[${f.flavor_name}]`).join("\n"); // Fallback
  }
  
}


export function getRandomFlavor(): Flavor { return flavors[Math.floor(Math.random() * flavors.length)]; }
