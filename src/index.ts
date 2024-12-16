import express from 'express';
import { connectDB } from './utils/db';  // Import the connectDB function

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database when the server starts
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});