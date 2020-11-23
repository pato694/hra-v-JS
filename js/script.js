var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// Načtení obrázků
var stork = new Image();
var background = new Image();
var foreground = new Image();
var pipe_up = new Image();
var pipe_down = new Image();
stork.src = "images/cap.png";
background.src = "images/background.png";
foreground.src = "images/foreground.png";
pipe_up.src = "images/pipe_up.png";
pipe_down.src = "images/pipe_down.png";

// Proměnné
var gap = 150;
var constant;
var sX = 10;
var sY = 150;
var gravity = 2.5;
var score = 0;
var speed = 4;

// Když uživatel stiskne jakkoukoliv klávesu tak se čáp posune nahoru o 50 px.
document.addEventListener("keydown", moveUp);
function moveUp() {
    sY -= 50;
}

var pipe = [];
pipe[0] = {
    x: cvs.width,
    y: 0

}

// Změní obrázek na dynamický, bude se do nekonečna pomalu opakovat
var width = cvs.width;
var height = cvs.height;
var animace = {
    x: 0,
    mx: 1000,
    width: 1000,
    height: 400,
    image: new Image(),
    src: "images/background.png",
    paintBackground: function () {
        this.image.src = "images/background.png";
        ctx.drawImage(this.image, this.x, 0, this.width, this.height);
        ctx.drawImage(this.image, this.mx, 0, this.width, this.height);
        this.spawnHill();
    },
    animate: function () {
        this.x--;
        this.mx--;
    },
    spawnHill: function () {
        if (this.x <= -this.width)
            this.x = 1000;
        if (this.mx <= -this.width)
            this.mx = 1000;
    }
}

// Vykreslení obrazů
function draw() {
    animace.paintBackground();
    for (var i = 0; i < pipe.length; i++) {
        constant = pipe_up.height + gap;
        ctx.drawImage(pipe_up, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipe_down, pipe[i].x, pipe[i].y + constant);

        pipe[i].x -= speed;
        if (pipe[i].x == width - 400) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipe_up.height) - pipe_up.height
            });
        }
        // Pokud se detekuje kolize, stránka se obnoví (reloadne)
        if (sX + stork.width >= pipe[i].x && sX <= pipe[i].x + pipe_up.width && (sY <= pipe[i].y + pipe_up.height || sY + stork.height >= pipe[i].y + constant) || sY + stork.height >= cvs.height - foreground.height) {
            location.reload();
        }
        // Pokud čáp trubkou proletí, přičte se bod
        if (pipe[i].x == 0) {
            score++;
        }
    }
    if (sY <= 0)
        sY = 0;
    ctx.drawImage(foreground, 0, cvs.height - foreground.height, width, foreground.height);
    ctx.drawImage(stork, sX, sY);

    sY += gravity;

    // Barva, font, velikost a umístění nápisu Score:
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Coiny";
    ctx.fillText("Score: " + score, 10, height - 475);
    animace.animate();
    requestAnimationFrame(draw);
}
draw();