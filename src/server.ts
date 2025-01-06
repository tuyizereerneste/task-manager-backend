// index.ts
import express from "express";
import { connectDB, sequelize } from "./utils/database";
import routes from "./routes/routes";

const app = express();
app.use(express.json());


const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Sync the database (use cautiously in production)
    await sequelize.sync({ force: false }); // Set force to true only if you need to drop and recreate tables
    console.log("Database synchronized successfully.");

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