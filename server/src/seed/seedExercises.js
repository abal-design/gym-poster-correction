const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../models/Exercise');
const exercises = require('./exercises');

dotenv.config();

const runSeed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required to seed exercises.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    await Exercise.deleteMany({});
    await Exercise.insertMany(exercises);

    console.log(`Seeded ${exercises.length} exercises successfully.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed exercises:', error.message);
    process.exit(1);
  }
};

runSeed();
