class Game
{
    constructor(options) {
        this.canvas = document.getElementById(options.canvas);
        this.menu = {
            background: document.getElementById(options.menu_bg)
        };
        this.pause = {
            isPause: false,
            background: document.getElementById(options.pause_bg)
        };
        this.buttons = {
            start: document.getElementById(options.btn_start),
            resume: document.getElementById(options.btn_resume)
        };
        this.ctx = this.canvas.getContext('2d');
        this.loop = false;
        this.colors = [
            "#8ae5ff"
        ];
        this.options = {
            fps: '60'
        }
        this.startDate = 0;
        this.gameLoopTimeout = null;
    }

    init() {
        this.drawBackground();
        document.addEventListener("keydown", this.keyboardEvent.bind(this));
        window.addEventListener("resize", () => {
            if (!this.loop || this.pause) this.drawBackground();
        });
        this.buttons.start.addEventListener("click", this.startGame.bind(this));
        this.buttons.resume.addEventListener("click", this.togglePause.bind(this));
    }

    togglePause() {
        if (!this.loop) return;
        this.pause.isPause = !this.pause.isPause;
        if (this.pause.isPause) {
            clearTimeout(this.gameLoopTimeout);
            this.pause.background.style.display = "flex";
            this.startDate = Date.now() - this.startDate;
        } else {
            this.pause.background.style.display = "none";
            this.gameLoop();
            this.startDate = Date.now() - this.startDate;
        }
    }

    keyboardEvent(evt) {
        if(evt.key === "Escape") this.togglePause();
    }

    startGame(evt) {
        if(evt) evt.preventDefault();
        this.menu.background.style.display = "none";
        this.loop = true;
        this.startDate = Date.now();
        this.gameLoop();
    }

    gameLoop() {
        if (!(this.loop && !this.pause.isPause)) return;
        this.gameLoopTimeout = setTimeout(() => {
            this.drawBackground();
            console.log(Math.floor((Date.now() - this.startDate) / 1000));
            
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }, 1000 / this.options.fps);
    }

    spawnCloud() {

    }

    drawBackground() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        this.ctx.fillStyle = this.colors[0];
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}