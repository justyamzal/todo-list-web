import { renderDashboard } from './dashboard.js';

export const todoForm = document.getElementById('todo-form');
export const taskInput = document.getElementById('task-input');
export const priorityInput = document.getElementById('priority-input');
export const taskEditIdInput = document.getElementById('task-edit-id');
export const dueDateInput = document.getElementById('due-date-input');
export const submitTaskBtn = document.getElementById('submit-task-btn');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');

export let tasks = [];

export function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadTasks() {
    const stored = localStorage.getItem('tasks');
    tasks = stored ? JSON.parse(stored) : [];
}

export function addOrUpdateTask({ text, priority, dueDate, editingId }) {
    if (!text || !dueDate) return alert('Harap isi deskripsi dan tanggal tugas!');

    if (editingId) {
        const idx = tasks.findIndex(t => t.id == editingId);
        if (idx > -1) {
            tasks[idx].text = text;
            tasks[idx].priority = priority;
            tasks[idx].dueDate = dueDate;
        }
    } else {
        tasks.push({
            id: Date.now(),
            text,
            priority,
            dueDate,
            status: 'todo',
            creationTimestamp: Date.now()
        });
    }

    saveTasks();
    renderUI();
    resetForm();
}

export function renderTasks() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', `priority-${task.priority}`);
        if (task.status === 'done') taskItem.classList.add('done');

        taskItem.dataset.id = task.id;
        taskItem.dataset.dueDate = task.dueDate;

        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.status === 'done' ? 'checked' : ''}>
            <div class="task-content">
                <p class="task-title">${task.text}</p>
                <small class="due-date">deadline : ${new Date(task.dueDate)
                    .toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</small>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn"><i class="fa-solid fa-pencil"></i></button>
                <button class="action-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>`;

        if (task.status === 'todo')
            todoList.appendChild(taskItem);
        else
            doneList.appendChild(taskItem);
    });

    checkOverdueTasks();
}

function checkOverdueTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    document.querySelectorAll('.task-item').forEach(taskItem => {
        const dueDate = new Date(taskItem.dataset.dueDate);
        const dueDateElement = taskItem.querySelector('.due-date');

        if (dueDate < today && !taskItem.classList.contains('done')) {
            taskItem.classList.add('overdue');
            if (!dueDateElement.textContent.includes('(overdue)'))
                dueDateElement.textContent += ' (overdue)';
        } else {
            taskItem.classList.remove('overdue');
            dueDateElement.textContent = dueDateElement.textContent.replace('(overdue)', '');
        }
    });
}

export function resetForm() {
    todoForm.reset();
    dueDateInput.valueAsDate = new Date();
    taskEditIdInput.value = '';
    submitTaskBtn.textContent = "Submit";
    taskInput.focus();
}

export function handleTaskEvents(e) {
    const target = e.target;
    const item = target.closest('.task-item');
    if (!item) return;

    const id = Number(item.dataset.id);

    if (target.matches('.task-checkbox')) {
        const task = tasks.find(t => t.id === id);
        if (task) task.status = target.checked ? 'done' : 'todo';
        saveTasks();
        renderUI();
    }

    if (target.closest('.edit-btn')) {
        const taskToEdit = tasks.find(t => t.id === id);
        if (taskToEdit) {
            taskEditIdInput.value = taskToEdit.id;
            taskInput.value = taskToEdit.text;
            priorityInput.value = taskToEdit.priority;
            dueDateInput.value = taskToEdit.dueDate;
            submitTaskBtn.textContent = "Update";
            taskInput.focus();
        }
    }

    if (target.closest('.delete-btn')) {
        item.classList.add('removing');
        setTimeout(() => {
            const idx = tasks.findIndex(t => t.id === id);
            if (idx > -1) tasks.splice(idx, 1);
            saveTasks();
            renderUI();
        }, 400);
    }
}

export function renderUI() {
    renderTasks();
    renderDashboard();
}
