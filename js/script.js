
// document.addEventListener('DOMContentLoaded',() =>{
    const profileNameEl = document.getElementById('profile-name');
    const profileJobEl = document.getElementById('profile-job');
    const profileHeader = document.getElementById('profile-header');

    const timeDisplay = document.querySelector('.time-display');

    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const taskEditIdInput = document.getElementById('task-edit-id');
    const dueDateInput = document.getElementById('due-date-input');
    const submitTaskBtn = document.getElementById('submit-task-btn');

    const filterDateInput = document.getElementById('filter-date');
    const showAllBtn = document.getElementById('show-all-btn');

    const dashboardGrid = document.getElementById('dashboard-grid');

    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');

    const deleteAllBtn = document.getElementById('delete-all-btn');


    let tasks = [];

    function saveTasks(){
        localStorage.setItem('todo_tasks',JSON.stringify(tasks));
    }


    //----- Profile Setup ----//
    function setupProfile(){
        const name = localStorage.getItem('todo_name');
        const job = localStorage.getItem('todo_job');
        profileNameEl.innerHTML = name || `username <i class="fa-solid fa-pen" style="font-size: 16px;"></i>`;
        profileJobEl.innerHTML = job || 'jobdesk';
    }   

    function askForProfileInfo(){
        const newName = prompt('Masukkan nama lengkap:',localStorage.getItem('todo_name') || '');
        if (newName) localStorage.setItem('todo_name', newName);
        const newJob = prompt('Masukkan pekerjaan:',localStorage.getItem('todo_job') || '');
        if (newJob) localStorage.setItem('todo_job', newJob);
        setupProfile();
    }
    profileHeader.addEventListener('click', askForProfileInfo);


    //----- Time Display ----//

    function updateTime(){
        const now = new Date();
        const dateOptions = {weekday:'long', day:'numeric', month:'long', year:'numeric'};
        const timeOptions = {hour:'2-digit', minute:'2-digit', second:'2-digit' };
        timeDisplay.innerHTML = `${now.toLocaleDateString('en-GB', dateOptions)}<br>${now.toLocaleTimeString('en-GB', timeOptions)}`;
    }
    updateTime();
    setInterval(updateTime, 1000);


//------- Dashboard ------//
function renderDashboard(){
    const totalTask = tasks.length;
    const doneTask = tasks.filter(task => task.status == 'done').length;
    
    //percentage of done tasks
    const percentageDone = totalTask > 0 ? Math.round((doneTask / totalTask)* 100) : 0;

    //counting percentage
    const highNotDone = tasks.filter(task => task.priority === 'high' && task.status !== 'done').length;
    const mediumNotDone =  tasks.filter(task => task.priority === 'medium' && task.status !== 'done').length;
    const lowNotDone = tasks.filter(task => task.priority === 'low' && task.status !== 'done').length;
    
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
                </div>
    `;

}

//----- App Initialization ----//
    function initializeApp(){
        setupProfile();
        const saved = localStorage.getItem('todo_tasks');
        if(saved) tasks = JSON.parse(saved);
        renderUI();
        dueDateInput.valueAsDate = new Date();
        updateTime();
        setInterval(updateTime, 1000);
    }
    initializeApp();


    //----- Adding Tasks ----//
    todoForm.addEventListener('submit',(event) => {
        event.preventDefault();
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
        saveTasks(); //console.log(tasks);
        renderUI();
        resetForm();
    });

    //----- Filter Tasks by Date
    filterDateInput.addEventListener('input', () =>{
        const filterValue = filterDateInput.value;
        document.querySelectorAll('.task-item').forEach(task => {
            if (filterValue && task.dataset.dueDate !== filterValue) {
                task.style.display = 'none';
            } else {
                task.style.display = 'flex';
            }
        });
    });
    
    showAllBtn.addEventListener('click',() => {
    filterDateInput.value = '';
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = 'flex';
        });
    });

    // ----- Rendering UI ----//
    function renderUI(){
        renderTasks();
        renderDashboard();
    }

    document.querySelector('.app-container').addEventListener('click',(event) =>{
        const target = event.target;
        const item = target.closest('.task-item');
        if(!item) return;

        const id = Number(item.dataset.id);
        
        //----- Checkbox -----//
        if(target.matches('.task-checkbox')){
            const task = tasks.find(t => t.id === id);
            if (task) task.status = target.checked ? 'done' :  'todo';
            saveTasks();
            renderUI();
        }

        //----- Getting task to Edit ----//
        if (target.closest('.edit-btn')) {
            const taskToEdit = tasks.find(t => t.id === id);
            if(taskToEdit) {
                taskEditIdInput.value = taskToEdit.id;
                taskInput.value = taskToEdit.text;
                priorityInput.value = taskToEdit.priority;
                dueDateInput.value = taskToEdit.dueDate;
                submitTaskBtn.textContent = "Update";
                taskInput.focus();
            }
        }

        //----- Deleting Task per Item/ID -----//
        if (target.closest('.delete-btn')){
            item.classList.add('removing');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderUI();
            }, 400);
        }
    });

    
    //------ Rendering Tasks ------//
    function renderTasks(){
        todoList.innerHTML = '';
        doneList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item', `priority-${task.priority}`);
            if(task.status === 'done') taskItem.classList.add('done');


            taskItem.dataset.id = task.id;
            taskItem.dataset.dueDate = task.dueDate;

            taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.status === 'done' ? 'checked' : ''}>
            <div class="task-content">
                    <p class="task-title">${task.text}</p>
                    <small class="due-date">deadline : ${new Date(task.dueDate).toLocaleDateString('id-ID',{ day: '2-digit', month: 'long', year: 'numeric'})}</small>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn" title="Edit Tugas" data-action="edit"><i class="fa-solid fa-pencil"></i></button>
                <button class="action-btn delete-btn" title="Hapus Tugas" data-action="delete"><i class="fa-solid fa-trash"></i></button>
            </div>`;
            if(task.status === 'todo')
                todoList.appendChild(taskItem);
            else 
                doneList.appendChild(taskItem);
        });
        checkOverdueTasks();
    }

    // ----- Overdue Tasks -----//
    function checkOverdueTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

            document.querySelectorAll('.task-item').forEach(taskItem => {
            const dueDate = new Date(taskItem.dataset.dueDate);
            const dueDateElement = taskItem.querySelector('.due-date');

                if (dueDate < today && !taskItem.classList.contains('done')){
                    taskItem.classList.add('overdue');
                    dueDateElement.textContent = `${dueDateElement.textContent} (overdue)`;
                } else {
                    taskItem.classList.remove('overdue');
                    dueDateElement.textContent = dueDateElement.textContent.replace('(overdue)','');
                }
            });
    }

    //----- Clean Form After Submit Task ----//
    function resetForm() {
        todoForm.reset();
        dueDateInput.valueAsDate = new Date();
        taskEditIdInput.value = '';
        submitTaskBtn.textContent = "Submit";
        taskInput.focus();
    }

    //----- Reset Tasks ----//
    deleteAllBtn.addEventListener('click',() =>{
        if (tasks.length > 0) {
            tasks = [];
            saveTasks();
            renderUI();
        }
    });

// });

