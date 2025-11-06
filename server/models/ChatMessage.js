import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  ciphertext: { type: String, required: true },
  nonce: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }  // ✅ auto timestamp
});

export default mongoose.model("ChatMessage", chatMessageSchema);
