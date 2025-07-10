function taskDetailViewTemplate(data) {
    return `    <div class="taskd_detail_header d_flex_center_row justify_between margin_0 width_100">
      <div class="margin_0 category_detail" id="task-category">User Story</div>
      <div class="close_detail_field  close_add_task margin_0" onclick="closeTaskOverlay()"></div>
    </div>
    <div class="margin_0 justify_start align_none d_flex margin_0 width_100">
      <h1 class="task_detail_title ">${data.taskName}</h1>
    </div>
    <div class="task_detail_description width_100">
      ${data.taskDescription}
    </div>
    <div class=" d_flex_center_row width_100 detail_head">
      <p class="task_detail">Due date:</p>
      <div class="width_100 detail_due_date">${data.taskData.dueDate}</div>
    </div>
    <div class="d_flex_center_row width_100 detail_head">
      <p class="task_detail">Priority:</p>
      <div class="d_flex_center_row width_100 margin_0 justify_start" id="priority"><p class="margin_0">${data.taskPriority.charAt(0).toUpperCase()
  + data.taskPriority.slice(1)}</p><img class="margin_0" src="./assets/icons/prio_${data.taskPriority}.svg" alt=""></img></div>
    </div>
    <div class="d_flex_center_column width_100 align_none justify_start gap_8">
      <div class="margin_0">
        <p class="task_detail detail_head">Assigned To:</p>
    </div>
      <div id="assigned-contacts" class="d_flex_column margin_0"></div>
    </div>
    <div class="d_flex_center_column width_100 align_none justify_start gap_8">
        <div class="margin_0">
            <p class="task_detail margin_0 detail_head">Subtasks</p>
        </div>
        <div id="subTasks-detail-view" class=""></div>
    </div>
    <div class="task_detail_view_footer">
    <div class="d_flex gap_8 margin_0 edit" id="deleteTask" taskname="${data.taskKey}"><div class="delete_wrapper"></div><p class="delete_size">Delete</p></div>
    <div class="vector_3"></div>
    <div class="d_flex gap_8 margin_0 edit" id="edit-Task" taskname="${data.taskKey}"><div class="edit_wrapper"></div><p class="edit_size">Edit</p></div>
     `
}

function taskDetailEditTemplate(data) {
      return `    <div class="taskd_detail_header d_flex_center_row justify_between margin_0 width_100">
      <div class="margin_0 category_detail" id="task-category">User Story</div>
      <div class="close_detail_field  close_add_task margin_0" onclick="closeTaskOverlay()"></div>
    </div>
    <div class="margin_0 justify_start align_none d_flex margin_0 width_100">
      <h1 class="task_detail_title ">${data.taskName}</h1>
    </div>
    <div class="task_detail_description width_100">
      ${data.taskDescription}
    </div>
    <div class=" d_flex_center_row width_100 detail_head">
      <p class="task_detail">Due date:</p>
      <div class="width_100 detail_due_date">${data.taskData.dueDate}</div>
    </div>
    <div class="d_flex_center_row width_100 detail_head">
      <p class="task_detail">Priority:</p>
      <div class="d_flex_center_row width_100 margin_0 justify_start" id="priority"><p class="margin_0">${data.taskPriority.charAt(0).toUpperCase()
  + data.taskPriority.slice(1)}</p><img class="margin_0" src="./assets/icons/prio_${data.taskPriority}.svg" alt=""></img></div>
    </div>
    <div class="d_flex_center_column width_100 align_none justify_start gap_8">
      <div class="margin_0">
        <p class="task_detail detail_head">Assigned To:</p>
    </div>
      <div id="assigned-contacts" class="d_flex_column margin_0"></div>
    </div>
    <div class="d_flex_center_column width_100 align_none justify_start gap_8">
        <div class="margin_0">
            <p class="task_detail margin_0 detail_head">Subtasks</p>
        </div>
        <div id="subTasks-detail-view" class=""></div>
    </div>
    <div class="task_detail_view_footer">
    <div class="d_flex gap_8 margin_0 edit" id="deleteTask" taskname="${data.taskKey}"><div class="delete_wrapper"></div><p class="delete_size">Delete</p></div>
    <div class="vector_3"></div>
    <div class="d_flex gap_8 margin_0 edit" id="edit-Task" taskname="${data.taskKey}"><div class="edit_wrapper"></div><p class="edit_size">Edit</p></div>
     `
}