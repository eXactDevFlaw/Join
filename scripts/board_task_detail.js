let assignedDetailInput = "";

function prepareRenderContacts(){
    let assignedInput = document.getElementById("assigned-to-dropdown");
    assignedDetailInput = assignedInput;
    if(assignedDetailInput){
    assignedDetailInput.addEventListener("input", () => {
    
        const list = document.getElementById("add-task-contacts-list");
        if (!list.classList.contains("d_none")) {
            renderContacts();
        }
    });
}
}

function renderContactsDetailEditView(data){
    const assignedTo = document.getElementById("assigned-contacts-preview");
    if (data.taskAssignedTo){
          data.taskAssignedTo.forEach((contact) => {
        assignedTo.innerHTML += `
        <div class="assigned_contact_edit_view"> 
        <div class="assigned_circle margin_0" id="${contact}"}></div>
        </div>`;
        const profileBadge = document.getElementById(contact);
        profileBadge.style.backgroundColor = stringToColor(contact);
        profileBadge.innerText = getUserCapitalInitials(contact);
    })
    }
}

function toggleAssignedToDropdown (e) {
    prepareRenderContacts();
    e.stopPropagation();
    const list = document.getElementById("add-task-contacts-list");
    const arrow = document.getElementById("arrow-drop-down-assign");
    if (list.classList.contains("d_none")) renderContacts();
    list.classList.toggle("d_none");
    arrow.classList.toggle("up");
};

function renderContacts() {
    const container = document.getElementById("add-task-contacts-list");
    container.innerHTML = "";

    const contacts = [...allContacts].sort((a, b) => a.name.localeCompare(b.name))
    const filter = assignedDetailInput.value.trim().toLowerCase();
    const filtered = filter ? contacts.filter(c => c.name.toLowerCase().includes(filter)) : contacts;

    filtered.forEach(contact => {
        const sel = selectedContacts.includes(contact.name);
        const color = stringToColor(contact.name);
        const initials = getInitials(contact.name);

        const row = document.createElement("div");
        row.className = "assign_contact_row" + (sel ? " contact_list_item_active" : "");
        row.innerHTML = `
        <div class="assign_contact_left">
          <div class="contact_circle" style="background-color:${color}">${initials}</div>
          <span class="assign_contact_name" style="color:${sel ? 'white' : ''}">${contact.name}</span>
        </div>
        <div class="assign_contact_checkbox">
          <img src="./assets/icons/check.svg" class="check_icon" style="display:${sel ? 'block' : 'none'}" />
        </div>
      `;

        row.addEventListener("click", e => {
            e.stopPropagation();
            const idx = selectedContacts.indexOf(contact.name);
            if (idx >= 0) selectedContacts.splice(idx, 1);
            else selectedContacts.push(contact.name);
            pushedContactsName.push(contact.name)
            renderContacts();
            addSelectedCircles();
        });

        container.appendChild(row);
    });
}

function addSelectedCircles(){
        const preview = document.getElementById("assigned-contacts-preview");
    preview.innerHTML = "";
    if (selectedContacts > "")
    selectedContacts.forEach(name => {
        const c = allContacts.find(x => x.name === name);
        if (!c) return;
        const circle = document.createElement("div");
        circle.className = "assigned_circle";
        circle.textContent = getInitials(c.name);
        circle.style.backgroundColor = stringToColor(c.name);
        preview.appendChild(circle);
    });
}