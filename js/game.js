// Game Configuration
const CONFIG = {
    speech: {
        hand: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        tickle: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        fist: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        baseball: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        brick: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        grenade: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        missile: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        laser: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        flamethrower: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        lightning: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        godfinger: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        solana: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        idle: ["I sold on your head lol", "I used you as EL", "Turn on notis for my text call", "Join my tg", "Do something!", "Hello?", "Wen launch"],
        happy: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"],
        hurt: ["I'm sorry I rugged you", "Please stop I'll refund", "Like and follow for ECA", "I love commiting crime on-chain", "Stop being a brokie", "WAGMI... SIKE", "I won't dump on you again", "I just nuked on your head", "Join my tg", "I'm such a fag", "I love dick, that's why I sold", "I rugged you to buy buttplugs"]
    }
};

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.money = 0;
        this.selectedTool = 'hand';
        this.currentSkin = 'default';
        this.currentMode = 'normal';
        this.currentBackground = 'default';
        this.ownedItems = new Set(['hand', 'default', 'normal', 'grenade', 'Orangie', 'TJR', 'Frank', 'Ansem', 'Thread Guy', 'Faze Banks', 'Logan Paul', 'Cupsey', 'jail', 'miami', 'dubai', 'casino', 'orangie']);
        
        this.skinImages = {};
        this.skinList = ['Orangie', 'TJR', 'Frank', 'Ansem', 'Thread Guy', 'Faze Banks', 'Logan Paul', 'Cupsey'];

        this.backgroundImages = {};
        this.backgroundList = ['jail', 'miami', 'dubai', 'casino'];

        this.orangieModeImages = {};

        this.speechTimeout = null;
        this.speechActive = false;
        
        this.buddy = new InteractiveBuddy(400, 300);
        this.particles = [];
        this.projectiles = [];
        this.draggedPart = null;
        this.dragOffset = {x: 0, y: 0};
        
        this.idleTimer = 0;
        this.lastInteraction = Date.now();
        
        this.uiManager = new UIManager(this);
        
        this.isMouseDown = false;
        this.mousePos = { x: 0, y: 0 };
        
        this.isAiming = false;
        this.aimStart = { x: 0, y: 0 };

        // Image assets
        this.solanaImage = new Image();
        this.fistImage = new Image();
        this.godFingerImage = new Image();

        // Effect properties
        this.screenShakeTime = 0;
        this.godFingerCooldown = false;

        this.preloadSkinImages();
        this.preloadBackgroundImages();
        this.preloadOrangieModeImages();
        
        this.solanaImage.src = 'assets/images/solana.png';
        this.fistImage.src = 'assets/images/fist.png';
        this.godFingerImage.src = 'assets/images/god_finger.png';
        
        this.resize();
        this.bindEvents();
        this.gameLoop();
        this.updateUI();
        window.game = this;
    }

    preloadSkinImages() {
        this.skinList.forEach(skinName => {
            const img = new Image();
            img.src = `assets/images/${skinName}.png`;
            this.skinImages[skinName] = img;
        });
    }

    preloadBackgroundImages() {
        this.backgroundList.forEach(backgroundName => {
            const img = new Image();
            img.src = `assets/images/${backgroundName}.png`;
            this.backgroundImages[backgroundName] = img;
        });
    }

    preloadOrangieModeImages() {
        const parts = ['body', 'hands', 'feet'];
        parts.forEach(part => {
            const img = new Image();
            img.src = `assets/images/orangie-mode-${part}.png`;
            this.orangieModeImages[part] = img;
        });
    }

    drawBackground() {
        const backgroundImage = this.backgroundImages[this.currentBackground];
        if (backgroundImage && backgroundImage.complete) {
            this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        switch(this.currentBackground) {
            case 'jail': this.ctx.fillStyle = '#666'; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); break;
            case 'miami': const mG = this.ctx.createLinearGradient(0,0,0,this.canvas.height); mG.addColorStop(0,'#ff6b9d'); mG.addColorStop(1,'#6c5ce7'); this.ctx.fillStyle=mG; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); break;
            case 'dubai': const dG = this.ctx.createLinearGradient(0,0,0,this.canvas.height); dG.addColorStop(0,'#f39c12'); dG.addColorStop(1,'#d35400'); this.ctx.fillStyle=dG; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); break;
            case 'casino': this.ctx.fillStyle = '#8B0000'; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); break;
            default: const deG = this.ctx.createLinearGradient(0,0,0,this.canvas.height); deG.addColorStop(0,'#f39c12'); deG.addColorStop(1,'#d35400'); this.ctx.fillStyle=deG; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); break;
        }
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        if (this.buddy) {
            this.buddy.resetToStanding(this.canvas.width / 2, this.canvas.height - 100);
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(e) {
        this.isMouseDown = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.selectedTool === 'fist') {
            return;
        }

        if (this.selectedTool === 'godfinger') {
            this.triggerGodFinger(x, y);
            return;
        }

        if (this.selectedTool === 'grenade' || this.selectedTool === 'solana') {
            this.isAiming = true;
            this.aimStart.x = x;
            this.aimStart.y = y;
            return;
        }

        if (this.selectedTool === 'missile') {
            const targetPart = this.buddy.parts[0];
            this.projectiles.push(new HomingMissile(x, y, targetPart));
            this.showSpeech(this.getRandomSpeech('missile'), 'happy');
            this.lastInteraction = Date.now();
            return;
        }

        this.draggedPart = this.buddy.getPartAtPoint(x, y);
        if (this.draggedPart) {
            this.dragOffset.x = x - this.draggedPart.x;
            this.dragOffset.y = y - this.draggedPart.y;
            this.useTool(x, y);
            this.lastInteraction = Date.now();
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;

        if (this.isAiming) return;

        if (this.draggedPart) {
            const dx = this.mousePos.x - this.dragOffset.x - this.draggedPart.x;
            const dy = this.mousePos.y - this.dragOffset.y - this.draggedPart.y;
            this.draggedPart.x += dx;
            this.draggedPart.y += dy;
            this.draggedPart.oldX += dx * 0.8;
            this.draggedPart.oldY += dy * 0.8;
        }
    }

    handleMouseUp(e) {
        if (this.isAiming) {
            this.isAiming = false;
            const powerMultiplier = 1 / 7;
            let vx = (this.aimStart.x - this.mousePos.x) * powerMultiplier;
            let vy = (this.aimStart.y - this.mousePos.y) * powerMultiplier;
            
            vx = Math.max(-25, Math.min(25, vx));
            vy = Math.max(-25, Math.min(25, vy));

            if (this.selectedTool === 'grenade') {
                this.projectiles.push(new Grenade(this.aimStart.x, this.aimStart.y, vx, vy, this.canvas));
            } else if (this.selectedTool === 'solana') {
                this.projectiles.push(new SolanaProjectile(this.aimStart.x, this.aimStart.y, vx, vy, this.canvas, this.solanaImage));
            }

            this.lastInteraction = Date.now();
        }

        this.isMouseDown = false;
        this.draggedPart = null;
    }

    drawTrajectory() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

        const powerMultiplier = 1 / 7;
        let vx = (this.aimStart.x - this.mousePos.x) * powerMultiplier;
        let vy = (this.aimStart.y - this.mousePos.y) * powerMultiplier;
        vx = Math.max(-25, Math.min(25, vx));
        vy = Math.max(-25, Math.min(25, vy));
        
        let pX = this.aimStart.x;
        let pY = this.aimStart.y;
        
        for (let i = 0; i < 40; i++) {
            vy += 0.5;
            pX += vx;
            pY += vy;
            
            if (i % 3 === 0) {
                this.ctx.beginPath();
                this.ctx.arc(pX, pY, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        this.ctx.restore();
    }

    useTool(x, y) {
        if (['grenade', 'solana', 'missile', 'fist', 'laser', 'godfinger'].includes(this.selectedTool)) return;

        this.earnMoney();
        const speechType = this.selectedTool === 'tickle' ? 'happy' : 'hurt';
        this.showSpeech(this.getRandomSpeech(this.selectedTool), speechType);
        
        switch(this.selectedTool) {
            case 'hand': this.buddy.applyImpulse((Math.random() - 0.5) * 50, -20 - Math.random() * 30); this.createParticles(x, y, '#ffaa00', 3); break;
            case 'tickle': this.buddy.wiggle(); this.createParticles(x, y, '#ffff00', 5); break;
            case 'baseball': this.buddy.applyImpulse((Math.random() - 0.5) * 100, -50 - Math.random() * 50); this.createParticles(x, y, '#ffffff', 8); break;
            case 'brick': this.buddy.applyImpulse((Math.random() - 0.5) * 20, 80); this.createParticles(x, y, '#8b4513', 10); break;
            case 'laser': this.createLaser(x, y, this.buddy.parts[0].x, this.buddy.parts[0].y); this.buddy.applyImpulse((Math.random() - 0.5) * 60, -30); break;
            case 'flamethrower': this.createFlame(x, y); this.buddy.applyImpulse((Math.random() - 0.5) * 50, -25); break;
            case 'lightning': this.createLightning(x, y); this.buddy.applyImpulse((Math.random() - 0.5) * 60, 120); this.buddy.wiggle(); break;
        }
    }

    createParticles(x, y, color, count) { for (let i = 0; i < count; i++) this.particles.push(new Particle(x, y, color)); }

    createExplosion(x, y) {
        this.particles.push(new Flash(x, y, 250)); 
        for (let i = 0; i < 40; i++) {
            this.particles.push(new ExplosionParticle(x, y));
        }
    }
    
    createSolanaExplosion(x, y) {
        this.particles.push(new Flash(x, y, 400)); 
        for (let i = 0; i < 70; i++) {
            this.particles.push(new ExplosionParticle(x, y));
        }
    }

    createGodExplosion(x, y) {
        this.particles.push(new Flash(x, y, 1500)); // Increased flash size
        for (let i = 0; i < 250; i++) { // Increased particle count
            this.particles.push(new ExplosionParticle(x, y));
        }
    }

    triggerGodFinger(x, y) {
        if (this.godFingerCooldown) return;

        this.godFingerCooldown = true;
        this.lastInteraction = Date.now();
        
        this.screenShakeTime = 45; // Increased screen shake time

        this.createGodExplosion(x, y);
        this.buddy.applyExplosiveForce(x, y, 15000); // Increased force
        this.showSpeech(this.getRandomSpeech('godfinger'), 'hurt');
        this.earnMoney();

        setTimeout(() => {
            this.godFingerCooldown = false;
        }, 1000); // 1-second cooldown
    }

    createLaser(x1, y1, x2, y2) { this.particles.push(new LaserBeam(x1, y1, x2, y2)); }
    
    createFlame(x, y, dirX, dirY) { 
        for (let i = 0; i < 20; i++) {
            this.particles.push(new FlameParticle(x, y, dirX, dirY)); 
        }
    }

    createLightning(x, y) { this.particles.push(new LightningBolt(x, y)); }

    earnMoney() { const base = Math.floor(Math.random() * 4) + 2; this.money += base * 2; this.updateUI(); }

    getRandomSpeech(type) { const s = CONFIG.speech[type] || ["..."]; return s[Math.floor(Math.random() * s.length)]; }

    showSpeech(text, type = 'neutral') {
        const bubble = document.getElementById('speechBubble');
        bubble.textContent = text;
        bubble.style.opacity = '1';
        this.speechActive = true;
        clearTimeout(this.speechTimeout);
        this.speechTimeout = setTimeout(() => { bubble.style.opacity = '0'; this.speechActive = false; }, 2500);
    }

    updateSpeechBubblePosition() {
        if (this.speechActive) {
            const bubble = document.getElementById('speechBubble');
            const head = this.buddy.parts[0];
            bubble.style.left = head.x + 'px';
            bubble.style.top = Math.max(15, head.y - head.radius - 80) + 'px';
        }
    }

    updateUI() {
        document.getElementById('moneyDisplay').textContent = `${this.money} SOL`;
        
        if (this.selectedTool === 'fist' || this.selectedTool === 'godfinger') {
            this.canvas.style.cursor = 'none';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }

        document.querySelectorAll('.menu-item[data-cost]').forEach(item => {
            const cost = parseInt(item.dataset.cost);
            const itemName = item.dataset.tool || item.dataset.skin || item.dataset.mode || item.dataset.background;
            if (this.ownedItems.has(itemName)) {
                item.classList.remove('disabled');
                const priceSpan = item.querySelector('.price');
                if (priceSpan && cost > 0) priceSpan.textContent = 'OWNED';
            } else {
                item.classList.toggle('disabled', this.money < cost);
            }
        });
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('selected'));
        document.querySelectorAll(`[data-tool="${this.selectedTool}"]`).forEach(item => item.classList.add('selected'));
        document.querySelectorAll(`[data-skin="${this.currentSkin}"]`).forEach(item => item.classList.add('selected'));
        document.querySelectorAll(`[data-mode="${this.currentMode}"]`).forEach(item => item.classList.add('selected'));
        document.querySelectorAll(`[data-background="${this.currentBackground}"]`).forEach(item => item.classList.add('selected'));
    }

    gameLoop() {
        this.ctx.save();

        if (this.screenShakeTime > 0) {
            const shakeX = (Math.random() - 0.5) * 20;
            const shakeY = (Math.random() - 0.5) * 20;
            this.ctx.translate(shakeX, shakeY);
            this.screenShakeTime--;
        }

        this.drawBackground();

        if (this.isAiming) {
            this.drawTrajectory();
        }
        
        if (Date.now() - this.lastInteraction > 8000) {
            this.idleTimer++;
            if (this.idleTimer > 300) {
                this.buddy.doIdleBehavior();
                if (Math.random() < 0.1) this.showSpeech(this.getRandomSpeech('idle'), 'neutral');
                this.idleTimer = 0;
            }
        } else {
            this.idleTimer = 0;
        }
        
        if (this.isMouseDown && !this.draggedPart && !this.isAiming) {
            if (this.selectedTool === 'flamethrower') {
                const target = this.buddy.parts[1]; // Target the body
                const dx = target.x - this.mousePos.x;
                const dy = target.y - this.mousePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const dirX = dx / distance;
                const dirY = dy / distance;
                this.createFlame(this.mousePos.x, this.mousePos.y, dirX, dirY); 
                this.buddy.applyImpulse((this.buddy.parts[1].x - this.mousePos.x) * 0.1, (this.buddy.parts[1].y - this.mousePos.y) * 0.1); 
            }
            else if (this.selectedTool === 'laser') { this.createLaser(this.mousePos.x, this.mousePos.y, this.buddy.parts[0].x, this.buddy.parts[0].y); }
        }
        
        if (this.selectedTool === 'fist') {
            const part = this.buddy.getPartAtPoint(this.mousePos.x, this.mousePos.y);
            if (part) {
                this.buddy.applyImpulse((Math.random() - 0.5) * 160, -60 - Math.random() * 80);
                this.createParticles(this.mousePos.x, this.mousePos.y, '#ffffff', 5);
                if (Math.random() < 0.1) {
                    this.showSpeech(this.getRandomSpeech('fist'), 'hurt');
                }
                this.earnMoney();
                this.lastInteraction = Date.now();
            }
        }

        this.buddy.update(this.canvas, this.currentMode);
        this.buddy.draw(this.ctx);
        
        this.updateSpeechBubblePosition();
        
        this.particles = this.particles.filter(p => { p.update(); p.draw(this.ctx); return p.life > 0; });
        
        this.projectiles = this.projectiles.filter(p => {
            p.update();
            p.draw(this.ctx);
            if (p.checkCollision && p.checkCollision(this.buddy)) {
                this.createExplosion(p.x, p.y);
                this.buddy.applyExplosiveForce(p.x, p.y, 2500);
                this.earnMoney();
                return false;
            }
            if (p.type === 'grenade' && p.life <= 0) {
                this.createExplosion(p.x, p.y);
                this.buddy.applyExplosiveForce(p.x, p.y, 3500);
                this.showSpeech(this.getRandomSpeech('grenade'), 'hurt');
                this.earnMoney();
                return false;
            }
            if (p.type === 'solana' && p.life <= 0) {
                this.createSolanaExplosion(p.x, p.y);
                this.buddy.applyExplosiveForce(p.x, p.y, 5000);
                this.showSpeech(this.getRandomSpeech('solana'), 'hurt');
                this.earnMoney();
                return false;
            }
            return p.life > 0;
        });
        
        if (this.selectedTool === 'fist' && this.fistImage.complete) {
            const fistSize = 120;
            const fistX = this.mousePos.x;
            const fistY = this.mousePos.y;

            const dx = this.buddy.parts[1].x - fistX;
            const dy = this.buddy.parts[1].y - fistY;
            const angle = Math.atan2(dy, dx);

            this.ctx.save();
            this.ctx.translate(fistX, fistY);
            this.ctx.scale(-1, 1);
            this.ctx.rotate(-angle);
            this.ctx.drawImage(this.fistImage, -fistSize / 2, -fistSize / 2, fistSize, fistSize);
            this.ctx.restore();
        }

        // Draw God Finger as cursor
        if (this.selectedTool === 'godfinger' && this.godFingerImage.complete) {
            const fingerWidth = 160;
            const fingerHeight = 240;
            const fingerX = this.mousePos.x;
            const fingerY = this.mousePos.y;

            const dx = this.buddy.parts[1].x - fingerX;
            const dy = this.buddy.parts[1].y - fingerY;
            const angle = Math.atan2(dy, dx) + Math.PI / 2;

            this.ctx.save();
            this.ctx.translate(fingerX, fingerY);
            this.ctx.rotate(angle);
            // Draw with a Y offset of 0 to place the tip at the cursor
            this.ctx.drawImage(this.godFingerImage, -fingerWidth / 2, 0, fingerWidth, fingerHeight);
            this.ctx.restore();
        }

        this.ctx.restore(); // This resets the context, removing the screen shake translation
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('DOMContentLoaded', () => { new Game(); });