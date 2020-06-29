import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

function move(color, x, y) {
    return color + ":" + x + ":" + y;
}

export default class CaroGame {
    constructor(playerX, playerO) {
        this.id = uuidv4();
        this.moves = [];
        this.colors = ["X", "O"];
        this.players = {
            "X": playerX,
            "O": playerO,
        };
        this.gameOver = false;
    }

    act(action) {
        switch (action.type) {
            case "PLAY":
                return this.constructor.play(this, action);
            case "UNDO":
                return this.constructor.undo(this, action);
            case "NEW_GAME":
                return this.constructor.newGame(this, action);
            default:
                return null;
        }
    }

    static play(state, action) {
        if (!state.isCurrentPlayer(action.playerId)) {
            console.log("0");
            return null;
        }
        let { x, y } = action;
        let color = (state.players.X === action.playerId) ? "X" : "O";
        let res = _.cloneDeep(state);
        if (res.gameOver === true) {
            // game already ended
            console.log("1");
            return null;
        }
        if (res.moves.length > 0 && color === res.moves[res.moves.length - 1].split(":")[0]) {
            // same player
            console.log("2");
            return null;
        }
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            // invalid coordinate
            console.log("3");
            return null;
        }
        if (!res.colors.includes(color)) {
            // wrong color
            console.log("4");
            return null;
        }
        for (let i = 0; i < res.moves.length; i++) {
            let mx = parseInt(res.moves[i].split(":")[1], 10);
            let my = parseInt(res.moves[i].split(":")[2], 10);
            if (x === mx && y === my) {
                // occupied coordinate
                console.log("5");
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

    static undo(state, action) {
        if (!state.isCurrentPlayer(action.playerId)) {
            return null;
        }
        let res = _.cloneDeep(state);
        res.gameOver = false;
        res.moves.pop();
        return res;
    }

    static newGame(state, action) {
        if (state.gameOver) {
            let ps = [state.players.X, state.players.O];
            if (state.isCurrentPlayer(state.players.O)) {
                ps.reverse();
            }
            return new CaroGame(...ps);
        } else {
            return null;
        }
    }

    isCurrentPlayer(playerId) {
        let color;
        if (this.moves.length === 0) {
            color = "X";
        } else {
            color = (this.moves[this.moves.length-1].split(":")[0] === "X") ? "O" : "X";
        }
        return this.players[color] === playerId;
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

