const express = require("express");
const cors = require("cors");
const { Telegraf } = require("telegraf");

const app = express();

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = "8793290142:AAFb9Luh1fW1yx4QhDAsXANU23Ig2rOg8C4";
const GROUP_ID = 7754601367;

// Executive code -> executive name
const EXECUTIVES = {
  "786": "Lucky Chopra",
  "EX002": "Amit Verma",
  "EX003": "Priya Singh",
  "EX004": "Neha Patel",
};

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is not set");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  try {
    const {
      client_id,
      client_name,
      amount,
      method,
      sharing,
      executive_code,
date
    } = req.body;

    // Validate required fields
    if (
      !client_id ||
      !client_name ||
      amount === undefined ||
      !method ||
      !sharing ||
      !executive_code
    ) {
      return res.status(400).json({
        success: false,
        error:
          "client_id, client_name, amount, method, sharing and executive_code are required",
      });
    }

    // Match executive code with name
    const executiveName = EXECUTIVES[executive_code];

    // Invalid executive code
    if (!executiveName) {
      return res.status(400).json({
        success: false,
        error: "Invalid executive code",
      });
    }

    // Always use the server's current date/time
    const inDate = new Date(date);

    const message = `
📋 New Client Entry

📅 Date: ${inDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    })}

👤 Client Name: ${client_name}
🆔 Client ID: ${client_id}
💰 Amount: ${amount}
💳 Method: ${method}
🤝 Sharing: ${sharing}
👨‍💼 Executive Name: ${executiveName}
`.trim();

    await bot.telegram.sendMessage(GROUP_ID, message);

    res.json({
      success: true,
      message: "Message sent to Telegram group",
    });
  } catch (error) {
    console.error("Telegram error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});