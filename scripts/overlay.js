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

  // Hintergrund und Modal einblenden
  overlay.classList.add("show");
  container.classList.add("show");

  // Add‑Button deaktivieren
  const addBtn = document.querySelector(".add_contact_btn");
  if (addBtn) addBtn.disabled = true;

  // Klicks im Container nicht weiterreichen
  container.addEventListener("click", e => e.stopPropagation(), { once: true });
}

/** Schließt Overlay nach Slide-Out */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  const container = document.getElementById("overlay-container");
  if (!overlay || !container) return;

  // Modal herausfahren
  container.classList.remove("show");

  // nach Animation den Hintergrund ausblenden & Button wieder aktivieren
  setTimeout(() => {
    overlay.classList.remove("show");
    const addBtn = document.querySelector(".add_contact_btn");
    if (addBtn) addBtn.disabled = false;
  }, 250);
}

// Klick aufs halbdurchsichtige Overlay schließt das Modal
document.getElementById("overlay")?.addEventListener("click", closeOverlay);

// Alles, was INSIDE des Containers angeklickt wird, darf nicht schließen
document.getElementById("overlay-container")?.addEventListener("click", e => {
  e.stopPropagation();
});
