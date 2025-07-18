/**
 * Activates the subtask input and shows add/remove controls.
 */
function activateSubtask() {
    document.querySelector(".add").classList.add("d_none");
    document.getElementById("add-subtasks").focus();
    document.querySelector(".add_or_remove").classList.remove("d_none");
}

/**
 * Deactivates the subtask input, hides add/remove controls.
 */
function unActivateSubtask() {
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

/**
 * Adds a new subtask from the input field, updates the subtask list.
 */
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

/**
 * Renders all current subtasks in the UI.
 */
function renderSubTasks() {
    let addSubtaskList = document.querySelector(".added_subtask_list");
    addSubtaskList.innerHTML = "";
    if (subTasks > "") {
        subTasks.forEach((subTask, index) => {
            addSubtaskList.innerHTML += addSubTaskTemplate(subTask, index);
        })
    }
}

/**
 * Clears the subtask input and resets subtask controls.
 */
function clearSubTaskValue() {
    let subTask = document.getElementById("add-subtasks");
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

/**
 * Deletes a subtask by index and updates the subtask list.
 * @param {number} index
 */
function deleteSubTask(index) {
    subTasks.splice(index, 1);
    renderSubTasks();
}

/**
 * Switches a subtask into edit mode (shows input for editing).
 * @param {number} index
 */
function editSubTask(index) {
    document.getElementById('subtask' + index).classList.add('d_none');
    document.getElementById('edit-subtask' + index).classList.remove('d_none');
}

/**
 * Commits an edit to a subtask, updates task details in DB if editing an existing task.
 * @param {number} index
 * @returns {Promise<void>}
 */
async function editCheck(index) {
    let editCheck = document.getElementById("edit-value" + index)
    let editCheckValue = editCheck.value;
    subTasks[index].title = editCheckValue;
    renderSubTasks()

    if (taskDetails.taskKey) {
        taskDetails.subtasks = subTasks;
        await updateOnDatabase("tasks/" + taskDetails.taskKey, taskDetails);
    }
}