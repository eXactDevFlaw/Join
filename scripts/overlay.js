/** Lädt externes HTML in #overlay-content */
async function loadFormIntoOverlay(file) {
  const contentEl = document.getElementById("overlay-content");
  const resp = await fetch(file);
  contentEl.innerHTML = resp.ok
    ? await resp.text()
    : `<p style="padding:16px;color:red">Template nicht gefunden: ${file}</p>`;
}

/** Zeigt das Overlay und slidet das Panel rein */
function slideInOverlay() {
  document.getElementById("overlay").classList.add("show");
  document.getElementById("overlay-container").classList.add("show");
}

/** Schließt das Overlay */
function closeOverlay() {
  document.getElementById("overlay-container").classList.remove("show");
  setTimeout(() => {
    document.getElementById("overlay").classList.remove("show");
  }, 250);
}

