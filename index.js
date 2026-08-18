const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();

const PORT =process.env.PORT || 3000;
const BOT_TOKEN = "8793290142:AAFb9Luh1fW1yx4QhDAsXANU23Ig2rOg8C4";
const GROUP_ID = 7754601367;

const bot = new Telegraf(BOT_TOKEN);

app.use(express.json());

app.post("/send", async (req, res) => {
  try {
    const { name, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        success: false,
        error: "name and text are required",
      });
    }

    const message = `Name: ${name}\n\n${text}`;

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
