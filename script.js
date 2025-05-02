document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-task-button');
    const taskListContainer = document.getElementById('task-list');
    let taskBeingEdited = null;

    initializeApp();

    addButton.addEventListener('click', handleAddOrUpdateTask);
    taskInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            handleAddOrUpdateTask();
        }
    });
    taskListContainer.addEventListener('click', handleTaskButtonClick);

    function initializeApp() {
        const savedTasks = getTasksFromStorage();
        savedTasks.forEach(({ id, text }) => {
            const taskElement = buildTaskElement(id, text);
            taskListContainer.appendChild(taskElement);
        });
    }

    function handleAddOrUpdateTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            alert('Please enter a task.');
            return;
        }

        if (taskBeingEdited) {
            updateTask(taskBeingEdited, taskText);
        } else {
            addNewTask(taskText);
        }

        resetForm();
    }

    function handleTaskButtonClick(event) {
        const target = event.target;
        const listItem = target.closest('li');

        if (!listItem) return;

        const taskId = listItem.dataset.id;

        if (target.classList.contains('edit-button')) {
            taskInput.value = listItem.querySelector('.task-text').textContent;
            taskBeingEdited = listItem;
            addButton.textContent = 'Update Task';
            taskInput.focus();
        }

        if (target.classList.contains('delete-button')) {
            listItem.remove();
            removeTaskFromStorage(taskId);
            if (taskBeingEdited === listItem) {
                resetForm();
            }
        }
    }

    function addNewTask(text) {
        const taskId = Date.now().toString();
        const newTaskElement = buildTaskElement(taskId, text);
        taskListContainer.appendChild(newTaskElement);
        saveTaskToStorage(taskId, text);
    }

    function updateTask(taskElement, newText) {
        const taskId = taskElement.dataset.id;
        taskElement.querySelector('.task-text').textContent = newText;
        updateTaskInStorage(taskId, newText);
        taskBeingEdited = null;
        addButton.textContent = 'Add Task';
    }

    function resetForm() {
        taskInput.value = '';
        taskBeingEdited = null;
        addButton.textContent = 'Add Task';
    }

    function buildTaskElement(id, text) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = id;
        li.innerHTML = `
            <span class="task-text">${text}</span>
            <div class="button-box">
                <button class="btn btn-warning btn-sm edit-button">Edit</button>
                <button class="btn btn-danger btn-sm delete-button">Delete</button>
            </div>
        `;
        return li;
    }

    function getTasksFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('tasks')) || [];
        } catch {
            return [];
        }
    }

    function saveTaskToStorage(id, text) {
        const tasks = getTasksFromStorage();
        tasks.push({ id, text });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInStorage(id, newText) {
        const tasks = getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromStorage(id) {
        const tasks = getTasksFromStorage();
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
