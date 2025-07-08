function openTaskDetails() {
    // console.log(tasks{taskKey});
    
    document.getElementById("task-overlay").classList.remove("d_none");
    let task_detail_entry = document.getElementById("task-details");
    // task_detail_entry.innerHTML = addTaskTemplate();
    task_detail_entry.classList.remove("d_none");
    void task_detail_entry.offsetWidth;
    task_detail_entry.classList.add("show");
}

