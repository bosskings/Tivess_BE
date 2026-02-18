import "dotenv/config";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import WatchParty from "./models/WatchParty.js";
import PaymentPlan from "./models/PaymentPlan.js";

const HOST_IDS = [
  "6991039eda5fbc8cfc85c206",
  "6991039eda5fbc8cfc85c207",
  "6991039eda5fbc8cfc85c208",
  "6991039eda5fbc8cfc85c209",
  "6991039eda5fbc8cfc85c20a"
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    // Clear existing watch parties so each run gives exactly 5
    await WatchParty.deleteMany({});
    console.log("Cleared existing watch parties");

    const watchParties = HOST_IDS.map((hostId, idx) => ({
      host: hostId,
      movieTitle: faker.lorem.words({ min: 2, max: 5 }),
      movieLink: faker.internet.url(),
      participants: [],
      status: "SCHEDULED",
      createdAt: new Date(),
    }));

    await WatchParty.insertMany(watchParties);
    console.log(`Seeded ${HOST_IDS.length} watch parties successfully.`);

    // Seed 1 payment plan
    await PaymentPlan.deleteMany({});
    const paymentPlan = new PaymentPlan({
      name: "Premium",
      price: 29.99,
      durationInDays: 30,
      features: ["HD streaming", "No ads", "Access to all movies"],
      status: "ACTIVE",
      createdAt: new Date(),
    });
    await paymentPlan.save();
    console.log("Seeded 1 payment plan successfully.");
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
