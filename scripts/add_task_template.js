function addTaskTemplate(){
return     `<div>
      <h1>Add Task</h1>
         <div class="close_add_task margin_0" onclick="closeTaskOverlay()"></div>
    </div>
    <div class="add_task_content d_flex_row justify_between">
      <div class="task_entries">
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Title</p>
            <p class="red_star margin_0">*</p>
          </div>
          <div class="margin_0">
            <input type="text" placeholder="Enter a title" id="title-input-overlay" required />
          </div>
        </div>
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Description</p>
          </div>
          <div class="textarea_wrapper margin_0">
            <textarea placeholder="Enter a Description" id="description-input-overlay"></textarea>
            <div class="resize_icon"></div>
          </div>
        </div>
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Due Date</p>
            <p class="red_star margin_0">*</p>
          </div>
          <div class="margin_0">
            <input class="date" id="datepicker" type="date" placeholder="dd/mm/yyyy" required />
          </div>
        </div>
      </div>
      <div class="vector_4 margin_0"></div>
      <div class="task_entries">
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Priority</p>
          </div>
          <div class="priority_button_container d_flex_center_row justify_between">
            <div class="priority_button d_flex_center_row" id="urgent-button" onclick="setPriority('urgent')">
              <p class="margin_0">Urgent</p>
              <img class="" src="./assets/icons/prio_high.svg" alt="" id="prio-urgent-icon" />
              <img class="d_none" src="./assets/icons/prio_high_active.svg" alt="" id="prio-urgent-icon-active" />
            </div>
            <div class="priority_button d_flex_center_row" id="medium-button" onclick="setPriority('medium')">
              <p class="margin_0">Medium</p>
              <img class="" src="./assets/icons/prio_medium.svg" alt="" id="prio-medium-icon" />
              <img class="d_none" src="./assets/icons/prio_medium_active.svg" alt="" id="prio-medium-icon-active" />
            </div>
            <div class="priority_button d_flex_center_row" id="low-button" onclick="setPriority('low')">
              <p class="margin_0">Low</p>
              <img class="" src="./assets/icons/prio_low.svg" alt="" id="prio-low-icon" />
              <img class="d_none" src="./assets/icons/prio_low_active.svg" alt="" id="prio-low-icon-active" />
            </div>
          </div>
        </div>
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Assigned to</p>
          </div>
          <div class="input_assigned_to input_icon_wrapper width_100 d_flex_center margin_0"
            onclick="openAssignedToDropdown()">
            <input class="assigned_to_dropdown" type="text" placeholder="Select contacts to assing"
              id="assigned-to-dropdown" required />
            <div class="input_icon_container d_flex_center">
              <div class="arrow_drop up" id="arrow-drop-down">
                <img src="./assets/icons/arrow_drop_down.svg" alt="drop-down-arrow" />
              </div>
            </div>
          </div>
        </div>
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Category</p>
            <p class="red_star margin_0">*</p>
          </div>
          <div class="input_icon_wrapper width_100 d_flex_center margin_0" onclick="openCategoryDropdown()">
            <div class="select_category_dropdown d_flex_center justify_between">
              <div class="margin_0">Select task category</div>
              <div class="input_icon_container d_flex_center">
                <div class="arrow_drop up margin_0" id="arrow-drop-down">
                  <img src="./assets/icons/arrow_drop_down.svg" alt="drop-down-arrow" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Subtasks</p>
          </div>
          <div class="input_icon_wrapper d_flex_center margin_0">
            <div class="input_icon_container d_flex_center">
              <div class="add_icon"></div>
            </div>
            <input type="text" placeholder="Add new subtasks" id="add-subtasks" required />
          </div>
        </div>
      </div>
    </div>
    <div class="d_flex_center_row justify_between margin_0 align_end add_task_footer">
      <div class="d_flex_center_row margin_0">
        <p class="red_star margin_0">*</p>
        <p class="margin_0">This field is required</p>
      </div>
      <div class="d_flex_center_row justify_between margin_0 add_task_button_container">
        <button class="btn_white margin_0 add_task_button" onclick="closeTaskOverlay()">Cancel <div class="close_cross"></div>
        </button>
        </button>
        <button class="btn_dark margin_0 add_task_button" onclick="createTask()">Create Task <img src="./assets/icons/check.svg" alt="">
        </button>
      </div>
    </div>`
}

function addSubTaskTemplate (subTask, index){
  return `
                        <div class="added_subtask d_flex_center justify_between">
                <li class="margin_0">${subTask}</li>
                <div class="subtask_edit_icons d_flex_center_row margin_0 gap_4 justify_between">
                <div onclick="deleteSubTask(${index})"> <img src="./assets/icons/delete.svg" alt=""></div>
                <div> <img src="./assets/icons/vector_3.svg" alt=""></div>
                <div onclick="editSubTask(${index})"> <img src="./assets/icons/edit.svg" alt=""></div>
                </div>
            </div>`
}