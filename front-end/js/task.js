// TASK CREATION / EDITION


// form elements
const taskList = document.getElementById('taskList');
const titleOfTask = document.getElementById('titleOfTask');
const notesOfTask = document.getElementById('notes');
const saveButton = document.getElementById('saveButton');
const notesAreaText = document.getElementById('notesAreaText');

// application state
let selectedTaskId = null;

// save task event
saveButton.addEventListener("click", addTask);


// creates or edits a task
async function addTask() {
    const title = titleOfTask.value.trim();
    const notes = notesOfTask.value.trim();

    if (title === '') {
        console.log('Title is required');
        return;
    }

    const isEditing = selectedTaskId !== null;

    const url = isEditing
        ? `http://localhost:3000/tasks/${selectedTaskId}`
        : 'http://localhost:3000/tasks';

    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, notes })
        });

        if (!response.ok) {
            console.log('Error saving task');
            return;
        }

        // reset
        selectedTaskId = null;
        titleOfTask.value = '';
        notesOfTask.value = '';
        notesAreaText.value = '';

        closeModal();
        loadTasks();

    } catch (error) {
        console.log('Connection error:', error);
    }
}




// TASK LOADING (GET)

async function loadTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');

        if (!response.ok) {
            console.log('Error loading tasks');
            return;
        }

        const tasks = await response.json();
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('task-item');

            // data
            li.dataset.id = task.id;
            li.dataset.notes = task.notes || '';

            // title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = task.title;

            // select task (WITHOUT editing)
            li.addEventListener('click', () => {
                selectTask(li);
            });

            // edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = '🖊';
            editBtn.classList.add('edit-btn');

            editBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                startEditingTask(task);
            });

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑';
            deleteBtn.classList.add('delete-btn');

            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteTask(task.id);
            });

            li.appendChild(titleSpan);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });

    } catch (error) {
        console.log('Connection error:', error);
    }
}




// TASK SELECTION (selection only)

function selectTask(taskElement) {
    selectedTaskId = taskElement.dataset.id;

    notesAreaText.value = taskElement.dataset.notes || '';

    document.querySelectorAll('#taskList li').forEach(li => {
        li.classList.remove('active');
    });

    taskElement.classList.add('active');
}




// TASK EDITING (ICON)

function startEditingTask(task) {
    selectedTaskId = task.id;

    titleOfTask.value = task.title;
    notesOfTask.value = task.notes || '';
    notesAreaText.value = task.notes || '';

    document.querySelectorAll('#taskList li').forEach(li => {
        li.classList.remove('active');
        if (li.dataset.id == task.id) {
            li.classList.add('active');
        }
    });

    openModal();
}




// TASK DELETING

async function deleteTask(id) {
    const confirmDelete = confirm('Do you really want to delete this task?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.log('Error deleting task');
            return;
        }

        selectedTaskId = null;
        notesAreaText.value = '';
        loadTasks();

    } catch (error) {
        console.log('Connection error:', error);
    }
}




// INITIAL LOAD
loadTasks();
