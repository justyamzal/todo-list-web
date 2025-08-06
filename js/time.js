const timeDisplay = document.querySelector('.time-display');

let tasks = [];

function saveTask(){
    localStorage.setItem('todo_tasks',JSON.stringify(tasks));
}


function updateTime(){
    const now = new Date();
    const dateOptions = {weekday:'long', day:'numeric', month:'long',year:'numeric'};
    const timeOptions = {hour:'2-digit', minute:'2-digit', second: '2-digit' };
    timeDisplay.innerHTML = `${now.toLocaleDateString('id-ID',dateOptions)}<br>${now.toLocaleTimeString('id-ID',timeOptions)}`;
}

