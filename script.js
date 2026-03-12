const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const player = {
    x: 200,
    y: 550,
    w: 20,
    h: 20,
    vx: 0,
    vy: 0,
    onGround: false
};

const gravity = 0.5;
const friction = 0.8;
let platforms = [];
let score = 0;
let cameraY = 0;

function initPlatforms() {
    platforms = [{ x: 0, y: 580, w: 400, h: 20 }];
    for (let i = 1; i < 7; i++) {
        addPlatform(600 - i * 100);
    }
}

function addPlatform(y) {
    const w = 80 + Math.random() * 50;
    const x = Math.random() * (canvas.width - w);
    platforms.push({ x, y, w, h: 15 });
}

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function update() {
    if (keys['ArrowLeft']) player.vx -= 0.8;
    if (keys['ArrowRight']) player.vx += 0.8;
    if (keys['ArrowUp'] && player.onGround) {
        player.vy = -12;
        player.onGround = false;
    }

    player.vy += gravity;
    player.vx *= friction;
    player.x += player.vx;
    player.y += player.vy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

    player.onGround = false;
    platforms.forEach(p => {
        if (player.vy > 0 &&
            player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y + player.h > p.y &&
            player.y + player.h < p.y + p.h + player.vy) {
            player.y = p.y - player.h;
            player.vy = 0;
            player.onGround = true;
        }
    });

    if (player.y < 300) {
        let diff = 300 - player.y;
        cameraY += diff;
        player.y = 300;
        platforms.forEach(p => p.y += diff);
        score += Math.floor(diff);
        scoreEl.textContent = score;
    }

    platforms = platforms.filter(p => p.y < 600);
    while (platforms.length < 7) {
        const highest = Math.min(...platforms.map(p => p.y));
        addPlatform(highest - 100);
    }

    if (player.y > 600) {
        alert("Game Over! Score: " + score);
        location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = '#10b981';
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

    update();
    requestAnimationFrame(draw);
}

initPlatforms();
draw();