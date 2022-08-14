import { useEffect, useState } from "react";
import Square from "./square";
import './board.css';
import { io } from "socket.io-client";

const socket = io('https://gametictoe.herokuapp.com/');

function Board() {
    const [value, setValue] = useState(Array(9).fill(null));
    const [xIsNext,setxIsNext] = useState(true);
    const winner = calculateWinner(value);
    let status;

    useEffect(() => {
        socket.on("connect", () => {
            console.log('已連線');
        });

        socket.on("new", (data, whichPlayer) => {
            console.log('新資料',data);
            console.log('現在換誰',whichPlayer);
            document.querySelector('.game-stopper').style.display = 'none';
            setValue(data);
            setxIsNext(whichPlayer);
        })
    }, []);

    if (winner) {
        status = '勝利者是' + winner + '方';
    } else {
        status = '這一回合是 ' + (xIsNext ? 'X' : 'O');
    }

    function mark(i) {
        if (calculateWinner(value) || value[i]) {
            return;
        }
        const squares = value.slice();
        squares[i] = xIsNext ? 'X' : 'O';
        setValue(squares);
        setxIsNext(!xIsNext);
        socket.emit('record', squares, !xIsNext);
        document.querySelector('.game-stopper').style.display = 'block';
    }

    function calculateWinner(value) {
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (value[a] && value[a] === value[b] && value[a] === value[c]) {
                return value[a];
            }
        }
        return null;
    }

    return(
        <>
            <div className="game-stopper"></div>
            <h1 className="game-name">Tic Tac Toe</h1>
            <div className="board-row">
                <Square value={value[0]} mark={() => {mark(0)}}/>
                <Square value={value[1]} mark={() => {mark(1)}} />
                <Square value={value[2]} mark={() => {mark(2)}} />
            </div>
            <div className="board-row">
                <Square value={value[3]} mark={() => {mark(3)}} />
                <Square value={value[4]} mark={() => {mark(4)}} />
                <Square value={value[5]} mark={() => {mark(5)}} />
            </div>
            <div className="board-row">
                <Square value={value[6]} mark={() => {mark(6)}} />
                <Square value={value[7]} mark={() => {mark(7)}} />
                <Square value={value[8]} mark={() => {mark(8)}} />
            </div>
            <h3 className="game-status">{status}</h3>
        </>
    );
}

export default Board;