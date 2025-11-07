const form = document.getElementById('lookup-form');
const input = document.getElementById('word-input');
const results = document.getElementById('results');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = input.value.trim();
  if (!word) {
    showMessage('Please enter a word.');
    return;
  }

  setBusy(true);
  clearResults();
  showMessage('Looking up...');

  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = res.status === 404 ? 'No definitions found for this word.' : `Request failed: ${res.status}`;
      showMessage(errText);
      setBusy(false);
      return;
    }

    const data = await res.json();
    renderEntry(data);
    showMessage('');
  } catch (err) {
    console.error(err);
    showMessage('Network error. Please try again.');
  } finally {
    setBusy(false);
  }
});

function renderEntry(data) {
  const entry = Array.isArray(data) ? data[0] : data;

  const wordHeader = document.createElement('div');
  wordHeader.className = 'word-header';

  const wordEl = document.createElement('div');
  wordEl.className = 'word';
  wordEl.textContent = entry.word || '';

  const phoneticEl = document.createElement('div');
  phoneticEl.className = 'phonetic';
  phoneticEl.textContent =
    entry.phonetic ||
    (entry.phonetics && entry.phonetics.find(p => p.text)?.text) ||
    '';

  wordHeader.appendChild(wordEl);
  if (phoneticEl.textContent) wordHeader.appendChild(phoneticEl);
  results.appendChild(wordHeader);

  if (Array.isArray(entry.meanings)) {
    entry.meanings.forEach(m => {
      const part = document.createElement('div');
      part.className = 'part';

      const h3 = document.createElement('h3');
      h3.textContent = m.partOfSpeech || 'part of speech';
      part.appendChild(h3);

      const ul = document.createElement('ul');
      ul.className = 'defs';

      (m.definitions || []).forEach(d => {
        const li = document.createElement('li');
        const defText = d.definition || '';
        const example = d.example ? ` — e.g., "${d.example}"` : '';
        li.textContent = `${defText}${example}`;
        ul.appendChild(li);
      });

      part.appendChild(ul);
      results.appendChild(part);
    });
  }
}

function setBusy(isBusy) {
  results.setAttribute('aria-busy', isBusy ? 'true' : 'false');
}
function showMessage(text) { message.textContent = text; }
function clearResults() { results.innerHTML = ''; }