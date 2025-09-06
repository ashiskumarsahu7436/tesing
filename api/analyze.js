import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false, // disable default parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read raw request body as ArrayBuffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Get API key from query or header
    const apiKey = req.headers["x-deepgram-api-key"] || req.query.apiKey;
    if (!apiKey) {
      return res.status(400).json({ error: "Deepgram API Key required" });
    }

    // Send to Deepgram
    const deepgramRes = await fetch(
      "https://api.deepgram.com/v1/listen?features=transcription,diarize,emotion,sentiment",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${apiKey}`,
          "Content-Type": "audio/mpeg", // change to audio/wav if needed
        },
        body: audioBuffer,
      }
    );

    const responseText = await deepgramRes.text();

    try {
      const data = JSON.parse(responseText);
      return res.status(200).json(data);
    } catch (err) {
      // Return raw response for easier debugging
      return res.status(500).send(responseText);
    }

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
