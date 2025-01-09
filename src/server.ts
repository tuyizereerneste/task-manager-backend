import express from "express";
import { connectDB, sequelize } from "./utils/database";
import routes from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Synchronize database schema
    if (process.env.NODE_ENV === "development") {
      // Use alter: true in development to apply model changes
      await sequelize.sync({ alter: true });
      console.log("Database schema updated in development mode.");
    } else {
      console.log("Skipping sync in production. Use migrations instead.");
    }

    // Apply routes
    app.use("/", routes);

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
  }
};

startServer();

export default startServer;