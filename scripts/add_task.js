let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];
let subTaskDetails = {};
let allContacts = [];
let selectedContacts = [];

// 2) Hook ins DOMContentLoaded, um alle Kontakte vorzulosen
document.addEventListener("DOMContentLoaded", async () => {
  const raw = await getContactsFromDatabase();
  allContacts = Object.entries(raw || {}).map(([id, data]) => ({ id, ...data }));
  // setze Dropdown-Pfeil-Handler
  document.querySelector(".input_assigned_to")
          .addEventListener("click", toggleAssignedToDropdown);
  // Klick außerhalb schließt
  document.addEventListener("click", closeIfClickedOutside);
});

document.addEventListener("DOMContentLoaded", () => {
    setPriority("medium");
})

function openTaskOverlay() {
    document.getElementById("task-overlay").classList.remove("d_none");;
    let add_task_entry = document.getElementById("add-task-entry");
    add_task_entry.innerHTML = addTaskTemplate();
    add_task_entry.classList.remove("d_none");
    void add_task_entry.offsetWidth;
    add_task_entry.classList.add("show");
}

function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");;
    const entry = document.getElementById("add-task-entry");
    entry.classList.remove("show");
    setTimeout(() => {
        entry.classList.add("d_none");
    }, 300);
}

function setPriority(level) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(priority => {
        if (document.getElementById(`${priority}-button`)) {
            document.getElementById(`${priority}-button`).classList.toggle(`${priority}_set`, priority === level);
        }
    });
    priorities.forEach(priority => {
        if (document.getElementById(`prio-${priority}-icon`)) {
            document.getElementById(`prio-${priority}-icon`).classList.remove('d_none');
            document.getElementById(`prio-${priority}-icon-active`).classList.add('d_none');
        }
    });
    if (document.getElementById(`prio-${level}-icon`)) {
        document.getElementById(`prio-${level}-icon`).classList.add('d_none');
        document.getElementById(`prio-${level}-icon-active`).classList.remove('d_none');
    }
    taskDetails.priority = level;
}

async function createTask() {
    taskDetails.title = document.getElementById('title-input-overlay').value;;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = document.getElementById('assigned-to-dropdown').value;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    taskDetails.status = "todo";
    if (taskDetails.title > "" && taskDetails.dueDate > "" && taskDetails.category != "Select task category") {
        await postToDatabase("tasks", taskDetails);
        locationReload();
    } else {
        validationHandling();
    }

}

function validationHandling() {
    if (taskDetails.title === "") {
        document.getElementById('title-input-overlay').classList.add("input_error_border");
        document.getElementById('required-title').classList.remove("d_none");
    }
    if (taskDetails.dueDate === "") {
        document.getElementById('datepicker').classList.add("input_error_border");
        document.getElementById('required-date').classList.remove("d_none");
    }
    if (taskDetails.category === "Select task category") {
        document.getElementById("select-task-category").classList.add("input_error_border");
        document.getElementById('required-category').classList.remove("d_none");
    }
}

let contactDropdown = document.querySelector(".input_assigned_to");
if (contactDropdown) {
    document.addEventListener("click", function (event) {
        if (!contactDropdown.contains(event.target)) {
            closeAssignedToDropdown();
        }
    });
}

// 3) Öffnen/Schließen
function toggleAssignedToDropdown(e) {
  e.stopPropagation();
  const list  = document.getElementById("add-task-contacts-list");
  const arrow = document.getElementById("arrow-drop-down-assign");
  if (list.classList.contains("d_none")) {
    renderContacts();   // nur beim Öffnen neu rendern
  }
  list.classList.toggle("d_none");
  arrow.classList.toggle("up");
}

function closeIfClickedOutside(e) {
  const list  = document.getElementById("add-task-contacts-list");
  const wrap  = document.querySelector(".input_assigned_to");
  if (!list.contains(e.target) && !wrap.contains(e.target)) {
    list.classList.add("d_none");
    document.getElementById("arrow-drop-down-assign")
            .classList.add("up");
  }
}

// 4) Das Dropdown rendern
async function renderContacts() {
  const container = document.getElementById("add-task-contacts-list");
  container.innerHTML = "";

  // Alphabetisch sortieren
  const contacts = [...allContacts].sort((a,b)=>a.name.localeCompare(b.name));

  // optional: nur die ersten 5 anzeigen, der Rest scrollbar
  // const visible = contacts.slice(0,5);
  const visible = contacts;

  visible.forEach(contact => {
    const color    = stringToColor(contact.name);
    const initials = getInitials(contact.name);
    const isSel    = selectedContacts.includes(contact.id);

    const row = document.createElement("div");
    row.className = "assign_contact_row";
    if (isSel) row.classList.add("contact_list_item_active");

    row.innerHTML = `
      <div class="assign_contact_left">
        <div class="contact_circle" 
             style="background-color:${color}">${initials}</div>
        <span class="assign_contact_name" 
              style="color:${isSel?'white':''}">
          ${contact.name}
        </span>
      </div>
      <div class="assign_contact_checkbox">
        <img src="./assets/icons/check.svg" 
             class="check_icon" 
             style="display:${isSel?'block':'none'}" />
      </div>
    `;

    // Klick toggelt Selektion
    row.addEventListener("click", e => {
      e.stopPropagation();
      const idx = selectedContacts.indexOf(contact.id);
      if (idx>=0) selectedContacts.splice(idx,1);
      else         selectedContacts.push(contact.id);

      // Zeile updaten
      const sel = selectedContacts.includes(contact.id);
      row.classList.toggle("contact_list_item_active", sel);
      row.querySelector(".check_icon")
         .style.display = sel ? "block" : "none";
      row.querySelector(".assign_contact_name")
         .style.color   = sel ? "white" : "";

      // Vorschau aktualisieren
      renderSelectedCircles();
    });

    container.appendChild(row);
  });
}

