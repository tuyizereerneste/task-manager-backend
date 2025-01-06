// File: utils/database.ts
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Initialize Sequelize instance
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5434,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Disable query logging for cleaner output
});

// Function to ensure database connection is established
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application on failure
  }
};

export  { sequelize, connectDB };