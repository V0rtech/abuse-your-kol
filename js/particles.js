class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = (Math.random() - 0.5) * 20 - 8;
        this.color = color;
        this.life = 80;
        this.maxLife = 80;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.5;
        this.vx *= 0.98;
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class FlameParticle extends Particle {
    constructor(x, y, dirX, dirY) {
        super(x, y, ['#ff4500', '#ff6600', '#ff8800', '#ffaa00'][Math.floor(Math.random() * 4)]);
        const speed = Math.random() * 15 + 8;
        this.vx = dirX * speed + (Math.random() - 0.5) * 8;
        this.vy = dirY * speed + (Math.random() - 0.5) * 8;
        this.life = 40;
        this.maxLife = 40;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life--;
    }
}

class LaserBeam {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.life = 25;
        this.maxLife = 25;
    }

    update() {
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.restore();
    }
}

// In particles.js, replace the existing HomingMissile class

class HomingMissile {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.vx = 2;
        this.vy = 0;
        this.life = 300;
        this.type = 'missile';
        // --- UPDATED VALUES ---
        this.speed = 7;     // Increased from 4 to 7 for more speed
        this.scale = 1.5;   // A 50% size increase
    }

    update() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.vx += (dx / distance) * 0.3;
            this.vy += (dy / distance) * 0.3;
        }
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.speed) {
            this.vx = (this.vx / speed) * this.speed;
            this.vy = (this.vy / speed) * this.speed;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        // Translate context to rotate the missile towards its direction of travel
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(this.vy, this.vx));

        // Missile Body (scaled)
        ctx.fillStyle = '#808080'; // A lighter grey
        ctx.fillRect(-10 * this.scale, -4 * this.scale, 20 * this.scale, 8 * this.scale);
        
        // Missile Tip (scaled)
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.moveTo(10 * this.scale, 0);
        ctx.lineTo(15 * this.scale, -3 * this.scale);
        ctx.lineTo(15 * this.scale, 3 * this.scale);
        ctx.fill();
        
        // Fins (scaled)
        ctx.fillStyle = '#c0392b'; // Red fins
        ctx.fillRect(-12 * this.scale, -6 * this.scale, 4 * this.scale, 12 * this.scale);
        ctx.fillRect(-8 * this.scale, -8 * this.scale, 10 * this.scale, 2 * this.scale);
        ctx.fillRect(-8 * this.scale, 6 * this.scale, 10 * this.scale, 2 * this.scale);

        ctx.restore();

        // Exhaust trail (no rotation needed for this)
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = i < 3 ? '#ff6600' : '#ffaa00';
            ctx.beginPath();
            // Spawn trail behind the missile based on its velocity
            const trailX = this.x - this.vx * (i + 2);
            const trailY = this.y - this.vy * (i + 2);
            ctx.arc(trailX + (Math.random() - 0.5) * 5, trailY + (Math.random() - 0.5) * 5, (3 - i * 0.3) * this.scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    checkCollision(buddy) {
        for (let part of buddy.parts) {
            const dx = this.x - part.x;
            const dy = this.y - part.y;
            if (dx * dx + dy * dy <= (part.radius + (15 * this.scale)) * (part.radius + (15 * this.scale))) {
                return true;
            }
        }
        return false;
    }
}

class LightningBolt {
    constructor(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.life = 15; 
        this.maxLife = 15;
        this.segments = [];
        let currentY = 0;
        let currentX = targetX;
        while (currentY < targetY) {
            let nextX = currentX + (Math.random() - 0.5) * 30;
            let nextY = currentY + Math.random() * 20 + 5;
            if (nextY > targetY) nextY = targetY;
            this.segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
            currentX = nextX;
            currentY = nextY;
        }
    }

    update() {
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 200, ${0.5 * (this.life / this.maxLife)})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        this.segments.forEach(seg => {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
        ctx.restore();
    }
}

class Grenade {
    constructor(x, y, vx, vy, canvas) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.canvas = canvas;
        this.life = 90;
        this.type = 'grenade';
        this.radius = 8;
        this.bounce = 0.6;
        this.friction = 0.9;
    }

    update() {
        this.vy += 0.5;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        if (this.y > this.canvas.height - this.radius) {
            this.y = this.canvas.height - this.radius;
            this.vy *= -this.bounce;
            this.vx *= this.friction;
        }
        if (this.x < this.radius || this.x > this.canvas.width - this.radius) {
            this.vx *= -this.bounce;
            this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d63031';
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.radius * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class SolanaProjectile {
    constructor(x, y, vx, vy, canvas, image) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.canvas = canvas;
        this.image = image;
        this.life = 120;
        this.type = 'solana';
        this.size = 32;
        this.bounce = 0.5;
        this.friction = 0.95;
        this.angle = 0;
    }

    update() {
        this.vy += 0.5;
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.vx * 0.05;
        this.life--;
        const radius = this.size / 2;
        if (this.y > this.canvas.height - radius) {
            this.y = this.canvas.height - radius;
            this.vy *= -this.bounce;
            this.vx *= this.friction;
        }
        if (this.x < radius || this.x > this.canvas.width - radius) {
            this.vx *= -this.bounce;
            this.x = Math.max(radius, Math.min(this.canvas.width - radius, this.x));
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.image && this.image.complete) {
            const aspectRatio = this.image.naturalWidth / this.image.naturalHeight;
            const drawWidth = this.size;
            const drawHeight = this.size / aspectRatio;
            ctx.drawImage(this.image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        }
        ctx.restore();
    }
}

class Flash {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size || 250; 
        this.life = 10;
        this.maxLife = this.life;
    }

    update() {
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        const lifePercent = Math.max(0, this.life / this.maxLife);
        const radius = this.size * (1 - lifePercent);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 220, ${0.8 * lifePercent})`);
        gradient.addColorStop(0.5, `rgba(255, 200, 100, ${0.4 * lifePercent})`);
        gradient.addColorStop(1, `rgba(255, 150, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - radius, this.y - radius, radius * 2, radius * 2);
        ctx.restore();
    }
}

class ExplosionParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = Math.random() > 0.4 ? 'fire' : 'smoke';

        const angle = Math.random() * Math.PI * 2;
        if (this.type === 'fire') {
            const speed = Math.random() * 12 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = Math.random() * 40 + 20;
            this.radius = Math.random() * 5 + 3;
            this.gravity = 0.3;
            this.drag = 0.95;
        } else { // Smoke
            const speed = Math.random() * 4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = Math.random() * 70 + 50;
            this.radius = Math.random() * 10 + 8;
            this.gravity = -0.1;
            this.drag = 0.98;
        }
        this.maxLife = this.life;
    }

    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        const lifePercent = Math.max(0, this.life / this.maxLife);
        ctx.globalAlpha = lifePercent;

        if (this.type === 'fire') {
            const size = this.radius * lifePercent;
            const g = Math.floor(200 * lifePercent);
            ctx.fillStyle = `rgb(255, ${g}, 0)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        } else { // Smoke
            const size = this.radius * (1.5 - lifePercent);
            const lightness = Math.floor(60 * lifePercent);
            ctx.fillStyle = `rgba(${lightness}, ${lightness}, ${lightness}, 0.6)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
