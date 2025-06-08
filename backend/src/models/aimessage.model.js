import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
  },
  { timestamps: true }
);

const AIMessage = mongoose.model("AIMessage", aiMessageSchema);

export default AIMessage;
