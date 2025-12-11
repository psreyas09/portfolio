const commandHistory = [];
let historyIndex = -1;

// Function to handle commands from the input field
function handleCommand(e) {
    if (e.key === 'Enter') {
        const currentInput = e.target;
        const command = currentInput.value.trim();
        const currentOutput = document.getElementById('output');

        if (command) {
            // Display command
            currentOutput.innerHTML += `<div class="command-executed"><span class="prompt">sreyas@portfolio:~$</span> <span class="command-highlight">${command}</span></div>`;

            // Execute command
            executeCommand(command, currentOutput);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        } else {
            currentOutput.innerHTML += `<div class="command-executed"><span class="prompt">sreyas@portfolio:~$</span></div>`;
        }

        // Clear input and scroll
        currentInput.value = '';
        const terminalBody = document.getElementById('terminal-body');
        if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            e.target.value = commandHistory[historyIndex];
        }
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            e.target.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            e.target.value = '';
        }
        e.preventDefault();
    }
}

function executeCommand(cmd, outputDiv) {
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'clear') {
        outputDiv.innerHTML = '';
        return;
    }

    if (lowerCmd === 'bsod') {
        const bsod = document.getElementById('bsod');
        if (bsod) bsod.style.display = 'flex';
        return;
    }

    if (lowerCmd === 'notepad') {
        if (window.openWindow) window.openWindow('notepad-window');
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response';
        responseDiv.textContent = 'Opening Notepad...';
        outputDiv.appendChild(responseDiv);
        return;
    }

    const responseDiv = document.createElement('div');
    responseDiv.className = 'response';
    outputDiv.appendChild(responseDiv);

    // Access data from global window object
    const data = window.portfolioData;

    if (data && data[lowerCmd]) {
        typeWriter(data[lowerCmd], responseDiv);
    } else {
        responseDiv.classList.add('error');
        responseDiv.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
}

