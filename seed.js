import "dotenv/config";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import WatchParty from "./models/WatchParty.js";
import PaymentPlan from "./models/PaymentPlan.js";
import Movie from "./models/Movie.js";
import Activity from "./models/Activity.js";

const HOST_IDS = [
  "6991039eda5fbc8cfc85c206",
  "6991039eda5fbc8cfc85c207",
  "6991039eda5fbc8cfc85c208",
  "6991039eda5fbc8cfc85c209",
  "6991039eda5fbc8cfc85c20a"
];

// These host IDs will be added both to 'watchedBy' and 'currentlyWatching'
const WATCHED_AND_WATCHING_USER_IDS = [
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

    // Update all movies: add given user IDs to watchedBy and currentlyWatching (avoid duplicates)
    const update = {
      $addToSet: {
        watchedBy: { $each: WATCHED_AND_WATCHING_USER_IDS },
        currentlyWatching: { $each: WATCHED_AND_WATCHING_USER_IDS }
      }
    };
    const result = await Movie.updateMany({}, update);
    console.log(`Updated ${result.modifiedCount !== undefined ? result.modifiedCount : result.nModified} movies with watchedBy and currentlyWatching user IDs.`);

    // Seed 20 activities
    await Activity.deleteMany({});
    const activityTypes = ["WATCH_PARTY_CREATED", "MOVIE_WATCHED", "COMMENT_ADDED", "FRIEND_JOINED", "PAYMENT_COMPLETED"];
    const activities = Array.from({ length: 20 }, () => ({
      activityType: faker.helpers.arrayElement(activityTypes),
      status: faker.helpers.arrayElement(["SEEN", "UNSEEN"]),
      comment: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : null,
      createdAt: faker.date.recent({ days: 30 }),
    }));
    await Activity.insertMany(activities);
    console.log("Seeded 20 activities successfully.");

    // Seed 1 payment plan if needed (uncomment/modify as desired)
    // await PaymentPlan.deleteMany({});
    // const paymentPlan = new PaymentPlan({
    //   name: "Premium",
    //   price: 29.99,
    //   durationInDays: 30,
    //   features: ["HD streaming", "No ads", "Access to all movies"],
    //   status: "ACTIVE",
    //   createdAt: new Date(),
    // });
    // await paymentPlan.save();
    // console.log("Seeded 1 payment plan successfully.");
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
