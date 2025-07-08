function openTaskDetails() {
    document.getElementById("task-overlay").classList.remove("d_none");;
    let add_task_entry = document.getElementById("task_detail_entry");
    add_task_entry.innerHTML = addTaskTemplate();
    add_task_entry.classList.remove("d_none");
    void add_task_entry.offsetWidth;
    add_task_entry.classList.add("show");
}

const taskCards = document.querySelectorAll(".task_card");

taskCards.forEach(element => {
    element.addEventListener("click", function() {
        let content = this.getAttribute("taskname");
        console.log(content, "Geklickt");
        
    })
})

