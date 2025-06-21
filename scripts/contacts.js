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
      sec.className = "contact-section";
      sec.innerHTML = `<div class="contact-initial">${L}</div>`;
      groups[L].forEach((c) => {
        const item = document.createElement("div");
        item.className = "contact-list-item";
        item.innerHTML = `
          <div class="contact-left">
            <div class="contact-circle">${getInitials(c.name)}</div>
            <div class="contact-details">
              <div class="contact-name">${c.name}</div>
              <div class="contact-email">${c.email}</div>
            </div>
          </div>`;
        const circle = item.querySelector(".contact-circle");
        circle.style.backgroundColor = stringToColor(c.name);
        item.addEventListener("click", () => showContactDetails(c, item));
        sec.appendChild(item);
      });
      listEl.appendChild(sec);
    }
  }

  window.showContactDetails = function (c, itemEl) {
    if (lastSelectedItem)
      lastSelectedItem.classList.remove("contact-list-item-active");
    itemEl.classList.add("contact-list-item-active");
    lastSelectedItem = itemEl;

    detailBox.classList.remove("d-none");

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
      await loadFormIntoOverlay("./templates/edit_contacts.html");
      slideInOverlay();

      document.getElementById("contact-namefield").value = c.name;
      document.getElementById("contact-emailfield").value = c.email;
      document.getElementById("contact-phonefield").value = c.phone;

      document.getElementById("edit-contact-form").onsubmit = async () => {
        const updated = {
          name: document.getElementById("contact-namefield").value,
          email: document.getElementById("contact-emailfield").value,
          phone: document.getElementById("contact-phonefield").value
        };
        await updateContact(c.id, updated);
        closeOverlay();
        await renderContacts();
      };
    };

    document.getElementById("btn-delete-detail").onclick = async () => {
      if (confirm("Kontakt wirklich löschen?")) {
        await deleteContact(c.id);
        await renderContacts();
        detailBox.classList.add("d-none");
      }
    };
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
        phone: document.getElementById("contact-phonefield").value
      };
      await createContact(contact);
      closeOverlay();
      await renderContacts();
    };
  };

  window.addEventListener("DOMContentLoaded", renderContacts);
})();
