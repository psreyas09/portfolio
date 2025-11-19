// Window Management Logic

let zIndexCounter = 100;

function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Bring to front
        element.style.zIndex = ++zIndexCounter;

        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function setupWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        const header = win.querySelector('.window-header');
        makeDraggable(win, header);

        win.addEventListener('mousedown', () => {
            win.style.zIndex = ++zIndexCounter;
            updateTaskbarActive(win.id);
        });

        // Close button
        const closeBtn = win.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                win.style.display = 'none';
                const taskbarItem = document.getElementById(`task-${win.id}`);
                if (taskbarItem) taskbarItem.style.display = 'none';
            });
        }

        // Minimize button
        const minBtn = win.querySelector('.minimize-btn');
        if (minBtn) {
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                win.style.display = 'none';
                const taskbarItem = document.getElementById(`task-${win.id}`);
                if (taskbarItem) taskbarItem.classList.remove('active');
            });
        }

        // Maximize button (Simple toggle for now)
        const maxBtn = win.querySelector('.maximize-btn');
        if (maxBtn) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (win.style.width === '100%') {
                    win.style.width = '800px';
                    win.style.height = '500px';
                    win.style.top = '100px';
                    win.style.left = '100px';
                } else {
                    win.style.width = '100%';
                    win.style.height = 'calc(100% - 30px)'; // Minus taskbar
                    win.style.top = '0';
                    win.style.left = '0';
                }
            });
        }
    });
}

function setupDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const targetId = icon.dataset.target;
            const targetWin = document.getElementById(targetId);
            if (targetWin) {
                targetWin.style.display = 'flex';
                targetWin.style.zIndex = ++zIndexCounter;

                const taskbarItem = document.getElementById(`task-${targetId}`);
                if (taskbarItem) {
                    taskbarItem.style.display = 'flex';
                    taskbarItem.classList.add('active');
                }
            }
        });
    });
}

function setupTaskbar() {
    const items = document.querySelectorAll('.taskbar-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            const targetWin = document.getElementById(targetId);

            if (targetWin.style.display === 'none') {
                targetWin.style.display = 'flex';
                targetWin.style.zIndex = ++zIndexCounter;
                item.classList.add('active');
            } else {
                // If active and on top, minimize
                if (parseInt(targetWin.style.zIndex) === zIndexCounter) {
                    targetWin.style.display = 'none';
                    item.classList.remove('active');
                } else {
                    // Bring to front
                    targetWin.style.zIndex = ++zIndexCounter;
                    item.classList.add('active');
                }
            }
        });
    });

    // Clock
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('clock').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();
}

function updateTaskbarActive(activeId) {
    document.querySelectorAll('.taskbar-item').forEach(item => {
        if (item.dataset.target === activeId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupWindows();
    setupDesktopIcons();
    setupTaskbar();

    // Start Menu Logic
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = startMenu.style.display === 'flex';
        startMenu.style.display = isVisible ? 'none' : 'flex';
        startButton.style.filter = isVisible ? '' : 'brightness(0.8)'; // Visual feedback
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.style.display = 'none';
            startButton.style.filter = '';
        }
    });

    // Helper to open window
    function openWindow(windowEl) {
        windowEl.style.display = 'flex';
        windowEl.style.zIndex = ++zIndexCounter;
        const taskbarItem = document.getElementById(`task-${windowEl.id}`);
        if (taskbarItem) {
            taskbarItem.style.display = 'flex';
            taskbarItem.classList.add('active');
        }
    }

    // Start Menu Items
    document.querySelectorAll('.start-item[data-target]').forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const windowEl = document.getElementById(targetId);
            if (windowEl) {
                openWindow(windowEl);
                startMenu.style.display = 'none';
                startButton.style.filter = '';
            }
        });
    });

    // Log Off Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log off?')) {
                location.reload(); // Simulates restart/log off
            }
        });
    }

    // Shutdown Logic
    const shutdownBtn = document.getElementById('shutdown-btn');
    const shutdownOverlay = document.getElementById('shutdown-overlay');
    const cancelShutdown = document.getElementById('cancel-shutdown');
    const actionTurnOff = document.getElementById('action-turnoff');
    const actionRestart = document.getElementById('action-restart');
    const actionStandby = document.getElementById('action-standby');

    if (shutdownBtn && shutdownOverlay) {
        shutdownBtn.addEventListener('click', () => {
            shutdownOverlay.style.display = 'flex';
            // Dim the background
            document.getElementById('desktop').style.filter = 'grayscale(100%)';
        });
    }

    if (cancelShutdown) {
        cancelShutdown.addEventListener('click', () => {
            shutdownOverlay.style.display = 'none';
            document.getElementById('desktop').style.filter = 'none';
        });
    }

    if (actionTurnOff) {
        actionTurnOff.addEventListener('click', () => {
            // Play shutdown sound
            if (window.AudioManager) {
                window.AudioManager.playShutdownSound();
            }

            // Turn Off Animation
            document.body.innerHTML = '';
            document.body.style.backgroundColor = 'black';
            document.body.style.cursor = 'default'; // Changed from 'none' to allow clicking

            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.textAlign = 'center';

            // Power Button
            const powerBtn = document.createElement('button');
            powerBtn.textContent = '⏻ Power On';
            powerBtn.style.padding = '15px 30px';
            powerBtn.style.fontSize = '24px';
            powerBtn.style.fontFamily = 'Tahoma, sans-serif';
            powerBtn.style.backgroundColor = '#333';
            powerBtn.style.color = '#ddd';
            powerBtn.style.border = '2px solid #555';
            powerBtn.style.borderRadius = '50px';
            powerBtn.style.cursor = 'pointer';
            powerBtn.style.transition = 'all 0.3s';

            powerBtn.onmouseover = () => {
                powerBtn.style.backgroundColor = '#444';
                powerBtn.style.color = 'white';
                powerBtn.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.2)';
            };
            powerBtn.onmouseout = () => {
                powerBtn.style.backgroundColor = '#333';
                powerBtn.style.color = '#ddd';
                powerBtn.style.boxShadow = 'none';
            };

            powerBtn.onclick = () => {
                location.reload();
            };

            container.appendChild(powerBtn);
            document.body.appendChild(container);
        });
    }

    if (actionRestart) {
        actionRestart.addEventListener('click', () => {
            location.reload();
        });
    }

    if (actionStandby) {
        actionStandby.addEventListener('click', () => {
            // Just close dialog for now, or dim screen
            shutdownOverlay.style.display = 'none';
            document.getElementById('desktop').style.filter = 'none';
        });
    }
});
