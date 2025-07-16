let assignedDetailInput = "";

function openTaskOverlay() {
    const overlay = document.getElementById("task-overlay");
    overlay.classList.remove("d_none");
    const addTaskEntry = document.getElementById("add-task-entry");
    addTaskEntry.innerHTML = addTaskTemplate();
    addTaskEntry.classList.remove("d_none");
    void addTaskEntry.offsetWidth;
    addTaskEntry.classList.add("show");
    setPriority("medium");
    prepareDropdownToggle();
}

function prepareDropdownToggle(){
    const contactList = document.getElementById("add-task-entry");
    contactList.addEventListener('click', (e) => {
    if (e.target.id != "add-task-contacts-list") {
        const list = document.getElementById("add-task-contacts-list");
        if (list) { list.classList.add('d_none') }
    }
})

}

function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");
    const entry = document.getElementById("add-task-entry");
    const task_detail_entry = document.getElementById("task-details");
    if (entry){
         entry.classList.remove("show");
    }
   
    task_detail_entry.classList.remove("show");
    setTimeout(() => {
        entry.classList.add("d_none");
        task_detail_entry.classList.add("d_none");
    }, 300);
    const addTaskEntry = document.querySelector(".add_task_entry");
    // addTaskEntry.remove();
    refreshBoard();
    selectedContacts = [];

}

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