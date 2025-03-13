class FlowtimeTimer {
    constructor() {
        this.elements = this.getElements();
        this.state = this.getInitialState();
        this.initializeEventListeners();
    }

    getElements() {
        return {
            timer: document.getElementById('timer'),
            task: document.getElementById('task'),
            taskForm: document.getElementById('taskForm'),
            startBtn: document.getElementById('startBtn'),
            breakBtn: document.getElementById('breakBtn'),
            stopBtn: document.getElementById('stopBtn'),
            status: document.getElementById('status'),
            currentSession: document.getElementById('currentSession'),
            workDuration: document.getElementById('workDuration'),
            breakTime: document.getElementById('breakTime')
        };
    }

    getInitialState() {
        return {
            interval: null,
            startTime: null,
            elapsedSeconds: 0,
            isBreak: false,
            lastWorkDuration: 0,
            recommendedBreak: 0
        };
    }

    initializeEventListeners() {
        this.elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startWork();
        });
        this.elements.breakBtn.addEventListener('click', () => this.startBreak());
        this.elements.stopBtn.addEventListener('click', () => this.stopTimer());

        window.addEventListener('beforeunload', (e) => {
            if (this.state.interval) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    updateTimer() {
        const now = Date.now();
        this.state.elapsedSeconds = Math.floor((now - this.state.startTime) / 1000);
        this.elements.timer.textContent = this.formatTime(this.state.elapsedSeconds);
        
        if (!this.state.isBreak) {
            // During work: update recommended break time continuously
            this.state.recommendedBreak = Math.ceil(this.state.elapsedSeconds / 5);
            this.elements.breakTime.textContent = this.formatTime(this.state.recommendedBreak);
            this.elements.breakBtn.setAttribute('data-break-time', 
                `(${this.formatTime(this.state.recommendedBreak)})`);
        }
        
        document.title = `(${this.formatTime(this.state.elapsedSeconds)}) Flowtime Timer`;
    }

    startWork() {
        const taskValue = this.elements.task.value.trim();
        if (!taskValue) return;

        this.state.startTime = Date.now();
        this.state.isBreak = false;
        this.state.elapsedSeconds = 0;
        
        this.state.interval = setInterval(() => this.updateTimer(), 1000);
        this.elements.startBtn.disabled = true;
        this.elements.breakBtn.disabled = false;
        this.elements.stopBtn.disabled = false;
        
        this.elements.status.textContent = `Working on: ${taskValue}`;
        this.elements.currentSession.textContent = 'Work';
        this.elements.breakTime.textContent = '00:00:00';
    }

    startBreak() {
        // Save work duration
        this.state.lastWorkDuration = this.state.elapsedSeconds;
        this.elements.workDuration.textContent = this.formatTime(this.state.lastWorkDuration);
        
        // Calculate break time (1/5 of work time)
        this.state.recommendedBreak = Math.ceil(this.state.lastWorkDuration / 5);
        this.elements.breakTime.textContent = this.formatTime(this.state.recommendedBreak);
        
        // Reset and start break timer
        clearInterval(this.state.interval);
        this.state.startTime = Date.now();
        this.state.elapsedSeconds = 0;
        this.state.isBreak = true;
        
        this.state.interval = setInterval(() => this.updateTimer(), 1000);
        this.elements.startBtn.disabled = false;
        this.elements.breakBtn.disabled = true;
        this.elements.stopBtn.disabled = false;
        
        this.elements.status.textContent = 
            `Taking a break (${this.formatTime(this.state.recommendedBreak)} recommended)`;
        this.elements.currentSession.textContent = 'Break';
    }

    stopTimer() {
        clearInterval(this.state.interval);
        
        if (!this.state.isBreak) {
            this.state.lastWorkDuration = this.state.elapsedSeconds;
            this.elements.workDuration.textContent = this.formatTime(this.state.lastWorkDuration);
        }
        
        this.elements.timer.textContent = '00:00:00';
        document.title = 'Flowtime Timer';
        this.state.elapsedSeconds = 0;
        
        this.elements.startBtn.disabled = false;
        this.elements.breakBtn.disabled = true;
        this.elements.stopBtn.disabled = true;
        this.elements.breakBtn.removeAttribute('data-break-time');
        
        this.elements.status.textContent = 'Ready to start';
        this.elements.currentSession.textContent = '-';
    }
}

// Initialize the timer
const flowtimeTimer = new FlowtimeTimer();