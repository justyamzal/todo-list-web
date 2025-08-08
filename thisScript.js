// script.js versi sudah dirapikan dan dijelaskan untuk pemula

// Tunggu hingga seluruh dokumen HTML dimuat
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ========== Ambil elemen dari HTML ========== //
    const timeDisplay = document.getElementById('time-display');
    const profileHeader = document.getElementById('profile-header');
    const profileNameEl = document.getElementById('profile-name');
    const profileJobEl = document.getElementById('profile-job');
    const dashboardGrid = document.getElementById('dashboard-grid');
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const dueDateInput = document.getElementById('due-date-input');
    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const filterDateInput = document.getElementById('filter-date');
    const showAllBtn = document.getElementById('show-all-btn');
    const taskEditIdInput = document.getElementById('task-edit-id');
    const submitTaskBtn = document.getElementById('submit-task-btn');

    let tasks = []; // array untuk menyimpan semua tugas

    // ========== Simpan ke localStorage ========== //
    function saveTasks() {
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    }

    // ========== Render statistik panel atas (dashboard) ========== //
    function renderDashboard() {
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(task => task.status === 'done').length;
        const percentageDone = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        const highNotDone = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
        const mediumNotDone = tasks.filter(t => t.priority === 'medium' && t.status !== 'done').length;
        const lowNotDone = tasks.filter(t => t.priority === 'low' && t.status !== 'done').length;

        dashboardGrid.innerHTML = `
            <div class="dashboard-card percentage">
                <div class="title">Tugas Selesai</div>
                <div class="value">${percentageDone}%</div>
            </div>
            <div class="dashboard-card high">
                <div class="title"><span class="dot"></span>Prioritas Tinggi</div>
                <div class="value">${highNotDone}</div>
            </div>
            <div class="dashboard-card medium">
                <div class="title"><span class="dot"></span>Prioritas Sedang</div>
                <div class="value">${mediumNotDone}</div>
            </div>
            <div class="dashboard-card low">
                <div class="title"><span class="dot"></span>Prioritas Rendah</div>
                <div class="value">${lowNotDone}</div>
            </div>`;
    }

    // ========== Tampilkan seluruh data tugas ke tampilan (UI) ========== //
    function renderUI() {
        renderTasks();
        renderDashboard();
    }

    // ========== Tampilkan daftar tugas (to-do & done) ========== //
    function renderTasks() {
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
                    <p>${task.text}</p>
                    <small class="due-date">Tenggat: ${new Date(task.dueDate).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                    })}</small>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit-btn" title="Edit Tugas">✏️</button>
                    <button class="action-btn delete-btn" title="Hapus Tugas">🗑️</button>
                </div>`;

            // Masukkan ke dalam list yang sesuai
            if (task.status === 'todo') todoList.appendChild(taskItem);
            else doneList.appendChild(taskItem);
        });

        checkOverdueTasks();
    }

    // ========== Tambah atau Update Tugas (saat form disubmit) ========== //
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        const editingId = taskEditIdInput.value;

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
    });

    function resetForm() {
        todoForm.reset();
        dueDateInput.valueAsDate = new Date();
        taskEditIdInput.value = '';
        submitTaskBtn.textContent = 'Tambah Tugas';
        taskInput.focus();
    }

    // ========== Klik item tugas (edit, hapus, checklist) ========== //
    document.querySelector('.app-container').addEventListener('click', (e) => {
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

        if (target.matches('.edit-btn')) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                taskEditIdInput.value = task.id;
                taskInput.value = task.text;
                priorityInput.value = task.priority;
                dueDateInput.value = task.dueDate;
                submitTaskBtn.textContent = 'Update Tugas';
                taskInput.focus();
            }
        }

        if (target.matches('.delete-btn')) {
            item.classList.add('removing');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderUI();
            }, 400);
        }
    });

    // ========== Hapus semua tugas ========== //
    deleteAllBtn.addEventListener('click', () => {
        if (tasks.length > 0) {
            tasks = [];
            saveTasks();
            renderUI();
        }
    });

    // ========== Inisialisasi Aplikasi ========== //
    function initializeApp() {
        setupProfile();
        const saved = localStorage.getItem('todo_tasks');
        if (saved) tasks = JSON.parse(saved);
        renderUI();
        dueDateInput.valueAsDate = new Date();
        updateTime();
        setInterval(updateTime, 1000);
    }

    initializeApp();

    // ========== PROFILE: Nama dan Jabatan ========== //
    function setupProfile() {
        const name = localStorage.getItem('todo_username');
        const job = localStorage.getItem('todo_userjob');
        profileNameEl.innerHTML = name || 'username <i class="fa-solid fa-pen" style="font-size: 16px;"></i>';
        profileJobEl.textContent = job || 'jobdesk';
    }

    function askForProfileInfo() {
        const newName = prompt('Masukkan nama lengkap:', localStorage.getItem('todo_username') || '');
        if (newName) localStorage.setItem('todo_username', newName);
        const newJob = prompt('Masukkan pekerjaan:', localStorage.getItem('todo_userjob') || '');
        if (newJob) localStorage.setItem('todo_userjob', newJob);
        setupProfile();
    }

    profileHeader.addEventListener('click', askForProfileInfo);

    // ========== Update Waktu ========== //
    function updateTime() {
        const now = new Date();
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        timeDisplay.innerHTML = `${now.toLocaleDateString('id-ID', dateOptions)}<br>${now.toLocaleTimeString('id-ID', timeOptions)}`;
    }

    // ========== Filter berdasarkan tanggal ========== //
    filterDateInput.addEventListener('input', () => {
        const filterValue = filterDateInput.value;
        document.querySelectorAll('.task-item').forEach(task => {
            if (filterValue && task.dataset.dueDate !== filterValue) {
                task.style.display = 'none';
            } else {
                task.style.display = 'flex';
            }
        });
    });

    showAllBtn.addEventListener('click', () => {
        filterDateInput.value = '';
        document.querySelectorAll('.task-item').forEach(task => {
            task.style.display = 'flex';
        });
    });

    // ========== Tandai tugas overdue ========== //
    function checkOverdueTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        document.querySelectorAll('.task-item').forEach(item => {
            const due = new Date(item.dataset.dueDate);
            if (due < today && !item.classList.contains('done')) {
                item.classList.add('overdue');
            } else {
                item.classList.remove('overdue');
            }
        });
    }
});
