let editIndex = null;

// Dummy-Kontakte (ersetzt später durch lokale Speicherung oder Backend)
const contacts = [
  { id: 1, name: "Anna Müller", email: "anna.mueller@example.com", phone: "+49 170 1234567" },
  { id: 2, name: "Ben Schneider", email: "ben.schneider@example.com", phone: "+49 172 9876543" },
  { id: 3, name: "Clara Fischer", email: "clara.fischer@example.com", phone: "+49 151 7654321" },
  { id: 4, name: "Lars Tieseler", email: "max.mustermann@example.com", phone: "+49 160 1234567" },
  { id: 5, name: "Andrea Fischer", email: "andrea.f@web.de", phone: "+49 170 7654321" },
];

const contactsList  = document.getElementById('contacts-list');
const overlay       = document.getElementById('contact-overlay');
const overlayTitle  = document.getElementById('overlay-title');
const nameInput     = document.getElementById('contact-name');
const emailInput    = document.getElementById('contact-email');
const phoneInput    = document.getElementById('contact-phone');

// erzeugt Initialen aus "Vorname Nachname"
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

// berechnet aus einem String eine HSL-Farbe
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
}

// gruppiert alphabetisch nach erstem Buchstaben
function groupContactsAlphabetically() {
  const grouped = {};
  contacts
    .slice() // kopie zum Sortieren
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(contact => {
      const initial = contact.name.charAt(0).toUpperCase();
      if (!grouped[initial]) grouped[initial] = [];
      grouped[initial].push(contact);
    });
  return grouped;
}

// rendert die komplette Liste
function renderContacts() {
  contactsList.innerHTML = '';
  const groups = groupContactsAlphabetically();

  for (const initial in groups) {
    // Buchstaben-Header
    const section = document.createElement('div');
    section.className = 'contact-section';
    section.innerHTML = `<div class="contact-initial">${initial}</div>`;
    
    // Einträge
    groups[initial].forEach(contact => {
      const idx = contacts.findIndex(c => c.id === contact.id);
      const item = document.createElement('div');
      item.className = 'contact-item join-style';
      item.innerHTML = `
        <div class="contact-left">
          <div class="contact-circle">${getInitials(contact.name)}</div>
          <div class="contact-details">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-email">${contact.email}</div>
          </div>
        </div>
        <div class="contact-actions">
          <img src="./assets/icons/edit.svg" class="icon" alt="Bearbeiten" onclick="editContact(${idx})">
          <img src="./assets/icons/delete.svg" class="icon" alt="Löschen" onclick="deleteContact(${idx})">
        </div>
      `;
      // farbigen Kreis setzen
      const circle = item.querySelector('.contact-circle');
      circle.style.backgroundColor = stringToColor(contact.name);

      section.appendChild(item);
    });

    contactsList.appendChild(section);
  }
}

// bearbeitet einen Kontakt
function editContact(index) {
  const contact = contacts[index];
  editIndex = index;
  overlayTitle.textContent = 'Kontakt bearbeiten';
  nameInput.value  = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
  openOverlay();
}

// löscht einen Kontakt
function deleteContact(index) {
  if (confirm('Kontakt wirklich löschen?')) {
    contacts.splice(index, 1);
    renderContacts();
  }
}

// speichert neuen oder bearbeiteten Kontakt
function saveContact() {
  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !email || !phone) {
    alert('Bitte alle Felder ausfüllen.');
    return;
  }

  if (editIndex !== null) {
    // update
    contacts[editIndex].name  = name;
    contacts[editIndex].email = email;
    contacts[editIndex].phone = phone;
    editIndex = null;
  } else {
    // neu
    contacts.push({ id: Date.now(), name, email, phone });
  }

  renderContacts();
  closeOverlay();
}

// zeigt Overlay
function openOverlay() {
  overlay.classList.remove('dNone');
  if (editIndex === null) {
    overlayTitle.textContent = 'Neuen Kontakt hinzufügen';
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
  }
}

// versteckt Overlay
function closeOverlay() {
  overlay.classList.add('dNone');
  editIndex = null;
}

// öffnet Overlay im "Neu"-Modus
function openAddContactOverlay() {
  editIndex = null;
  openOverlay();
}

// initial render
window.addEventListener('DOMContentLoaded', renderContacts);
