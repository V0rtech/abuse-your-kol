class InteractiveBuddy {
    constructor(x, y) {
        this.mode = 'normal';
        this.wiggleTime = 0;
        this.idleAnimation = 0;
        this.activeSkinImage = null;
        this.currentSkin = 'default';

        // Store the original, unscaled "blueprint" of the buddy
        this.baseParts = [
            { x: x, y: y - 80, oldX: x, oldY: y - 80, radius: 20, id: 'head', mass: 1.0 },
            { x: x, y: y - 40, oldX: x, oldY: y - 40, radius: 25, id: 'body', mass: 2.5 },
            { x: x - 35, y: y - 25, oldX: x - 35, oldY: y - 25, radius: 12, id: 'leftArm', mass: 0.8 },
            { x: x + 35, y: y - 25, oldX: x + 35, oldY: y - 25, radius: 12, id: 'rightArm', mass: 0.8 },
            { x: x - 15, y: y, oldX: x - 15, oldY: y, radius: 14, id: 'leftLeg', mass: 1.2 },
            { x: x + 15, y: y, oldX: x + 15, oldY: y, radius: 14, id: 'rightLeg', mass: 1.2 }
        ];
        
        this.baseConstraints = [
            { partA: 0, partB: 1, length: 40, stiffness: 0.7 },
            { partA: 1, partB: 2, length: 38, stiffness: 0.7 },
            { partA: 1, partB: 3, length: 38, stiffness: 0.7 },
            { partA: 1, partB: 4, length: 45, stiffness: 0.7 },
            { partA: 1, partB: 5, length: 45, stiffness: 0.7 },
        ];
        
        this.parts = JSON.parse(JSON.stringify(this.baseParts));
        this.constraints = JSON.parse(JSON.stringify(this.baseConstraints));

        this.resetToStanding(x, y);
    }

    resetToStanding(x, y) {
        // Reset positions from the base blueprint
        this.parts.forEach((part, index) => {
            const basePath = this.baseParts[index];
            const dx = part.x - this.parts[1].x; // distance from body center
            const dy = part.y - this.parts[1].y;
            part.x = x + dx;
            part.y = y - 40 + dy; // a more stable way to reset position
            part.oldX = part.x;
            part.oldY = part.y;
        });

        // Re-apply the current skin's properties (like size)
        this.setSkin(this.currentSkin, this.activeSkinImage);
    }

    setSkin(skinName, image) {
        this.currentSkin = skinName;
        this.activeSkinImage = image;

        // --- 🎮 EASY SCALE CONTROLS 🎮 ---
        const defaultScale = 1.5;             // The size of the default buddy
        const bobbleheadBodyScale = 1.5;     // The size of the bobblehead's body and limbs
        const bobbleheadHeadMultiplier = 2.5; // Extra size multiplier for the bobblehead's head

        let scale = defaultScale;
        
        if (skinName !== 'default') {
            scale = bobbleheadBodyScale;
            this.constraints[0].stiffness = 0.7; // Wobbly neck for bobbleheads
        } else {
            this.constraints[0].stiffness = 0.7; // Normal neck stiffness
        }

        // Apply the scale to all parts and constraints based on the "blueprint"
        this.parts.forEach((part, index) => {
            part.radius = this.baseParts[index].radius * scale;
        });
        this.constraints.forEach((constraint, index) => {
            constraint.length = this.baseConstraints[index].length * scale;
        });

        // Apply the extra head multiplier for bobbleheads
        if (skinName !== 'default') {
            this.parts[0].radius = this.baseParts[0].radius * scale * bobbleheadHeadMultiplier;
        }
    }

    setMode(mode) {
        this.mode = mode;
        
        if (mode === 'orangie') {
            // Make body parts bigger and heavier for orangie mode
            this.parts.forEach((part, index) => {
                part.radius = this.baseParts[index].radius * 2.5; // Much bigger
                
                // Different mass for different parts
                if (part.id === 'leftArm' || part.id === 'rightArm') {
                    part.mass = this.baseParts[index].mass * 1.2; // Less heavy arms
                } else {
                    part.mass = this.baseParts[index].mass * 3; // Much heavier body/legs
                }
            });
        } else {
            // Reset to normal size
            this.parts.forEach((part, index) => {
                part.radius = this.baseParts[index].radius * 1.5; // Normal size
                part.mass = this.baseParts[index].mass; // Normal mass
            });
        }
    }

    getPartAtPoint(x, y) {
        for (let part of this.parts) {
            const dx = x - part.x;
            const dy = y - part.y;
            if (dx * dx + dy * dy <= part.radius * part.radius) {
                return part;
            }
        }
        return null;
    }

    applyImpulse(fx, fy) {
        this.parts.forEach(part => {
            const randomFactor = 0.7 + Math.random() * 0.6;
            part.oldX -= (fx / part.mass) * randomFactor * 0.3;
            part.oldY -= (fy / part.mass) * randomFactor * 0.3;
        });
    }

    applyExplosiveForce(x, y, strength) {
        this.parts.forEach(part => {
            const dx = part.x - x;
            const dy = part.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Avoid division by zero and make force weaker with distance
            if (distance > 1) {
                const force = (1 / distance) * strength;
                const impulseX = (dx / distance) * force;
                const impulseY = (dy / distance) * force;
                
                part.oldX -= impulseX / part.mass;
                part.oldY -= impulseY / part.mass;
            }
        });
    }

    wiggle() {
        this.wiggleTime = 50;
    }

    doIdleBehavior() {
        if (Math.random() < 0.15) {
            this.applyImpulse((Math.random() - 0.5) * 10, -Math.random() * 10 * 0.5);
        }
        if (Math.random() < 0.05) {
            this.applyImpulse((Math.random() - 0.5) * 20, -10);
        }
    }

    update(canvas, mode) {
        const gravity = mode === 'lowgrav' ? 0.15 : mode === 'orangie' ? 1.2 : 0.5;
        const damping = 0.99;
        const floorFriction = 0.95;
        
        this.parts.forEach(part => {
            let vx = (part.x - part.oldX) * damping;
            let vy = (part.y - part.oldY) * damping;
            
            const maxVelocity = 50;
            const speed = Math.sqrt(vx * vx + vy * vy);
            if (speed > maxVelocity) {
                vx = (vx / speed) * maxVelocity;
                vy = (vy / speed) * maxVelocity;
            }

            part.oldX = part.x;
            part.oldY = part.y;
            part.x += vx;
            part.y += vy + gravity;
            
            if (this.wiggleTime > 0) {
                part.x += (Math.random() - 0.5) * 4;
                part.y += (Math.random() - 0.5) * 2;
            }
            if (part.id === 'body') {
                part.y += Math.sin(this.idleAnimation) * 0.3;
            }
            
            if (true) {
                if (part.x < part.radius) { part.x = part.radius; part.oldX = part.x + vx * 0.8; }
                if (part.x > canvas.width - part.radius) { part.x = canvas.width - part.radius; part.oldX = part.x + vx * 0.8; }
                if (part.y > canvas.height - part.radius) { part.y = canvas.height - part.radius; part.oldY = part.y + vy * 0.5; part.oldX = part.x - (part.x - part.oldX) * floorFriction; }
                if (part.y < part.radius) { part.y = part.radius; part.oldY = part.y + vy * 0.8; }
            }
        });
    
        const head = this.parts[0];
        const body = this.parts[1];
        const leftArm = this.parts[2];
        const rightArm = this.parts[3];
        const leftLeg = this.parts[4];
        const rightLeg = this.parts[5];

        for (let iteration = 0; iteration < 8; iteration++) {
            this.constraints.forEach(constraint => {
                const partA = this.parts[constraint.partA];
                const partB = this.parts[constraint.partB];
                const dx = partB.x - partA.x;
                const dy = partB.y - partA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0.001) {
                    const difference = constraint.length - distance;
                    const percent = (difference / distance) * constraint.stiffness * 0.5;
                    const offsetX = dx * percent;
                    const offsetY = dy * percent;
                    const totalMass = partA.mass + partB.mass;
                    const ratioA = partB.mass / totalMass;
                    const ratioB = partA.mass / totalMass;
                    partA.x -= offsetX * ratioA;
                    partA.y -= offsetY * ratioA;
                    partB.x += offsetX * ratioB;
                    partB.y += offsetY * ratioB;
                }
            });

            const legDx = rightLeg.x - leftLeg.x;
            const legDy = rightLeg.y - leftLeg.y;
            const legDistance = Math.sqrt(legDx * legDx + legDy * legDy);
            const gap = 8;
            const minLegDistance = leftLeg.radius + rightLeg.radius + gap;

            if (legDistance < minLegDistance) {
                const overlap = minLegDistance - legDistance;
                const percent = (overlap / legDistance) * 0.2;
                const offsetX = legDx * percent;
                const offsetY = legDy * percent;

                leftLeg.x -= offsetX;
                leftLeg.y -= offsetY;
                rightLeg.x += offsetX;
                rightLeg.y += offsetY;
            }
        }
        
        if (this.wiggleTime === 0) {
            const armCorrectionForce = this.mode === 'orangie' ? 0.05 : 0.02; // Stronger arm correction for orangie
            const targetLeftArmX = body.x - (leftArm.radius + body.radius) * 0.7;
            const targetLeftArmY = body.y - (this.mode === 'orangie' ? 20 : 10); // Higher arm position for orangie
            leftArm.x += (targetLeftArmX - leftArm.x) * armCorrectionForce;
            leftArm.y += (targetLeftArmY - leftArm.y) * armCorrectionForce;

            const targetRightArmX = body.x + (rightArm.radius + body.radius) * 0.7;
            const targetRightArmY = body.y - (this.mode === 'orangie' ? 20 : 10); // Higher arm position for orangie
            rightArm.x += (targetRightArmX - rightArm.x) * armCorrectionForce;
            rightArm.y += (targetRightArmY - rightArm.y) * armCorrectionForce;
            
            const shoulderLineY = body.y - 10;
            if (head.y > shoulderLineY) {
                const headReturnForce = 0.8;
                head.y -= (head.y - shoulderLineY) * headReturnForce;
            }
        }
        
        const leftOnGround = leftLeg.y >= canvas.height - leftLeg.radius - 2;
        const rightOnGround = rightLeg.y >= canvas.height - rightLeg.radius - 2;
        const onGround = leftOnGround || rightOnGround;
        const isStable = leftOnGround && rightOnGround;

        if (onGround && this.wiggleTime === 0) {
            const desiredHeadY = body.y - this.constraints[0].length;
            if (head.y > desiredHeadY) {
                const getUpForce = 0.05;
                head.y -= (head.y - desiredHeadY) * getUpForce;
                body.y -= (head.y - desiredHeadY) * getUpForce * 0.5;
            }

            if (isStable) {
                const centeringForce = 0.04;
                const feetMidpointX = (leftLeg.x + rightLeg.x) / 2;
                body.x += (feetMidpointX - body.x) * centeringForce;
                head.x += (body.x - head.x) * centeringForce;

                const stanceWidth = (leftLeg.radius + rightLeg.radius + 8) / 2;
                const targetLeftFootX = body.x - stanceWidth;
                const targetRightFootX = body.x + stanceWidth;

                leftLeg.x = targetLeftFootX;
                leftLeg.oldX = targetLeftFootX;
                rightLeg.x = targetRightFootX;
                rightLeg.oldX = targetRightFootX;
            } else {
                const legCorrectionForce = 0.07;
                const stanceWidth = (leftLeg.radius + rightLeg.radius + 8) / 2;
                const targetLeftFootX = body.x - stanceWidth;
                const targetRightFootX = body.x + stanceWidth;
                leftLeg.x += (targetLeftFootX - leftLeg.x) * legCorrectionForce;
                rightLeg.x += (targetRightFootX - rightLeg.x) * legCorrectionForce;

                const targetFeetY = body.y + 20;
                if (leftLeg.y < body.y) {
                    leftLeg.y += (targetFeetY - leftLeg.y) * legCorrectionForce;
                }
                if (rightLeg.y < body.y) {
                    rightLeg.y += (targetFeetY - rightLeg.y) * legCorrectionForce;
                }
            }
        }
    
        if (this.wiggleTime > 0) this.wiggleTime--;
        this.idleAnimation += 0.03;
    }

    draw(ctx) {
        const isOrangieMode = this.mode === 'orangie';
        const game = window.game || {}; // Get access to game instance
        
        // Draw body parts (skip head for now)
        for (let i = 1; i < this.parts.length; i++) {
            const part = this.parts[i];
            
            if (isOrangieMode && game.orangieModeImages) {
                // Use orangie mode images
                let image = null;
                if (part.id === 'body') {
                    image = game.orangieModeImages.body;
                } else if (part.id === 'leftArm' || part.id === 'rightArm') {
                    image = game.orangieModeImages.hands;
                } else if (part.id === 'leftLeg' || part.id === 'rightLeg') {
                    image = game.orangieModeImages.feet;
                }
                
                if (image && image.complete) {
                    ctx.save();
                    if (part.id === 'leftArm' || part.id === 'leftLeg') {
                        // Flip left side horizontally
                        ctx.scale(-1, 1);
                        ctx.drawImage(image, -(part.x + part.radius), part.y - part.radius, part.radius * 2, part.radius * 2);
                    } else {
                        ctx.drawImage(image, part.x - part.radius, part.y - part.radius, part.radius * 2, part.radius * 2);
                    }
                    ctx.restore();
                } else {
                    this.drawSphere(ctx, part, '#b0b0b0');
                }
            } else {
                this.drawSphere(ctx, part, '#b0b0b0');
            }
        }
        
        // Draw head
        const head = this.parts[0];
        if (isOrangieMode && game.skinImages && game.skinImages.Orangie && game.skinImages.Orangie.complete) {
            // Use Orangie skin for head in orangie mode
            ctx.save();
            ctx.beginPath();
            ctx.arc(head.x, head.y, head.radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(game.skinImages.Orangie, 
                head.x - head.radius, 
                head.y - head.radius, 
                head.radius * 2, 
                head.radius * 2);
            ctx.restore();
        } else if (this.activeSkinImage && this.activeSkinImage.complete) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(head.x, head.y, head.radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(this.activeSkinImage, 
                head.x - head.radius, 
                head.y - head.radius, 
                head.radius * 2, 
                head.radius * 2);
            ctx.restore();
        } else {
            this.drawSphere(ctx, head, '#b0b0b0');
            this.drawFace(ctx, head);
        }
    }

    getHeadColor(skinType) {
        switch(skinType) {
            case 'crypto': return '#ffd700';
            case 'robot': return '#c0c0c0';
            default: return '#b0b0b0';
        }
    }

    drawSphere(ctx, part, baseColor) {
        const gradient = ctx.createRadialGradient(part.x - part.radius * 0.3, part.y - part.radius * 0.3, 0, part.x, part.y, part.radius);
        gradient.addColorStop(0, this.lightenColor(baseColor, 40));
        gradient.addColorStop(0.4, baseColor);
        gradient.addColorStop(1, this.darkenColor(baseColor, 30));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
        const highlight = ctx.createRadialGradient(part.x - part.radius * 0.4, part.y - part.radius * 0.4, 0, part.x - part.radius * 0.2, part.y - part.radius * 0.2, part.radius * 0.5);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFace(ctx, head) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(head.x - 6, head.y - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x + 6, head.y - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(head.x - 6, head.y + 5);
        ctx.lineTo(head.x + 6, head.y + 5);
        ctx.stroke();
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) - amt, G = (num >> 8 & 0x00FF) - amt, B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 + (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 + (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
}