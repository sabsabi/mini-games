// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game state
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver', 'levelComplete'
let score = 0;
let highScore = localStorage.getItem('spaceInvadersHighScore') || 0;
let lives = 3;
let level = 1;
let animationFrameId;

// Game objects
let player;
let aliens = [];
let bunkers = [];
let bullets = [];
let alienBullets = [];
let ufo = null;
let particles = [];

// Game settings
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ALIEN_BULLET_SPEED = 4;
const INITIAL_ALIEN_SPEED = 0.5;
let alienSpeed = INITIAL_ALIEN_SPEED;
let alienDirection = 1; // 1 for right, -1 for left
let alienDropDistance = 20;
let lastAlienShot = 0;
let alienShootInterval = 1000; // ms
let ufoSpawnTimer = 0;
const UFO_SPAWN_INTERVAL = 15000; // 15 seconds

// Input handling
const keys = {};
let canShoot = true;

// Audio context for sound effects
let audioContext;
let sounds = {};

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create sound effects
        sounds.shoot = () => playTone(200, 0.1, 'square');
        sounds.alienShoot = () => playTone(150, 0.15, 'sawtooth');
        sounds.explosion = () => playTone(100, 0.2, 'sawtooth');
        sounds.ufoSound = () => playTone(300, 0.1, 'sine');
        sounds.alienMove = () => playTone(80, 0.05, 'square');
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playTone(frequency, duration, type = 'sine') {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Player class
class Player {
    constructor() {
        this.width = 40;
        this.height = 30;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 80;
        this.speed = PLAYER_SPEED;
    }

    draw() {
        ctx.fillStyle = '#fff';

        // Draw player ship (tank-like)
        // Base
        ctx.fillRect(this.x + 5, this.y + 20, 30, 10);
        // Turret
        ctx.fillRect(this.x + 15, this.y + 10, 10, 10);
        // Cannon
        ctx.fillRect(this.x + 18, this.y + 5, 4, 10);
    }

    move() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
    }

    shoot() {
        if (canShoot) {
            bullets.push(new Bullet(this.x + this.width / 2 - 2, this.y, -BULLET_SPEED));
            canShoot = false;
            sounds.shoot();
            setTimeout(() => canShoot = true, 300);
        }
    }
}

// Alien class
class Alien {
    constructor(x, y, type) {
        this.width = 32;
        this.height = 24;
        this.x = x;
        this.y = y;
        this.type = type; // 0, 1, or 2 for different alien types
        this.alive = true;
        this.animFrame = 0;
        this.points = [30, 20, 10][type];
    }

    draw() {
        if (!this.alive) return;

        ctx.fillStyle = '#0f0';

        const frame = Math.floor(Date.now() / 500) % 2;

        // Different alien designs based on type
        if (this.type === 0) {
            // Top row alien (squid)
            if (frame === 0) {
                ctx.fillRect(this.x + 8, this.y, 16, 8);
                ctx.fillRect(this.x, this.y + 8, 32, 8);
                ctx.fillRect(this.x + 4, this.y + 16, 4, 8);
                ctx.fillRect(this.x + 12, this.y + 16, 4, 8);
                ctx.fillRect(this.x + 20, this.y + 16, 4, 8);
                ctx.fillRect(this.x + 28, this.y + 16, 4, 8);
            } else {
                ctx.fillRect(this.x + 8, this.y, 16, 8);
                ctx.fillRect(this.x, this.y + 8, 32, 8);
                ctx.fillRect(this.x, this.y + 16, 4, 8);
                ctx.fillRect(this.x + 8, this.y + 16, 4, 8);
                ctx.fillRect(this.x + 20, this.y + 16, 4, 8);
                ctx.fillRect(this.x + 28, this.y + 16, 4, 8);
            }
        } else if (this.type === 1) {
            // Middle rows alien (crab)
            if (frame === 0) {
                ctx.fillRect(this.x + 4, this.y, 4, 4);
                ctx.fillRect(this.x + 24, this.y, 4, 4);
                ctx.fillRect(this.x + 4, this.y + 4, 24, 8);
                ctx.fillRect(this.x, this.y + 12, 32, 8);
                ctx.fillRect(this.x + 8, this.y + 20, 4, 4);
                ctx.fillRect(this.x + 20, this.y + 20, 4, 4);
            } else {
                ctx.fillRect(this.x + 4, this.y, 4, 4);
                ctx.fillRect(this.x + 24, this.y, 4, 4);
                ctx.fillRect(this.x + 4, this.y + 4, 24, 8);
                ctx.fillRect(this.x, this.y + 12, 32, 8);
                ctx.fillRect(this.x + 4, this.y + 20, 4, 4);
                ctx.fillRect(this.x + 24, this.y + 20, 4, 4);
            }
        } else {
            // Bottom rows alien (octopus)
            if (frame === 0) {
                ctx.fillRect(this.x + 12, this.y, 8, 4);
                ctx.fillRect(this.x + 8, this.y + 4, 16, 12);
                ctx.fillRect(this.x, this.y + 16, 8, 8);
                ctx.fillRect(this.x + 24, this.y + 16, 8, 8);
            } else {
                ctx.fillRect(this.x + 12, this.y, 8, 4);
                ctx.fillRect(this.x + 8, this.y + 4, 16, 12);
                ctx.fillRect(this.x + 4, this.y + 16, 8, 8);
                ctx.fillRect(this.x + 20, this.y + 16, 8, 8);
            }
        }
    }
}

