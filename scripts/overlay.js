/**
 * Lädt ein externes HTML‐Fragment in #overlay-content.
 * @param {string} file - Pfad zur HTML-Datei
 */
async function loadFormIntoOverlay(file) {
  const overlayContent = document.getElementById('overlay-content');
  const resp = await fetch(file);
  overlayContent.innerHTML = resp.ok
    ? await resp.text()
    : `<p style="padding:16px;color:red">Template nicht gefunden</p>`;
}

/** Zeigt das Overlay (fade-in) und zieht den Container rein */
function slideInOverlay() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('overlay-container').classList.add('overlay-slide-in');
}

/** Schließt das Overlay (slide-out + fade-out) */
function closeOverlay() {
  document.getElementById('overlay-container').classList.remove('overlay-slide-in');
  setTimeout(() => {
    document.getElementById('overlay').classList.remove('show');
  }, 200);
}
