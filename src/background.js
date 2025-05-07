chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeCase") {
    analyzeCase(request.caseName)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; 
  }
});

function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['gemini_api_key'], (result) => {
      if (result.gemini_api_key) resolve(result.gemini_api_key);
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

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
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

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return parseGeminiResponse(data);
}

function parseGeminiResponse(data) {
  try {
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/``````/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse Gemini response as JSON.');
  }
}