// 5) Unterhalb die kleinen Kreise für jede Selektion
function renderSelectedCircles() {
  const preview = document.getElementById("assigned-contacts-preview");
  preview.innerHTML = "";

  selectedContacts.forEach(id => {
    const c = allContacts.find(x=>x.id===id);
    if (!c) return;
    const initials = getInitials(c.name);
    const color    = stringToColor(c.name);

    const circle = document.createElement("div");
    circle.className   = "assigned_circle";
    circle.textContent = initials;
    circle.style.backgroundColor = color;
    preview.appendChild(circle);
  });
}

// Hilfsfunktionen (aus Deinem Code)
function getInitials(name) {
  return name.split(" ")
             .map(n=>n[0].toUpperCase())
             .join("")
             .slice(0,2);
}
function stringToColor(str) {
  let hash=0;
  for(let c of str) hash=(hash<<5)-hash+c.charCodeAt(0);
  return `hsl(${hash%360},70%,50%)`;
}


async function renderAssignableContacts() {
    const container = document.getElementById("assign-contact-list");
    if (!container) return;

    container.innerHTML = "";
    container.classList.remove("d_none");

    const contacts = await fetchContacts(); // bereits in contacts.js definiert

    contacts.forEach((c, i) => {
        const div = document.createElement("div");
        div.className = "assign-contact-item";

        div.innerHTML = `
      <div class="assign-left">
        <div class="contact_circle" style="background-color:${stringToColor(c.name)}">
          ${getInitials(c.name)}
        </div>
        <span class="assign-name">${c.name}</span>
      </div>
      <input type="checkbox" id="assign-checkbox-${i}" class="assign-checkbox" />
    `;

        container.appendChild(div);
    });
}

// // Klick auf das Inputfeld oder Dropdown-Pfeil zeigt Liste an
// document.getElementById("assign-input").addEventListener("click", renderAssignableContacts);


let categoryDropdown = document.querySelector(".select_category_dropdown");
if (categoryDropdown) {
    document.addEventListener("click", function (event) {
        if (!categoryDropdown.contains(event.target)) {
            closeCategoryDropdown();
        }
    });
}

function closeCategoryDropdown() {
    document.getElementById("category-list").classList.add("d_none");
    document.getElementById("arrow-drop-down-category").classList.add("up");
}

function toggleCategoryDropdown() {
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
    document.getElementById("required-category").classList.add("d_none");
    document.getElementById("required-category-container").classList.add("d_none");
}

function setCategory(number) {
    let category = document.getElementById("category" + number).innerHTML;
    let selectedCategory = document.getElementById("selected-category");
    selectedCategory.innerHTML = category;
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
}

function activateSubtask() {
    document.querySelector(".add").classList.add("d_none");
    document.getElementById("add-subtasks").focus();
    document.querySelector(".add_or_remove").classList.remove("d_none");
}

let subtaskInput = document.getElementById("add-subtasks");
if (subtaskInput) {
    document.addEventListener("click", function (event) {
        if (!subtaskInput.contains(event.target)) {
            if (subtaskInput.value === "") {
                unActivateSubtask();
            }
        }
    });
}

function unActivateSubtask() {
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function addNewSubTask() {
    let subTask = document.getElementById("add-subtasks");
    let subTaskTitle = subTask.value
    if (subTaskTitle > "") {
        subTaskDetails.status = "open";
        subTaskDetails.title = subTaskTitle;
        subTasks.push(subTaskDetails);
        renderSubTasks();
        subTaskDetails = {};
    }
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function renderSubTasks() {
    let addSubtaskList = document.querySelector(".added_subtask_list");
    addSubtaskList.innerHTML = "";
    subTasks.forEach((subTask, index) => {
        addSubtaskList.innerHTML += addSubTaskTemplate(subTask.title, index);
    })
}

let addSubTaskInput = document.getElementById("add-subtasks");
if (addSubTaskInput) {
    addSubTaskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addNewSubTask();
        }
    });
}

function clearSubTaskValue() {
    let subTask = document.getElementById("add-subtasks");
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function deleteSubTask(index) {
    subTasks.splice(index, 1);
    renderSubTasks();
}

function editSubTask(index) {
    document.getElementById('subtask' + index).classList.add('d_none');
    document.getElementById('edit-subtask' + index).classList.remove('d_none');
}

function editCheck(index) {
    let editCheck = document.getElementById("edit-value" + index)
    let editCheckValue = editCheck.value;
    subTasks[index] = editCheckValue;
    renderSubTasks()
}