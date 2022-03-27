function isInRect(x, y, x1, y1, x2, y2) {
    if (x >= x1 && x <= x2)
        if (y >= y1 && y <= y2)
            return (true);
    return (false);
}

class Cloud
{
    /**
     * Cloud constructor
     * @param {Game} game game class
     */
    constructor(game) {
        this.game = game;
        this.id = ++game._cloudsid;
        this.x = null;
        this.y = null;
        this.direction = null;
        this.timer = Date.now();
        this.image = new Image();
        this.randomSize = (Math.round(Math.random() * 100) / 100) - game.difficultyModifier;
        if (this.randomSize < 0.25) this.randomSize = 0.25;
        this.image.width = 600 * this.randomSize;
        this.image.height = 350 * this.randomSize;
    }

    init() {
        this.loadImage();
        this.direction = Math.random() >= 0.5 ? 1 : -1;
        if (this.direction == -1)
            this.x = this.game.canvas.width + Math.floor(Math.random() * this.image.width);
        else
            this.x = (this.image.width * -1) - Math.floor(Math.random() * this.image.width);
        this.y = Math.floor(Math.random() * (this.game.canvas.height - this.image.height));
        return (this);
    }

    loadImage() {
        this.image.src = "./sprites/little_cloud.png";
    }

    draw(ctx) {
        this.move();
        ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }

    move() {
        if ((Date.now() - this.timer) >= 20) {
            this.x += Math.floor((5 * this.direction) / this.randomSize);
            this.timer = Date.now();
        }
    }
}
class Game
{
    /**
     * Game constructor
     * @param {Object} options options
     */
    constructor(options) {
        this.canvas = document.getElementById(options.canvas);
        this.menu = {
            background: document.getElementById(options.menu_bg),
            zorotl: document.getElementById(options.zorotl)
        };
        this.pause = {
            isPause: false,
            background: document.getElementById(options.pause_bg)
        };
        this.end = {
            background: document.getElementById(options.end_bg),
            score: document.getElementById(options.score_span)
        };
        this.buttons = {
            start: document.getElementById(options.btn_start),
            resume: document.getElementById(options.btn_resume),
            restart: document.getElementsByClassName(options.btn_restart)
        };
        this.ctx = this.canvas.getContext('2d');
        this.font = null;
        this.isFontLoaded = false;
        this.loop = false;
        this.gameLoopTimeout = null;
        this.colors = [ "#acf5fb", "#75d5e3", "#cdf9ff", "#054c52" ];
        this.options = { fps: '120' };
        this.startDate = 0;
        this.lastSec = 0;
        this.difficultyModifier = 0;
        this.score = 0;
        this.clouds = [];
        this._cloudsid = 0;
    }

    init() {
        this.drawBackground();
        document.addEventListener("keydown", this.keyboardEvent.bind(this));
        window.addEventListener("resize", () => {
            if (!this.loop || this.pause) this.drawBackground();
        });
        this.canvas.addEventListener("click", this.clickEvent.bind(this));
        this.buttons.start.addEventListener("click", this.startGame.bind(this));
        this.buttons.resume.addEventListener("click", this.togglePause.bind(this));
        for (let i = 0; this.buttons.restart[i]; i++) {
            this.buttons.restart[i].addEventListener("click", this.startGame.bind(this));
        }
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

    clickEvent(evt) {
        evt.preventDefault();
        let mouse_pos = {
            x: evt.clientX,
            y: evt.clientY
        };
        for (let i in this.clouds) {
            let cloud = this.clouds[i];
            if (isInRect(mouse_pos.x, mouse_pos.y, cloud.x, cloud.y, cloud.x + cloud.image.width, cloud.y + cloud.image.height)) {
                this.cloudClick(cloud);
                break;
            }
        }
    }

    /**
     * Cloud click event
     * @param {Cloud} cloud cloud
     */
    cloudClick(cloud) {
        if (cloud.randomSize >= 0.6)
            this.score += 1;
        else if (cloud.randomSize >= 0.4)
            this.score += 2;
        else
            this.score += 3;
        this.killCloud(cloud);
        this.spawnCloud();
    }

    startGame(evt) {
        if(evt) evt.preventDefault();
        if (this.gameLoopTimeout) clearTimeout(this.gameLoopTimeout);
        this.end.background.style.display = "none";
        this.menu.background.style.display = "none";
        this.pause.background.style.display = "none";
        this.menu.zorotl.style.display = "none";
        this.score = 0;
        this.clouds = [];
        this.difficultyModifier = 0;
        this.lastSec = 0;
        this.loop = true;
        this.pause.isPause = false;
        this.startDate = Date.now();
        this.gameLoop();
        this.spawnCloud(2);
    }

    endGame() {
        this.loop = false;
        this.end.background.style.display = "flex";
        this.end.score.innerText = this.score; 
    }

    gameLoop() {
        if (!(this.loop && !this.pause.isPause)) return;
        this.gameLoopTimeout = setTimeout(() => {
            this.drawBackground();
            this.drawCloud();
            this.drawTexts();

            if (this.timeInSecs >= 60) {
                this.endGame();
                return;
            }

            if (this.lastSec != this.timeInSecs) {
                this.lastSec = this.timeInSecs;

                if (this.timeInSecs/4 == Math.round(this.timeInSecs/4)) {
                    this.spawnCloud();
                    console.log("cloud spawned");   
                }
                this.difficultyModifier += 0.01;
            }

            window.requestAnimationFrame(this.gameLoop.bind(this));
        }, 1000 / this.options.fps);
    }

    spawnCloud(count = 1) {
        for(let i = 0; i < count; i++)
            this.clouds.push(new Cloud(this).init());
    }

    /**
     * Kill a cloud
     * @param {Cloud} cloud cloud
     */
    killCloud(cloud) {
        this.clouds.splice(this.clouds.indexOf(cloud), 1);
    }

    drawTexts() {
        let _drawTxt = (s, x, y) => {
            this.ctx.font = "30px sans-serif";
            this.ctx.textBaseline = "top";
            this.ctx.fillStyle = this.colors[2];
            this.ctx.strokeStyle = this.colors[3];

            this.ctx.strokeText(s, x, y);
            this.ctx.fillText(s, x, y);
        };
        _drawTxt(`Time: ${60 - this.timeInSecs}`, 5, 5);
        _drawTxt(`Score: ${this.score}`, 5, 35);
    }

    drawCloud() {
        this.clouds.forEach((cloud) => {
            if ((cloud.direction == 1) && cloud.x >= this.canvas.width
            || ((cloud.direction == -1) && cloud.x <= (cloud.image.width * (-1)))) {
                this.killCloud(cloud);
                return;
            }
            cloud.draw(this.ctx);
        });
    }

    drawBackground() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        let gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.colors[0]);
        gradient.addColorStop(1, this.colors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    get timeInSecs() {
        return (Math.floor(this.time / 1000));
    }

    get time() {
        return (Date.now() - this.startDate);
    }
}