function typeWriter(text, element) {
    let i = 0;
    const speed = 10; // ms per char
    const terminalBody = document.getElementById('terminal-body');

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('DOMContentLoaded', () => {
    // Boot Sequence Logic
    const bootScreen = document.getElementById('boot-screen');
    const loginScreen = document.getElementById('login-screen');
    const desktop = document.getElementById('desktop');
    const loginBtn = document.getElementById('login-btn');

    // Initial State: Boot Screen -> Login Screen
    setTimeout(() => {
        if (bootScreen) bootScreen.style.display = 'none';
        if (loginScreen) loginScreen.style.display = 'flex';
    }, 4000); // 4 seconds boot time

    // Login Logic: Login Screen -> Desktop
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginScreen) loginScreen.style.display = 'none';
            if (desktop) desktop.style.display = 'flex';

            // Play startup sound
            if (window.AudioManager) {
                window.AudioManager.playStartupSound();
            }

            // Initialize terminal
            const terminalBody = document.getElementById('terminal-body');
            if (terminalBody) {
                terminalBody.innerHTML = ''; // Clear previous
                const outputDiv = document.createElement('div');
                outputDiv.id = 'output';
                terminalBody.appendChild(outputDiv);

                const inputLine = document.createElement('div');
                inputLine.className = 'input-line';
                inputLine.innerHTML = `
                    <span class="prompt">sreyas@portfolio:~$</span>
                    <input type="text" id="command-input" autocomplete="off" autofocus>
                `;
                terminalBody.appendChild(inputLine);

                // Re-attach event listener to new input
                const newInput = document.getElementById('command-input');
                if (newInput) {
                    newInput.addEventListener('keydown', handleCommand);
                    newInput.focus();
                }

                // Type welcome message
                const welcomeMsg = `Welcome to Sreyas's Portfolio v1.0.0 (XP Edition)
Type 'help' to see available commands.
`;
                typeWriter(welcomeMsg, outputDiv);

                // Open terminal window by default
                if (window.openWindow) {
                    window.openWindow('terminal-window');
                }
            }
        });
    }

    // Focus input when clicking terminal body
    const terminalBody = document.getElementById('terminal-body');
    if (terminalBody) {
        terminalBody.addEventListener('click', () => {
            const input = document.getElementById('command-input');
            if (input) input.focus();
        });
    }



    // Notepad Menu Logic
    const notepadMenuItems = document.querySelectorAll('.notepad-menu-item');

    // Toggle menu
    notepadMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close others
            notepadMenuItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });

        // Hover behavior (classic Windows style: if one is open, hovering others opens them)
        item.addEventListener('mouseover', () => {
            const isAnyActive = Array.from(notepadMenuItems).some(i => i.classList.contains('active'));
            if (isAnyActive) {
                notepadMenuItems.forEach(other => other.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', () => {
        notepadMenuItems.forEach(item => item.classList.remove('active'));
    });

    // Menu Actions
    const notepadDropdownItems = document.querySelectorAll('.notepad-dropdown-item');
    const notepadTextarea = document.querySelector('.notepad-textarea');

    notepadDropdownItems.forEach(actionItem => {
        actionItem.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = actionItem.dataset.action;

            // Close menus
            notepadMenuItems.forEach(item => item.classList.remove('active'));

            // Perform Action
            switch (action) {
                case 'new':
                    if (notepadTextarea) notepadTextarea.value = '';
                    break;
                case 'exit':
                    const notepadWindow = document.getElementById('notepad-window');
                    if (notepadWindow) notepadWindow.style.display = 'none';
                    break;
                case 'time-date':
                    if (notepadTextarea) {
                        const now = new Date();
                        notepadTextarea.value += now.toLocaleString();
                    }
                    break;
                case 'select-all':
                    if (notepadTextarea) notepadTextarea.select();
                    break;
                case 'word-wrap':
                    if (notepadTextarea) {
                        if (notepadTextarea.style.whiteSpace === 'nowrap') {
                            notepadTextarea.style.whiteSpace = 'pre-wrap';
                            // Visual checkmark logic would go here ideally
                        } else {
                            notepadTextarea.style.whiteSpace = 'nowrap';
                        }
                    }
                    break;
                case 'status-bar':
                case 'font':
                case 'save':
                    if (notepadTextarea) {
                        const path = prompt('Enter file path to save (e.g., C:\\test.txt):', 'C:\\Documents and Settings\\Sreyas\\My Documents\\New Text.txt');
                        if (path) {
                            const success = window.FileSystem.writeFile(path, notepadTextarea.value);
                            if (success) alert('File saved successfully!');
                            else alert('Failed to save file. Check if the folder exists.');
                        }
                    }
                    break;
                case 'open':
                    const openPath = prompt('Enter file path to open:', 'C:\\Documents and Settings\\Sreyas\\My Documents\\Resume.txt');
                    if (openPath) {
                        const content = window.FileSystem.readFile(openPath);
                        if (content !== null) {
                            if (notepadTextarea) notepadTextarea.value = content;
                        } else {
                            alert('File not found.');
                        }
                    }
                    break;
                case 'font':
                case 'about':
                    alert('This feature is not implemented in this demo.');
                    break;
                case 'undo':
                    alert('Undo is not available.');
                    break;
                case 'cut':
                    if (notepadTextarea) {
                        const start = notepadTextarea.selectionStart;
                        const end = notepadTextarea.selectionEnd;
                        const text = notepadTextarea.value.substring(start, end);
                        if (text) {
                            window.Clipboard = { data: text, type: 'text' };
                            notepadTextarea.setRangeText('', start, end, 'end');
                        }
                    }
                    break;
                case 'copy':
                    if (notepadTextarea) {
                        const text = notepadTextarea.value.substring(notepadTextarea.selectionStart, notepadTextarea.selectionEnd);
                        if (text) window.Clipboard = { data: text, type: 'text' };
                    }
                    break;
                case 'paste':
                    if (notepadTextarea && window.Clipboard && window.Clipboard.type === 'text') {
                        notepadTextarea.setRangeText(window.Clipboard.data, notepadTextarea.selectionStart, notepadTextarea.selectionEnd, 'end');
                    }
                    break;
                case 'delete':
                    if (notepadTextarea) {
                        notepadTextarea.setRangeText('', notepadTextarea.selectionStart, notepadTextarea.selectionEnd, 'end');
                    }
                    break;

                // Explorer Actions
                case 'exp-close':
                    const expWindow = document.getElementById('explorer-window');
                    if (expWindow) expWindow.style.display = 'none';
                    break;
                case 'exp-refresh':
                    if (window.Explorer && window.Explorer.render) {
                        window.Explorer.render(window.Explorer.currentPath);
                    }
                    break;
                case 'exp-about':
                    alert('Windows XP Explorer (Simulated)\nVersion 2025');
                    break;
                case 'exp-copy':
                    const copyName = prompt('Enter filename to copy in current folder:', '');
                    if (copyName && window.Explorer) {
                        const srcPath = window.Explorer.currentPath + window.FileSystem.pathSeparator + copyName;
                        if (window.FileSystem.resolvePath(srcPath)) {
                            window.Clipboard = { data: srcPath, type: 'file' };
                            alert('File copied to clipboard.');
                        } else {
                            alert('File not found.');
                        }
                    }
                    break;
                case 'exp-paste':
                    if (window.Clipboard && window.Clipboard.type === 'file' && window.Explorer) {
                        const srcPath = window.Clipboard.data;
                        const fileName = srcPath.split(window.FileSystem.pathSeparator).pop();
                        const destPath = window.Explorer.currentPath + window.FileSystem.pathSeparator + 'Copy of ' + fileName;

                        if (window.FileSystem.copy(srcPath, destPath)) {
                            window.Explorer.render(window.Explorer.currentPath);
                        } else {
                            alert('Failed to paste.');
                        }
                    } else {
                        alert('Clipboard is empty or invalid.');
                    }
                    break;
                case 'exp-copy':
                case 'exp-paste':
                case 'exp-selall':
                case 'exp-fav':
                case 'exp-opt':
                    alert('This feature is limited in this demo.');
                    break;
            }
        });
    });

    // BSOD Logic
    const bsod = document.getElementById('bsod');
    if (bsod) {
        bsod.addEventListener('click', () => {
            location.reload();
        });
    }

    // Run Dialog Logic
    const runOk = document.getElementById('run-ok');
    const runCancel = document.getElementById('run-cancel');
    const runInput = document.getElementById('run-input');
    const runWindow = document.getElementById('run-window');

    if (runOk && runInput && runWindow) {
        runOk.addEventListener('click', () => {
            const cmd = runInput.value.trim().toLowerCase();
            if (cmd === 'notepad') {
                if (window.openWindow) window.openWindow('notepad-window');
            } else if (cmd === 'cmd' || cmd === 'terminal') {
                if (window.openWindow) window.openWindow('terminal-window');
            } else if (cmd === 'bsod') {
                if (bsod) bsod.style.display = 'flex';
            } else if (cmd) {
                alert(`Cannot find '${cmd}'. Make sure you typed the name correctly, and then try again.`);
            }
            runWindow.style.display = 'none';
        });

        if (runCancel) {
            runCancel.addEventListener('click', () => {
                runWindow.style.display = 'none';
            });
        }

        // Also handle Enter key in run input
        runInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                runOk.click();
            }
        });
    }
});

