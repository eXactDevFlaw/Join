let editIndex = null;

// Dummy-Kontakte (ersetze später durch lokale Speicherung oder Backend)
const contacts = [
  { id: 1, name: "Anna Müller", email: "anna.mueller@example.com", phone: "+49 170 1234567" },
  { id: 2, name: "Ben Schneider", email: "ben.schneider@example.com", phone: "+49 172 9876543" },
  { id: 3, name: "Clara Fischer", email: "clara.fischer@example.com", phone: "+49 151 7654321" }
];

const contactsList = document.getElementById('contacts-list');
const overlay = document.getElementById('contact-overlay');
const overlayTitle = document.getElementById('overlay-title');
const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');
const phoneInput = document.getElementById('contact-phone');

function getInitials(name) {
  return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
}

function groupContactsAlphabetically() {
  const grouped = {};
  contacts.sort((a, b) => a.name.localeCompare(b.name)).forEach(contact => {
    const initial = contact.name.charAt(0).toUpperCase();
    if (!grouped[initial]) grouped[initial] = [];
    grouped[initial].push(contact);
  });
  return grouped;
}

function renderContacts() {
  contactsList.innerHTML = "";
  const groupedContacts = groupContactsAlphabetically();

  for (const initial in groupedContacts) {
    const section = document.createElement("div");
    section.className = "contact-section";
    section.innerHTML = `<div class="contact-initial">${initial}</div>`;

    groupedContacts[initial].forEach((contact, index) => {
      const contactItem = document.createElement("div");
      contactItem.className = "contact-item join-style";
      contactItem.innerHTML = `
        <div class="contact-left">
          <div class="contact-circle">${getInitials(contact.name)}</div>
          <div class="contact-details">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-email">${contact.email}</div>
          </div>
        </div>
        <div class="contact-actions">
          <img src="./assets/edit_icon.svg" alt="Bearbeiten" onclick="editContact(${contacts.indexOf(contact)})" class="icon">
        </div>
      `;
      section.appendChild(contactItem);
    });

    contactsList.appendChild(section);
  }
}

function editContact(index) {
  const contact = contacts[index];
  editIndex = index;
  nameInput.value = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
  overlayTitle.textContent = "Kontakt bearbeiten";
  openOverlay();
}

function saveContact() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !email || !phone) {
    alert("Bitte alle Felder ausfüllen.");
    return;
  }

  const newContact = { id: Date.now(), name, email, phone };

  if (editIndex !== null) {
    contacts[editIndex].name = name;
    contacts[editIndex].email = email;
    contacts[editIndex].phone = phone;
    editIndex = null;
  } else {
    contacts.push(newContact);
  }

  renderContacts();
  closeOverlay();
}

function openOverlay() {
  overlay.classList.remove("dNone");
  if (editIndex === null) {
    overlayTitle.textContent = "Neuen Kontakt hinzufügen";
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
  }
}

function closeOverlay() {
  overlay.classList.add("dNone");
  editIndex = null;
}

function openAddContactOverlay() {
  editIndex = null;
  overlayTitle.textContent = "Neuen Kontakt hinzufügen";
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  openOverlay();
}

window.addEventListener("DOMContentLoaded", () => {
  renderContacts();
});
