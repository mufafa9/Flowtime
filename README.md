# Flowtime Timer

A modern, minimalist timer application implementing the Flowtime Technique - a flexible alternative to the Pomodoro method. Instead of fixed work/break intervals, Flowtime allows natural breaking points with recommended break durations based on work time.

## Features

- Clean, responsive interface
- Automatic break time calculation (1/5th of work duration)
- Fullscreen focus mode
- Dark mode support
- Accessible design with ARIA attributes
- Save prompt before closing active sessions
- Session statistics tracking

## How It Works

1. Enter your task in the input field
2. Click "Start Work" to begin your work session
3. Work for as long as you feel productive
4. Click "Take Break" when you need a break
   - Recommended break duration is calculated as 1/5th of your work time
5. Click "Stop" to end your session completely

## Installation

1. Clone this repository:
```bash
git clone https://github.com/mufafa9/Flowtime
```

2. Open `index.html` in your browser

## Usage

The timer shows three main pieces of information:
- Current session type (Work/Break)
- Work duration
- Recommended break time

Use the fullscreen button (⛶) in the corner for a distraction-free experience. Press ESC to exit fullscreen mode.

## Tech Stack

- HTML5
- CSS3 (with CSS Custom Properties)
- Vanilla JavaScript
- Responsive Design
- Dark Mode Support

## License

MIT License
