(function () {
  // === Daten + State ===
  let lastSelectedItem = null;
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
  const listEl = document.getElementById("contacts-list");
  const detailBox = document.getElementById("contact-detail");

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
      sec.className = "contact_section";
      sec.innerHTML = `<div class="contact_initial">${L}</div>`;
      groups[L].forEach((c) => {
        const item = document.createElement("div");
        item.className = "contact_list_item";
        item.innerHTML = `
          <div class="contact_left">
            <div class="contact_circle">${getInitials(c.name)}</div>
            <div class="contact_details">
              <div class="contact_name">${c.name}</div>
              <div class="contact_email">${c.email}</div>
            </div>
          </div>`;
        const circle = item.querySelector(".contact_circle");
        circle.style.backgroundColor = stringToColor(c.name);
        item.addEventListener("click", () => showContactDetails(c, item));
        sec.appendChild(item);
      });
      listEl.appendChild(sec);
    }
  }

  // === Detail-Ansicht ===
  window.showContactDetails = function (c, itemEl) {
    if (lastSelectedItem)
      lastSelectedItem.classList.remove("contact_list_item_active");
    itemEl.classList.add("contact_list_item_active");
    lastSelectedItem = itemEl;

    detailBox.classList.remove("d_none");

    const initEl = document.getElementById("detail-initials");
    const nameEl = document.getElementById("detail-name");
    const emailEl = document.getElementById("detail-email");
    const phoneEl = document.getElementById("detail-phone");

    initEl.textContent = getInitials(c.name);
    initEl.style.backgroundColor = stringToColor(c.name);
    nameEl.textContent = c.name;
    emailEl.textContent = c.email;
    emailEl.href = `mailto:${c.email}`;
    phoneEl.textContent = c.phone;

    document.getElementById("btn-edit-detail").onclick = async () => {
      await loadFormIntoOverlay("./templates/edit_Contacts.html");
      slideInOverlay();
      document.getElementById("contact-namefield").value = c.name;
      document.getElementById("contact-emailfield").value = c.email;
      document.getElementById("contact-phonefield").value = c.phone;
    };

    document.getElementById("btn-delete-detail").onclick = () => {
      if (confirm("Kontakt wirklich löschen?")) {
        const idx = contacts.findIndex((x) => x.id === c.id);
        contacts.splice(idx, 1);
        renderContacts();
        overview.classList.remove("d_none");
        detailBox.classList.add("d_none");
      }
    };
  };

  window.hideContactDetailsArea = function () {
    overview.classList.remove("d_none");
    detailBox.classList.add("d_none");
    if (lastSelectedItem) {
      lastSelectedItem.classList.remove("contact_list_item_active");
      lastSelectedItem = null;
    }
  };

  window.openAddContactOverlay = async function () {
    await loadFormIntoOverlay("./templates/new_contact.html");
    slideInOverlay();
  };

  window.addEventListener("DOMContentLoaded", renderContacts);
})();
