function openTaskOverlay() {
    document.getElementById("task-overlay").classList.remove("d_none");;
    let add_task_entry = document.getElementById("add-task-entry");
    add_task_entry.classList.remove("d_none");
    void add_task_entry.offsetWidth;
    add_task_entry.classList.add("show");
}

// function closeTaskOverlay() {
//     document.getElementById("add-task-entry").classList.remove("show");
//     document.getElementById("task-overlay").classList.add("d_none");
// }

function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");;
    const entry = document.getElementById("add-task-entry");
    entry.classList.remove("show");
    setTimeout(() => {
        entry.classList.add("d_none");
    }, 300);
}