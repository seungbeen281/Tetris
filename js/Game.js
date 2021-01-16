import {
    Block
} from './Block.js';

export class Game {
    constructor(app) {
        this.canvas = app.canvas;
        this.ctx = app.ctx;
        this.app = app; // gameOver access

        this.inventoryW = 120;
        this.inventoryH = this.canvas.height;

        this.stageW = this.canvas.width - this.inventoryW;
        this.stageH = this.canvas.height;

        this.score = 0;
        this.blockCnt = 20; // x axle max block cnt
        this.blockSize = this.stageW / this.blockCnt;
        this.downTime = 500;
        this.initBlockArr();

        this.createBlock();
        this.setEvent();
        this.animation();
    }

    initBlockArr() {
        this.blockArr = [];
        this.inspectionBlockArr = [];
        for (let x = 0; x < this.blockCnt; x++) {
            this.inspectionBlockArr.push([]);
            for (let y = 0; y < Math.floor(this.stageH / this.blockSize); y++) {
                this.inspectionBlockArr[x][y] = false;
            }
        }
    }

    gameOver() {
        alert(`gameOver`);
        location.reload();

        // clearInterval(this.downInverval);
        // this.app.gameOver = true;
        //
        // this.ctx.textBaseline = 'middle';
        // this.ctx.textAlign = 'center';
        // this.ctx.fillStyle = '#fff';
        //
        // this.ctx.font = '36px Arial';
        // this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 20);
        //
        // this.ctx.font = '16px Arial';
        // this.ctx.fillText('게임을 재시작하시려면 스페이스바를 눌러주세요.', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    updateBlockArr() {
        for (let i = 0; i < this.moveBlock.parts.length; i++) {
            const parts = this.moveBlock.parts[i];
            if (this.inspectionBlockArr[parts.x + this.moveBlock.moveX][parts.y + this.moveBlock.moveY] == true) {
                this.gameOver();
                return;
            }
            this.inspectionBlockArr[parts.x + this.moveBlock.moveX][parts.y + this.moveBlock.moveY] = true;
        }
        // inspection line
        this.inspectionBlockArr.map(x => {
            const repeatAxis = (x, y) => {
                if (!this.inspectionBlockArr[x][y]) return;
                if (x + 1 == this.blockCnt) {
                    this.deleteLine(y);
                    return;
                }
                repeatAxis(x + 1, y);
            }

            x.map((y, yIdx) => {
                repeatAxis(0, yIdx)
            })
        })
    }

    deleteLine(y) {
        // get score
        this.score += this.blockCnt*2;
        // inspectionBlockArr
        this.inspectionBlockArr.map(x => {
            x.splice(y, 1);
            x.unshift(false);
        })
        // blockArr
        this.blockArr.map(block => {
            for (let i = block.parts.length - 1; i >= 0; i--) {
                const parts = block.parts[i];
                if (parts.y + block.moveY === y) {
                    block.parts.splice(i, 1);
                } else if (parts.y + block.moveY < y) {
                    parts.y += 1;
                }
            }
        })
    }

    setEvent() {
        window.addEventListener('keydown', this.keyControl.bind(this))
    }

    keyControl(e) {
        this.moveBlock.inspectionBlockArr = this.inspectionBlockArr;
        switch (e.keyCode) {
            case 37:
                // left (left move)
                this.moveBlock.move('left');

                break;
            case 39:
                // right (right move)
                this.moveBlock.move('right');

                break;
            case 40:
                // bottom (down)
                if (this.moveBlock.move('down')) this.stack();

                break;
            case 38:
                // top (save)
                let tmp;
                if (!!this.saveBlock) {
                    tmp = this.saveBlock;
                } else {
                    tmp = this.readyBlock;
                    this.readyBlock = new Block(this.stageW, this.stageH, this.blockCnt, this.ctx);
                }
                this.saveBlock = this.moveBlock;
                this.moveBlock = tmp;
                this.moveBlock.inspectionBlockArr = this.inspectionBlockArr;
                this.moveBlockDown();

                this.initInventoryBlock();

                break;
            case 17:
                // ctrl (rotate)
                this.moveBlock.rotate();

                break;
        }
    }

