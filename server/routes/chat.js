import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// 🧠 Save encrypted message
router.post("/save", async (req, res) => {
  try {
    const { from, to, ciphertext, nonce } = req.body;

    const message = new ChatMessage({
      from,
      to,
      ciphertext,
      nonce,
      timestamp: new Date(), // ✅ ensure timestamp saved
    });

    await message.save();
    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// 🧩 Get chat history
router.get("/get/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await ChatMessage.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    })
      .sort({ timestamp: 1 }); // ✅ add this line here (sort by oldest → newest)

    res.json(messages);
  } catch (err) {
    console.error("Error getting chat:", err);
    res.status(500).json({ error: "Failed to load chat" });
  }
});

export default router;
