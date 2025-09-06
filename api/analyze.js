import fetch from "node-fetch";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form" });
    }

    const apiKey = fields.apiKey;
    const file = files.audio;

    if (!apiKey || !file) {
      return res.status(400).json({ error: "API Key and audio file are required" });
    }

    try {
      const audioData = fs.readFileSync(file.filepath);

      const deepgramRes = await fetch(
        "https://api.deepgram.com/v1/listen?features=transcription,diarize,emotion,sentiment",
        {
          method: "POST",
          headers: {
            "Authorization": `Token ${apiKey}`,
            "Content-Type": "audio/mpeg", // or audio/wav depending on your file
          },
          body: audioData,
        }
      );

      if (!deepgramRes.ok) {
        const errorText = await deepgramRes.text();
        return res.status(500).json({ error: errorText });
      }

      const data = await deepgramRes.json();
      return res.status(200).json(data);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
}
