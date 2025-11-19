const PacmanGame = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    score: 0,
    animationId: null,
    frameCount: 0,
    moveInterval: 10, // Move every 10 frames
    pacman: { x: 1, y: 1, dir: 'right', nextDir: 'right' },
    ghosts: [
        { x: 9, y: 9, color: 'red', dir: 'up' },
        { x: 10, y: 9, color: 'pink', dir: 'up' },
        { x: 9, y: 10, color: 'cyan', dir: 'up' },
        { x: 10, y: 10, color: 'orange', dir: 'up' }
    ],
    map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    stateMap: [],

    init: function () {
        this.canvas = document.getElementById('pacman-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size based on map
        this.canvas.width = this.map[0].length * this.gridSize;
        this.canvas.height = this.map.length * this.gridSize;

        // Controls
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                // Only prevent default if the pacman window is visible
                const pacmanWindow = document.getElementById('pacman-window');
                if (pacmanWindow && pacmanWindow.style.display !== 'none') {
                    e.preventDefault();
                    this.pacman.nextDir = e.key.replace('Arrow', '').toLowerCase();
                }
            }
        });

        // Start Button
        const startBtn = document.getElementById('start-pacman');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.resetGame();
                this.start();
                startBtn.blur(); // Remove focus so spacebar doesn't trigger it again
            });
        }

        // Initial Draw
        this.resetDots();
        this.draw();
    },

    resetDots: function () {
        // 0 = dot, 1 = wall, 2 = empty
        this.stateMap = JSON.parse(JSON.stringify(this.map));
    },

    start: function () {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.isRunning = true; // Set game to running
        this.gameLoop();
    },

    gameLoop: function () {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }
    },

    update: function () {
        this.frameCount++;
        if (this.frameCount % this.moveInterval === 0) {
            this.movePacman();
            this.moveGhosts();
            this.checkCollisions();
            this.checkWin();
        }
    },

    movePacman: function () {
        const dirs = {
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 }
        };

        // Try next dir
        let nextX = this.pacman.x + dirs[this.pacman.nextDir].x;
        let nextY = this.pacman.y + dirs[this.pacman.nextDir].y;

        if (this.stateMap[nextY][nextX] !== 1) {
            this.pacman.dir = this.pacman.nextDir;
        }

        // Move in current dir
        let moveX = this.pacman.x + dirs[this.pacman.dir].x;
        let moveY = this.pacman.y + dirs[this.pacman.dir].y;

        if (this.stateMap[moveY][moveX] !== 1) {
            this.pacman.x = moveX;
            this.pacman.y = moveY;

            // Eat dot
            if (this.stateMap[moveY][moveX] === 0) {
                this.stateMap[moveY][moveX] = 2;
                this.score += 10;
                document.getElementById('pacman-score').textContent = `Score: ${this.score}`;
                SoundManager.playWaka();
            }
        }
    },

    moveGhosts: function () {
        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        this.ghosts.forEach(ghost => {
            // Simple random movement
            const validMoves = dirs.filter(d => {
                return this.stateMap[ghost.y + d.y][ghost.x + d.x] !== 1;
            });

            if (validMoves.length > 0) {
                // Try to keep moving in same direction if possible
                const currentDirMove = dirs.find(d => {
                    if (ghost.dir === 'up') return d.x === 0 && d.y === -1;
                    if (ghost.dir === 'down') return d.x === 0 && d.y === 1;
                    if (ghost.dir === 'left') return d.x === -1 && d.y === 0;
                    if (ghost.dir === 'right') return d.x === 1 && d.y === 0;
                    return false;
                });

                // 80% chance to keep moving same direction if valid
                let move;
                if (currentDirMove && validMoves.includes(currentDirMove) && Math.random() > 0.2) {
                    move = currentDirMove;
                } else {
                    move = validMoves[Math.floor(Math.random() * validMoves.length)];
                    // Update dir
                    if (move.x === 0 && move.y === -1) ghost.dir = 'up';
                    else if (move.x === 0 && move.y === 1) ghost.dir = 'down';
                    else if (move.x === -1 && move.y === 0) ghost.dir = 'left';
                    else if (move.x === 1 && move.y === 0) ghost.dir = 'right';
                }

                ghost.x += move.x;
                ghost.y += move.y;
            }
        });
    },

    checkCollisions: function () {
        this.ghosts.forEach(ghost => {
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                // Game Over
                this.isRunning = false;
                SoundManager.playDie();
                alert('Game Over! Score: ' + this.score);
                this.resetGame();
            }
        });
    },

    checkWin: function () {
        let dotsRemaining = 0;
        for (let y = 0; y < this.stateMap.length; y++) {
            for (let x = 0; x < this.stateMap[y].length; x++) {
                if (this.stateMap[y][x] === 0) {
                    dotsRemaining++;
                }
            }
        }

        if (dotsRemaining === 0) {
            this.isRunning = false;
            SoundManager.playWin();
            alert('You Win! Score: ' + this.score);
            this.resetGame();
        }
    },

    resetGame: function () {
        this.pacman = { x: 1, y: 1, dir: 'right', nextDir: 'right' };
        this.ghosts = [
            { x: 9, y: 9, color: 'red', dir: 'up' },
            { x: 10, y: 9, color: 'pink', dir: 'up' },
            { x: 9, y: 10, color: 'cyan', dir: 'up' },
            { x: 10, y: 10, color: 'orange', dir: 'up' }
        ];
        this.score = 0;
        this.frameCount = 0;
        document.getElementById('pacman-score').textContent = `Score: 0`;
        this.resetDots();
        this.draw();
    },

    draw: function () {
        if (!this.ctx) return;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Map
        for (let y = 0; y < this.stateMap.length; y++) {
            for (let x = 0; x < this.stateMap[y].length; x++) {
                if (this.stateMap[y][x] === 1) {
                    this.ctx.fillStyle = '#0000FF';
                    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
                    // Inner black square to make it look like walls
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(x * this.gridSize + 4, y * this.gridSize + 4, this.gridSize - 8, this.gridSize - 8);
                    this.ctx.strokeStyle = '#0000FF';
                    this.ctx.strokeRect(x * this.gridSize + 4, y * this.gridSize + 4, this.gridSize - 8, this.gridSize - 8);
                } else if (this.stateMap[y][x] === 0) {
                    this.ctx.fillStyle = '#FFB8AE'; // Dot color
                    this.ctx.beginPath();
                    this.ctx.arc(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // Draw Pacman
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        const mouthOpen = (this.frameCount % 20 < 10) ? 0.2 : 0.05;

        let startAngle = 0;
        if (this.pacman.dir === 'right') startAngle = 0;
        if (this.pacman.dir === 'down') startAngle = 0.5 * Math.PI;
        if (this.pacman.dir === 'left') startAngle = 1 * Math.PI;
        if (this.pacman.dir === 'up') startAngle = 1.5 * Math.PI;

        this.ctx.arc(
            this.pacman.x * this.gridSize + this.gridSize / 2,
            this.pacman.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            startAngle + mouthOpen * Math.PI,
            startAngle + (2 - mouthOpen) * Math.PI
        );
        this.ctx.lineTo(this.pacman.x * this.gridSize + this.gridSize / 2, this.pacman.y * this.gridSize + this.gridSize / 2);
        this.ctx.fill();

        // Draw Ghosts
        this.ghosts.forEach(ghost => {
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(
                ghost.x * this.gridSize + this.gridSize / 2,
                ghost.y * this.gridSize + this.gridSize / 2,
                this.gridSize / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    }
};

const SoundManager = {
    ctx: null,

    init: function () {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playTone: function (freq, type, duration) {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playWaka: function () {
        this.playTone(200, 'triangle', 0.1);
        setTimeout(() => this.playTone(400, 'triangle', 0.1), 100);
    },

    playEatGhost: function () {
        this.playTone(800, 'square', 0.2);
    },

    playDie: function () {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    },

    playWin: function () {
        if (!this.ctx) this.init();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.value = 0.1;
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        });
    }
};

window.PacmanGame = PacmanGame;

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PacmanGame.init();
});
