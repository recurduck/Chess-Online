import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";

import { boardsService } from "../services/boards-service"
import { boardService } from "../services/board-service"
import { socketService } from "../services/socketService";

import { GameData } from "../cmps/GameData.jsx";
import { useSelector } from "react-redux"

export const Gameroom = () => {
  const params = useParams();
  const history = useHistory();
  const id = params.roomId
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  let user = useSelector(state => state.userModule)


  const fetchGame = async () => {
    const fetchedBoards = await boardsService.getBoardById(id)
    setGame(fetchedBoards)
  }

  const reset = () => {
    fetchGame();
  }

  const onLeavingGame = async () => {
    await boardsService.deleteBoard(id)
    console.log('game deleted');
    history.goBack();
  }
  useEffect(() => {
    async function socketSetup() {
      await socketService.setup();
      socketService.emit("room-id", id);
    socketService.on("update wap", updateSocketBoard);

      console.log('id', id)
    }
    socketSetup()
  }, [])
  const updateSocketBoard = (data) => {
    setBoard(data.board);
  };

  useEffect(() => {
    if (!game) return
    const cellClicked = async (i, j) => {
      const _game = await boardService.cellClicked(i, j, game, user.loggedInUser._id);
      console.log(_game)
      _game && setGame({ ..._game });
    }

    const updateGameBoard = () => {
      const mBoard = game.gameBoard
      const _board = []
      for (let i = 0; i < mBoard.length; i++) {
        for (let j = 0; j < mBoard.length; j++) {
          _board.push(
            <div key={`${i}${j}`}
              className={`cell ${(mBoard[i][j].isMarked && !mBoard[i][j].piece) ? 'hint' : ''} ${mBoard[i][j].isSelected ? 'selected' : ''}`}
              onClick={() => cellClicked(i, j)}>
              {mBoard[i][j].piece}
            </div>
          )
        }
      }
      setBoard(_board);
    }

    updateGameBoard();
    console.log('board Updated: ', game.gameBoard);
  }, [game]);

  //TODO: create cell component
  // redux hold game, and user on the reducer make a function hold and remove from cell Selected..
  if (!game) {
    reset()
    return <div>loading...</div>
  }

  return (
    <div>
      <h1>GameRoom {id}</h1>
      <section className="flex wrap">
        <div className="board">
          {board}
        </div>

        {game.blackPlayer.user ? <GameData game={game} /> : 'waiting for an opponent'}
        <button onClick={() => onLeavingGame()}>Leave Game</button>
      </section>
    </div>
  )
}
