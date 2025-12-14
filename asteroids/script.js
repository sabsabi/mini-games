// Game Configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game State
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
let score = 0;
let highScore = parseInt(localStorage.getItem('asteroidsHighScore')) || 0;
let level = 1;
let lives = 3;

// Game Objects
let ship;
let asteroids = [];
let bullets = [];
let particles = [];
let ufo = null;
let ufoBullets = [];

// Input
const keys = {};

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Ship Class
class Ship {
    constructor() {
        this.x = WIDTH / 2;
        this.y = HEIGHT / 2;
        this.angle = -Math.PI / 2; // Point upward
        this.velocity = { x: 0, y: 0 };
        this.radius = 15;
        this.thrust = 0.15;
        this.turnSpeed = 0.08;
        this.friction = 0.98;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.maxInvulnerableTime = 120; // 2 seconds at 60fps
    }

    update() {
        // Rotation
        if (keys['ArrowLeft']) {
            this.angle -= this.turnSpeed;
        }
        if (keys['ArrowRight']) {
            this.angle += this.turnSpeed;
        }

        // Thrust
        if (keys['ArrowUp']) {
            this.velocity.x += Math.cos(this.angle) * this.thrust;
            this.velocity.y += Math.sin(this.angle) * this.thrust;

            // Create thrust particles
            if (Math.random() < 0.3) {
                particles.push(new Particle(
                    this.x - Math.cos(this.angle) * this.radius,
                    this.y - Math.sin(this.angle) * this.radius,
                    -Math.cos(this.angle) * 2 + (Math.random() - 0.5),
                    -Math.sin(this.angle) * 2 + (Math.random() - 0.5),
                    20
                ));
            }
        }

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Screen wrapping
        if (this.x < 0) this.x = WIDTH;
        if (this.x > WIDTH) this.x = 0;
        if (this.y < 0) this.y = HEIGHT;
        if (this.y > HEIGHT) this.y = 0;

        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerableTime++;
            if (this.invulnerableTime > this.maxInvulnerableTime) {
                this.invulnerable = false;
                this.invulnerableTime = 0;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);

        // Draw ship outline (triangle)
        ctx.strokeStyle = this.invulnerable && Math.floor(this.invulnerableTime / 10) % 2 ?
            'rgba(255, 255, 255, 0.3)' : '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius * 0.8, this.radius);
        ctx.lineTo(0, this.radius * 0.6);
        ctx.lineTo(-this.radius * 0.8, this.radius);
        ctx.closePath();
        ctx.stroke();

        // Draw thrust flame
        if (keys['ArrowUp']) {
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(0, this.radius);
            ctx.lineTo(-3, this.radius + 8);
            ctx.lineTo(0, this.radius + 5);
            ctx.lineTo(3, this.radius + 8);
            ctx.stroke();
        }

        ctx.restore();
    }

    shoot() {
        bullets.push(new Bullet(
            this.x + Math.cos(this.angle) * this.radius,
            this.y + Math.sin(this.angle) * this.radius,
            this.angle
        ));
        playSound('shoot');
    }

    reset() {
        this.x = WIDTH / 2;
        this.y = HEIGHT / 2;
        this.velocity = { x: 0, y: 0 };
        this.angle = -Math.PI / 2;
        this.invulnerable = true;
        this.invulnerableTime = 0;
    }
}

// Asteroid Class
class Asteroid {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size; // 'large', 'medium', 'small'

        // Size configurations
        const sizeConfig = {
            'large': { radius: 40, points: 100, speed: 1 },
            'medium': { radius: 25, points: 50, speed: 1.5 },
            'small': { radius: 15, points: 20, speed: 2 }
        };

        this.config = sizeConfig[size];
        this.radius = this.config.radius;
        this.points = this.config.points;

        // Random velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = this.config.speed + Math.random() * 0.5;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        // Random rotation
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.04;

