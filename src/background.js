chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeCase") {
    console.log('[background.js] Received analyzeCase request:', request.caseName);
    analyzeCase(request.caseName)
      .then(response => {
        console.log('[background.js] analyzeCase success:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('[background.js] analyzeCase error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; 
  }
});

function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['gemini_api_key'], (result) => {
      console.log('[background.js] Loaded API key from storage:', result['gemini_api_key']);
      if (result['gemini_api_key']) resolve(result['gemini_api_key']);
      else reject(new Error('Gemini API key not found. Please save it in the popup.'));
    });
  });
}

async function analyzeCase(caseName) {
  const apiKey = await getApiKey();
  const prompt = `For the legal case "${caseName}", return JSON with: 
    - "case_facts": concise facts of the case
    - "ruling": court's final decision
    - "tags": array of 3-5 legal tags
    - "summary": 2-sentence overview
    Use this exact structure. No markdown.`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  console.log('[background.js] Gemini API response status:', response.status);

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('[background.js] Gemini API response data:', data);
  return parseGeminiResponse(data);
}

function parseGeminiResponse(data) {
  try {
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/``````/g, '').trim();
    const parsed = JSON.parse(text);
    console.log('[background.js] Parsed Gemini response:', parsed);
    return parsed;
  } catch (e) {
    console.error('[background.js] Failed to parse Gemini response:', e);
    throw new Error('Failed to parse Gemini response as JSON.');
  }
}