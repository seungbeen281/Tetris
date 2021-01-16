import {
    Game
} from './Game.js';

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.gameOver = true;
        this.init();
    }

    init() {
        this.clear();

        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';

        this.ctx.font = '36px Arial';
        this.ctx.fillText('Tetris', this.canvas.width / 2, this.canvas.height / 2 - 20);

        this.ctx.font = '16px Arial';
        this.ctx.fillText('게임을 시작하시려면 스페이스바를 눌러주세요.', this.canvas.width / 2, this.canvas.height / 2 + 20);

        window.addEventListener('keydown', this.gameStart.bind(this));
    }

    gameStart(e) {
        if (e.keyCode != 32 || !this.gameOver) return;

        this.gameOver = false;
        new Game(this);
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.onload = () => {
    new App();
}