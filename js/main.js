import { setupProfile, askForProfileInfo } from './profile.js';
import { startClock } from './time.js';
import { loadTasks, addOrUpdateTask, handleTaskEvents, todoForm, taskInput, priorityInput, taskEditIdInput, dueDateInput, renderUI } from './tasks.js';
import { initTaskFilter } from './filter.js';

function initializeApp() {
    setupProfile();
    loadTasks();
    renderUI();
    dueDateInput.valueAsDate = new Date();
    startClock();
    initTaskFilter();
}

todoForm.addEventListener('submit', e => {
    e.preventDefault();
    addOrUpdateTask({
        text: taskInput.value.trim(),
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        editingId: taskEditIdInput.value
    });
});

document.querySelector('.app-container').addEventListener('click', handleTaskEvents);
document.getElementById('profile-header').addEventListener('click', askForProfileInfo);

document.addEventListener('DOMContentLoaded', initializeApp);
