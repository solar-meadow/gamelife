'use strict';

class Matrix extends Array {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.direction = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];
    }
    create() {
        let matrix = [];
        this.matrix = matrix;
        let n = 1;
        for (let i = 0; i < this.x; i++) {
            matrix[i] = [];
            for (let k = 0; k < this.y; k++) {
                matrix[i][k] = {
                    before: 0,
                    after: 0,
                };
                n++;
            }
        }
    }
    get(x, y) {
        return this.matrix[x][y];
    }

    set(x, y, obj) {
        this.matrix[x][y] = obj;
    }
    findNeighbours(x, y) {
        let neighbors = [];
        for (const [w, h] of this.direction) {
            const neighborsX = x + w;
            const neighborsY = y + h;

            if (
                neighborsX >= 0 &&
                neighborsX < this.x &&
                neighborsY >= 0 &&
                neighborsY < this.y
            ) {
                neighbors.push(this.matrix[neighborsX][neighborsY]);
            }
        }
        return neighbors;
    }
}

class Game extends Matrix {
    constructor(x, y) {
        super(x, y);
    }

    show() {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let k = 0; k < this.matrix[i].length; k++) {
                process.stdout.write(String(this.matrix[i][k].after));
            }
            console.log();
        }
        console.log('----------------GAME_LIFE---------------------');
        this.clear();
    }

    findAliveCell(x, y) {
        let neighbours = this.findNeighbours(x, y);
        let aliveCells = 0;
        neighbours.forEach((cell) => {
            if (cell.before === 1) {
                aliveCells++;
            }
        });
        return aliveCells;
    }
    onestep() {
        this.stepSurvivalCells();
        this.stepBornCells();
    }

    stepSurvivalCells() {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let k = 0; k < this.matrix[i].length; k++) {
                let aliveCells = this.findAliveCell(i, k);
                let currentCell = this.get(i, k);
                if (aliveCells > 3 || aliveCells < 2) {
                    this.matrix[i][k].after = 0;
                }
                if (aliveCells <= 2 && currentCell.before === 0) {
                    this.matrix[i][k].after = 0;
                }
            }
        }
    }
    stepBornCells() {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let k = 0; k < this.matrix[i].length; k++) {
                let aliveCells = this.findAliveCell(i, k);
                let currentCell = this.get(i, k);
                if (aliveCells === 3) {
                    this.matrix[i][k].after = 1;
                }
                if (aliveCells === 2 && currentCell.before === 1) {
                    this.matrix[i][k].after = 1;
                }
            }
        }
    }

    clear() {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let k = 0; k < this.matrix[i].length; k++) {
                if (this.matrix[i][k].before !== this.matrix[i][k].after) {
                    this.matrix[i][k].before = this.matrix[i][k].after;
                }
            }
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let game = new Game(20, 20);
game.create();

game.matrix[0][1] = { before: 1, after: 1 };
game.matrix[1][1] = { before: 1, after: 1 };
game.matrix[2][1] = { before: 1, after: 1 };

const main = async () => {
    while (true) {
        console.clear();
        game.show();
        game.onestep();

        await sleep(500);
    }
};
main();
