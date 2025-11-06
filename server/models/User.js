import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: String, // hashed
  publicKey: String,
  encryptedPrivateKey: String, // 🔐 AES encrypted using user's password
});

export default mongoose.model("User", userSchema);
