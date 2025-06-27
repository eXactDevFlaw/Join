/** Lädt externes HTML in #overlay-content */
async function loadFormIntoOverlay(file) {
  const overlayContent = document.getElementById("overlay-content");
  if (!overlayContent) {
    console.error("Overlay-Content-Element nicht gefunden!");
    return;
  }
  const resp = await fetch(file);
  overlayContent.innerHTML = resp.ok
    ? await resp.text()
    : `<p style="padding:16px;color:red">Template nicht gefunden</p>`;
}

/** Zeigt Overlay und zieht Container herein */
function slideInOverlay() {
  const overlay = document.getElementById("overlay");
  const container = document.getElementById("overlay-container");
  if (!overlay || !container) {
    console.error("Overlay- oder Container-Element nicht gefunden!");
    return;
  }

  // Grauen Hintergrund anzeigen
  overlay.classList.add("show");
  // Modal hereinschieben
  container.classList.add("show");

  // Klicks **im** Container nicht weiterreichen, damit es nicht sofort wieder schließt
  container.addEventListener("click", e => e.stopPropagation(), { once: true });
}

/** Schließt Overlay nach Slide-Out */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  const container = document.getElementById("overlay-container");
  if (!overlay || !container) return;

  // Container herausfahren lassen
  container.classList.remove("show");
  // nach der Animation den Hintergrund ausblenden
  setTimeout(() => overlay.classList.remove("show"), 250);
}

// Klick aufs halbdurchsichtige Overlay schließt das Modal
document.getElementById("overlay")?.addEventListener("click", closeOverlay);

// **Alles, was INSIDE des Containers angeklickt wird, darf nicht schließen**
document.getElementById("overlay-container")?.addEventListener("click", e => {
  e.stopPropagation();
});