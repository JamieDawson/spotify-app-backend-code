import mongoose from "mongoose";

const albumSchema = mongoose.Schema({
  one: {
    type: String,
    required: true,
  },
  two: {
    type: String,
    required: true,
  },
  three: {
    type: String,
    required: true,
  },
  four: {
    type: String,
    required: true,
  },
});

export const Albums = mongoose.model("Albums", albumSchema);
