// TKD Top Trumps — Black Belt Card Data
// All 80 black belts with generated stats
// Stats are out of 100. Special Move is a unique named technique.
// Photos: placeholder CDN URL used until real photos are uploaded.

export interface BlackBelt {
  id: number;
  name: string;
  dan: string;
  power: number;
  speed: number;
  technique: number;
  flexibility: number;
  aura: number;
  special_move: string;
  photo?: string;
}

export type StatKey = 'power' | 'speed' | 'technique' | 'flexibility' | 'aura';

export const STAT_LABELS: Record<StatKey, string> = {
  power: 'Power',
  speed: 'Speed',
  technique: 'Technique',
  flexibility: 'Flexibility',
  aura: 'Aura',
};

export const STAT_COLORS: Record<StatKey, string> = {
  power: '#E8001D',
  speed: '#00B4D8',
  technique: '#C9A84C',
  flexibility: '#7BC67E',
  aura: '#B388FF',
};

export const STAT_ICONS: Record<StatKey, string> = {
  power: '💥',
  speed: '⚡',
  technique: '🎯',
  flexibility: '🌀',
  aura: '👁️',
};

const PLACEHOLDER_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663205307184/79kvvEBJspWmci3JJyfyv4/tkd-card-placeholder-9AqMoKbZrETyRZk6pRSFR3.webp';

