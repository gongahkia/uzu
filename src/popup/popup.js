const API_KEY_STORAGE_KEY = 'gemini_api_key';

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get([API_KEY_STORAGE_KEY], (result) => {
    console.log('[popup.js] Loaded API key from storage:', result[API_KEY_STORAGE_KEY]);
    document.getElementById('apiKey').value = result[API_KEY_STORAGE_KEY] || '';
  });
});

document.getElementById('saveKey').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value.trim();
  chrome.storage.local.set({ [API_KEY_STORAGE_KEY]: key }, () => {
    console.log('[popup.js] Saved API key to storage:', key);
    alert('API key saved!');
  });
});

document.getElementById('searchButton').addEventListener('click', () => {
  const caseName = document.getElementById('caseInput').value.trim();
  if (!caseName) {
    alert('Please enter a case name');
    return;
  }
  showLoading(true);
  chrome.runtime.sendMessage(
    { action: "analyzeCase", caseName },
    (response) => {
      showLoading(false);
      if (!response) {
        displayResult({ error: "No response from background script." });
        return;
      }
      if (response.success) {
        displayResult(response.data);
      } else {
        displayResult({ error: response.error });
      }
    }
  );
});

function displayResult(data) {
  const output = document.getElementById('output');
  output.textContent = data.error 
    ? `Error: ${data.error}`
    : JSON.stringify(data, null, 2);
}

function showLoading(show) {
  document.getElementById('loader').style.display = show ? 'block' : 'none';
}

function renderCaseResult(data) {
  if (!data || data.error) {
    document.getElementById('output').innerHTML = `<div class="error">${data?.error || 'No data'}</div>`;
    return;
  }
  document.getElementById('output').innerHTML = `
    <div class="uzu-card">
      <div class="uzu-section">
        <div class="uzu-section-title">Summary</div>
        <div class="uzu-section-content">${data.summary}</div>
      </div>
      <div class="uzu-section">
        <div class="uzu-section-title">Case Facts</div>
        <div class="uzu-section-content">${data.case_facts}</div>
      </div>
      <div class="uzu-section">
        <div class="uzu-section-title">Ruling</div>
        <div class="uzu-section-content">${data.ruling}</div>
      </div>
      <div class="uzu-section">
        <div class="uzu-section-title">Tags</div>
        <ul class="uzu-tags">
          ${Array.isArray(data.tags) ? data.tags.map(tag => `<li>${tag}</li>`).join('') : ''}
        </ul>
      </div>
    </div>
  `;
}

document.getElementById('searchButton').addEventListener('click', () => {
  const caseName = document.getElementById('caseInput').value.trim();
  if (!caseName) {
    alert('Please enter a case name');
    return;
  }
  showLoading(true);
  chrome.runtime.sendMessage(
    { action: "analyzeCase", caseName },
    (response) => {
      showLoading(false);
      if (response && response.success && response.data) {
        renderCaseResult(response.data);
      } else {
        renderCaseResult({ error: response?.error || "Unknown error" });
      }
    }
  );
});