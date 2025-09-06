export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for environment variable
    if (!process.env.HUGGING_FACE_TOKEN) {
      return res.status(500).json({ 
        error: 'Server configuration error: HUGGING_FACE_TOKEN not set' 
      });
    }

    // Your audio processing code here
    // ...
    
    // Sample success response
    res.status(200).json({ 
      success: true, 
      text: "यह ट्रांसक्रिप्शन का उदाहरण है" 
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Processing failed: ' + error.message 
    });
  }
}
