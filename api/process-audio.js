const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audioUrl, apiKey } = req.body;

    if (!audioUrl || !apiKey) {
      return res.status(400).json({ 
        error: 'Missing audioUrl or apiKey in request body' 
      });
    }

    // Deepgram API parameters
    const params = new URLSearchParams({
      model: 'nova-2',
      smart_format: 'true',
      utterances: 'true',
      punctuate: 'true',
      diarize: 'true',
      sentiment: 'true',
      extras: 'vocals'
    });

    // Call Deepgram API with the public URL
    const deepgramResponse = await fetch(
      `https://api.deepgram.com/v1/listen?${params}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: audioUrl })
      }
    );

    if (!deepgramResponse.ok) {
      const errorText = await deepgramResponse.text();
      throw new Error(`Deepgram API error: ${errorText}`);
    }

    const data = await deepgramResponse.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};
