const timer = document.getElementById('timer');
const task = document.getElementById('task');
const startBtn = document.getElementById('startBtn');
const breakBtn = document.getElementById('breakBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');
const currentSession = document.getElementById('currentSession');
const workDuration = document.getElementById('workDuration');
const breakTime = document.getElementById('breakTime');

let interval;
let startTime;
let elapsedSeconds = 0;
let isBreak = false;
let lastWorkDuration = 0;

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function updateTimer() {
    const now = Date.now();
    elapsedSeconds = Math.floor((now - startTime) / 1000);
    timer.textContent = formatTime(elapsedSeconds);
}

function startWork() {
    if (!task.value.trim()) {
        task.focus();
        return;
    }
    
    startTime = Date.now();
    isBreak = false;
    
    interval = setInterval(updateTimer, 1000);
    startBtn.disabled = true;
    breakBtn.disabled = false;
    stopBtn.disabled = false;
    
    status.textContent = `Working: ${task.value}`;
    currentSession.textContent = 'Work';
}

function startBreak() {
    // Save work duration
    lastWorkDuration = elapsedSeconds;
    workDuration.textContent = formatTime(lastWorkDuration);
    
    // Calculate recommended break
    const recommendedBreak = Math.ceil(lastWorkDuration / 5);
    breakTime.textContent = formatTime(recommendedBreak);
    
    // Reset timer for break
    clearInterval(interval);
    startTime = Date.now();
    elapsedSeconds = 0;
    isBreak = true;
    
    // Start break timer
    interval = setInterval(updateTimer, 1000);
    startBtn.disabled = false;
    breakBtn.disabled = true;
    
    status.textContent = 'Taking a break';
    currentSession.textContent = 'Break';
}

function stopTimer() {
    clearInterval(interval);
    
    if (!isBreak) {
        lastWorkDuration = elapsedSeconds;
        workDuration.textContent = formatTime(lastWorkDuration);
    }
    
    timer.textContent = '00:00:00';
    elapsedSeconds = 0;
    
    startBtn.disabled = false;
    breakBtn.disabled = true;
    stopBtn.disabled = true;
    
    status.textContent = 'Ready to start';
    currentSession.textContent = '-';
}

startBtn.addEventListener('click', startWork);
breakBtn.addEventListener('click', startBreak);
stopBtn.addEventListener('click', stopTimer);

task.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !startBtn.disabled) {
        startWork();
    }
});