// File Explorer Logic
const Explorer = {
    currentPath: 'root',
    history: [],
    historyIndex: -1,

    init: function () {
        this.render('root');
        this.setupListeners();
    },

    setupListeners: function () {
        // Toolbar Buttons
        document.getElementById('exp-back')?.addEventListener('click', () => this.goBack());
        document.getElementById('exp-forward')?.addEventListener('click', () => this.goForward());
        document.getElementById('exp-up')?.addEventListener('click', () => this.goUp());
        document.querySelector('.go-btn')?.addEventListener('click', () => {
            const path = document.getElementById('explorer-address').value;
            this.navigateTo(path);
        });

        // Search Button
        document.getElementById('exp-search')?.addEventListener('click', () => {
            const sidebarTasks = document.getElementById('sidebar-tasks');
            const sidebarSearch = document.getElementById('sidebar-search');
            if (sidebarTasks && sidebarSearch) {
                if (sidebarSearch.style.display === 'none') {
                    sidebarTasks.style.display = 'none';
                    sidebarSearch.style.display = 'block';
                } else {
                    sidebarTasks.style.display = 'block';
                    sidebarSearch.style.display = 'none';
                }
            }
        });

        // Search Interface
        document.getElementById('search-btn')?.addEventListener('click', () => this.performSearch());
        document.getElementById('search-back-btn')?.addEventListener('click', () => {
            // Reset search view
            document.querySelector('.search-form').style.display = 'block';
            document.getElementById('rover-bubble').style.display = 'none';
        });

        // Sidebar Actions
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (!action) return;

                switch (action) {
                    case 'sys-info':
                        alert('System Information:\n\nOS: Windows XP (Simulated)\nUser: Sreyas\nBrowser: ' + navigator.userAgent);
                        break;
                    case 'sys-programs':
                        alert('Add or Remove Programs is not available in this demo.');
                        break;
                    case 'sys-setting':
                        alert('Control Panel is restricted.');
                        break;
                    case 'place-mycomp':
                        this.navigateTo('root');
                        break;
                    case 'place-mydocs':
                        this.navigateTo('C:\\Documents and Settings\\Sreyas\\My Documents');
                        break;
                    case 'place-net':
                        alert('Network discovery is turned off.');
                        break;
                }
            });
        });
    },

    navigateTo: function (path) {
        if (this.currentPath !== path) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(path);
            this.historyIndex++;
        }
        this.currentPath = path;
        this.render(path);
    },

    goBack: function () {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const path = this.history[this.historyIndex];
            this.currentPath = path;
            this.render(path);
        }
    },

    goForward: function () {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const path = this.history[this.historyIndex];
            this.currentPath = path;
            this.render(path);
        }
    },

    goUp: function () {
        if (this.currentPath === 'root') return;
        const separator = window.FileSystem.pathSeparator;
        // If it's a drive like "C:", go to root
        if (this.currentPath.endsWith(':')) {
            this.navigateTo('root');
            return;
        }

        const lastSep = this.currentPath.lastIndexOf(separator);
        if (lastSep === -1) {
            // Must be a drive without trailing slash or something, go root
            this.navigateTo('root');
        } else {
            const parent = this.currentPath.substring(0, lastSep);
            this.navigateTo(parent || 'root'); // If empty string, root
        }
    },

    performSearch: function () {
        const query = document.getElementById('search-query').value.toLowerCase();
        const results = [];

        const searchRecursive = (node, currentPath) => {
            for (const name in node.children) {
                const item = node.children[name];
                const fullPath = currentPath === 'root' ? name : currentPath + window.FileSystem.pathSeparator + name;

                if (name.toLowerCase().includes(query)) {
                    results.push({ name, path: fullPath, type: item.type });
                }

                if (item.type === 'folder' || item.type === 'drive') {
                    searchRecursive(item, fullPath);
                }
            }
        };

        // Search from root for now
        searchRecursive(window.FileSystem.root || {}, 'root'); // Pass empty obj if root null

        this.renderResults(results);

        // Rover Animation
        const bubble = document.getElementById('rover-bubble');
        if (bubble) {
            bubble.style.display = 'block';
            bubble.textContent = `I found ${results.length} results!`;
        }
    },

    renderResults: function (results) {
        const mainView = document.getElementById('explorer-main');
        if (!mainView) return;
        mainView.innerHTML = '';

        if (results.length === 0) {
            mainView.innerHTML = '<div style="padding:20px;">There are no results to display.</div>';
            return;
        }

        results.forEach(item => {
            const el = document.createElement('div');
            el.className = 'file-item';

            let iconSrc = 'icons/folder.ico';
            if (item.type === 'drive') iconSrc = 'icons/folder.ico'; // Placeholder for drive
            if (item.type === 'file') iconSrc = 'icons/notepad.png'; // Placeholder

            el.innerHTML = `
                <img src="${iconSrc}" alt="${item.type}">
                <span>${item.name}</span>
            `;

            el.addEventListener('dblclick', () => {
                if (item.type === 'folder' || item.type === 'drive') {
                    this.navigateTo(item.path);
                } else if (item.type === 'file') {
                    this.openFile(item.path);
                }
            });

            el.addEventListener('click', () => {
                document.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
                el.classList.add('selected');
            });

            mainView.appendChild(el);
        });
    },

    render: function (path) {
        const mainView = document.getElementById('explorer-main');
        const addressBar = document.getElementById('explorer-address');
        const title = document.getElementById('explorer-title');

        if (addressBar) addressBar.value = path === 'root' ? 'My Computer' : path;
        if (title) title.textContent = path === 'root' ? 'My Computer' : path.split(window.FileSystem.pathSeparator).pop();

        if (!mainView) return;
        mainView.innerHTML = '';

        // Get contents
        let contents = window.FileSystem.readDir(path);

        // If root, contents is the 'root' object from filesystem, iterating its keys gives drives
        if (path === 'root') {
            // In filesystem.js root structure is { 'C:': ..., 'D:': ... }
            // readDir('root') returns the root object itself in my implementation
            contents = window.FileSystem.root;
        }

        if (!contents) {
            mainView.innerHTML = '<div style="padding:20px;">Folder is empty or does not exist.</div>';
            return;
        }

        for (const name in contents) {
            const item = contents[name];
            const el = document.createElement('div');
            el.className = 'file-item';

            let iconSrc = 'icons/folder.ico';
            // Custom icons based on name/type
            if (name.includes('C:')) iconSrc = 'icons/folder.ico'; // Should use drive icon
            else if (name.includes('D:')) iconSrc = 'icons/folder.ico';
            else if (item.type === 'file') iconSrc = 'icons/notepad.png';

            // Fix icon for known drives
            if (item.type === 'drive') iconSrc = 'icons/folder.ico'; // Generic for now

            el.innerHTML = `
                <img src="${iconSrc}" alt="${item.type}">
                <span>${name}</span>
            `;

            el.addEventListener('dblclick', () => {
                const fullPath = path === 'root' ? name : path + window.FileSystem.pathSeparator + name;
                if (item.type === 'folder' || item.type === 'drive') {
                    this.navigateTo(fullPath);
                } else if (item.type === 'file') {
                    this.openFile(fullPath);
                }
            });

            el.addEventListener('click', () => {
                document.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
                el.classList.add('selected');
            });

            mainView.appendChild(el);
        }
    },

    openFile: function (path) {
        const content = window.FileSystem.readFile(path);
        // Open in Notepad
        if (window.openWindow) window.openWindow('notepad-window');
        const textarea = document.querySelector('.notepad-textarea');
        if (textarea) textarea.value = content;

        const notepadTitle = document.querySelector('#notepad-window .window-title span');
        if (notepadTitle) notepadTitle.textContent = path.split(window.FileSystem.pathSeparator).pop() + ' - Notepad';
    }
};

