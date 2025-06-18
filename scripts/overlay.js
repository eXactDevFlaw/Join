/** Lädt externes HTML in #overlay_content */
async function loadFormIntoOverlay(file) {
  const overlayContent = document.getElementById("overlay-content");
  const resp = await fetch(file);
  overlayContent.innerHTML = resp.ok
    ? await resp.text()
    : `<p style="padding:16px;color:red">Template nicht gefunden</p>`;
}

/** Zeigt Overlay und zieht Container von rechts herein */
function slideInOverlay() {
  document.getElementById("overlay").classList.add("show");
  document.getElementById("overlay-container").classList.add("show");
}

/** Schließt Overlay nach Slide-Out */
function closeOverlay() {
  document.getElementById("overlay-container").classList.remove("show");
  setTimeout(() => {
    document.getElementById("overlay").classList.remove("show");
  }, 250);
}
