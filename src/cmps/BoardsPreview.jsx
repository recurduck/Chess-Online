import { boardsService } from "../services/boards-service"

import { useHistory } from "react-router-dom"
import { useState } from "react"
import { useSelector } from 'react-redux';

export const BoardsPreview = () => {
  const [boards, setBoards] = useState(null)
  const history = useHistory()
  let user = useSelector(state => state.userModule)

  const fetchBoards = async () => {
    const fetchedBoards = await boardsService.query()
    setBoards(fetchedBoards)
  }
  const reset = () => {
    fetchBoards();
  }

  const onCreateNewGame = async () => {
    let { _id, username } = user.loggedInUser
    let newBoard = await boardsService.addBoard({ _id, username, })
    history.push(`/gamerooms/${newBoard._id}`)
  }

  const onAddPlayerToGame = async (boardId) => {
    if (user.loggedInUser) {
      let { _id } = user.loggedInUser
      await boardsService.addPlayerToGame(boardId, _id)
      // socketService.emit('update-board', updatedGameBoard)
      // console.log('updatedGameBoard',updatedGameBoard)

    }
    history.push(`/gamerooms/${boardId}`)
  }

  const getBoardOptions = (board) => {
    if (user.loggedInUser && (board.whitePlayer.user._id === user.loggedInUser._id || (board.blackPlayer.user && board.blackPlayer.user._id === user.loggedInUser._id)))
      return 'back'
    else if (board.blackPlayer.user) return 'Watch'
    else if (user.loggedInUser) return 'Join'
    else return 'Watch'
  }
  if (!boards) {
    reset()
    return <div>loading...</div>
  }

  return (
    <div>
      {user.loggedInUser && <button className="new-game-btn" onClick={() => onCreateNewGame()}>New Game</button>}
      <table className="boards-list">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Players</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(board =>
            <tr key={board._id}>
              <td>{board._id}</td>
              <td>{board.whitePlayer.user.username}</td>
              <td>{board.blackPlayer.user ? board.blackPlayer.user.username : 'pending'}</td>
              <td>{board.blackPlayer.user ? '2' : '1'}/2</td>
              {/* <td><Link to={`/gamerooms/${board._id}`} onClick={() => onAddPlayerToGame(board._id)}> */}
              <td>
                <button onClick={() => onAddPlayerToGame(board._id)}>{getBoardOptions(board)}</button>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

