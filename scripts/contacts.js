(function () {
  let contacts = [];
  let lastSelectedItem = null;
  const listEl = document.getElementById("contacts-list");
  const detailBox = document.getElementById("contact-detail");

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

  async function renderContacts() {
    contacts = await fetchContacts();
    listEl.innerHTML = "";
    const groups = groupContacts();
    for (const L in groups) {
      const sec = document.createElement("div");
      sec.className = "contact_section";
      sec.innerHTML = `<div class="contact_initial">${L}</div>`;
      groups[L].forEach((c) => {
        const item = document.createElement("div");
        item.className = "contact-list-item";
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

  window.showContactDetails = async function (contact, itemEl) {
    // Auswahl visuell markieren
    if (lastSelectedItem)
      lastSelectedItem.classList.remove("contact_list_item_active");
    itemEl.classList.add("contact_list_item_active");
    lastSelectedItem = itemEl;

    // Kontakt-Detailbereich einblenden
    detailBox.classList.remove("d_none");

    // Kontakt-Daten befüllen
    const initialsEl = document.getElementById("detail-initials");
    const nameEl = document.getElementById("detail-name");
    const emailEl = document.getElementById("detail-email");
    const phoneEl = document.getElementById("detail-phone");

    initialsEl.textContent = getInitials(contact.name);
    initialsEl.style.backgroundColor = stringToColor(contact.name);
    nameEl.textContent = contact.name;
    emailEl.textContent = contact.email;
    emailEl.href = `mailto:${contact.email}`;
    phoneEl.textContent = contact.phone;

    // 🖊 Editieren des Kontakts
    const editBtn = document.getElementById("btn-edit-detail");
    if (editBtn) {
      editBtn.onclick = async () => {
        console.log("Edit-Button wurde geklickt");
        await loadFormIntoOverlay("./templates/edit_Contacts.html"); // Großes C!
        slideInOverlay();

        // Felder vorausfüllen
        document.getElementById("contact-namefield").value = contact.name;
        document.getElementById("contact-emailfield").value = contact.email;
        document.getElementById("contact-phonefield").value = contact.phone;

        // Initialen-Kreis im Overlay setzen
        const initialsCircle = document.getElementById("edit-contact-initials");
        initialsCircle.textContent = getInitials(contact.name);
        initialsCircle.style.backgroundColor = stringToColor(contact.name);

        // Speichern bei Submit
        const form = document.getElementById("edit-contact-form");
        form.onsubmit = async (e) => {
          e.preventDefault();
          const updated = {
            name: document.getElementById("contact-namefield").value,
            email: document.getElementById("contact-emailfield").value,
            phone: document.getElementById("contact-phonefield").value,
          };
          await updateContact(contact.id, updated);
          closeOverlay();
          await renderContacts();
        };

        // 🗑 Löschen im Overlay
        const deleteBtn = form.querySelector(".btn_clear");
        if (deleteBtn) {
          deleteBtn.onclick = async () => {
            if (confirm("Kontakt wirklich löschen?")) {
              await dbDeleteContact(contact.id);
              closeOverlay();
              hideContactDetailsArea();
              await renderContacts();
            }
          };
        }
      };
    }

    // 🗑 Löschen aus der Detailansicht (nicht Overlay)
    const deleteBtn = document.getElementById("btn-delete-detail");
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (confirm("Kontakt wirklich löschen?")) {
          await dbDeleteContact(contact.id);
          detailBox.classList.add("d_none");
          await renderContacts();
        }
      };
    }
  };

  window.hideContactDetailsArea = function () {
    detailBox.classList.add("d-none");
    if (lastSelectedItem) {
      lastSelectedItem.classList.remove("contact-list-item-active");
      lastSelectedItem = null;
    }
  };

  window.openAddContactOverlay = async function () {
    await loadFormIntoOverlay("./templates/new_contact.html");
    slideInOverlay();
    document.getElementById("addnew-contact-form").onsubmit = async () => {
      const contact = {
        name: document.getElementById("contact-namefield").value,
        email: document.getElementById("contact-emailfield").value,
        phone: document.getElementById("contact-phonefield").value,
      };
      await createContact(contact);
      closeOverlay();
      await renderContacts();
    };
  };

  window.addEventListener("DOMContentLoaded", renderContacts);
})();
