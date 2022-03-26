class Cloud
{
    constructor(x, y, canvas, ctx) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = ctx;
        this.image = new Image();
        this.random = Math.round(Math.random() * 100) / 100;
        
        if (this.random < 0.15) this.random = 0.15;
    }
    loadImage() {
        this.image.src = "./sprites/little_cloud.png";
        return (this);
    }
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.image.width * this.random, this.image.height * this.random);
    }
}
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
        this.clouds = [];
    }

    init() {
        this.drawBackground();
        document.addEventListener("keydown", this.keyboardEvent.bind(this));
        window.addEventListener("resize", () => {
            if (!this.loop || this.pause) this.drawBackground();
        });
        this.buttons.start.addEventListener("click", this.startGame.bind(this));
        this.buttons.resume.addEventListener("click", this.togglePause.bind(this));
        this.spawnCloud();
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
            
            this.drawCloud();
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }, 1000 / this.options.fps);
    }

    spawnCloud() {
        this.clouds.push(new Cloud(0, 0, this.canvas, this.ctx).loadImage());
    }

    drawCloud() {
        this.clouds.forEach((cloud)=>{
            cloud.draw();
        });
    }

    drawBackground() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        this.ctx.fillStyle = this.colors[0];
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}