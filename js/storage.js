    // ----- Load the Task  ----//
    
    export let tasks = [];

    export function saveTasks(){
        localStorage.setItem('todo_tasks',JSON.stringify(tasks));
    }


    export function loadTasks(){
        const saved = localStorage.getItem('todo_tasks');
        tasks = saved ? JSON.parse(saved) : [];
    }

