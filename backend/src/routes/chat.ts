import express from "express";
import { openai } from "../api/openai";
import multer from "multer";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/text", async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    
    const reply = response.choices?.[0]?.message?.content ?? "No response from the model.";
    res.json({ reply });
  } catch (err: any) {
    if (err.code === 'insufficient_quota' || err.status === 429) {
      return res.status(429).json({ 
        error: "API usage limit exceeded. Check your OpenAI account or use a new API key." 
      });
    }
    
    res.status(500).json({ error: "Error when consulting the chatbot" });
  }
});

router.post("/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File not sent." });
    }

    if (req.file.mimetype?.startsWith('image/')) {
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: req.body.prompt || "What's in this picture?" },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      });

      const reply = response.choices?.[0]?.message?.content ?? "No response from the model.";
      res.json({ reply });
    } else {
      const file = await openai.files.create({
        file: fs.createReadStream(req.file.path),
        purpose: "assistants",
      });

      const assistant = await openai.beta.assistants.create({
        name: "Document Analyzer",
        instructions: "You are an assistant who analyzes documents.",
        model: "gpt-4o",
        tools: [{ type: "file_search" }],
      });

      const thread = await openai.beta.threads.create({
        messages: [{
          role: "user",
          content: req.body.prompt || "What's in this document?",
          attachments: [{
            file_id: file.id,
            tools: [{ type: "file_search" }]
          }]
        }]
      });

      const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id
      });

      const messages = await openai.beta.threads.messages.list(thread.id);
      const reply = messages.data[0]?.content[0]?.type === 'text' 
        ? messages.data[0].content[0].text.value 
        : "Unable to process document.";

      res.json({ reply });
    }
  } catch (err) {
    res.status(500).json({ error: "Error processing file" });
  }
});

export default router;