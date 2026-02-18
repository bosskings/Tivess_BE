import "dotenv/config";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import WatchParty from "./models/WatchParty.js";

const SEED_COUNT = 50;

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    // Optional: clear existing watch parties so each run gives exactly 50
    await WatchParty.deleteMany({});
    console.log("Cleared existing watch parties");

    const watchParties = [];

    for (let i = 0; i < SEED_COUNT; i++) {
      watchParties.push({
        title: `Watch Party #${i + 1}`,
        description: faker.lorem.sentence(),
        movieTitle: faker.lorem.words({ min: 2, max: 5 }),
        host: faker.person.fullName(),
        scheduledAt: faker.date.future(),
        inviteCode: faker.string.alphanumeric(8),
        isPrivate: faker.datatype.boolean(),
        maxParticipants: faker.number.int({ min: 2, max: 50 }),
        createdAt: new Date(),
        attendees: []
      });
    }

    await WatchParty.insertMany(watchParties);
    console.log(`Seeded ${SEED_COUNT} watch parties successfully.`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  }
}

seed();
