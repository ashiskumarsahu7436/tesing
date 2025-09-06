// api/transcribe.js - Simplified version
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return simulated transcription
    res.status(200).json({ 
      success: true, 
      text: "यह आपकी audio file का simulated transcription है।" 
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Processing failed' 
    });
  }
}
