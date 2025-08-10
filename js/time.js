export function updateTime() {
    const timeDisplay = document.querySelector('.time-display');
    if (!timeDisplay) return;

    const now = new Date();

    // Format in English
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Two lines: date on top, time below
    timeDisplay.innerHTML = `
        <div>${dateStr}</div>
        <div>${timeStr}</div>
    `;
}

export function startClock() {
    updateTime();
    setInterval(updateTime, 1000);
}
