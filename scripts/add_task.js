let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];

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
        document.getElementById(`${priority}-button`).classList.toggle(`${priority}_set`, priority === level);
    });

    priorities.forEach(priority => {
        document.getElementById(`prio-${priority}-icon`).classList.remove('d_none');
        document.getElementById(`prio-${priority}-icon-active`).classList.add('d_none');
    });
    document.getElementById(`prio-${level}-icon`).classList.add('d_none');
    document.getElementById(`prio-${level}-icon-active`).classList.remove('d_none');
    taskDetails.priority = level;
    console.log(taskDetails.priority);
}

function createTask() {
    taskDetails.title = document.getElementById('title-input-overlay').value;;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = document.getElementById('assigned-to-dropdown').value;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    console.log(taskDetails);
}


let contactDropdown = document.querySelector(".input_assigned_to");

document.addEventListener("click", function (event) {
  if (!contactDropdown.contains(event.target)) {
    closeAssignedToDropdown();
  }
});

function closeAssignedToDropdown() {
  document.getElementById("contacts-list").classList.add("d_none");
  document.getElementById("arrow-drop-down-assign").classList.add("up");
}

function toggleAssignedToDropdown() {
  document.getElementById("contacts-list").classList.toggle("d_none");
  document.getElementById("arrow-drop-down-assign").classList.toggle("up");
}

let categoryDropdown = document.querySelector(".select_category_dropdown");

document.addEventListener("click", function (event) {
  if (!categoryDropdown.contains(event.target)) {
    closeCategoryDropdown();
  }
});


function closeCategoryDropdown(){
    document.getElementById("category-list").classList.add("d_none");
    document.getElementById("arrow-drop-down-category").classList.add("up");
}

function toggleCategoryDropdown(){
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
if(addSubTaskInput){
    addSubTaskInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addNewSubTask();
      }
    });
}

function clearSubTaskValue(){
    let subTask = document.getElementById("add-subtasks");
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function deleteSubTask(index) {
    subTasks.splice(index, 1);
    renderSubTasks();
}

function editSubTask(index){
   document.getElementById('subtask' + index).classList.add('d_none');
   document.getElementById('edit-subtask' + index).classList.remove('d_none');
    console.log(subTasks[index]);
}

function editCheck(index){
   let editCheck = document.getElementById("edit-value" + index)
    let editCheckValue = editCheck.value;
    subTasks[index] = editCheckValue;
    renderSubTasks()
}