// Bullet class
class Bullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 12;
        this.speed = speed;
        this.active = true;
    }

    update() {
        this.y += this.speed;

        // Remove if off screen
        if (this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Bunker class
class Bunker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 60;
        this.blocks = [];

        // Create bunker pattern (dome shape)
        this.initBlocks();
    }

    initBlocks() {
        const blockSize = 4;
        const pattern = [
            '    ########    ',
            '  ##########  ',
            ' ############ ',
            '##############',
            '##############',
            '##############',
            '###        ###',
            '###        ###',
        ];

        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === '#') {
                    this.blocks.push({
                        x: this.x + col * blockSize,
                        y: this.y + row * blockSize,
                        width: blockSize,
                        height: blockSize,
                        health: 3
                    });
                }
            }
        }
    }

    draw() {
        this.blocks.forEach(block => {
            if (block.health > 0) {
                // Color based on health
                const colors = ['#ff0000', '#ff6666', '#ff9999'];
                ctx.fillStyle = colors[block.health - 1];
                ctx.fillRect(block.x, block.y, block.width, block.height);
            }
        });
    }

    checkCollision(bullet) {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            if (block.health > 0 &&
                bullet.x < block.x + block.width &&
                bullet.x + bullet.width > block.x &&
                bullet.y < block.y + block.height &&
                bullet.y + bullet.height > block.y) {

                block.health--;
                bullet.active = false;
                return true;
            }
        }
        return false;
    }
}

// UFO class
class UFO {
    constructor() {
        this.width = 48;
        this.height = 24;
        this.x = -this.width;
        this.y = 60;
        this.speed = 2;
        this.points = [50, 100, 150][Math.floor(Math.random() * 3)];
        this.alive = true;
    }

    update() {
        this.x += this.speed;

        // Remove if off screen
        if (this.x > canvas.width) {
            this.alive = false;
        }
    }

    draw() {
        if (!this.alive) return;

        ctx.fillStyle = '#f00';

        // Draw UFO
        ctx.fillRect(this.x + 8, this.y, 32, 8);
        ctx.fillRect(this.x, this.y + 8, 48, 12);
        ctx.fillRect(this.x + 12, this.y + 20, 8, 4);
        ctx.fillRect(this.x + 28, this.y + 20, 8, 4);
    }
}

// Particle class for explosions
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 30;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 30;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.globalAlpha = 1;
    }
}

// Initialize new game (resets everything)
function initNewGame() {
    score = 0;
    lives = 3;
    level = 1;
    initLevel();
}

// Initialize level (keeps score and lives)
function initLevel() {
    // Clear keys to fix control bug
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });

    player = new Player();
    aliens = [];
    bunkers = [];
    bullets = [];
    alienBullets = [];
    ufo = null;
    particles = [];

    // Increase base alien speed with each level
    alienSpeed = INITIAL_ALIEN_SPEED + (level - 1) * 0.3;
    alienDirection = 1;
    ufoSpawnTimer = 0;

    // Create aliens (5 rows, 11 per row)
    const alienRows = 5;
    const aliensPerRow = 11;
    const startX = 100;
    const startY = 80;
    const spacingX = 50;
    const spacingY = 45;

    for (let row = 0; row < alienRows; row++) {
        for (let col = 0; col < aliensPerRow; col++) {
            const type = row < 1 ? 0 : row < 3 ? 1 : 2;
            aliens.push(new Alien(
                startX + col * spacingX,
                startY + row * spacingY,
                type
            ));
        }
    }

    // Create bunkers
    const bunkerY = canvas.height - 150;
    const bunkerSpacing = 200;
    const bunkerStartX = 100;

    for (let i = 0; i < 4; i++) {
        bunkers.push(new Bunker(bunkerStartX + i * bunkerSpacing, bunkerY));
    }

    updateUI();
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = String(score).padStart(4, '0');
    document.getElementById('highScore').textContent = String(highScore).padStart(4, '0');
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = level;
}

// Move aliens
function moveAliens() {
    let shouldDrop = false;

    // Check if any alien hit the edge
    aliens.forEach(alien => {
        if (!alien.alive) return;

        const nextX = alien.x + alienSpeed * alienDirection;
        if (nextX <= 0 || nextX + alien.width >= canvas.width) {
            shouldDrop = true;
        }
    });

    // Drop and reverse direction
    if (shouldDrop) {
        alienDirection *= -1;
        aliens.forEach(alien => {
            alien.y += alienDropDistance;
        });
        sounds.alienMove();
    } else {
        // Move horizontally
        aliens.forEach(alien => {
            alien.x += alienSpeed * alienDirection;
        });
    }

    // Check if aliens reached the bottom
    aliens.forEach(alien => {
        if (alien.alive && alien.y + alien.height > canvas.height - 100) {
            gameOver();
        }
    });
}

