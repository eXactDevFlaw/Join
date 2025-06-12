let task = [];
let taskDetails = {};

function openTaskOverlay() {
    document.getElementById("task-overlay").classList.remove("d_none");;
    let add_task_entry = document.getElementById("add-task-entry");
    document.getElementById("add-task-entry").innerHTML = addTaskTemplate();
    add_task_entry.classList.remove("d_none");
    
    void add_task_entry.offsetWidth;
    
    
    // addTaskTemplate();
    add_task_entry.classList.add("show");
    add_task_entry.innerHtml = "";
    console.log(add_task_entry);
    
}

function deleteIt(){
    document.getElementById("add-task-entry").innerHTML = "";
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