    moveBlockDown() {
        clearInterval(this.downInverval);
        this.downInverval = setInterval(() => {
            if (!this.app.gameOver) {
                if (this.moveBlock.move('down')) this.stack();
            }
        }, this.downTime);
    }

    stack() {
        this.score += this.moveBlock.parts.length;
        this.blockArr.push(this.moveBlock);
        this.updateBlockArr();
        this.createBlock();
    }

    createBlock() {
        this.moveBlock = !!this.readyBlock ? this.readyBlock : new Block(this.stageW, this.stageH, this.blockCnt, this.ctx);
        this.moveBlock.inspectionBlockArr = this.inspectionBlockArr;
        this.moveBlockDown();
        this.readyBlock = new Block(this.stageW, this.stageH, this.blockCnt, this.ctx);

        this.initInventoryBlock();
    }

    initInventoryBlock() {
        // inventory draw
        this.readyBlock.x = this.canvas.width - this.inventoryW / 2 - this.readyBlock.maxSize().width / 2;
        this.readyBlock.y = this.inventoryH / 3 * 0 + (this.inventoryH / 3 / 6 * 5 + this.inventoryH / 3 / 6) / 2;
        if (!!this.saveBlock) {
            this.saveBlock.x = this.canvas.width - this.inventoryW / 2 - this.readyBlock.maxSize().width / 2;
            this.saveBlock.y = this.inventoryH / 3 * 1 + (this.inventoryH / 3 / 6 * 5 + this.inventoryH / 3 / 6) / 2;
            this.saveBlock.moveX = 0;
            this.saveBlock.moveY = 0;
        }
        // moveBlock draw
        this.moveBlock.x = 0;
        this.moveBlock.y = 0;
        this.moveBlock.moveX = Math.floor(this.blockCnt / 2 - this.moveBlock.maxSize().w / 2);
        this.moveBlock.moveY = 0;
    }

    drawScore() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '42px Arial';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(this.score, this.canvas.width - this.inventoryW + this.inventoryW / 2, this.inventoryH / 3 * 2 + (this.inventoryH / 3 / 6 * 5 + this.inventoryH / 3 / 6) / 2);
    }

    animation() {
        this.clear();

        // draw block
        this.blockArr.map(block => {
            block.draw();
        });
        this.readyBlock.draw();
        this.moveBlock.draw();
        if (!!this.saveBlock) this.saveBlock.draw();
        // draw score
        this.drawScore();

        if (!this.app.gameOver) window.requestAnimationFrame(this.animation.bind(this));
    }

    clear() {
        // canvas background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // inventory background
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(this.canvas.width - this.inventoryW, 0, this.inventoryW, this.inventoryH);
        // inventory division
        this.ctx.fillStyle = '#888';
        this.ctx.fillRect(this.canvas.width - this.inventoryW, this.inventoryH / 3 * 1, this.inventoryW, 1);
        this.ctx.fillRect(this.canvas.width - this.inventoryW, this.inventoryH / 3 * 2, this.inventoryW, 1);
        this.ctx.fillRect(this.canvas.width - this.inventoryW, this.inventoryH / 3 * 3, this.inventoryW, 1);
        // inventory ready, save, score text
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText('ready', this.canvas.width - this.inventoryW + this.inventoryW / 2, this.inventoryH / 3 / 6);
        this.ctx.fillText('save', this.canvas.width - this.inventoryW + this.inventoryW / 2, this.inventoryH / 3 / 6 + this.inventoryH / 3);
        this.ctx.fillText('score', this.canvas.width - this.inventoryW + this.inventoryW / 2, this.inventoryH / 3 / 6 + this.inventoryH / 3 * 2);
        // gameOver line
        this.ctx.fillStyle = '#888';
        const y = this.stageH - Math.floor(this.stageH / this.blockSize) * this.blockSize;
        this.ctx.fillRect(0, y, this.stageW, 1);
    }
}