// TKD Trump Cards — 2026 Edition
// 175 students across all TAGB belt ranks
// Stats: Power (1-100), Speed (1-100), Technique (1-100), Flexibility (1-100), Aura (1-100), Special Move (string), Belt (string)

export type BeltRank =
  | "White"
  | "White/Yellow Tag"
  | "Yellow"
  | "Yellow/Orange Tag"
  | "Orange"
  | "Orange/Green Tag"
  | "Green"
  | "Green/Blue Tag"
  | "Blue"
  | "Blue/Red Tag"
  | "Red"
  | "Red/Black Tag"
  | "Black";

export interface Student2026 {
  id: number;
  name: string;
  belt: BeltRank;
  beltColor: string; // hex colour for the belt
  power: number;
  speed: number;
  technique: number;
  flexibility: number;
  aura: number;
  specialMove: string;
  photo?: string; // placeholder until real photo provided
}

// Belt colour mapping
export const BELT_COLOURS: Record<BeltRank, string> = {
  "White": "#FFFFFF",
  "White/Yellow Tag": "#FFFDE7",
  "Yellow": "#F5C800",
  "Yellow/Orange Tag": "#FFB300",
  "Orange": "#FF6D00",
  "Orange/Green Tag": "#76B900",
  "Green": "#2E7D32",
  "Green/Blue Tag": "#1565C0",
  "Blue": "#1565C0",
  "Blue/Red Tag": "#B71C1C",
  "Red": "#C62828",
  "Red/Black Tag": "#4A148C",
  "Black": "#111111",
};

// Belt rank power multiplier (higher belts have higher base stats)
// White ~30-50, Yellow ~35-55, Orange ~40-60, Green ~45-65, Blue ~50-70, Red ~55-75, Black ~65-95

