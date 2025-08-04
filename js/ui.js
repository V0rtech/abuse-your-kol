class UIManager {
    constructor(game) {
        this.game = game;
        this.activeMenu = null;
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleMenu(e));
        });
        
        document.querySelectorAll('.menu-item[data-tool]').forEach(item => {
            item.addEventListener('click', (e) => this.selectTool(e));
        });
        
        document.querySelectorAll('.menu-item[data-skin]').forEach(item => {
            item.addEventListener('click', (e) => this.selectSkin(e));
        });
        
        document.querySelectorAll('.menu-item[data-mode]').forEach(item => {
            item.addEventListener('click', (e) => this.selectMode(e));
        });

        document.querySelectorAll('.menu-item[data-background]').forEach(item => {
            item.addEventListener('click', (e) => this.selectBackground(e));
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-btn') && !e.target.closest('.dropdown-menu')) {
                this.closeAllMenus();
            }
        });
    }

    toggleMenu(e) {
        const menuType = e.target.dataset.menu;
        const menu = document.getElementById(menuType + 'Menu');
        
        if (this.activeMenu === menuType) {
            this.closeAllMenus();
        } else {
            this.closeAllMenus();
            menu.classList.add('show');
            e.target.classList.add('active');
            this.activeMenu = menuType;
        }
    }

    closeAllMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
        this.activeMenu = null;
    }

    selectTool(e) {
        const item = e.target.closest('.menu-item');
        if (!item) return;
        
        const tool = item.dataset.tool;
        const cost = parseInt(item.dataset.cost) || 0;
        
        if (cost > 0 && !this.game.ownedItems.has(tool)) {
            if (this.game.money >= cost) {
                this.game.money -= cost;
                this.game.ownedItems.add(tool);
            } else {
                this.game.showSpeech("Need more SOL!", 'hurt');
                return;
            }
        }
        
        if (this.game.ownedItems.has(tool)) {
            this.game.selectedTool = tool;
            this.game.updateUI();
            this.closeAllMenus();
        }
    }

    selectSkin(e) {
        const item = e.target.closest('.menu-item');
        if (!item || item.classList.contains('disabled')) return;
        
        const skinName = item.dataset.skin;

        if (this.game.ownedItems.has(skinName)) {
            this.game.currentSkin = skinName;
            const skinImage = this.game.skinImages[skinName] || null;
            this.game.buddy.setSkin(skinName, skinImage);
            this.game.showSpeech("New look!", 'happy');
            this.game.updateUI();
            this.closeAllMenus();
        }
    }

    selectBackground(e) {
        const item = e.target.closest('.menu-item');
        if (!item || item.classList.contains('disabled')) return;
        
        const backgroundName = item.dataset.background;

        if (this.game.ownedItems.has(backgroundName)) {
            this.game.currentBackground = backgroundName;
            this.game.showSpeech("New scenery!", 'happy');
            this.game.updateUI();
            this.closeAllMenus();
        }
    }

    selectMode(e) {
        const item = e.target.closest('.menu-item');
        if (!item) return;
        
        const mode = item.dataset.mode;
        const cost = parseInt(item.dataset.cost) || 0;
        
        if (cost > 0 && !this.game.ownedItems.has(mode)) {
            if (this.game.money >= cost) {
                this.game.money -= cost;
                this.game.ownedItems.add(mode);
            } else {
                this.game.showSpeech("Need more SOL!", 'hurt');
                return;
            }
        }
        
        if (this.game.ownedItems.has(mode)) {
            this.game.currentMode = mode;
            this.game.buddy.setMode(mode);
            this.game.updateUI();
            this.closeAllMenus();
        }
    }
}