window.openPath = function (path) {
    if (window.openWindow) window.openWindow('explorer-window');
    Explorer.navigateTo(path);
};

// Initialize Explorer when DOM ready
window.addEventListener('DOMContentLoaded', () => {
    Explorer.init();
});

// Calculator Logic
const Calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,

    init: function () {
        this.updateDisplay();
        this.setupListeners();
    },

    setupListeners: function () {
        const keys = document.querySelector('.calc-buttons');
        if (!keys) return;

        keys.addEventListener('click', (event) => {
            const { target } = event;
            if (!target.matches('button')) return;

            if (target.classList.contains('text-red')) {
                // Clear functions
                const action = target.textContent;
                if (action === 'C') this.resetCalculator();
                else if (action === 'CE') this.displayValue = '0';
                else if (action === 'Backspace') {
                    this.displayValue = this.displayValue.length > 1 ? this.displayValue.slice(0, -1) : '0';
                }
                this.updateDisplay();
                return;
            }

            if (target.classList.contains('text-blue') || target.textContent === '%' || target.textContent === 'sqrt' || target.textContent === '1/x') {
                this.handleOperator(target.textContent);
                this.updateDisplay();
                return;
            }

            if (target.textContent === '.') {
                this.inputDecimal(target.textContent);
                this.updateDisplay();
                return;
            }

            if (target.textContent === '+/-') {
                this.displayValue = (parseFloat(this.displayValue) * -1).toString();
                this.updateDisplay();
                return;
            }

            this.inputDigit(target.textContent);
            this.updateDisplay();
        });
    },

    inputDigit: function (digit) {
        if (this.waitingForSecondOperand === true) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
    },

    inputDecimal: function (dot) {
        if (this.waitingForSecondOperand === true) return;
        if (!this.displayValue.includes(dot)) {
            this.displayValue += dot;
        }
    },

    handleOperator: function (nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand === null) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
            this.displayValue = String(result);
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
    },

    performCalculation: function (op, first, second) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') return first / second;
        if (op === '=') return second;
        if (op === '%') return first % second;
        if (op === 'sqrt') return Math.sqrt(first);
        if (op === '1/x') return 1 / first;

        return second;
    },

    resetCalculator: function () {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
    },

    updateDisplay: function () {
        const display = document.getElementById('calc-display');
        if (display) display.value = this.displayValue;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Calculator.init();
});


// Clipboard Initialization
window.Clipboard = {
    data: null,
    type: null
};
