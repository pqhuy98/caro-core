import _ from "lodash";

function move(color, x, y) {
    return color + ":" + x + ":" + y;
}

export default class CaroGame {
    constructor() {
        this.moves = [];
        this.colors = ["X", "O"];
        this.gameOver = false;
    }


    play(color, x, y) {
        if (this.gameOver === true) {
            // game already ended
            return false;
        }
        if (this.moves.length > 0 && color === this.moves[this.moves.length - 1].split(":")[0]) {
            // same player
            return false;
        }
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            // invalid coordinate
            return false;
        }
        if (!this.colors.includes(color)) {
            // wrong color
            return false;
        }
        for (let i = 0; i < this.moves.length; i++) {
            let mx = parseInt(this.moves[i].split(":")[1], 10);
            let my = parseInt(this.moves[i].split(":")[2], 10);
            if (x === mx && y === my) {
                // occupied coordinate
                return false;
            }
        }

        let m = move(color, x, y);
        this.moves.push(m);
        let over = this.checkGameOver();
        if (over !== false) {
            this.gameOver = true;
            return over;
        }
        return true;
    }

    undo() {
        this.gameOver = false;
        this.moves.pop();
    }

    checkGameOver() {
        let set = {};
        this.moves.forEach((m) => {
            set[m] = true;
        });
        let dx = [0, 1, 1, 1, 0, -1, -1, -1];
        let dy = [-1, -1, 0, 1, 1, 1, 0, -1];
        for (let i = 0; i < this.moves.length; i++) {
            let m = this.moves[i];
            let [color, x, y] = m.split(":");
            x = parseInt(x, 10);
            y = parseInt(y, 10);
            for (let d = 0; d < dx.length; d++) {
                let cnt = 0;
                for (let i = 0; i < 5; i++) {
                    let m2 = move(color, x + i * dx[d], y + i * dy[d]);
                    if (set[m2] === true) {
                        cnt++;
                    }
                }
                if (cnt >= 5) {
                    return _.range(0, 5).map((i) => {
                        let m2 = move(color, x + i * dx[d], y + i * dy[d]);
                        return m2;
                    });
                }
            }
        }

        return false;
    }
}

