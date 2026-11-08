const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main Chat Interface
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Smart AI Assistant</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #101828;
  color: white;
}

.header {
  background: #182230;
  padding: 18px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.container {
  max-width: 700px;
  margin: auto;
  padding: 15px;
}

.chat-box {
  height: 70vh;
  overflow-y: auto;
  background: #1e293b;
  border-radius: 12px;
  padding: 15px;
}

.message {
  padding: 12px;
  margin: 10px 0;
  border-radius: 10px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.user {
  background: #2563eb;
  margin-left: 20%;
}

.ai {
  background: #334155;
  margin-right: 20%;
}

.input-area {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

input {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  outline: none;
}

button {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
}

.status {
  text-align: center;
  color: #94a3b8;
  margin-top: 10px;
}
</style>
</head>

<body>

<div class="header">
  🤖 Smart AI Assistant
</div>

<div class="container">

  <div class="chat-box" id="chatBox">
    <div class="message ai">
      আসসালামু আলাইকুম! 👋
      আমি তোমার Smart AI Assistant।
      আমাকে যেকোনো প্রশ্ন করতে পারো।
    </div>
  </div>

  <div class="input-area">
    <input
      type="text"
      id="messageInput"
      placeholder="এখানে মেসেজ লিখো..."
    >

    <button id="sendBtn" onclick="sendMessage()">
      Send
    </button>
  </div>

  <div class="status" id="status"></div>

</div>

<script>
const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const statusText = document.getElementById("status");

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className = "message " + type;
  message.textContent = text;

  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";
  sendBtn.disabled = true;

  statusText.textContent = "AI উত্তর তৈরি করছে...";

  try {
    const response = await fetch("/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "সমস্যা হয়েছে");
    }

    addMessage(data.reply, "ai");

  } catch (error) {
    addMessage(
      "দুঃখিত! সমস্যা হয়েছে। আবার চেষ্টা করো।",
      "ai"
    );

    console.error(error);

  } finally {
    sendBtn.disabled = false;
    statusText.textContent = "";
    input.focus();
  }
}

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
</script>

</body>
</html>
  `);
});

// AI Chat API
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",

      instructions:
        "You are Smart AI Assistant. Answer users helpfully and clearly in Bengali when they write in Bengali.",

      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI response failed"
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Smart AI Assistant running on port ${PORT}`
  );
});
