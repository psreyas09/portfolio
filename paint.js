const PaintApp = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentTool: 'brush', // 'brush' or 'eraser'
    currentColor: '#000000',
    brushSize: 5,
    lastX: 0,
    lastY: 0,

    init: function () {
        this.canvas = document.getElementById('paint-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size (internal resolution)
        // We might want to sync this with CSS size or window size
        this.canvas.width = 600;
        this.canvas.height = 400;

        // Set initial context styles
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.currentColor;

        // Event Listeners
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Toolbar Listeners
        this.setupToolbar();
    },

    setupToolbar: function () {
        // Colors
        const colors = document.querySelectorAll('.paint-color');
        colors.forEach(color => {
            color.addEventListener('click', (e) => {
                this.currentTool = 'brush';
                this.currentColor = e.target.dataset.color;
                this.ctx.strokeStyle = this.currentColor;
                this.updateActiveColor(e.target);
            });
        });

        // Tools
        const eraserBtn = document.getElementById('paint-tool-eraser');
        if (eraserBtn) {
            eraserBtn.addEventListener('click', () => {
                this.currentTool = 'eraser';
                this.ctx.strokeStyle = '#FFFFFF'; // Eraser is just white paint
            });
        }

        const brushBtn = document.getElementById('paint-tool-brush');
        if (brushBtn) {
            brushBtn.addEventListener('click', () => {
                this.currentTool = 'brush';
                this.ctx.strokeStyle = this.currentColor;
            });
        }

        const clearBtn = document.getElementById('paint-tool-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            });
        }

        // Size
        const sizeInput = document.getElementById('paint-brush-size');
        if (sizeInput) {
            sizeInput.addEventListener('change', (e) => {
                this.brushSize = e.target.value;
                this.ctx.lineWidth = this.brushSize;
            });
        }
    },

    updateActiveColor: function (activeElement) {
        document.querySelectorAll('.paint-color').forEach(c => c.classList.remove('active'));
        activeElement.classList.add('active');
    },

    getMousePos: function (e) {
        const rect = this.canvas.getBoundingClientRect();
        // Scale mouse coordinates to canvas resolution
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },

    startDrawing: function (e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
    },

    draw: function (e) {
        if (!this.isDrawing) return;
        const pos = this.getMousePos(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;
    },

    stopDrawing: function () {
        this.isDrawing = false;
    }
};

window.PaintApp = PaintApp;

document.addEventListener('DOMContentLoaded', () => {
    PaintApp.init();
});
