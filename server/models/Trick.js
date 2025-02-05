import mongoose from "mongoose";

const TrickSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  complexity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Trick", TrickSchema);