        // Generate irregular shape
        this.shape = this.generateShape();
    }

    generateShape() {
        const points = 8 + Math.floor(Math.random() * 4);
        const shape = [];
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const distance = this.radius * (0.7 + Math.random() * 0.3);
            shape.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            });
        }
        return shape;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;

        // Screen wrapping
        if (this.x < -this.radius) this.x = WIDTH + this.radius;
        if (this.x > WIDTH + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = HEIGHT + this.radius;
        if (this.y > HEIGHT + this.radius) this.y = -this.radius;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.shape.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }

    split() {
        const newAsteroids = [];
        if (this.size === 'large') {
            for (let i = 0; i < 2; i++) {
                newAsteroids.push(new Asteroid(this.x, this.y, 'medium'));
            }
        } else if (this.size === 'medium') {
            for (let i = 0; i < 2; i++) {
                newAsteroids.push(new Asteroid(this.x, this.y, 'small'));
            }
        }
        return newAsteroids;
    }
}

// Bullet Class
class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 7;
        this.velocity = {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };
        this.life = 60; // Bullets last 1 second
        this.radius = 2;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;

        // Screen wrapping
        if (this.x < 0) this.x = WIDTH;
        if (this.x > WIDTH) this.x = 0;
        if (this.y < 0) this.y = HEIGHT;
        if (this.y > HEIGHT) this.y = 0;
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    isDead() {
        return this.life <= 0;
    }
}

// UFO Class
class UFO {
    constructor() {
        this.x = Math.random() < 0.5 ? -30 : WIDTH + 30;
        this.y = Math.random() * HEIGHT;
        this.velocity = {
            x: this.x < 0 ? 2 : -2,
            y: (Math.random() - 0.5) * 2
        };
        this.radius = 20;
        this.shootTimer = 0;
        this.shootInterval = 60 + Math.floor(Math.random() * 60);
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Random direction changes
        if (Math.random() < 0.02) {
            this.velocity.y = (Math.random() - 0.5) * 3;
        }

        // Shoot at player
        this.shootTimer++;
        if (this.shootTimer > this.shootInterval && ship) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Screen wrapping
        if (this.y < 0) this.y = HEIGHT;
        if (this.y > HEIGHT) this.y = 0;
    }

    draw() {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // Draw UFO body
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw dome
        ctx.beginPath();
        ctx.ellipse(this.x, this.y - 5, this.radius * 0.5, this.radius * 0.3, 0, 0, Math.PI, true);
        ctx.stroke();
    }

    shoot() {
        const angle = Math.atan2(ship.y - this.y, ship.x - this.x) + (Math.random() - 0.5) * 0.3;
        ufoBullets.push(new Bullet(this.x, this.y, angle));
        playSound('ufoShoot');
    }

    isOffScreen() {
        return this.x < -50 || this.x > WIDTH + 50;
    }
}

// Particle Class for explosions
class Particle {
    constructor(x, y, vx, vy, life) {
        this.x = x;
        this.y = y;
        this.velocity = { x: vx, y: vy };
        this.life = life;
        this.maxLife = life;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(this.x, this.y, 2, 2);
    }

    isDead() {
        return this.life <= 0;
    }
}

// Collision Detection
function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + obj2.radius;
}

// Create Explosion
function createExplosion(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            30 + Math.floor(Math.random() * 20)
        ));
    }
}

// Sound Functions
function playSound(type) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    switch(type) {
        case 'shoot':
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
            break;
        case 'explosion':
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 100;
            gainNode.gain.value = 0.2;
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            break;
        case 'ufoShoot':
            oscillator.frequency.value = 300;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
            break;
        case 'thrust':
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 50;
            gainNode.gain.value = 0.05;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
            break;
    }
}

// Initialize Level
function initLevel() {
    asteroids = [];
    bullets = [];
    ufoBullets = [];
    ufo = null;

    // Create asteroids based on level
    const asteroidCount = 3 + level;
    for (let i = 0; i < asteroidCount; i++) {
        let x, y;
        // Spawn away from center
        do {
            x = Math.random() * WIDTH;
            y = Math.random() * HEIGHT;
        } while (Math.abs(x - WIDTH / 2) < 150 && Math.abs(y - HEIGHT / 2) < 150);

        asteroids.push(new Asteroid(x, y, 'large'));
    }

    if (ship) {
        ship.reset();
    }
}

// Initialize Game
function initGame() {
    ship = new Ship();
    score = 0;
    level = 1;
    lives = 3;
    particles = [];
    initLevel();
    updateUI();
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lives').textContent = lives;
    document.getElementById('highScore').textContent = highScore;
}

