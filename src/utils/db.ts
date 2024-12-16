import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined, // Convert to number
  });

const connectDB = async () => {
    try {
        // Attempt to connect to the database
        await pool.connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);  // Exit if connection fails
    }
};

// Graceful shutdown (if needed)
const shutdownDB = async () => {
    try {
        await pool.end();  // Close the connection pool
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error closing the database connection:", error);
    }
};

// Export the connectDB function to be used elsewhere
export { connectDB, shutdownDB };