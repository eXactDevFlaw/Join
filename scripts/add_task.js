let task = [];
let taskDetails = {};
let users = {};

let category = ["Technical Task", "User Story"];

async function getTestContactsFromDatabase() {
  let users = await loadFromDatabase("testUsers");
  console.log(users)
  return users;
}

async function init(){
    users = await getTestContactsFromDatabase();
   for (let index = 0; index < users.length; index++) {
        console.log(users[index].name);
        
   }
}

function test(){
   
}

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

function openAssignedToDropdown(){

}

function createTask(){
    let title = document.getElementById('title-input-overlay').value;
    let description = document.getElementById('description-input-overlay').value;
    let dueDate = document.getElementById('datepicker').value;
    let assignedTo = document.getElementById('assigned-to-dropdown').value;
    // let category;
    // let subtasks;
    
    taskDetails.title = title;
    taskDetails.description = description;
    taskDetails.dueDate = dueDate;
    taskDetails.assignedTo = assignedTo;
    
    console.log(taskDetails);
    
}