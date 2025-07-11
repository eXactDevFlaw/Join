let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];
let subTaskDetails = {};
let allContacts = [];
let selectedContacts = [];


window.toggleAssignedToDropdown = function (e) {
    e.stopPropagation();
    const list = document.getElementById("add-task-contacts-list");
    const arrow = document.getElementById("arrow-drop-down-assign");
    if (list.classList.contains("d_none")) renderContacts();
    list.classList.toggle("d_none");
    arrow.classList.toggle("up");
};


const assignedInput = document.getElementById("assigned-to-dropdown");
assignedInput.addEventListener("input", () => {

    const list = document.getElementById("add-task-contacts-list");
    if (!list.classList.contains("d_none")) {
        renderContacts();
    }
});

/**
 * Lädt alle Kontakte einmalig ins Array.
 */
async function initContacts() {
    const raw = await getContactsFromDatabase();
    allContacts = Object.entries(raw || {}).map(([id, data]) => ({ id, ...data }));
}


document.addEventListener("DOMContentLoaded", () => {
    initContacts();
    setPriority("medium");
});

/**
 * Öffnet das Overlay und injiziert das Template.
 * Binded hier auch den Assigned‑to‑Dropdown‑Handler.
 */
function openTaskOverlay() {
    const overlay = document.getElementById("task-overlay");
    overlay.classList.remove("d_none");

    const addTaskEntry = document.getElementById("add-task-entry");
    addTaskEntry.innerHTML = addTaskTemplate();
    addTaskEntry.classList.remove("d_none");
    void addTaskEntry.offsetWidth;
    addTaskEntry.classList.add("show");

    initAssignedDropdownListeners();

    function initAssignedDropdownListeners() {
        const wrap = document.querySelector(".input_assigned_to");
        if (wrap) {
            wrap.addEventListener("click", toggleAssignedToDropdown);
        }

        const input = document.getElementById("assigned-to-dropdown");
        if (input) {
            input.addEventListener("input", () => {
                const list = document.getElementById("add-task-contacts-list");
                if (!list.classList.contains("d_none")) {
                    renderContacts();
                }
            });
        }
    }

    addTaskEntry.innerHTML = addTaskTemplate();
    addTaskEntry.classList.remove("d_none");
    void addTaskEntry.offsetWidth;
    entry.classList.add("show");


    const wrap = entry.querySelector(".input_assigned_to");
    const list = entry.querySelector("#add-task-contacts-list");
    const arrow = entry.querySelector("#arrow-drop-down-assign");


    wrap.addEventListener("click", e => {
        e.stopPropagation();
        if (list.classList.contains("d_none")) renderContacts();
        list.classList.toggle("d_none");
        arrow.classList.toggle("up");
    });


    document.addEventListener("click", e => {
        if (!wrap.contains(e.target) && !list.contains(e.target)) {
            list.classList.add("d_none");
            arrow.classList.add("up");
        }
    });
}

/**
 * Schließt das Overlay wieder.
 */
function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");
    const entry = document.getElementById("add-task-entry");
    entry.classList.remove("show");
    setTimeout(() => entry.classList.add("d_none"), 300);
}

function setPriority(level) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(p => {
        const btn = document.getElementById(`${p}-button`);
        if (btn) btn.classList.toggle(`${p}_set`, p === level);
    });
    priorities.forEach(p => {
        const icon = document.getElementById(`prio-${p}-icon`);
        const iconAct = document.getElementById(`prio-${p}-icon-active`);
        if (icon && iconAct) {
            icon.classList.toggle('d_none', p === level);
            iconAct.classList.toggle('d_none', p !== level);
        }
    });
    taskDetails.priority = level;
}

async function createTask() {
    taskDetails.title = document.getElementById('title-input-overlay').value;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = document.getElementById('assigned-to-dropdown').value;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    taskDetails.status = "todo";

    if (taskDetails.title && taskDetails.dueDate && taskDetails.category !== "Select task category") {
        await postToDatabase("tasks", taskDetails);
        locationReload();
    } else {
        validationHandling();
    }
}

function validationHandling() {
    if (!taskDetails.title) {
        document.getElementById('title-input-overlay').classList.add("input_error_border");
        document.getElementById('required-title').classList.remove("d_none");
    }
    if (!taskDetails.dueDate) {
        document.getElementById('datepicker').classList.add("input_error_border");
        document.getElementById('required-date').classList.remove("d_none");
    }
    if (taskDetails.category === "Select task category") {
        document.getElementById("select-task-category").classList.add("input_error_border");
        document.getElementById('required-category').classList.remove("d_none");
    }
}

/**
 * Rendert die Contact‑Liste im Dropdown alphabetisch.
 */
function renderContacts() {
    const container = document.getElementById("add-task-contacts-list");
    container.innerHTML = "";

    const contacts = [...allContacts].sort((a, b) => a.name.localeCompare(b.name))

    const filter = assignedInput.value.trim().toLowerCase();
    const filtered = filter ? contacts.filter(c => c.name.toLowerCase().includes(filter)) : contacts;

    filtered.forEach(contact => {
        const sel = selectedContacts.includes(contact.id);
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
            const idx = selectedContacts.indexOf(contact.id);
            if (idx >= 0) selectedContacts.splice(idx, 1);
            else selectedContacts.push(contact.id);
            renderContacts();
            renderSelectedCircles();
        });

        container.appendChild(row);
    });
}

/**
 * Zeigt unter dem Inputkreischen der ausgewählten Kontakte.
 */
function renderSelectedCircles() {
    const preview = document.getElementById("assigned-contacts-preview");
    preview.innerHTML = "";
    selectedContacts.forEach(id => {
        const c = allContacts.find(x => x.id === id);
        if (!c) return;
        const circle = document.createElement("div");
        circle.className = "assigned_circle";
        circle.textContent = getInitials(c.name);
        circle.style.backgroundColor = stringToColor(c.name);
        preview.appendChild(circle);
    });
}

/** Hilfsfunktionen */
function getInitials(name) {
    return name.split(" ").map(w => w[0].toUpperCase()).join("").slice(0, 2);
}
function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360},70%,50%)`;
}

async function renderAssignableContacts() {
    const container = document.getElementById("assign-contact-list");
    if (!container) return;

    container.innerHTML = "";
    container.classList.remove("d_none");

    const contacts = await fetchContacts();

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
        addSubtaskList.innerHTML += addSubTaskTemplate(subTask, index);
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
    subTasks[index].title = editCheckValue;
    renderSubTasks()
}