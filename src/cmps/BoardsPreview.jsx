import { Link, useHistory } from "react-router-dom"
import { useState } from "react"
import { boardsService } from "../services/boards-service"
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
    console.log(newBoard._id)
    history.push(`/gamerooms/${newBoard._id}`)
  }

  const onAddPlayerToGame = async (boardId) => {
    if (user.loggedInUser) {
      let { _id } = user.loggedInUser
      await boardsService.addPlayerToGame(boardId, _id)
    }
    history.push(history.push(`/gamerooms/${boardId}`))
  }

  const getBoardOptions = (board) => {
    if (user.loggedInUser && (board.whitePlayer.user._id === user.loggedInUser._id || board.blackPlayer.user._id === user.loggedInUser._id)) 
      return 'back'
    else if (board.blackPlayer.user)
      return 'Watch'
    else return 'Join'
  }
  if (!boards) {
    reset()
    return <div>loading...</div>
  }

  return (
    <div>
      {user.loggedInUser && <button onClick={() => onCreateNewGame()}>New Game</button>}
      <table>
        <thead>
          <tr>
            <td>Room ID</td>
            <td>Player 1</td>
            <td>Player 2</td>
            <td>Players</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {boards.map(board =>
            <tr key={board._id}>
              <td>{board._id}</td>
              <td>{board.whitePlayer.user.username}</td>
              <td>{board.blackPlayer.user ? board.blackPlayer.user.username : 'pending'}</td>
              <td>{board.blackPlayer.user ? '2' : '1'}/2</td>
              <td><Link to={`/gamerooms/${board._id}`} onClick={() => onAddPlayerToGame(board._id)}>
                {getBoardOptions(board)}
              </Link></td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

