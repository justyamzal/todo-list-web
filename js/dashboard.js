import { tasks } from './tasks.js';

export function renderDashboard() {
    const dashboardGrid = document.getElementById('dashboard-grid');
    const totalTask = tasks.length;
    const doneTask = tasks.filter(task => task.status === 'done').length;
    const percentageDone = totalTask > 0 ? Math.round((doneTask / totalTask) * 100) : 0;

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
        </div>
    `;
}
