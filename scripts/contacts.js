(function () {
  // === Daten + State ===
  let lastSelectedItem = null; // zuletzt ausgewählter Kontakt
  const contacts = [
    {
      id: 1,
      name: "Anna Müller",
      email: "anna.mueller@example.com",
      phone: "+49 170 1234567",
    },
    {
      id: 2,
      name: "Ben Schneider",
      email: "ben.schneider@example.com",
      phone: "+49 172 9876543",
    },
    {
      id: 3,
      name: "Clara Fischer",
      email: "clara.fischer@example.com",
      phone: "+49 151 7654321",
    },
    {
      id: 4,
      name: "Lars Tieseler",
      email: "lars.tieseler@example.com",
      phone: "+49 160 1234567",
    },
    {
      id: 5,
      name: "Andrea Fischer",
      email: "andrea.f@web.de",
      phone: "+49 170 7654321",
    },
  ];
  const listEl = document.getElementById("contacts_list");
  const detailBox = document.getElementById("contactDetail");

  // === Helfer ===
  function getInitials(name) {
    return name
      .split(" ")
      .map((p) => p[0].toUpperCase())
      .join("");
  }
  function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360},70%,50%)`;
  }
  function groupContacts() {
    const g = {};
    contacts
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((c) => {
        const L = c.name[0].toUpperCase();
        (g[L] || (g[L] = [])).push(c);
      });
    return g;
  }

  // === Liste rendern ===
  function renderContacts() {
    listEl.innerHTML = "";
    const groups = groupContacts();
    for (const L in groups) {
      const sec = document.createElement("div");
      sec.className = "contactSection";
      sec.innerHTML = `<div class="contactInitial">${L}</div>`;
      groups[L].forEach((c) => {
        const item = document.createElement("div");
        item.className = "contactItem";
        item.innerHTML = `
          <div class="contactLeft">
            <div class="contactCircle">${getInitials(c.name)}</div>
            <div class="contactDetails">
              <div class="contactName">${c.name}</div>
              <div class="contactEmail">${c.email}</div>
            </div>
          </div>`;
        // farbigen Kreis setzen
        const circle = item.querySelector(".contactCircle");
        circle.style.backgroundColor = stringToColor(c.name);
        // Klick öffnet Detail-Ansicht
        item.addEventListener("click", () => showContactDetails(c, item));
        sec.appendChild(item);
      });
      listEl.appendChild(sec);
    }
  }

  // === Detail-Ansicht ===
  window.showContactDetails = function (c, itemEl) {
    // Highlight: alte entfernen, neue hinzufügen
    if (lastSelectedItem)
      lastSelectedItem.classList.remove("contactItemActive");
    itemEl.classList.add("contactItemActive");
    lastSelectedItem = itemEl;
    // Detail-Box einblenden
    detailBox.classList.remove("d_none");

    // Felder befüllen
    const initEl = document.getElementById("detailInitials");
    const nameEl = document.getElementById("detailName");
    const emailEl = document.getElementById("detailEmail");
    const phoneEl = document.getElementById("detailPhone");

    initEl.textContent = getInitials(c.name);
    initEl.style.backgroundColor = stringToColor(c.name);
    nameEl.textContent = c.name;
    emailEl.textContent = c.email;
    emailEl.href = `mailto:${c.email}`;
    phoneEl.textContent = c.phone;

    // Aktionen für Edit/Delete
    document.getElementById("btnEditDetail").onclick = async () => {
      await loadFormIntoOverlay("./templates/edit_Contacts.html");
      slideInOverlay();
      // Formular-Felder füllen
      document.getElementById("contact-namefield").value = c.name;
      document.getElementById("contact-emailfield").value = c.email;
      document.getElementById("contact-phonefield").value = c.phone;
    };
    document.getElementById("btnDeleteDetail").onclick = () => {
      if (confirm("Kontakt wirklich löschen?")) {
        const idx = contacts.findIndex((x) => x.id === c.id);
        contacts.splice(idx, 1);
        renderContacts();
        // Detail-Box wieder ausblenden
        overview.classList.remove("d_none");
        detailBox.classList.add("d_none");
      }
    };
  };

  window.hideContactDetailsArea = function () {
    // nur Detail-Box verstecken
    overview.classList.remove("d_none");
    detailBox.classList.add("d_none");
    // Highlight entfernen
    if (lastSelectedItem) {
      lastSelectedItem.classList.remove("contactItemActive");
      lastSelectedItem = null;
    }
  };

  // === Overlay zum Neu-Kontakt ===
  window.openAddContactOverlay = async function () {
    await loadFormIntoOverlay("./templates/new_contact.html");
    slideInOverlay();
  };

  // === Initialisierung ===
  window.addEventListener("DOMContentLoaded", renderContacts);
})();
