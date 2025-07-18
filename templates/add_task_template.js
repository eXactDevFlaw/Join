/**
 * Returns the HTML string for the add task modal/template.
 * This template includes fields for title, description, due date, priority,
 * assignees, category, and subtasks, as well as the UI for adding/clearing tasks.
 * 
 * @returns {string} HTML markup for the add task modal.
 */
function addTaskTemplate() {
  return `<div class="add_task_container">
    <div class="head">
      <h1>Add Task</h1>
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
            <div class="margin_0 input_error font_12">
              <p class="d_none" id="required-title">this field is required</p>
            </div>
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
            <div class="margin_0 input_error font_12">
              <p class="d_none" id="required-date">this field is required</p>
            </div>
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
              <img src="./assets/icons/prio_urgent.svg" alt="" id="prio-urgent-icon" />
              <img class="d_none" src="./assets/icons/prio_urgent_active.svg" alt="" id="prio-urgent-icon-active" />
            </div>
            <div class="priority_button d_flex_center_row" id="medium-button" onclick="setPriority('medium')">
              <p class="margin_0">Medium</p>
              <img src="./assets/icons/prio_medium.svg" alt="" id="prio-medium-icon" />
              <img class="d_none" src="./assets/icons/prio_medium_active.svg" alt="" id="prio-medium-icon-active" />
            </div>
            <div class="priority_button d_flex_center_row" id="low-button" onclick="setPriority('low')">
              <p class="margin_0">Low</p>
              <img src="./assets/icons/prio_low.svg" alt="" id="prio-low-icon" />
              <img class="d_none" src="./assets/icons/prio_low_active.svg" alt="" id="prio-low-icon-active" />
            </div>
          </div>
        </div>

        <!-- Assigned to -->
        <div class="title_input margin_0">
        <div class="d_flex_center_column align_none gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Assigned to</p>
          </div>
          <div class="input_assigned_to input_icon_wrapper width_100 d_flex_center margin_0" onclick="toggleAssignedToDropdown(event)">
            <input
              id="assigned-to-dropdown"
              class="assigned_to_dropdown"
              type="text"
              placeholder="Select contacts to assign"
              autocomplete="off"
              required
            />
            <div class="input_icon_container z_3 d_flex_center">
              <div id="arrow-drop-down-assign" class="arrow_drop up">
                <img src="./assets/icons/arrow_drop_down.svg" alt="drop-down-arrow" />
              </div>
            </div>
          </div>
          </div>
          <div id="add-task-contacts-list" class="contact_dropdown d_none"></div>
        </div>

        <div id="assigned-contacts-preview" class="d_flex_row gap_8 margin_t8"></div>

        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Category</p>
            <p class="red_star margin_0">*</p>
          </div>
          <div class="input_icon_wrapper width_100 d_flex_center_column margin_0">
            <div class="select_category_dropdown d_flex_center justify_between z_3"
                 id="select-task-category"
                 onclick="toggleCategoryDropdown()">
              <div class="margin_0 task_category" id="selected-category">Select task category</div>
              <div class="input_icon_container d_flex_center">
                <div id="arrow-drop-down-category" class="arrow_drop up">
                  <img src="./assets/icons/arrow_drop_down.svg" alt="drop-down-arrow" />
                </div>
              </div>
            </div>
            <div class="margin_0 input_error font_12 width_100" id="required-category-container">
              <p class="d_none" id="required-category">this field is required</p>
            </div>
            <div id="category-list" class="dropdown d_none">
              <div class="category" id="category1" onclick="setCategory('1')">Technical Task</div>
              <div class="category" id="category2" onclick="setCategory('2')">User Story</div>
            </div>
          </div>
        </div>

        <div class="title_input margin_0 gap_8">
          <div class="d_flex_center_row justify_start margin_0">
            <p class="margin_0">Subtasks</p>
          </div>
          <div class="input_icon_wrapper d_flex_center margin_0">
            <div class="input_icon_container add d_flex_center" onclick="activateSubtask()">
              <div class="add_icon"></div>
            </div>
            <div class="add_or_remove d_flex_center_row gap_4 d_none">
              <div class="input_icon_container position_unset">
                <img src="./assets/icons/subtask_close.svg" alt="subtask_close" onclick="clearSubTaskValue()">
              </div>
              <img src="./assets/icons/vector_3.svg" alt="vector">
              <div class="input_icon_container position_unset">
                <img src="./assets/icons/subtask_check.svg" alt="subtask_check" onclick="addNewSubTask()">
              </div>
            </div>
            <input
              type="text"
              placeholder="Add new subtasks"
              id="add-subtasks"
              required
              onclick="activateSubtask()"
            />
          </div>
          <div class="added_subtask_list margin_0"></div>
        </div>

      </div>
    </div>

    <div class="d_flex_center_row justify_between margin_0 align_end add_task_footer">
      <div class="d_flex_center_row margin_0 required_input">
        <p class="red_star margin_0">*</p>
        <p class="margin_0">This field is required</p>
      </div>
      <div class="d_flex_center_row justify_between margin_0 add_task_button_container">
        <button class="btn_white margin_0 add_task_button" onclick="clearTask()">Clear
          <div class="close_cross"></div>
        </button>
        <button class="btn_dark margin_0 add_task_button" onclick="createTask()">Create Task
          <img src="./assets/icons/check.svg" alt="">
        </button>
      </div>
    </div>
    </div>
  `;
}

