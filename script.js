class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleButton = document.getElementById('toggleSidebar');
        this.sidebarNavItems = document.querySelectorAll('.sidebar-nav li a');
        
        this.isMobile = window.innerWidth <= 768;
        this.addEventListeners();
    }

    addEventListeners() {
        // Toggle sidebar
        this.toggleButton.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.checkMobileView();
        });

        // Add click event to nav items
        this.sidebarNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveItem(item);
                
                // On mobile, close sidebar after clicking an item
                if (this.isMobile && this.sidebar.classList.contains('active')) {
                    this.toggleSidebar();
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (this.isMobile && 
                this.sidebar.classList.contains('active') && 
                !this.sidebar.contains(e.target) && 
                e.target !== this.toggleButton) {
                this.toggleSidebar();
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.sidebar.classList.toggle('active');
        } else {
            this.sidebar.classList.toggle('collapsed');
        }
    }

    setActiveItem(item) {
        // Remove active class from all items
        this.sidebarNavItems.forEach(navItem => {
            navItem.parentElement.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.parentElement.classList.add('active');
    }

    checkMobileView() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // If transitioning between mobile and desktop views
        if (wasMobile !== this.isMobile) {
            // Remove any mobile-specific classes when switching to desktop
            if (!this.isMobile) {
                this.sidebar.classList.remove('active');
            } else {
                this.sidebar.classList.remove('collapsed');
            }
        }
    }
}

// Initialize the sidebar
document.addEventListener('DOMContentLoaded', () => {
    const sidebarManager = new SidebarManager();
});

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
            breakTime: document.getElementById('breakTime'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            fullscreenControls: document.getElementById('fullscreen-controls'),
            startBtnFS: document.getElementById('startBtnFS'),
            breakBtnFS: document.getElementById('breakBtnFS'),
            stopBtnFS: document.getElementById('stopBtnFS'),
            exitFsBtn: document.getElementById('exitFsBtn')
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

        // Fullscreen related listeners
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.enterFullscreen();
            } else {
                this.exitFullscreen();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
                return;
            }

            const key = e.key.toLowerCase();
            switch(key) {
                case 's': 
                    if (!this.elements.startBtn.disabled) this.startWork();
                    break;
                case 'b': 
                    if (!this.elements.breakBtn.disabled) this.startBreak();
                    break;
                case 'x': 
                    if (!this.elements.stopBtn.disabled) this.stopTimer();
                    break;
                case 'f': 
                    this.toggleFullscreen();
                    break;
            }
        });

        // Fullscreen control buttons
        this.elements.startBtnFS.addEventListener('click', () => {
            if (!this.elements.startBtn.disabled) this.startWork();
        });
        this.elements.breakBtnFS.addEventListener('click', () => {
            if (!this.elements.breakBtn.disabled) this.startBreak();
        });
        this.elements.stopBtnFS.addEventListener('click', () => {
            if (!this.elements.stopBtn.disabled) this.stopTimer();
        });
        this.elements.exitFsBtn.addEventListener('click', () => this.exitFullscreen());
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

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    enterFullscreen() {
        document.body.classList.add('fullscreen-mode');
        this.elements.fullscreenBtn.querySelector('.fullscreen-icon').textContent = '⛗';
        this.elements.fullscreenControls.hidden = false;
        this.isFullscreen = true;
    }

    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        document.body.classList.remove('fullscreen-mode');
        this.elements.fullscreenBtn.querySelector('.fullscreen-icon').textContent = '⛶';
        this.elements.fullscreenControls.hidden = true;
        this.isFullscreen = false;
    }
}

// Initialize the timer
document.addEventListener('DOMContentLoaded', () => {
    console.log("FlowtimeTimer initializing...");
    const flowtimeTimer = new FlowtimeTimer();
});