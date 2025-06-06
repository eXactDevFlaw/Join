let task = [];
let taskDetails = {};

function openTaskOverlay() {
    document.getElementById("task-overlay").classList.remove("d_none");;
    let add_task_entry = document.getElementById("add-task-entry");
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

// function setUrgent(){
//     document.getElementById("urgent-button").classList.add("urgent_set");
//     document.getElementById("medium-button").classList.remove("medium_set");
//     document.getElementById("low-button").classList.remove("low_set");
//     document.getElementById("prio-high-icon").classList.add("d_none");
//     document.getElementById("prio-high-icon-active").classList.remove("d_none");
//     document.getElementById("prio-medium-icon").classList.remove("d_none");
//     document.getElementById("prio-medium-icon-active").classList.add("d_none");
//     document.getElementById("prio-low-icon").classList.remove("d_none");
//     document.getElementById("prio-low-icon-active").classList.add("d_none");
//     taskDetails.priority = "urgent";
//     console.log(taskDetails);
// }

// function setMedium(){
//     document.getElementById("medium-button").classList.add("medium_set");
//     document.getElementById("urgent-button").classList.remove("urgent_set");
//     document.getElementById("low-button").classList.remove("low_set");
//     document.getElementById("prio-high-icon").classList.remove("d_none");
//     document.getElementById("prio-high-icon-active").classList.add("d_none");
//     document.getElementById("prio-medium-icon").classList.add("d_none");
//     document.getElementById("prio-medium-icon-active").classList.remove("d_none");
//     document.getElementById("prio-low-icon").classList.remove("d_none");
//     document.getElementById("prio-low-icon-active").classList.add("d_none");
//     taskDetails.priority = "medium";
//     console.log(taskDetails);
// }

// function setLow(){
//     document.getElementById("low-button").classList.add("low_set");
//     document.getElementById("medium-button").classList.remove("medium_set");
//     document.getElementById("urgent-button").classList.remove("urgent_set");
//     document.getElementById("prio-high-icon").classList.remove("d_none");
//     document.getElementById("prio-high-icon-active").classList.add("d_none");
//     document.getElementById("prio-medium-icon").classList.remove("d_none");
//     document.getElementById("prio-medium-icon-active").classList.add("d_none");
//     document.getElementById("prio-low-icon").classList.add("d_none");
//     document.getElementById("prio-low-icon-active").classList.remove("d_none");
//     taskDetails.priority = "low";
//     taskDetails.name = "Anton"
//     console.log(taskDetails);
//     task.push(taskDetails);
//     console.log(task);
    
// }


function setPriority(level) {
    const priorities = ['urgent', 'medium', 'low'];

    // Buttons aktualisieren
    priorities.forEach(priority => {
        document.getElementById(`${priority}-button`).classList.toggle(`${priority}_set`, priority === level);
    });

    // Icons aktualisieren
    priorities.forEach(priority => {
        document.getElementById(`prio-${priority}-icon`).classList.remove('d_none');
        document.getElementById(`prio-${priority}-icon-active`).classList.add('d_none');
    });

    document.getElementById(`prio-${level}-icon`).classList.add('d_none');
    document.getElementById(`prio-${level}-icon-active`).classList.remove('d_none');

    // Task aktualisieren
    taskDetails.priority = level;

    if (level === 'low') {
        taskDetails.name = 'Anton';
        task.push(taskDetails);
        console.log(task);
    }

    console.log(taskDetails);
}