/**
 * Returns the HTML string for a single added subtask entry,
 * including edit and delete controls, as well as the inline edit UI.
 * 
 * @param {Object} subTask - The subtask object to render.
 * @param {string} subTask.title - The title of the subtask.
 * @param {number} index - The index of the subtask in the list, used for element IDs and event handlers.
 * @returns {string} HTML markup for the subtask entry.
 */
function addSubTaskTemplate(subTask, index) {
  return `
                 <div class="added_subtask d_flex_center justify_between" id="subtask${index}" ondblclick="editSubTask(${index})">
              <li class="margin_0">${subTask.title}</li>
              <div class="subtask_edit_hover_icons d_flex_center_row margin_0 gap_4 justify_between">
                <div onclick="editSubTask(${index})" class="input_icon_container edit_check_delete d_flex_center"> <img src="./assets/icons/edit.svg" alt=""></div>
                <div> <img src="./assets/icons/vector_3.svg" alt="" class="vector-subtask"></div>
                <div onclick="deleteSubTask(${index})" class="input_icon_container edit_check_delete d_flex_center"> <img src="./assets/icons/delete.svg" alt=""></div>
              </div>
            </div>
            <div class="input_icon_wrapper subtask_edit_input d_flex_center justify_between d_none" id="edit-subtask${index}">
              <input class="edit_input" type="text" value="${subTask.title}" id="edit-value${index}">
               <div class="subtask_edit_icons edit_check_delete_container position_absolute d_flex d_flex_center_row margin_0 gap_4 justify_between">
                <div class="input_icon_container edit_check_delete  d_flex_center" onclick="deleteSubTask(${index})"> <img src="./assets/icons/delete.svg" alt=""></div>
                <div> <img src="./assets/icons/vector_3.svg" alt="" class="vector-subtask"></div>
                <div class="input_icon_container edit_check_delete d_flex_center" onclick="editCheck(${index})"> <img src="./assets/icons/check_dark.svg" alt=""></div>
              </div>
            </div>`
}

/**
 * Returns HTML for a contact assignment row.
 * @param {string} color
 * @param {string} initials
 * @param {boolean} sel - Selected state.
 * @param {string} contactName
 * @returns {string}
 */
function creatContactsHtml(color, initials, sel, contactName) {
    return `
                <div class="assign_contact_left">
                  <div class="contact_circle" style="background-color:${color}">
                    ${initials}
                  </div>
                  <span class="assign_contact_name" style="color:${sel ? 'white' : ''}">
                    ${contactName}
                  </span>
                </div>
                <div class="assign_contact_checkbox">
                  <img src="./assets/icons/check.svg"
                       class="check_icon"
                       style="display:${sel ? 'block' : 'none'}" />
                </div>
            `;
}