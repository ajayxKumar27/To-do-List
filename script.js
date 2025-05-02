// JavaScript logic for the To-Do List application with local storage

document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    let editMode = null; // To track the task being edited

    // Load tasks from local storage on page load
    loadTasksFromLocalStorage();

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        if (editMode) {
            // Update the existing task
            editMode.querySelector('.task-text').textContent = taskText;
            updateTaskInLocalStorage(editMode.dataset.id, taskText);
            editMode = null; // Exit edit mode
            addTaskButton.textContent = 'Add Task'; // Reset button text
        } else {
            // Add a new task
            const taskId = Date.now().toString(); // Unique ID for the task
            const listItem = createTaskElement(taskId, taskText);
            taskList.appendChild(listItem);
            saveTaskToLocalStorage(taskId, taskText);
        }

        taskInput.value = ''; // Clear the input field
    }

    function handleTaskActions(event) {
        if (event.target.classList.contains('delete-button')) {
            // Delete the task
            const listItem = event.target.closest('li');
            const taskId = listItem.dataset.id;
            listItem.remove();
            deleteTaskFromLocalStorage(taskId);
        } else if (event.target.classList.contains('edit-button')) {
            // Edit the task
            const listItem = event.target.closest('li');
            const taskText = listItem.querySelector('.task-text').textContent.trim();
            taskInput.value = taskText; // Populate the input field with the task text
            editMode = listItem; // Set the current task in edit mode
            addTaskButton.textContent = 'Update Task'; // Change button text to "Update Task"
        }
    }

    function createTaskElement(taskId, taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.dataset.id = taskId; // Store the task ID in a data attribute
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div>
                <button class="btn btn-warning btn-sm edit-button">Edit</button>
                <button class="btn btn-danger btn-sm delete-button">Delete</button>
            </div>
        `;
        return listItem;
    }

    // Local Storage Functions
    function saveTaskToLocalStorage(taskId, taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ id: taskId, text: taskText });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(taskId, updatedText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = updatedText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function deleteTaskFromLocalStorage(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = createTaskElement(task.id, task.text);
            taskList.appendChild(listItem);
        });
    }
});