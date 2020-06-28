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
        let res = _.cloneDeep(this);
        if (res.gameOver === true) {
            // game already ended
            return null;
        }
        if (res.moves.length > 0 && color === res.moves[res.moves.length - 1].split(":")[0]) {
            // same player
            return null;
        }
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            // invalid coordinate
            return null;
        }
        if (!res.colors.includes(color)) {
            // wrong color
            return null;
        }
        for (let i = 0; i < res.moves.length; i++) {
            let mx = parseInt(res.moves[i].split(":")[1], 10);
            let my = parseInt(res.moves[i].split(":")[2], 10);
            if (x === mx && y === my) {
                // occupied coordinate
                return null;
            }
        }

        let m = move(color, x, y);
        res.moves.push(m);
        let over = res.findFive();
        if (over !== false) {
            res.gameOver = true;
        }
        return res;
    }

    undo() {
        let res = _.cloneDeep(this);
        res.gameOver = false;
        res.moves.pop();
        return res;
    }

    findFive() {
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