// Game Loop
function gameLoop() {
    if (gameState === 'playing') {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Update Game State
function update() {
    // Update ship
    ship.update();

    // Update asteroids
    asteroids.forEach(asteroid => asteroid.update());

    // Update bullets
    bullets.forEach(bullet => bullet.update());
    bullets = bullets.filter(bullet => !bullet.isDead());

    // Update UFO
    if (ufo) {
        ufo.update();
        if (ufo.isOffScreen()) {
            ufo = null;
        }
    } else if (Math.random() < 0.001 * level) {
        ufo = new UFO();
    }

    // Update UFO bullets
    ufoBullets.forEach(bullet => bullet.update());
    ufoBullets = ufoBullets.filter(bullet => !bullet.isDead());

    // Update particles
    particles.forEach(particle => particle.update());
    particles = particles.filter(particle => !particle.isDead());

    // Collision detection: bullets vs asteroids
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], asteroids[j])) {
                // Create explosion
                createExplosion(asteroids[j].x, asteroids[j].y);
                playSound('explosion');

                // Update score
                score += asteroids[j].points;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('asteroidsHighScore', highScore);
                }

                // Split asteroid
                const newAsteroids = asteroids[j].split();
                asteroids.splice(j, 1);
                asteroids.push(...newAsteroids);

                // Remove bullet
                bullets.splice(i, 1);
                updateUI();
                break;
            }
        }
    }

    // Collision detection: ship vs asteroids
    if (!ship.invulnerable) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            if (checkCollision(ship, asteroids[i])) {
                createExplosion(ship.x, ship.y, 25);
                playSound('explosion');
                lives--;
                updateUI();

                if (lives <= 0) {
                    gameOver();
                } else {
                    ship.reset();
                }
                break;
            }
        }
    }

    // Collision detection: bullets vs UFO
    if (ufo) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (checkCollision(bullets[i], ufo)) {
                createExplosion(ufo.x, ufo.y);
                playSound('explosion');
                score += 200;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('asteroidsHighScore', highScore);
                }
                updateUI();
                ufo = null;
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // Collision detection: ship vs UFO bullets
    if (!ship.invulnerable) {
        for (let i = ufoBullets.length - 1; i >= 0; i--) {
            if (checkCollision(ship, ufoBullets[i])) {
                createExplosion(ship.x, ship.y, 25);
                playSound('explosion');
                lives--;
                updateUI();
                ufoBullets.splice(i, 1);

                if (lives <= 0) {
                    gameOver();
                } else {
                    ship.reset();
                }
                break;
            }
        }
    }

    // Check for level completion
    if (asteroids.length === 0) {
        level++;
        updateUI();
        initLevel();
    }
}

// Draw Everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (gameState === 'playing' || gameState === 'paused') {
        // Draw all game objects
        asteroids.forEach(asteroid => asteroid.draw());
        bullets.forEach(bullet => bullet.draw());
        ufoBullets.forEach(bullet => bullet.draw());
        particles.forEach(particle => particle.draw());
        if (ufo) ufo.draw();
        if (ship) ship.draw();

        // Draw pause text
        if (gameState === 'paused') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '48px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', WIDTH / 2, HEIGHT / 2);
        }
    }
}

// Game Over
function gameOver() {
    gameState = 'gameOver';
    showOverlay('GAME OVER', `Final Score: ${score}<br>Press SPACE to Restart`);
}

// Show/Hide Overlay
function showOverlay(title, message) {
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlayMessage').innerHTML = message;
    document.getElementById('gameOverlay').classList.remove('hidden');
}

function hideOverlay() {
    document.getElementById('gameOverlay').classList.add('hidden');
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Prevent arrow key scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    // Shoot
    if (e.key === ' ' && gameState === 'playing') {
        ship.shoot();
    }

    // Start game
    if (e.key === ' ' && (gameState === 'start' || gameState === 'gameOver')) {
        hideOverlay();
        initGame();
        gameState = 'playing';
    }

    // Pause
    if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
            gameState = 'paused';
        } else if (gameState === 'paused') {
            gameState = 'playing';
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Initialize
updateUI();
showOverlay('ASTEROIDS', 'Press SPACE to Start');
gameLoop();
