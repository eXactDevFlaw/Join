let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];

// async function init() {



//     users = await getContactsFromDatabase();
//     console.log(users)

//     Object.entries(users).forEach(daten => {
//         console.log(daten)

//     });

//     Object.keys(users).forEach(daten => {
//         console.log(daten)

//     });

//     Object.values(users).forEach(daten => {
//         console.log(daten)

//     });

//     for (let index = 0; index < users.length; index++) {
//         console.log(users[index].name);

//     }


//     for (const keys of Object.entries(users)) {
//         console.log(keys)

//         for (const values of keys) {
//             console.log(values.name)
//         }

//     }
// }

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

// flatpickr("#datepicker", {
//     dateFormat: "d/m/Y", // -> dd/mm/yyyy
//   });

function setPriority(level) {
    const priorities = ['urgent', 'medium', 'low'];

    priorities.forEach(priority => {
        document.getElementById(`${priority}-button`).classList.toggle(`${priority}_set`, priority === level);
    });

    priorities.forEach(priority => {
        document.getElementById(`prio-${priority}-icon`).classList.remove('d_none');
        document.getElementById(`prio-${priority}-icon-active`).classList.add('d_none');
    });
    document.getElementById(`prio-${level}-icon`).classList.add('d_none');
    document.getElementById(`prio-${level}-icon-active`).classList.remove('d_none');

    taskDetails.priority = level;
    // if (level === 'low') {
    //     taskDetails.name = 'Anton';
    //     task.push(taskDetails);
    //     console.log(task);
    // }
    console.log(taskDetails);
}

function createTask() {
    let title = document.getElementById('title-input-overlay').value;
    let description = document.getElementById('description-input-overlay').value;
    let dueDate = document.getElementById('datepicker').value;
    let assignedTo = document.getElementById('assigned-to-dropdown').value;
    let selectedCategory = document.getElementById("selected-category");
    let category = selectedCategory.innerHTML
    // let subtasks;

    taskDetails.title = title;
    taskDetails.description = description;
    taskDetails.dueDate = dueDate;
    taskDetails.assignedTo = assignedTo;
    taskDetails.category = category;

    console.log(taskDetails);

}

function openAssignedToDropdown() {
  document.getElementById("contacts-list").classList.toggle("d_none");
  document.getElementById("arrow-drop-down-assign").classList.toggle("up");
//   renderContacts();
}

function openCategoryDropdown(){
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
}

function setCategory(number){
   let category = document.getElementById("category" + number).innerHTML;
   let selectedCategory = document.getElementById("selected-category");
   selectedCategory.innerHTML = category;
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
   console.log(selectedCategory);
}

function activateSubtask(){
    document.querySelector(".add").classList.add("d_none");
    document.getElementById("add-subtasks").focus();
    document.querySelector(".add_or_remove").classList.remove("d_none");
}

function addNewSubTask(){
    let subTask = document.getElementById("add-subtasks");
    if (subTask.value > "") {
        subTasks.push(subTask.value);
        renderSubTasks();
    }
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
    console.log(subTasks);
}

function renderSubTasks(){
    let addSubtaskList = document.querySelector(".added_subtask_list");
    addSubtaskList.innerHTML = "";
    subTasks.forEach((subTask, index) => {
        addSubtaskList.innerHTML += addSubTaskTemplate(subTask, index);
    })
}

let addSubTaskInput = document.getElementById("add-subtasks");
addSubTaskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addNewSubTask();
  }
});

function clearSubTaskValue(){
    let subTask = document.getElementById("add-subtasks");
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function deleteSubTask(index) {
    subTasks.splice(index, 1);
    renderSubTasks();
    console.log(subTasks);
    
}

function editSubTask(index){
    console.log("edit" + index);
    
}