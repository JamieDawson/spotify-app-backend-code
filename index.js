import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { Albums } from "./models/albumsModel.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;
const mongoDBURL = process.env.MONGODB_URL;

// Use the CORS middleware
app.use(
  cors({
    origin: [
      "https://spotify-app-frontend-code.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you're using credentials
  })
);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB database!");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

const normalizeString = (value) => {
  return value.trim(); // Add any additional normalization logic you need here
};

app.post(
  "/albumsUpdate",
  [
    // Validate and sanitize each field
    body("one").optional().isString().customSanitizer(normalizeString),
    body("two").optional().isString().customSanitizer(normalizeString),
    body("three").optional().isString().customSanitizer(normalizeString),
    body("four").optional().isString().customSanitizer(normalizeString),
  ],
  async (request, response) => {
    // Check for validation errors
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const updates = {};

      // Add only validated fields to the updates object
      if (request.body.one !== undefined) updates.one = request.body.one;
      if (request.body.two !== undefined) updates.two = request.body.two;
      if (request.body.three !== undefined) updates.three = request.body.three;
      if (request.body.four !== undefined) updates.four = request.body.four;

      if (Object.keys(updates).length === 0) {
        return response.status(400).send({
          message: "No fields to update",
        });
      }

      // Define the filter to locate the document
      const filter = { _id: "66a9d1828fb1ffaa63f4ed3c" };

      // Update the existing document only; do not create a new document
      const result = await Albums.updateOne(filter, { $set: updates });

      if (result.matchedCount === 0) {
        return response.status(404).send({ message: "Document not found" });
      }

      // Fetch the updated document
      const album = await Albums.findOne(filter);

      return response.status(200).send(album);
    } catch (error) {
      console.error("Error in /albumsUpdate:", error.message);
      response.status(500).send({ message: error.message });
    }
  }
);

app.get("/getAlbum", async (request, response) => {
  try {
    console.log("Fetching album with ID: 66a9d1828fb1ffaa63f4ed3c");
    const album = await Albums.findOne({ _id: "66a9d1828fb1ffaa63f4ed3c" });
    if (!album) {
      console.error("Album not found");
      return response.status(404).send({ message: "Document not found" });
    }
    return response.status(200).send(album);
  } catch (error) {
    console.error("Error in /getAlbum:", error.message);
    response.status(500).send({ message: error.message });
  }
});

export default app;