// Alien shooting
function alienShoot() {
    const now = Date.now();
    if (now - lastAlienShot > alienShootInterval) {
        // Find bottom-most alien in a random column
        const aliveAliens = aliens.filter(a => a.alive);
        if (aliveAliens.length === 0) return;

        const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        alienBullets.push(new Bullet(
            shooter.x + shooter.width / 2 - 2,
            shooter.y + shooter.height,
            ALIEN_BULLET_SPEED
        ));

        sounds.alienShoot();
        lastAlienShot = now;
    }
}

// Spawn UFO
function spawnUFO() {
    if (!ufo && Math.random() < 0.001) {
        ufo = new UFO();
        sounds.ufoSound();
    }
}

// Create explosion particles
function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Check collisions
function checkCollisions() {
    // Player bullets vs aliens
    bullets.forEach(bullet => {
        if (!bullet.active) return;

        aliens.forEach(alien => {
            if (!alien.alive) return;

            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {

                alien.alive = false;
                bullet.active = false;
                score += alien.points;

                createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2, '#0f0');
                sounds.explosion();

                // Update high score
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('spaceInvadersHighScore', highScore);
                }

                updateUI();

                // Increase alien speed
                const aliveCount = aliens.filter(a => a.alive).length;
                alienSpeed = INITIAL_ALIEN_SPEED + (level - 1) * 0.3 + (55 - aliveCount) * 0.02;

                // Check win condition
                if (aliveCount === 0) {
                    setTimeout(() => {
                        levelComplete();
                    }, 500);
                }
            }
        });
    });

    // Player bullets vs UFO
    if (ufo && ufo.alive) {
        bullets.forEach(bullet => {
            if (!bullet.active) return;

            if (bullet.x < ufo.x + ufo.width &&
                bullet.x + bullet.width > ufo.x &&
                bullet.y < ufo.y + ufo.height &&
                bullet.y + bullet.height > ufo.y) {

                ufo.alive = false;
                bullet.active = false;
                score += ufo.points;

                createExplosion(ufo.x + ufo.width / 2, ufo.y + ufo.height / 2, '#f00');
                sounds.explosion();

                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('spaceInvadersHighScore', highScore);
                }

                updateUI();
            }
        });
    }

    // Bullets vs bunkers
    [...bullets, ...alienBullets].forEach(bullet => {
        if (!bullet.active) return;
        bunkers.forEach(bunker => {
            bunker.checkCollision(bullet);
        });
    });

    // Alien bullets vs player
    alienBullets.forEach(bullet => {
        if (!bullet.active) return;

        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {

            bullet.active = false;
            lives--;

            createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#fff');
            sounds.explosion();

            updateUI();

            if (lives <= 0) {
                gameOver();
            } else {
                // Reset player position
                player.x = canvas.width / 2 - player.width / 2;
            }
        }
    });
}

// Game over
function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = String(score).padStart(4, '0');
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Level complete
function levelComplete() {
    gameState = 'levelComplete';
    document.getElementById('levelScore').textContent = String(score).padStart(4, '0');
    document.getElementById('nextLevel').textContent = level + 1;
    document.getElementById('levelCompleteScreen').classList.remove('hidden');
}

// Game loop
function gameLoop() {
    if (gameState !== 'playing') return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw player
    player.move();
    player.draw();

    // Move aliens
    moveAliens();

    // Alien shooting
    alienShoot();

    // Spawn and update UFO
    spawnUFO();
    if (ufo) {
        ufo.update();
        ufo.draw();
        if (!ufo.alive) ufo = null;
    }

    // Update and draw bullets
    bullets = bullets.filter(b => {
        b.update();
        b.draw();
        return b.active;
    });

    alienBullets = alienBullets.filter(b => {
        b.update();
        b.draw();
        return b.active;
    });

    // Draw aliens
    aliens.forEach(alien => alien.draw());

    // Draw bunkers
    bunkers.forEach(bunker => bunker.draw());

    // Update and draw particles
    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.life > 0;
    });

    // Check collisions
    checkCollisions();

    // Continue loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ' && gameState === 'playing') {
        e.preventDefault();
        player.shoot();
    }

    if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
            gameState = 'paused';
            document.getElementById('pauseScreen').classList.remove('hidden');
        } else if (gameState === 'paused') {
            gameState = 'playing';
            document.getElementById('pauseScreen').classList.add('hidden');
            gameLoop();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('startButton').addEventListener('click', () => {
    initAudio();
    document.getElementById('startScreen').classList.add('hidden');
    initNewGame();
    gameState = 'playing';
    gameLoop();
});

document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('gameOverScreen').classList.add('hidden');
    initNewGame();
    gameState = 'playing';
    gameLoop();
});

document.getElementById('nextLevelButton').addEventListener('click', () => {
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    level++;
    initLevel();
    gameState = 'playing';
    gameLoop();
});

// Initialize
updateUI();
