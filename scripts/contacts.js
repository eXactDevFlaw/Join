;(function() {
  let editIndex = null;
  const contacts = [
    { id: 1, name: "Anna Müller",   email: "anna.mueller@example.com",    phone: "+49 170 1234567" },
    { id: 2, name: "Ben Schneider", email: "ben.schneider@example.com",  phone: "+49 172 9876543" },
    { id: 3, name: "Clara Fischer", email: "clara.fischer@example.com",  phone: "+49 151 7654321" },
    { id: 4, name: "Lars Tieseler", email: "lars.tieseler@example.com",   phone: "+49 160 1234567" },
    { id: 5, name: "Andrea Fischer",email: "andrea.f@web.de",             phone: "+49 170 7654321" }
  ];
  const listEl = document.getElementById('contacts-list');

  function getInitials(name) {
    return name.split(' ').map(p=>p[0].toUpperCase()).join('');
  }
  function stringToColor(str) {
    let h=0; for(const c of str) h=(h<<5)-h+c.charCodeAt(0);
    return `hsl(${h%360},70%,50%)`;
  }
  function groupContacts() {
    const g = {};
    contacts.slice().sort((a,b)=>a.name.localeCompare(b.name))
      .forEach(c=>{
        const L=c.name[0].toUpperCase();
        (g[L]||(g[L]=[])).push(c);
      });
    return g;
  }
  function renderContacts() {
    listEl.innerHTML = '';
    const groups = groupContacts();
    for(const L in groups) {
      const sec = document.createElement('div');
      sec.className = 'contact-section';
      sec.innerHTML = `<div class="contact-initial">${L}</div>`;
      groups[L].forEach(c=>{
        const idx = contacts.findIndex(x=>x.id===c.id);
        const item = document.createElement('div');
        item.className = 'contact-item join-style';
        item.innerHTML = `
          <div class="contact-left">
            <div class="contact-circle">${getInitials(c.name)}</div>
            <div class="contact-details">
              <div class="contact-name">${c.name}</div>
              <div class="contact-email">${c.email}</div>
            </div>
          </div>
          <div class="contact-actions">
            <img src="./assets/icons/edit.svg"   class="icon" alt="Bearbeiten" onclick="openEditContactOverlay(${idx})">
          </div>`;
        item.querySelector('.contact-circle').style.backgroundColor = stringToColor(c.name);
        item.addEventListener('click', ()=>showContactDetails(c));
        sec.appendChild(item);
      });
      listEl.appendChild(sec);
    }
  }

  // Detail-Ansicht
  window.showContactDetails = c => {
    const area = document.getElementById('contact-details-area');
    area.classList.remove('d-none');
    document.getElementById('singleview-initials').textContent = getInitials(c.name);
    document.getElementById('singleview-email').textContent    = c.email;
    document.getElementById('singleview-phone').textContent    = c.phone;
    document.getElementById('singleview-name').textContent     = c.name;
  };
  window.hideContactDetailsArea = ()=> {
    document.getElementById('contact-details-area').classList.add('d-none');
  };

  // Add-Dialog
  window.openAddContactOverlay = async () => {
    editIndex = null;
    await loadFormIntoOverlay('templates/edit_Contacts.html');
    slideInOverlay();
  };

  // Edit-Dialog
  window.openEditContactOverlay = async idx => {
    editIndex = idx;
    await loadFormIntoOverlay('templates/edit_Contacts.html');
    // fülle Formular-Felder:
    document.getElementById('edit-contact-initials').textContent = getInitials(contacts[idx].name);
    document.getElementById('contact-namefield').value    = contacts[idx].name;
    document.getElementById('contact-emailfield').value   = contacts[idx].email;
    document.getElementById('contact-phonefield').value   = contacts[idx].phone;
    slideInOverlay();
  };

  // Initial Render
  window.addEventListener('DOMContentLoaded', renderContacts);
})();
