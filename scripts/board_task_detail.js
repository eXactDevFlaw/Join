/**
 * Board‑Detail: Assigned‑to‑Dropdown im Task‑Overlay
 * Nutzt die globalen allContacts / selectedContacts aus add_task.js
 */
// 1) Beim Laden einmal alle Kontakte holen (global)
document.addEventListener("DOMContentLoaded", async () => {
    const raw = await getContactsFromDatabase();
    allContacts = Object.entries(raw || {}).map(([id, data]) => ({ id, ...data }));
});
async function renderContacts() {
  const container = document.getElementById("add-task-contacts-list");
  const input     = document.getElementById("assigned-to-dropdown");
  if (!container || !input) return;
  const filter = input.value.trim().toLowerCase();
  container.innerHTML = "";
  allContacts
    .filter(c => c.name.toLowerCase().startsWith(filter))
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(contact => {
      const sel      = selectedContacts.includes(contact.id);
      const initials = getInitials(contact.name);
      const color    = stringToColor(contact.name);
      const row      = document.createElement("div");
      row.className = "assign_contact_row" + (sel ? " contact_list_item_active" : "");
      row.innerHTML = `
        <div class="assign_contact_left">
          <div class="contact_circle" style="background-color:${color}">
            ${initials}
          </div>
          <span class="assign_contact_name" style="color:${sel?'white':''}">
            ${contact.name}
          </span>
        </div>
        <div class="assign_contact_checkbox">
          <img src="./assets/icons/check.svg"
               class="check_icon"
               style="display:${sel?'block':'none'}" />
        </div>
      `;
      row.addEventListener("click", e => {
        e.stopPropagation();
        const idx = selectedContacts.indexOf(contact.id);
        if (idx >= 0) selectedContacts.splice(idx, 1);
        else           selectedContacts.push(contact.id);
        renderContacts();
        renderSelectedCircles();
      });
      container.appendChild(row);
    });
}
// 3) Vorschau unten (kleine Kreise)
function renderSelectedCircles() {
    const preview = document.getElementById("assigned-contacts-preview");
    preview.innerHTML = "";
    selectedContacts.forEach(id => {
        const c = allContacts.find(x => x.id === id);
        if (!c) return;
        const circle = document.createElement("div");
        circle.className = "assigned_circle";
        circle.textContent = getInitials(c.name);
        circle.style.backgroundColor = stringToColor(c.name);
        preview.appendChild(circle);
    });
}
// 4) Das Overlay öffnen — zentraler Einstiegspunkt vom Board!
function openTaskOverlay() {
    // Overlay sichtbar machen
    const overlay = document.getElementById("task-overlay");
    overlay.classList.remove("d_none");
    // Template injizieren
    const entry = document.getElementById("add-task-entry");
    entry.innerHTML = addTaskTemplate();
    entry.classList.remove("d_none");
    void entry.offsetWidth;
    entry.classList.add("show");
    // Live‑Refs im neueingefügten DOM
    const wrap = entry.querySelector(".input_assigned_to");
    const list = entry.querySelector("#add-task-contacts-list");
    const arrow = entry.querySelector("#arrow-drop-down-assign");
    const input = entry.querySelector("#assigned-to-dropdown");
    // 1× erstes Rendern
    renderContacts();
    // Live‑Filter auf Eingabe
    if (input) {
        input.addEventListener("input", () => {
            if (!list.classList.contains("d_none")) renderContacts();
        });
    }
    // Klick auf Wrap öffnet/schließt Dropdown
    if (wrap && list && arrow) {
        wrap.addEventListener("click", e => {
            e.stopPropagation();
            if (list.classList.contains("d_none")) renderContacts();
            list.classList.toggle("d_none");
            arrow.classList.toggle("up");
        });
        // Klick außerhalb schließt Dropdown
        document.addEventListener("click", e => {
            if (!wrap.contains(e.target) && !list.contains(e.target)) {
                list.classList.add("d_none");
                arrow.classList.add("up");
            }
        });
    }
}
// 5) Hilfsfunktionen
function getInitials(name) {
    return name
        .split(" ")
        .map(w => w[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 2);
}
function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360}, 70%, 50%)`;
}
// Globale Exports
window.openTaskOverlay = openTaskOverlay;
window.renderContacts = renderContacts;
window.renderSelectedCircles = renderSelectedCircles;