const express = require("express");
const cors = require("cors");
const { Telegraf } = require("telegraf");

const app = express();

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = "8793290142:AAFb9Luh1fW1yx4QhDAsXANU23Ig2rOg8C4";
const GROUP_ID = 7754601367;

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

    // Always use the server's current date/time.
    // Any `date` sent in req.body is intentionally ignored.
    const date = new Date();

    const message = `
📋 New Client Entry

📅 Date: ${date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    })}

👤 Client Name: ${client_name}
🆔 Client ID: ${client_id}
💰 Amount: ${amount}
💳 Method: ${method}
🤝 Sharing: ${sharing}
👨‍💼 Executive Code: ${executive_code}
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