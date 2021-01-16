export class Block {
    constructor(stageW, stageH, blockCnt, ctx) {
        // init
        this.ctx = ctx;
        this.stageW = stageW;
        this.stageH = stageH;
        this.blockCntX = blockCnt;
        this.blockSize = this.stageW / this.blockCntX;
        this.blockCntY = Math.floor(this.stageH / this.blockSize);
        this.defaultStageTop = this.stageH - this.blockCntY * this.blockSize;
        // block type setting
        this.init();
        const type = this.blockType[Math.floor(Math.random() * this.blockType.length)];
        this.color = type.color;
        this.parts = type.parts;
        // inventory block x, y
        this.x = 0;
        this.y = 0;
        this.moveX = 0;
        this.moveY = 0;
        // random rotate, flip
        let rotateCnt = Math.floor(Math.random()*4);
        while (rotateCnt--){
            this.rotate();
        }
        if(Math.floor(Math.random()*2) == 1){
            const w = this.maxSize().w;
            this.parts.map(parts => {
                parts.x = Math.abs(parts.x-w);
            })
        }
    }

    inspection() {
        for (let i = 0; i < this.parts.length; i++) {
            const parts = this.parts[i];
            if (parts.x+this.moveX < 0 || parts.x+this.moveX >= this.blockCntX || parts.y+this.moveY >= this.blockCntY) return true;
            if (this.inspectionBlockArr[parts.x+this.moveX][parts.y+this.moveY]) return true;
        }
        return false;
    }

    rotate() {
        const tmp = JSON.stringify(this.parts);
        this.parts.map(parts => {
            const tmp = parts.x;
            parts.x = parts.y;
            parts.y = tmp;
        })
        const w = this.maxSize().w;
        this.parts.map(parts => {
            parts.x = Math.abs(parts.x-w);
        })

        if( !this.inspectionBlockArr ) return;
        if( this.inspection() ){
            this.parts = JSON.parse(tmp);
        }
    }
    // block move
    move(direction) {
        const tmpX = this.moveX;
        const tmpY = this.moveY;
        switch (direction) {
            case 'left':
                // left
                this.moveX--;
                break;
            case 'right':
                // right
                this.moveX++;
                break;
            case 'down':
                // down
                this.moveY++;
                break;
        }

        if (this.inspection()) {
            this.moveX = tmpX;
            this.moveY = tmpY;
            if (direction == 'down') return true;
        }
    }
    // get block max size
    maxSize() {
        const res = {w: 0, h: 0};
        this.parts.map(parts => {
            res.w = Math.max(parts.x, res.w);
            res.h = Math.max(parts.y, res.h);
        });
        res.width = (res.w + 1) * this.blockSize;
        res.height = (res.h + 1) * this.blockSize;

        return res;
    }
    // block type init
    init() {
        this.blockType = [
            {
                // □□□
                color: 'skyblue',
                parts: [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 2, y: 0},
                ]
            },
            {
                // □ □
                // □□□
                color: 'yellow',
                parts: [
                    {x: 0, y: 0},
                    {x: 2, y: 0},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: 2, y: 1},
                ]
            },
            {
                // □□
                //  □□
                color: 'red',
                parts: [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 2, y: 1},
                ]
            },
            {
                // □□
                // □□
                color: 'green',
                parts: [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                ]
            },
            {
                // □□
                // □□□
                color: 'purple',
                parts: [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: 2, y: 1},
                ]
            },
            {
                // □
                // □□□□
                color: 'orange',
                parts: [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: 2, y: 1},
                    {x: 3, y: 1},
                ]
            },
            {
                // □□□□□
                color: 'blue',
                parts: [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 2, y: 0},
                    {x: 3, y: 0},
                    {x: 4, y: 0},
                ]
            },
        ]
    }
    // canvas draw
    draw() {
        this.ctx.fillStyle = this.color;
        this.parts.map(parts => {
            this.ctx.fillRect(
                (parts.x + this.moveX) * this.blockSize + this.x,
                this.defaultStageTop + ((parts.y + this.moveY) * this.blockSize) + this.y,
                this.blockSize,
                this.blockSize
            );
        })
    }
}