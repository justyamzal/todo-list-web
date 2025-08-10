export function initTaskFilter() {
    const filterDateInput = document.getElementById('filter-date');
    const showAllBtn = document.getElementById('show-all-btn');

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
}
