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
});