export const blackbelts: BlackBelt[] = [
  { id: 1, name: "Alex Storm", dan: "1st Dan", power: 72, speed: 85, technique: 78, flexibility: 80, aura: 70, special_move: "Thunder Axe Kick", photo: PLACEHOLDER_PHOTO },
  { id: 2, name: "Jamie Blaze", dan: "2nd Dan", power: 80, speed: 76, technique: 82, flexibility: 74, aura: 78, special_move: "Spinning Heel Slash", photo: PLACEHOLDER_PHOTO },
  { id: 3, name: "Morgan Frost", dan: "1st Dan", power: 65, speed: 90, technique: 70, flexibility: 88, aura: 72, special_move: "Frost Tornado Kick", photo: PLACEHOLDER_PHOTO },
  { id: 4, name: "Casey Fire", dan: "3rd Dan", power: 88, speed: 70, technique: 85, flexibility: 68, aura: 90, special_move: "Dragon's Breath Strike", photo: PLACEHOLDER_PHOTO },
  { id: 5, name: "Riley Shadow", dan: "1st Dan", power: 68, speed: 88, technique: 75, flexibility: 85, aura: 65, special_move: "Shadow Step Kick", photo: PLACEHOLDER_PHOTO },
  { id: 6, name: "Jordan Peak", dan: "2nd Dan", power: 82, speed: 78, technique: 80, flexibility: 72, aura: 80, special_move: "Mountain Crusher", photo: PLACEHOLDER_PHOTO },
  { id: 7, name: "Taylor Viper", dan: "1st Dan", power: 70, speed: 82, technique: 72, flexibility: 90, aura: 68, special_move: "Viper's Fang Kick", photo: PLACEHOLDER_PHOTO },
  { id: 8, name: "Sam Thunder", dan: "4th Dan", power: 92, speed: 74, technique: 88, flexibility: 65, aura: 95, special_move: "Thunder God Palm", photo: PLACEHOLDER_PHOTO },
  { id: 9, name: "Drew Phoenix", dan: "2nd Dan", power: 78, speed: 80, technique: 84, flexibility: 78, aura: 76, special_move: "Rising Phoenix Kick", photo: PLACEHOLDER_PHOTO },
  { id: 10, name: "Quinn Blade", dan: "1st Dan", power: 74, speed: 86, technique: 76, flexibility: 82, aura: 74, special_move: "Blade Wind Sweep", photo: PLACEHOLDER_PHOTO },
  { id: 11, name: "Avery Stone", dan: "3rd Dan", power: 86, speed: 72, technique: 90, flexibility: 70, aura: 88, special_move: "Iron Mountain Block", photo: PLACEHOLDER_PHOTO },
  { id: 12, name: "Blake Ember", dan: "1st Dan", power: 66, speed: 84, technique: 68, flexibility: 92, aura: 62, special_move: "Ember Whirlwind", photo: PLACEHOLDER_PHOTO },
  { id: 13, name: "Cameron Tide", dan: "2nd Dan", power: 76, speed: 79, technique: 82, flexibility: 76, aura: 74, special_move: "Tidal Wave Sweep", photo: PLACEHOLDER_PHOTO },
  { id: 14, name: "Dakota Wolf", dan: "1st Dan", power: 80, speed: 83, technique: 74, flexibility: 78, aura: 76, special_move: "Wolf Fang Strike", photo: PLACEHOLDER_PHOTO },
  { id: 15, name: "Elliot Crane", dan: "5th Dan", power: 85, speed: 80, technique: 95, flexibility: 82, aura: 92, special_move: "Crane's Beak Precision", photo: PLACEHOLDER_PHOTO },
  { id: 16, name: "Finley Arrow", dan: "1st Dan", power: 62, speed: 92, technique: 70, flexibility: 88, aura: 60, special_move: "Arrow Flight Kick", photo: PLACEHOLDER_PHOTO },
  { id: 17, name: "Gray Falcon", dan: "2nd Dan", power: 78, speed: 85, technique: 80, flexibility: 80, aura: 78, special_move: "Falcon Dive Strike", photo: PLACEHOLDER_PHOTO },
  { id: 18, name: "Harper Comet", dan: "1st Dan", power: 70, speed: 88, technique: 72, flexibility: 86, aura: 68, special_move: "Comet Tail Kick", photo: PLACEHOLDER_PHOTO },
  { id: 19, name: "Indigo Hawk", dan: "3rd Dan", power: 84, speed: 76, technique: 88, flexibility: 72, aura: 86, special_move: "Hawk Talon Drop", photo: PLACEHOLDER_PHOTO },
  { id: 20, name: "Jesse Titan", dan: "2nd Dan", power: 90, speed: 68, technique: 82, flexibility: 64, aura: 88, special_move: "Titan's Hammer Kick", photo: PLACEHOLDER_PHOTO },
  { id: 21, name: "Kai Lotus", dan: "1st Dan", power: 68, speed: 80, technique: 85, flexibility: 90, aura: 72, special_move: "Lotus Spin Kick", photo: PLACEHOLDER_PHOTO },
  { id: 22, name: "Lane Striker", dan: "2nd Dan", power: 82, speed: 78, technique: 78, flexibility: 74, aura: 80, special_move: "Lightning Jab Combo", photo: PLACEHOLDER_PHOTO },
  { id: 23, name: "Milo Raven", dan: "1st Dan", power: 72, speed: 86, technique: 74, flexibility: 84, aura: 70, special_move: "Raven's Wing Sweep", photo: PLACEHOLDER_PHOTO },
  { id: 24, name: "Nova Steel", dan: "4th Dan", power: 88, speed: 78, technique: 92, flexibility: 76, aura: 90, special_move: "Steel Nova Burst", photo: PLACEHOLDER_PHOTO },
  { id: 25, name: "Oakley Surge", dan: "1st Dan", power: 74, speed: 82, technique: 76, flexibility: 80, aura: 72, special_move: "Surge Stomp Kick", photo: PLACEHOLDER_PHOTO },
  { id: 26, name: "Parker Blitz", dan: "2nd Dan", power: 84, speed: 80, technique: 80, flexibility: 70, aura: 82, special_move: "Blitz Rush Strike", photo: PLACEHOLDER_PHOTO },
  { id: 27, name: "Quinn Ember", dan: "1st Dan", power: 66, speed: 88, technique: 70, flexibility: 92, aura: 64, special_move: "Ember Spiral", photo: PLACEHOLDER_PHOTO },
  { id: 28, name: "Reese Gale", dan: "3rd Dan", power: 86, speed: 74, technique: 86, flexibility: 70, aura: 88, special_move: "Gale Force Roundhouse", photo: PLACEHOLDER_PHOTO },
  { id: 29, name: "Sage Drift", dan: "1st Dan", power: 64, speed: 90, technique: 72, flexibility: 88, aura: 66, special_move: "Drift Step Counter", photo: PLACEHOLDER_PHOTO },
  { id: 30, name: "Tatum Blaze", dan: "2nd Dan", power: 80, speed: 82, technique: 82, flexibility: 76, aura: 78, special_move: "Blaze Heel Drop", photo: PLACEHOLDER_PHOTO },
  { id: 31, name: "Uma Cyclone", dan: "1st Dan", power: 70, speed: 84, technique: 74, flexibility: 86, aura: 70, special_move: "Cyclone Spin Kick", photo: PLACEHOLDER_PHOTO },
  { id: 32, name: "Vance Iron", dan: "5th Dan", power: 94, speed: 72, technique: 90, flexibility: 68, aura: 96, special_move: "Iron Fist Devastator", photo: PLACEHOLDER_PHOTO },
  { id: 33, name: "Wren Spark", dan: "1st Dan", power: 68, speed: 86, technique: 76, flexibility: 84, aura: 68, special_move: "Spark Flicker Kick", photo: PLACEHOLDER_PHOTO },
  { id: 34, name: "Xander Bolt", dan: "2nd Dan", power: 82, speed: 84, technique: 78, flexibility: 76, aura: 80, special_move: "Bolt Dash Strike", photo: PLACEHOLDER_PHOTO },
  { id: 35, name: "Yara Mist", dan: "1st Dan", power: 62, speed: 88, technique: 80, flexibility: 90, aura: 66, special_move: "Mist Veil Kick", photo: PLACEHOLDER_PHOTO },
  { id: 36, name: "Zane Fury", dan: "3rd Dan", power: 90, speed: 76, technique: 84, flexibility: 68, aura: 92, special_move: "Fury Storm Combo", photo: PLACEHOLDER_PHOTO },
  { id: 37, name: "Ace Phantom", dan: "2nd Dan", power: 76, speed: 88, technique: 80, flexibility: 82, aura: 78, special_move: "Phantom Blur Kick", photo: PLACEHOLDER_PHOTO },
  { id: 38, name: "Bex Comet", dan: "1st Dan", power: 70, speed: 82, technique: 72, flexibility: 86, aura: 68, special_move: "Comet Crash Kick", photo: PLACEHOLDER_PHOTO },
  { id: 39, name: "Cruz Titan", dan: "4th Dan", power: 92, speed: 70, technique: 88, flexibility: 66, aura: 94, special_move: "Titan Quake Stomp", photo: PLACEHOLDER_PHOTO },
  { id: 40, name: "Dex Blaze", dan: "1st Dan", power: 74, speed: 80, technique: 76, flexibility: 82, aura: 72, special_move: "Blaze Snap Kick", photo: PLACEHOLDER_PHOTO },
  { id: 41, name: "Eden Storm", dan: "2nd Dan", power: 78, speed: 84, technique: 82, flexibility: 78, aura: 76, special_move: "Storm Surge Heel", photo: PLACEHOLDER_PHOTO },
  { id: 42, name: "Flynn Viper", dan: "1st Dan", power: 72, speed: 86, technique: 70, flexibility: 88, aura: 70, special_move: "Viper Strike Combo", photo: PLACEHOLDER_PHOTO },
  { id: 43, name: "Gia Shadow", dan: "3rd Dan", power: 84, speed: 78, technique: 88, flexibility: 74, aura: 86, special_move: "Shadow Mirage Kick", photo: PLACEHOLDER_PHOTO },
  { id: 44, name: "Haze Arrow", dan: "1st Dan", power: 66, speed: 90, technique: 72, flexibility: 90, aura: 64, special_move: "Arrow Rain Kick", photo: PLACEHOLDER_PHOTO },
  { id: 45, name: "Ivan Peak", dan: "2nd Dan", power: 86, speed: 74, technique: 80, flexibility: 70, aura: 84, special_move: "Peak Pressure Strike", photo: PLACEHOLDER_PHOTO },
  { id: 46, name: "Juno Blade", dan: "1st Dan", power: 68, speed: 84, technique: 78, flexibility: 86, aura: 66, special_move: "Blade Edge Sweep", photo: PLACEHOLDER_PHOTO },
  { id: 47, name: "Knox Frost", dan: "5th Dan", power: 90, speed: 78, technique: 94, flexibility: 74, aura: 95, special_move: "Frost King Devastator", photo: PLACEHOLDER_PHOTO },
  { id: 48, name: "Lena Surge", dan: "2nd Dan", power: 76, speed: 82, technique: 84, flexibility: 80, aura: 76, special_move: "Surge Spin Kick", photo: PLACEHOLDER_PHOTO },
  { id: 49, name: "Max Ember", dan: "1st Dan", power: 80, speed: 78, technique: 74, flexibility: 76, aura: 74, special_move: "Ember Blast Kick", photo: PLACEHOLDER_PHOTO },
  { id: 50, name: "Nix Hawk", dan: "3rd Dan", power: 88, speed: 80, technique: 86, flexibility: 72, aura: 88, special_move: "Hawk Screech Kick", photo: PLACEHOLDER_PHOTO },
  { id: 51, name: "Ora Phoenix", dan: "1st Dan", power: 66, speed: 86, technique: 76, flexibility: 88, aura: 68, special_move: "Phoenix Feather Kick", photo: PLACEHOLDER_PHOTO },
  { id: 52, name: "Pax Thunder", dan: "2nd Dan", power: 84, speed: 76, technique: 80, flexibility: 72, aura: 82, special_move: "Thunder Clap Strike", photo: PLACEHOLDER_PHOTO },
  { id: 53, name: "Rex Gale", dan: "1st Dan", power: 78, speed: 80, technique: 72, flexibility: 80, aura: 76, special_move: "Gale Sweep Kick", photo: PLACEHOLDER_PHOTO },
  { id: 54, name: "Sky Lotus", dan: "4th Dan", power: 82, speed: 84, technique: 92, flexibility: 88, aura: 88, special_move: "Lotus Blossom Strike", photo: PLACEHOLDER_PHOTO },
  { id: 55, name: "Teo Wolf", dan: "1st Dan", power: 74, speed: 82, technique: 74, flexibility: 82, aura: 72, special_move: "Wolf Howl Kick", photo: PLACEHOLDER_PHOTO },
  { id: 56, name: "Uri Raven", dan: "2nd Dan", power: 80, speed: 80, technique: 82, flexibility: 76, aura: 80, special_move: "Raven Dive Kick", photo: PLACEHOLDER_PHOTO },
  { id: 57, name: "Val Titan", dan: "1st Dan", power: 82, speed: 74, technique: 76, flexibility: 70, aura: 78, special_move: "Titan Slam Kick", photo: PLACEHOLDER_PHOTO },
  { id: 58, name: "Wes Cyclone", dan: "3rd Dan", power: 86, speed: 78, technique: 84, flexibility: 74, aura: 86, special_move: "Cyclone Fury Combo", photo: PLACEHOLDER_PHOTO },
  { id: 59, name: "Xia Drift", dan: "1st Dan", power: 64, speed: 90, technique: 74, flexibility: 92, aura: 64, special_move: "Drift Ghost Kick", photo: PLACEHOLDER_PHOTO },
  { id: 60, name: "Yuki Bolt", dan: "2nd Dan", power: 78, speed: 86, technique: 80, flexibility: 80, aura: 76, special_move: "Bolt Flash Kick", photo: PLACEHOLDER_PHOTO },
  { id: 61, name: "Zara Spark", dan: "1st Dan", power: 68, speed: 84, technique: 76, flexibility: 86, aura: 68, special_move: "Spark Burst Kick", photo: PLACEHOLDER_PHOTO },
  { id: 62, name: "Axel Blaze", dan: "5th Dan", power: 92, speed: 80, technique: 92, flexibility: 78, aura: 96, special_move: "Blazing Inferno Kick", photo: PLACEHOLDER_PHOTO },
  { id: 63, name: "Bria Storm", dan: "2nd Dan", power: 76, speed: 82, technique: 82, flexibility: 78, aura: 76, special_move: "Storm Blade Kick", photo: PLACEHOLDER_PHOTO },
  { id: 64, name: "Cole Viper", dan: "1st Dan", power: 72, speed: 84, technique: 72, flexibility: 84, aura: 70, special_move: "Viper Coil Strike", photo: PLACEHOLDER_PHOTO },
  { id: 65, name: "Dara Falcon", dan: "3rd Dan", power: 84, speed: 80, technique: 88, flexibility: 76, aura: 86, special_move: "Falcon Talon Kick", photo: PLACEHOLDER_PHOTO },
  { id: 66, name: "Eli Frost", dan: "1st Dan", power: 70, speed: 82, technique: 78, flexibility: 84, aura: 70, special_move: "Frost Bite Kick", photo: PLACEHOLDER_PHOTO },
  { id: 67, name: "Faye Arrow", dan: "2nd Dan", power: 74, speed: 88, technique: 80, flexibility: 84, aura: 74, special_move: "Arrow Storm Kick", photo: PLACEHOLDER_PHOTO },
  { id: 68, name: "Glen Surge", dan: "1st Dan", power: 78, speed: 78, technique: 74, flexibility: 78, aura: 74, special_move: "Surge Kick Combo", photo: PLACEHOLDER_PHOTO },
  { id: 69, name: "Hana Ember", dan: "4th Dan", power: 86, speed: 82, technique: 90, flexibility: 84, aura: 90, special_move: "Ember Phoenix Rise", photo: PLACEHOLDER_PHOTO },
  { id: 70, name: "Ike Shadow", dan: "1st Dan", power: 74, speed: 80, technique: 72, flexibility: 80, aura: 72, special_move: "Shadow Kick Counter", photo: PLACEHOLDER_PHOTO },
  { id: 71, name: "Jade Titan", dan: "2nd Dan", power: 82, speed: 76, technique: 82, flexibility: 72, aura: 80, special_move: "Titan Spin Kick", photo: PLACEHOLDER_PHOTO },
  { id: 72, name: "Kobe Hawk", dan: "1st Dan", power: 76, speed: 82, technique: 74, flexibility: 80, aura: 74, special_move: "Hawk Swoop Kick", photo: PLACEHOLDER_PHOTO },
  { id: 73, name: "Luna Gale", dan: "3rd Dan", power: 80, speed: 84, technique: 88, flexibility: 82, aura: 84, special_move: "Gale Moon Kick", photo: PLACEHOLDER_PHOTO },
  { id: 74, name: "Marc Blitz", dan: "1st Dan", power: 80, speed: 76, technique: 74, flexibility: 74, aura: 76, special_move: "Blitz Snap Kick", photo: PLACEHOLDER_PHOTO },
  { id: 75, name: "Nina Lotus", dan: "2nd Dan", power: 72, speed: 84, technique: 86, flexibility: 88, aura: 76, special_move: "Lotus Spiral Kick", photo: PLACEHOLDER_PHOTO },
  { id: 76, name: "Omar Bolt", dan: "1st Dan", power: 78, speed: 80, technique: 72, flexibility: 76, aura: 74, special_move: "Bolt Kick Rush", photo: PLACEHOLDER_PHOTO },
  { id: 77, name: "Pia Cyclone", dan: "5th Dan", power: 88, speed: 84, technique: 94, flexibility: 86, aura: 94, special_move: "Cyclone Goddess Kick", photo: PLACEHOLDER_PHOTO },
  { id: 78, name: "Rory Raven", dan: "2nd Dan", power: 80, speed: 82, technique: 80, flexibility: 78, aura: 80, special_move: "Raven Talon Strike", photo: PLACEHOLDER_PHOTO },
  { id: 79, name: "Suki Wolf", dan: "1st Dan", power: 70, speed: 86, technique: 76, flexibility: 86, aura: 70, special_move: "Wolf Spirit Kick", photo: PLACEHOLDER_PHOTO },
  { id: 80, name: "Theo Thunder", dan: "3rd Dan", power: 90, speed: 74, technique: 86, flexibility: 70, aura: 92, special_move: "Thunder God Stomp", photo: PLACEHOLDER_PHOTO },
];

export function shuffleDeck(deck: BlackBelt[]): BlackBelt[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