export const students2026: Student2026[] = [
  // ─── WHITE BELTS (20 students) ───────────────────────────────────────────
  { id: 1, name: "Alfie Thompson", belt: "White", beltColor: "#FFFFFF", power: 32, speed: 38, technique: 28, flexibility: 45, aura: 30, specialMove: "Beginner's Kick" },
  { id: 2, name: "Isla Morrison", belt: "White", beltColor: "#FFFFFF", power: 29, speed: 42, technique: 31, flexibility: 50, aura: 33, specialMove: "First Strike" },
  { id: 3, name: "Noah Patel", belt: "White", beltColor: "#FFFFFF", power: 35, speed: 36, technique: 27, flexibility: 40, aura: 28, specialMove: "Rookie Punch" },
  { id: 4, name: "Evie Clarke", belt: "White", beltColor: "#FFFFFF", power: 28, speed: 44, technique: 33, flexibility: 55, aura: 35, specialMove: "Snap Kick" },
  { id: 5, name: "Harry Wilson", belt: "White", beltColor: "#FFFFFF", power: 33, speed: 37, technique: 29, flexibility: 42, aura: 31, specialMove: "Straight Punch" },
  { id: 6, name: "Amelia Foster", belt: "White", beltColor: "#FFFFFF", power: 30, speed: 40, technique: 32, flexibility: 48, aura: 34, specialMove: "Rising Block" },
  { id: 7, name: "Oliver Reed", belt: "White", beltColor: "#FFFFFF", power: 36, speed: 35, technique: 26, flexibility: 38, aura: 27, specialMove: "Front Kick" },
  { id: 8, name: "Poppy Davies", belt: "White", beltColor: "#FFFFFF", power: 27, speed: 43, technique: 34, flexibility: 52, aura: 36, specialMove: "Side Step" },
  { id: 9, name: "Ethan Hughes", belt: "White", beltColor: "#FFFFFF", power: 34, speed: 39, technique: 30, flexibility: 44, aura: 29, specialMove: "Hammer Fist" },
  { id: 10, name: "Grace Mitchell", belt: "White", beltColor: "#FFFFFF", power: 31, speed: 41, technique: 35, flexibility: 51, aura: 37, specialMove: "Palm Block" },
  { id: 11, name: "Liam Cooper", belt: "White", beltColor: "#FFFFFF", power: 37, speed: 34, technique: 25, flexibility: 36, aura: 26, specialMove: "Knee Strike" },
  { id: 12, name: "Sophie Turner", belt: "White", beltColor: "#FFFFFF", power: 26, speed: 45, technique: 36, flexibility: 54, aura: 38, specialMove: "Dodge Roll" },
  { id: 13, name: "Mason Bailey", belt: "White", beltColor: "#FFFFFF", power: 38, speed: 33, technique: 24, flexibility: 35, aura: 25, specialMove: "Stomp Kick" },
  { id: 14, name: "Chloe Evans", belt: "White", beltColor: "#FFFFFF", power: 25, speed: 46, technique: 37, flexibility: 56, aura: 39, specialMove: "Spinning Dodge" },
  { id: 15, name: "Jack Roberts", belt: "White", beltColor: "#FFFFFF", power: 39, speed: 32, technique: 23, flexibility: 34, aura: 24, specialMove: "Low Kick" },
  { id: 16, name: "Lily Walker", belt: "White", beltColor: "#FFFFFF", power: 24, speed: 47, technique: 38, flexibility: 57, aura: 40, specialMove: "Quick Jab" },
  { id: 17, name: "Theo Harris", belt: "White", beltColor: "#FFFFFF", power: 40, speed: 31, technique: 22, flexibility: 33, aura: 23, specialMove: "Push Kick" },
  { id: 18, name: "Ruby Martin", belt: "White", beltColor: "#FFFFFF", power: 23, speed: 48, technique: 39, flexibility: 58, aura: 41, specialMove: "Feint Strike" },
  { id: 19, name: "Freddie Scott", belt: "White", beltColor: "#FFFFFF", power: 41, speed: 30, technique: 21, flexibility: 32, aura: 22, specialMove: "Charge Punch" },
  { id: 20, name: "Daisy Green", belt: "White", beltColor: "#FFFFFF", power: 22, speed: 49, technique: 40, flexibility: 59, aura: 42, specialMove: "Windmill Block" },

  // ─── WHITE/YELLOW TAG (8 students) ──────────────────────────────────────
  { id: 21, name: "Archie King", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 38, speed: 44, technique: 36, flexibility: 50, aura: 38, specialMove: "Tag Kick" },
  { id: 22, name: "Mia Brown", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 35, speed: 47, technique: 39, flexibility: 54, aura: 41, specialMove: "Rising Knee" },
  { id: 23, name: "Reuben Hall", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 40, speed: 42, technique: 34, flexibility: 48, aura: 36, specialMove: "Pivot Punch" },
  { id: 24, name: "Ellie Young", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 33, speed: 49, technique: 41, flexibility: 56, aura: 43, specialMove: "Step-In Kick" },
  { id: 25, name: "Callum Wright", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 42, speed: 40, technique: 32, flexibility: 46, aura: 34, specialMove: "Lunge Strike" },
  { id: 26, name: "Phoebe Adams", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 31, speed: 51, technique: 43, flexibility: 58, aura: 45, specialMove: "Flick Kick" },
  { id: 27, name: "Dylan Baker", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 44, speed: 38, technique: 30, flexibility: 44, aura: 32, specialMove: "Sweep Attempt" },
  { id: 28, name: "Zara Nelson", belt: "White/Yellow Tag", beltColor: "#FFFDE7", power: 29, speed: 53, technique: 45, flexibility: 60, aura: 47, specialMove: "Spinning Jab" },

  // ─── YELLOW BELTS (18 students) ─────────────────────────────────────────
  { id: 29, name: "Sebastian Carter", belt: "Yellow", beltColor: "#F5C800", power: 45, speed: 50, technique: 42, flexibility: 55, aura: 44, specialMove: "Yellow Flash Kick" },
  { id: 30, name: "Imogen Phillips", belt: "Yellow", beltColor: "#F5C800", power: 42, speed: 53, technique: 45, flexibility: 58, aura: 47, specialMove: "Solar Punch" },
  { id: 31, name: "Finley Campbell", belt: "Yellow", beltColor: "#F5C800", power: 48, speed: 48, technique: 40, flexibility: 52, aura: 42, specialMove: "Gold Rush Kick" },
  { id: 32, name: "Harriet Morgan", belt: "Yellow", beltColor: "#F5C800", power: 40, speed: 55, technique: 47, flexibility: 60, aura: 49, specialMove: "Sunshine Strike" },
  { id: 33, name: "Jude Parker", belt: "Yellow", beltColor: "#F5C800", power: 50, speed: 46, technique: 38, flexibility: 50, aura: 40, specialMove: "Bolt Kick" },
  { id: 34, name: "Arabella Price", belt: "Yellow", beltColor: "#F5C800", power: 38, speed: 57, technique: 49, flexibility: 62, aura: 51, specialMove: "Amber Sweep" },
  { id: 35, name: "Toby Bennett", belt: "Yellow", beltColor: "#F5C800", power: 52, speed: 44, technique: 36, flexibility: 48, aura: 38, specialMove: "Haymaker" },
  { id: 36, name: "Penelope Wood", belt: "Yellow", beltColor: "#F5C800", power: 36, speed: 59, technique: 51, flexibility: 64, aura: 53, specialMove: "Twisting Kick" },
  { id: 37, name: "Barnaby Cox", belt: "Yellow", beltColor: "#F5C800", power: 54, speed: 42, technique: 34, flexibility: 46, aura: 36, specialMove: "Charging Bull" },
  { id: 38, name: "Scarlett Mills", belt: "Yellow", beltColor: "#F5C800", power: 34, speed: 61, technique: 53, flexibility: 66, aura: 55, specialMove: "Whip Kick" },
  { id: 39, name: "Jasper Shaw", belt: "Yellow", beltColor: "#F5C800", power: 56, speed: 40, technique: 32, flexibility: 44, aura: 34, specialMove: "Power Stomp" },
  { id: 40, name: "Violet Cole", belt: "Yellow", beltColor: "#F5C800", power: 32, speed: 63, technique: 55, flexibility: 68, aura: 57, specialMove: "Petal Kick" },
  { id: 41, name: "Monty Ward", belt: "Yellow", beltColor: "#F5C800", power: 58, speed: 38, technique: 30, flexibility: 42, aura: 32, specialMove: "Thunderclap" },
  { id: 42, name: "Beatrice Fox", belt: "Yellow", beltColor: "#F5C800", power: 30, speed: 65, technique: 57, flexibility: 70, aura: 59, specialMove: "Blossom Spin" },
  { id: 43, name: "Rafferty Stone", belt: "Yellow", beltColor: "#F5C800", power: 60, speed: 36, technique: 28, flexibility: 40, aura: 30, specialMove: "Rock Smash" },
  { id: 44, name: "Cordelia Hunt", belt: "Yellow", beltColor: "#F5C800", power: 28, speed: 67, technique: 59, flexibility: 72, aura: 61, specialMove: "Spiral Kick" },
  { id: 45, name: "Alistair Cross", belt: "Yellow", beltColor: "#F5C800", power: 62, speed: 34, technique: 26, flexibility: 38, aura: 28, specialMove: "Battering Ram" },
  { id: 46, name: "Rosalind Sharp", belt: "Yellow", beltColor: "#F5C800", power: 26, speed: 69, technique: 61, flexibility: 74, aura: 63, specialMove: "Rose Thorn Kick" },

  // ─── YELLOW/ORANGE TAG (8 students) ─────────────────────────────────────
  { id: 47, name: "Barnabas Quinn", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 52, speed: 54, technique: 48, flexibility: 58, aura: 50, specialMove: "Ember Kick" },
  { id: 48, name: "Celestine Ray", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 49, speed: 57, technique: 51, flexibility: 61, aura: 53, specialMove: "Spark Strike" },
  { id: 49, name: "Dashiell Ford", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 55, speed: 51, technique: 45, flexibility: 55, aura: 47, specialMove: "Flame Punch" },
  { id: 50, name: "Evangeline Ross", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 47, speed: 59, technique: 53, flexibility: 63, aura: 55, specialMove: "Sunrise Kick" },
  { id: 51, name: "Fletcher Gray", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 57, speed: 49, technique: 43, flexibility: 53, aura: 45, specialMove: "Blaze Kick" },
  { id: 52, name: "Genevieve Hart", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 45, speed: 61, technique: 55, flexibility: 65, aura: 57, specialMove: "Glowing Palm" },
  { id: 53, name: "Hamish Long", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 59, speed: 47, technique: 41, flexibility: 51, aura: 43, specialMove: "Torch Kick" },
  { id: 54, name: "Isadora Bell", belt: "Yellow/Orange Tag", beltColor: "#FFB300", power: 43, speed: 63, technique: 57, flexibility: 67, aura: 59, specialMove: "Lantern Spin" },

  // ─── ORANGE BELTS (18 students) ─────────────────────────────────────────
  { id: 55, name: "Jasper Knight", belt: "Orange", beltColor: "#FF6D00", power: 58, speed: 58, technique: 54, flexibility: 62, aura: 56, specialMove: "Inferno Kick" },
  { id: 56, name: "Katerina Lane", belt: "Orange", beltColor: "#FF6D00", power: 55, speed: 61, technique: 57, flexibility: 65, aura: 59, specialMove: "Blaze Spin" },
  { id: 57, name: "Leopold Nash", belt: "Orange", beltColor: "#FF6D00", power: 61, speed: 55, technique: 51, flexibility: 59, aura: 53, specialMove: "Fireball Punch" },
  { id: 58, name: "Magnolia Owen", belt: "Orange", beltColor: "#FF6D00", power: 53, speed: 63, technique: 59, flexibility: 67, aura: 61, specialMove: "Ember Storm" },
  { id: 59, name: "Nathaniel Page", belt: "Orange", beltColor: "#FF6D00", power: 63, speed: 53, technique: 49, flexibility: 57, aura: 51, specialMove: "Volcano Kick" },
  { id: 60, name: "Octavia Quinn", belt: "Orange", beltColor: "#FF6D00", power: 51, speed: 65, technique: 61, flexibility: 69, aura: 63, specialMove: "Phoenix Rise" },
  { id: 61, name: "Percy Reid", belt: "Orange", beltColor: "#FF6D00", power: 65, speed: 51, technique: 47, flexibility: 55, aura: 49, specialMove: "Magma Fist" },
  { id: 62, name: "Quincy Stone", belt: "Orange", beltColor: "#FF6D00", power: 49, speed: 67, technique: 63, flexibility: 71, aura: 65, specialMove: "Lava Sweep" },
  { id: 63, name: "Rosie Tate", belt: "Orange", beltColor: "#FF6D00", power: 67, speed: 49, technique: 45, flexibility: 53, aura: 47, specialMove: "Scorched Earth" },
  { id: 64, name: "Sylvester Vane", belt: "Orange", beltColor: "#FF6D00", power: 47, speed: 69, technique: 65, flexibility: 73, aura: 67, specialMove: "Wildfire Kick" },
  { id: 65, name: "Tabitha Wade", belt: "Orange", beltColor: "#FF6D00", power: 69, speed: 47, technique: 43, flexibility: 51, aura: 45, specialMove: "Forge Punch" },
  { id: 66, name: "Ulysses Webb", belt: "Orange", beltColor: "#FF6D00", power: 45, speed: 71, technique: 67, flexibility: 75, aura: 69, specialMove: "Comet Kick" },
  { id: 67, name: "Valentina West", belt: "Orange", beltColor: "#FF6D00", power: 71, speed: 45, technique: 41, flexibility: 49, aura: 43, specialMove: "Meteor Strike" },
  { id: 68, name: "Winston York", belt: "Orange", beltColor: "#FF6D00", power: 43, speed: 73, technique: 69, flexibility: 77, aura: 71, specialMove: "Sunburst Kick" },
  { id: 69, name: "Xena Ash", belt: "Orange", beltColor: "#FF6D00", power: 73, speed: 43, technique: 39, flexibility: 47, aura: 41, specialMove: "Warrior Slam" },
  { id: 70, name: "Yasmin Blake", belt: "Orange", beltColor: "#FF6D00", power: 41, speed: 75, technique: 71, flexibility: 79, aura: 73, specialMove: "Dancing Flame" },
  { id: 71, name: "Zachary Cole", belt: "Orange", beltColor: "#FF6D00", power: 75, speed: 41, technique: 37, flexibility: 45, aura: 39, specialMove: "Titan Kick" },
  { id: 72, name: "Abigail Dean", belt: "Orange", beltColor: "#FF6D00", power: 39, speed: 77, technique: 73, flexibility: 81, aura: 75, specialMove: "Spiral Flame" },

  // ─── ORANGE/GREEN TAG (8 students) ──────────────────────────────────────
  { id: 73, name: "Benedict Ellis", belt: "Orange/Green Tag", beltColor: "#76B900", power: 62, speed: 64, technique: 60, flexibility: 66, aura: 62, specialMove: "Forest Fire Kick" },
  { id: 74, name: "Cassandra Ford", belt: "Orange/Green Tag", beltColor: "#76B900", power: 59, speed: 67, technique: 63, flexibility: 69, aura: 65, specialMove: "Jungle Strike" },
  { id: 75, name: "Dominic Grant", belt: "Orange/Green Tag", beltColor: "#76B900", power: 65, speed: 61, technique: 57, flexibility: 63, aura: 59, specialMove: "Vine Whip" },
  { id: 76, name: "Elspeth Hall", belt: "Orange/Green Tag", beltColor: "#76B900", power: 57, speed: 69, technique: 65, flexibility: 71, aura: 67, specialMove: "Leaf Blade" },
  { id: 77, name: "Fabian Irwin", belt: "Orange/Green Tag", beltColor: "#76B900", power: 67, speed: 59, technique: 55, flexibility: 61, aura: 57, specialMove: "Thorn Kick" },
  { id: 78, name: "Georgiana James", belt: "Orange/Green Tag", beltColor: "#76B900", power: 55, speed: 71, technique: 67, flexibility: 73, aura: 69, specialMove: "Bamboo Strike" },
  { id: 79, name: "Horatio Kent", belt: "Orange/Green Tag", beltColor: "#76B900", power: 69, speed: 57, technique: 53, flexibility: 59, aura: 55, specialMove: "Moss Sweep" },
  { id: 80, name: "Iphigenia Lowe", belt: "Orange/Green Tag", beltColor: "#76B900", power: 53, speed: 73, technique: 69, flexibility: 75, aura: 71, specialMove: "Fern Spin" },

  // ─── GREEN BELTS (18 students) ──────────────────────────────────────────
  { id: 81, name: "Jethro Marsh", belt: "Green", beltColor: "#2E7D32", power: 66, speed: 68, technique: 64, flexibility: 70, aura: 66, specialMove: "Emerald Kick" },
  { id: 82, name: "Kira Nash", belt: "Green", beltColor: "#2E7D32", power: 63, speed: 71, technique: 67, flexibility: 73, aura: 69, specialMove: "Jade Strike" },
  { id: 83, name: "Leander Owen", belt: "Green", beltColor: "#2E7D32", power: 69, speed: 65, technique: 61, flexibility: 67, aura: 63, specialMove: "Forest Fist" },
  { id: 84, name: "Mirabel Page", belt: "Green", beltColor: "#2E7D32", power: 61, speed: 73, technique: 69, flexibility: 75, aura: 71, specialMove: "Ivy Sweep" },
  { id: 85, name: "Niall Quinn", belt: "Green", beltColor: "#2E7D32", power: 71, speed: 63, technique: 59, flexibility: 65, aura: 61, specialMove: "Serpent Kick" },
  { id: 86, name: "Ophelia Reed", belt: "Green", beltColor: "#2E7D32", power: 59, speed: 75, technique: 71, flexibility: 77, aura: 73, specialMove: "Willow Whip" },
  { id: 87, name: "Ptolemy Shaw", belt: "Green", beltColor: "#2E7D32", power: 73, speed: 61, technique: 57, flexibility: 63, aura: 59, specialMove: "Oak Stomp" },
  { id: 88, name: "Rowena Tate", belt: "Green", beltColor: "#2E7D32", power: 57, speed: 77, technique: 73, flexibility: 79, aura: 75, specialMove: "Petal Storm" },
  { id: 89, name: "Silas Vane", belt: "Green", beltColor: "#2E7D32", power: 75, speed: 59, technique: 55, flexibility: 61, aura: 57, specialMove: "Jungle Slam" },
  { id: 90, name: "Thalia Wade", belt: "Green", beltColor: "#2E7D32", power: 55, speed: 79, technique: 75, flexibility: 81, aura: 77, specialMove: "Canopy Kick" },
  { id: 91, name: "Ulric Webb", belt: "Green", beltColor: "#2E7D32", power: 77, speed: 57, technique: 53, flexibility: 59, aura: 55, specialMove: "Bark Breaker" },
  { id: 92, name: "Verity West", belt: "Green", beltColor: "#2E7D32", power: 53, speed: 81, technique: 77, flexibility: 83, aura: 79, specialMove: "Vine Spin" },
  { id: 93, name: "Walter York", belt: "Green", beltColor: "#2E7D32", power: 79, speed: 55, technique: 51, flexibility: 57, aura: 53, specialMove: "Redwood Kick" },
  { id: 94, name: "Xanthe Ash", belt: "Green", beltColor: "#2E7D32", power: 51, speed: 83, technique: 79, flexibility: 85, aura: 81, specialMove: "Lotus Kick" },
  { id: 95, name: "Yorick Blake", belt: "Green", beltColor: "#2E7D32", power: 81, speed: 53, technique: 49, flexibility: 55, aura: 51, specialMove: "Timber Punch" },
  { id: 96, name: "Zinnia Cole", belt: "Green", beltColor: "#2E7D32", power: 49, speed: 85, technique: 81, flexibility: 87, aura: 83, specialMove: "Blossom Burst" },
  { id: 97, name: "Amos Dean", belt: "Green", beltColor: "#2E7D32", power: 83, speed: 51, technique: 47, flexibility: 53, aura: 49, specialMove: "Fist of the Forest" },
  { id: 98, name: "Blythe Ellis", belt: "Green", beltColor: "#2E7D32", power: 47, speed: 87, technique: 83, flexibility: 89, aura: 85, specialMove: "Whirlwind Leaf" },

  // ─── GREEN/BLUE TAG (8 students) ────────────────────────────────────────
  { id: 99, name: "Caspar Ford", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 68, speed: 72, technique: 68, flexibility: 72, aura: 70, specialMove: "Teal Tornado" },
  { id: 100, name: "Delphine Grant", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 65, speed: 75, technique: 71, flexibility: 75, aura: 73, specialMove: "Aqua Kick" },
  { id: 101, name: "Edmund Hall", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 71, speed: 69, technique: 65, flexibility: 69, aura: 67, specialMove: "Tidal Sweep" },
  { id: 102, name: "Felicity Irwin", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 63, speed: 77, technique: 73, flexibility: 77, aura: 75, specialMove: "Ocean Spin" },
  { id: 103, name: "Gideon James", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 73, speed: 67, technique: 63, flexibility: 67, aura: 65, specialMove: "Reef Strike" },
  { id: 104, name: "Helena Kent", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 61, speed: 79, technique: 75, flexibility: 79, aura: 77, specialMove: "Mist Kick" },
  { id: 105, name: "Ignatius Lowe", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 75, speed: 65, technique: 61, flexibility: 65, aura: 63, specialMove: "Glacier Punch" },
  { id: 106, name: "Josephine Marsh", belt: "Green/Blue Tag", beltColor: "#1565C0", power: 59, speed: 81, technique: 77, flexibility: 81, aura: 79, specialMove: "Ripple Kick" },

  // ─── BLUE BELTS (18 students) ────────────────────────────────────────────
  { id: 107, name: "Killian Nash", belt: "Blue", beltColor: "#1565C0", power: 72, speed: 76, technique: 72, flexibility: 76, aura: 74, specialMove: "Ocean Crusher" },
  { id: 108, name: "Lavinia Owen", belt: "Blue", beltColor: "#1565C0", power: 69, speed: 79, technique: 75, flexibility: 79, aura: 77, specialMove: "Sapphire Kick" },
  { id: 109, name: "Magnus Page", belt: "Blue", beltColor: "#1565C0", power: 75, speed: 73, technique: 69, flexibility: 73, aura: 71, specialMove: "Tsunami Fist" },
  { id: 110, name: "Narcissa Quinn", belt: "Blue", beltColor: "#1565C0", power: 67, speed: 81, technique: 77, flexibility: 81, aura: 79, specialMove: "Whirlpool Kick" },
  { id: 111, name: "Orlando Reed", belt: "Blue", beltColor: "#1565C0", power: 77, speed: 71, technique: 67, flexibility: 71, aura: 69, specialMove: "Blue Typhoon" },
  { id: 112, name: "Portia Shaw", belt: "Blue", beltColor: "#1565C0", power: 65, speed: 83, technique: 79, flexibility: 83, aura: 81, specialMove: "Cobalt Spin" },
  { id: 113, name: "Quentin Tate", belt: "Blue", beltColor: "#1565C0", power: 79, speed: 69, technique: 65, flexibility: 69, aura: 67, specialMove: "Depth Charge" },
  { id: 114, name: "Rowena Vane", belt: "Blue", beltColor: "#1565C0", power: 63, speed: 85, technique: 81, flexibility: 85, aura: 83, specialMove: "Riptide Kick" },
  { id: 115, name: "Stellan Wade", belt: "Blue", beltColor: "#1565C0", power: 81, speed: 67, technique: 63, flexibility: 67, aura: 65, specialMove: "Anchor Strike" },
  { id: 116, name: "Tatiana Webb", belt: "Blue", beltColor: "#1565C0", power: 61, speed: 87, technique: 83, flexibility: 87, aura: 85, specialMove: "Coral Kick" },
  { id: 117, name: "Ulysses West", belt: "Blue", beltColor: "#1565C0", power: 83, speed: 65, technique: 61, flexibility: 65, aura: 63, specialMove: "Trident Punch" },
  { id: 118, name: "Vivienne York", belt: "Blue", beltColor: "#1565C0", power: 59, speed: 89, technique: 85, flexibility: 89, aura: 87, specialMove: "Pearl Spin" },
  { id: 119, name: "Warwick Ash", belt: "Blue", beltColor: "#1565C0", power: 85, speed: 63, technique: 59, flexibility: 63, aura: 61, specialMove: "Kraken Kick" },
  { id: 120, name: "Xara Blake", belt: "Blue", beltColor: "#1565C0", power: 57, speed: 91, technique: 87, flexibility: 91, aura: 89, specialMove: "Siren Sweep" },
  { id: 121, name: "Yannick Cole", belt: "Blue", beltColor: "#1565C0", power: 87, speed: 61, technique: 57, flexibility: 61, aura: 59, specialMove: "Poseidon Slam" },
  { id: 122, name: "Zephyrine Dean", belt: "Blue", beltColor: "#1565C0", power: 55, speed: 93, technique: 89, flexibility: 93, aura: 91, specialMove: "Mermaid Kick" },
  { id: 123, name: "Adrian Ellis", belt: "Blue", beltColor: "#1565C0", power: 89, speed: 59, technique: 55, flexibility: 59, aura: 57, specialMove: "Leviathan Strike" },
  { id: 124, name: "Briony Ford", belt: "Blue", beltColor: "#1565C0", power: 53, speed: 95, technique: 91, flexibility: 95, aura: 93, specialMove: "Waterfall Kick" },

  // ─── BLUE/RED TAG (8 students) ───────────────────────────────────────────
  { id: 125, name: "Crispin Grant", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 76, speed: 78, technique: 76, flexibility: 78, aura: 78, specialMove: "Purple Haze Kick" },
  { id: 126, name: "Dorinda Hall", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 73, speed: 81, technique: 79, flexibility: 81, aura: 81, specialMove: "Violet Strike" },
  { id: 127, name: "Evander Irwin", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 79, speed: 75, technique: 73, flexibility: 75, aura: 75, specialMove: "Crimson Wave" },
  { id: 128, name: "Florinda James", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 71, speed: 83, technique: 81, flexibility: 83, aura: 83, specialMove: "Scarlet Spin" },
  { id: 129, name: "Gulliver Kent", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 81, speed: 73, technique: 71, flexibility: 73, aura: 73, specialMove: "Magenta Fist" },
  { id: 130, name: "Hermione Lowe", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 69, speed: 85, technique: 83, flexibility: 85, aura: 85, specialMove: "Rose Tornado" },
  { id: 131, name: "Ichabod Marsh", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 83, speed: 71, technique: 69, flexibility: 71, aura: 71, specialMove: "Garnet Kick" },
  { id: 132, name: "Jacinda Nash", belt: "Blue/Red Tag", beltColor: "#B71C1C", power: 67, speed: 87, technique: 85, flexibility: 87, aura: 87, specialMove: "Ruby Sweep" },

  // ─── RED BELTS (18 students) ─────────────────────────────────────────────
  { id: 133, name: "Kendrick Owen", belt: "Red", beltColor: "#C62828", power: 80, speed: 82, technique: 80, flexibility: 82, aura: 82, specialMove: "Crimson Tornado" },
  { id: 134, name: "Lavender Page", belt: "Red", beltColor: "#C62828", power: 77, speed: 85, technique: 83, flexibility: 85, aura: 85, specialMove: "Red Dragon Kick" },
  { id: 135, name: "Merrick Quinn", belt: "Red", beltColor: "#C62828", power: 83, speed: 79, technique: 77, flexibility: 79, aura: 79, specialMove: "Blood Moon Strike" },
  { id: 136, name: "Niamh Reed", belt: "Red", beltColor: "#C62828", power: 75, speed: 87, technique: 85, flexibility: 87, aura: 87, specialMove: "Scarlet Cyclone" },
  { id: 137, name: "Oberon Shaw", belt: "Red", beltColor: "#C62828", power: 85, speed: 77, technique: 75, flexibility: 77, aura: 77, specialMove: "Inferno Fist" },
  { id: 138, name: "Persephone Tate", belt: "Red", beltColor: "#C62828", power: 73, speed: 89, technique: 87, flexibility: 89, aura: 89, specialMove: "Fire Goddess Kick" },
  { id: 139, name: "Quinlan Vane", belt: "Red", beltColor: "#C62828", power: 87, speed: 75, technique: 73, flexibility: 75, aura: 75, specialMove: "Volcano Slam" },
  { id: 140, name: "Rhiannon Wade", belt: "Red", beltColor: "#C62828", power: 71, speed: 91, technique: 89, flexibility: 91, aura: 91, specialMove: "Ember Whirlwind" },
  { id: 141, name: "Sylvanus Webb", belt: "Red", beltColor: "#C62828", power: 89, speed: 73, technique: 71, flexibility: 73, aura: 73, specialMove: "Magma Crusher" },
  { id: 142, name: "Thessaly West", belt: "Red", beltColor: "#C62828", power: 69, speed: 93, technique: 91, flexibility: 93, aura: 93, specialMove: "Phoenix Spiral" },
  { id: 143, name: "Uther York", belt: "Red", beltColor: "#C62828", power: 91, speed: 71, technique: 69, flexibility: 71, aura: 71, specialMove: "Dragon Stomp" },
  { id: 144, name: "Valentina Ash", belt: "Red", beltColor: "#C62828", power: 67, speed: 95, technique: 93, flexibility: 95, aura: 95, specialMove: "Blazing Lotus" },
  { id: 145, name: "Wolfric Blake", belt: "Red", beltColor: "#C62828", power: 93, speed: 69, technique: 67, flexibility: 69, aura: 69, specialMove: "Wolf Fang Kick" },
  { id: 146, name: "Xiomara Cole", belt: "Red", beltColor: "#C62828", power: 65, speed: 97, technique: 95, flexibility: 97, aura: 97, specialMove: "Comet Spiral" },
  { id: 147, name: "Yaroslav Dean", belt: "Red", beltColor: "#C62828", power: 95, speed: 67, technique: 65, flexibility: 67, aura: 67, specialMove: "Bear Claw Kick" },
  { id: 148, name: "Zara Ellis", belt: "Red", beltColor: "#C62828", power: 63, speed: 99, technique: 97, flexibility: 99, aura: 99, specialMove: "Shooting Star Kick" },
  { id: 149, name: "Aloysius Ford", belt: "Red", beltColor: "#C62828", power: 97, speed: 65, technique: 63, flexibility: 65, aura: 65, specialMove: "Titan Crusher" },
  { id: 150, name: "Beatrix Grant", belt: "Red", beltColor: "#C62828", power: 61, speed: 98, technique: 96, flexibility: 98, aura: 98, specialMove: "Aurora Kick" },

  // ─── RED/BLACK TAG (8 students) ──────────────────────────────────────────
  { id: 151, name: "Cornelius Hall", belt: "Red/Black Tag", beltColor: "#4A148C", power: 84, speed: 86, technique: 84, flexibility: 86, aura: 86, specialMove: "Shadow Flame Kick" },
  { id: 152, name: "Desdemona Irwin", belt: "Red/Black Tag", beltColor: "#4A148C", power: 81, speed: 89, technique: 87, flexibility: 89, aura: 89, specialMove: "Dark Phoenix" },
  { id: 153, name: "Elijah James", belt: "Red/Black Tag", beltColor: "#4A148C", power: 87, speed: 83, technique: 81, flexibility: 83, aura: 83, specialMove: "Obsidian Strike" },
  { id: 154, name: "Fiamma Kent", belt: "Red/Black Tag", beltColor: "#4A148C", power: 79, speed: 91, technique: 89, flexibility: 91, aura: 91, specialMove: "Night Blaze" },
  { id: 155, name: "Griffith Lowe", belt: "Red/Black Tag", beltColor: "#4A148C", power: 89, speed: 81, technique: 79, flexibility: 81, aura: 81, specialMove: "Void Kick" },
  { id: 156, name: "Hypatia Marsh", belt: "Red/Black Tag", beltColor: "#4A148C", power: 77, speed: 93, technique: 91, flexibility: 93, aura: 93, specialMove: "Eclipse Spin" },
  { id: 157, name: "Ignatius Nash", belt: "Red/Black Tag", beltColor: "#4A148C", power: 91, speed: 79, technique: 77, flexibility: 79, aura: 79, specialMove: "Midnight Slam" },
  { id: 158, name: "Jocasta Owen", belt: "Red/Black Tag", beltColor: "#4A148C", power: 75, speed: 95, technique: 93, flexibility: 95, aura: 95, specialMove: "Twilight Kick" },

  // ─── BLACK BELTS — 2026 Edition (17 students) ────────────────────────────
  { id: 159, name: "Gavin Cook", belt: "Black", beltColor: "#111111", power: 99, speed: 97, technique: 99, flexibility: 95, aura: 100, specialMove: "4th Dan Devastator" },
  { id: 160, name: "Leander Price", belt: "Black", beltColor: "#111111", power: 95, speed: 93, technique: 95, flexibility: 91, aura: 96, specialMove: "Iron Fist Tornado" },
  { id: 161, name: "Seraphina Quinn", belt: "Black", beltColor: "#111111", power: 91, speed: 97, technique: 97, flexibility: 95, aura: 94, specialMove: "Seraph Spiral Kick" },
  { id: 162, name: "Thaddeus Reed", belt: "Black", beltColor: "#111111", power: 97, speed: 91, technique: 93, flexibility: 89, aura: 92, specialMove: "Thunder Dragon Kick" },
  { id: 163, name: "Ursula Shaw", belt: "Black", beltColor: "#111111", power: 89, speed: 99, technique: 99, flexibility: 97, aura: 98, specialMove: "Phantom Tornado" },
  { id: 164, name: "Valerian Tate", belt: "Black", beltColor: "#111111", power: 99, speed: 89, technique: 91, flexibility: 87, aura: 90, specialMove: "Colossus Kick" },
  { id: 165, name: "Winifred Vane", belt: "Black", beltColor: "#111111", power: 87, speed: 98, technique: 98, flexibility: 99, aura: 96, specialMove: "Whirlwind Goddess" },
  { id: 166, name: "Xander Wade", belt: "Black", beltColor: "#111111", power: 98, speed: 87, technique: 89, flexibility: 85, aura: 88, specialMove: "Dark Matter Punch" },
  { id: 167, name: "Yolanda Webb", belt: "Black", beltColor: "#111111", power: 85, speed: 96, technique: 96, flexibility: 98, aura: 94, specialMove: "Obsidian Lotus" },
  { id: 168, name: "Zephyr West", belt: "Black", beltColor: "#111111", power: 96, speed: 85, technique: 87, flexibility: 83, aura: 86, specialMove: "Storm Breaker" },
  { id: 169, name: "Aurelius York", belt: "Black", beltColor: "#111111", power: 83, speed: 94, technique: 94, flexibility: 96, aura: 92, specialMove: "Golden Dragon" },
  { id: 170, name: "Briseis Ash", belt: "Black", beltColor: "#111111", power: 94, speed: 83, technique: 85, flexibility: 81, aura: 84, specialMove: "Shadow Cyclone" },
  { id: 171, name: "Caelum Blake", belt: "Black", beltColor: "#111111", power: 81, speed: 92, technique: 92, flexibility: 94, aura: 90, specialMove: "Celestial Kick" },
  { id: 172, name: "Demetria Cole", belt: "Black", beltColor: "#111111", power: 92, speed: 81, technique: 83, flexibility: 79, aura: 82, specialMove: "Titan Spiral" },
  { id: 173, name: "Evander Dean", belt: "Black", beltColor: "#111111", power: 79, speed: 90, technique: 90, flexibility: 92, aura: 88, specialMove: "Warrior's Wrath" },
  { id: 174, name: "Faustina Ellis", belt: "Black", beltColor: "#111111", power: 90, speed: 79, technique: 81, flexibility: 77, aura: 80, specialMove: "Iron Lotus" },
  { id: 175, name: "Gawain Ford", belt: "Black", beltColor: "#111111", power: 77, speed: 88, technique: 88, flexibility: 90, aura: 86, specialMove: "Knight's Kick" },
];

export default students2026;
