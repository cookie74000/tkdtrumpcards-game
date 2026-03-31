// Seed script: imports 123 real club members into the students table
// Run with: node seed-students.mjs

import { createReadStream } from "fs";
import { createInterface } from "readline";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";

dotenv.config();

// Belt grade → stat boosts (higher grade = higher base stats)
const GRADE_STATS = {
  "White Belt - 10th Kup":              { power: 30, speed: 35, technique: 28, flexibility: 40, aura: 25 },
  "White Belt  Yellow Tag - 9th Kup":   { power: 35, speed: 38, technique: 32, flexibility: 42, aura: 28 },
  "Yellow Belt - 8th Kup":              { power: 40, speed: 42, technique: 38, flexibility: 45, aura: 32 },
  "Yellow Belt Green Tag - 7th Kup":    { power: 45, speed: 46, technique: 43, flexibility: 48, aura: 36 },
  "Green Belt - 6th Kup":               { power: 50, speed: 52, technique: 50, flexibility: 52, aura: 42 },
  "Green Belt Blue Tag - 5th Kup":      { power: 55, speed: 56, technique: 55, flexibility: 55, aura: 48 },
  "Blue Belt - 4th Kup":                { power: 60, speed: 60, technique: 60, flexibility: 58, aura: 54 },
  "Blue Belt Red Tag - 3rd Kup":        { power: 65, speed: 64, technique: 65, flexibility: 62, aura: 60 },
  "Red Belt - 2nd Kup":                 { power: 70, speed: 68, technique: 70, flexibility: 65, aura: 66 },
  "Red Belt Black Tag - 1st Kup":       { power: 75, speed: 72, technique: 75, flexibility: 68, aura: 72 },
  "Black Belt - 1st Dan":               { power: 80, speed: 78, technique: 80, flexibility: 72, aura: 78 },
  "Black Belt - 1st Dan 1st*":          { power: 84, speed: 82, technique: 84, flexibility: 75, aura: 82 },
  "Black Belt - 1st Dan 2nd*":          { power: 87, speed: 85, technique: 87, flexibility: 78, aura: 85 },
  "Black Belt - 2nd Dan":               { power: 90, speed: 88, technique: 90, flexibility: 82, aura: 88 },
  "Black Belt - 3rd Dan":               { power: 93, speed: 91, technique: 93, flexibility: 85, aura: 92 },
  "Black Belt - 4th Dan":               { power: 96, speed: 94, technique: 96, flexibility: 88, aura: 95 },
  "Black Belt - 5th Dan":               { power: 99, speed: 97, technique: 99, flexibility: 92, aura: 99 },
};

const SPECIAL_MOVES = {
  "White Belt - 10th Kup":              "Front Kick",
  "White Belt  Yellow Tag - 9th Kup":   "Side Kick",
  "Yellow Belt - 8th Kup":              "Turning Kick",
  "Yellow Belt Green Tag - 7th Kup":    "Double Kick",
  "Green Belt - 6th Kup":              "Jumping Front Kick",
  "Green Belt Blue Tag - 5th Kup":      "Spinning Back Kick",
  "Blue Belt - 4th Kup":                "Reverse Turning Kick",
  "Blue Belt Red Tag - 3rd Kup":        "Flying Side Kick",
  "Red Belt - 2nd Kup":                 "Tornado Kick",
  "Red Belt Black Tag - 1st Kup":       "540 Kick",
  "Black Belt - 1st Dan":               "Dragon Sweep",
  "Black Belt - 1st Dan 1st*":          "Thunder Strike",
  "Black Belt - 1st Dan 2nd*":          "Phoenix Kick",
  "Black Belt - 2nd Dan":               "Iron Tiger Combo",
  "Black Belt - 3rd Dan":               "Storm Breaker",
  "Black Belt - 4th Dan":               "Shadow Destroyer",
  "Black Belt - 5th Dan":               "Grand Master's Wrath",
};

function jitter(base, range = 8) {
  return Math.min(99, Math.max(10, base + Math.floor(Math.random() * range * 2) - range));
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  // Read the master CSV
  const csvContent = readFileSync("/home/ubuntu/members_master.csv", "utf-8");
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  console.log(`Seeding ${records.length} students...`);

  // Build insert values
  const values = records.map((row) => {
    const grade = row.grade || "White Belt - 10th Kup";
    const baseStats = GRADE_STATS[grade] || GRADE_STATS["White Belt - 10th Kup"];
    const specialMove = SPECIAL_MOVES[grade] || "Taekwondo Strike";

    // Clean name — strip titles
    let name = row.name
      .replace(/^(Mr|Mrs|Miss|Ms|Master|Dr|Prof)\s+/i, "")
      .trim();
    // Fix all-caps
    if (name === name.toUpperCase()) {
      name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }
    // Fix first letter capitalisation
    name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    return {
      membershipNumber: row.membership_number,
      name,
      grade,
      power: jitter(baseStats.power),
      speed: jitter(baseStats.speed),
      technique: jitter(baseStats.technique),
      flexibility: jitter(baseStats.flexibility),
      aura: jitter(baseStats.aura),
      specialMove,
      active: true,
    };
  });

  // Insert in batches, ignore duplicates
  let inserted = 0;
  for (const v of values) {
    try {
      await connection.execute(
        `INSERT INTO students (membershipNumber, name, grade, power, speed, technique, flexibility, aura, specialMove, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           grade = VALUES(grade)`,
        [v.membershipNumber, v.name, v.grade, v.power, v.speed, v.technique, v.flexibility, v.aura, v.specialMove, v.active ? 1 : 0]
      );
      inserted++;
    } catch (err) {
      console.error(`Failed to insert ${v.name}:`, err.message);
    }
  }

  console.log(`✅ Seeded ${inserted} students successfully.`);
  await connection.end();
}

main().catch(console.error);
