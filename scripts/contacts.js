// contacts.js
(function () {
  const DB_PATH = "users";

  let contacts = [];
  let lastSelectedItem = null;
  const listEl = document.getElementById("contacts-list");
  const detailBox = document.getElementById("contact-detail");

  function getInitials(name) {
    return name.split(" ").map((p) => p[0].toUpperCase()).join("");
  }

  function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360}, 70%, 50%)`;
  }

  function groupContacts() {
    const g = {};
    contacts
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((c) => {
        const L = c.name[0].toUpperCase();
        (g[L] ||= []).push(c);
      });
    return g;
  }

  async function fetchContacts() {
    const raw = await getContactsFromDatabase();
    if (!raw) return [];
    return Object.entries(raw).map(([id, data]) => ({ id, ...data }));
  }

  async function createContact(contact) {
    await postToDatabase(DB_PATH, contact);
  }

  async function updateContact(id, data) {
    await updateOnDatabase(`${DB_PATH}/${id}`, data);
  }

  async function deleteContact(id) {
    await deleteFromDatabase(`${DB_PATH}/${id}`);
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
        item.querySelector(".contact_circle").style.backgroundColor = stringToColor(c.name);
        item.addEventListener("click", () => showContactDetails(c, item));
        sec.appendChild(item);
      });
      listEl.appendChild(sec);
    }
  }

  window.showContactDetails = async function (contact, itemEl) {
    if (lastSelectedItem)
      lastSelectedItem.classList.remove("contact_list_item_active");
    itemEl.classList.add("contact_list_item_active");
    lastSelectedItem = itemEl;

    detailBox.classList.remove("d_none");

    document.getElementById("detail-initials").textContent = getInitials(contact.name);
    document.getElementById("detail-initials").style.backgroundColor = stringToColor(contact.name);
    document.getElementById("detail-name").textContent = contact.name;
    const emailEl = document.getElementById("detail-email");
    emailEl.textContent = contact.email;
    emailEl.href = `mailto:${contact.email}`;
    document.getElementById("detail-phone").textContent = contact.phone;

    const editBtn = document.getElementById("btn-edit-detail");
    if (editBtn) {
      editBtn.onclick = async () => {
        await loadFormIntoOverlay("./templates/edit_Contacts.html");
        slideInOverlay();
        document.getElementById("contact-namefield").value = contact.name;
        document.getElementById("contact-emailfield").value = contact.email;
        document.getElementById("contact-phonefield").value = contact.phone;
        const initialsCircle = document.getElementById("edit-contact-initials");
        initialsCircle.textContent = getInitials(contact.name);
        initialsCircle.style.backgroundColor = stringToColor(contact.name);

        document.getElementById("edit-contact-form").onsubmit = async (e) => {
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

        const deleteBtn = document.querySelector(".btn_clear");
        if (deleteBtn) {
          deleteBtn.onclick = async () => {
            if (confirm("Kontakt wirklich löschen?")) {
              await deleteContact(contact.id);
              closeOverlay();
              hideContactDetailsArea();
              await renderContacts();
            }
          };
        }
      };
    }

    const deleteBtn = document.getElementById("btn-delete-detail");
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (confirm("Kontakt wirklich löschen?")) {
          await deleteContact(contact.id);
          detailBox.classList.add("d_none");
          await renderContacts();
        }
      };
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

  window.hideContactDetailsArea = function () {
    detailBox.classList.add("d_none");
    if (lastSelectedItem) {
      lastSelectedItem.classList.remove("contact_list_item_active");
      lastSelectedItem = null;
    }
  };

  window.addEventListener("DOMContentLoaded", renderContacts);
})();
