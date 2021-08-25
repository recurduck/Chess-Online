import { boardService } from "../services/board-service";

export const GameData = ({ game }) => {

  function convertMsToMinAndSec(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  return (
    <table className="dev-data">
      <thead>
        <tr><th colSpan="4">Turn: {game.whiteTurn ? 'White' : 'Black'}</th></tr>
        <tr><th colSpan="4">Game Num: {game.countGame}</th></tr>
        <tr><th colSpan="2">White</th><th colSpan="2">Black</th></tr>
      </thead>
      <tbody>
        <tr>
          <th>User:</th>
          <td>{game.whitePlayer.user.username}</td>
          <th>User:</th>
          <td>{game.blackPlayer.user.username}</td>
        </tr>

        <tr>
          <th>Time:</th>
          <td>{convertMsToMinAndSec(game.whitePlayer.time)}</td>
          <th>Time:</th>
          <td>{convertMsToMinAndSec(game.blackPlayer.time)}</td>
        </tr>

        <tr>
          <th>King coord:</th>
          <td>i:{game.whitePlayer.kingPos.i}, j:{game.whitePlayer.kingPos.j}</td>
          <th>King coord:</th>
          <td>i:{game.blackPlayer.kingPos.i}, j:{game.blackPlayer.kingPos.j}</td>
        </tr>

        <tr>
          <th>King moved:</th>
          <td>{game.whitePlayer.kingMoved ? 'true' : 'false'}</td>
          <th>King moved:</th>
          <td>{game.blackPlayer.kingMoved ? 'true' : 'false'}</td>
        </tr>
        <tr>
          <th>Far Rook moved:</th>
          <td>{game.whitePlayer.farRookMoved ? 'true' : 'false'}</td>
          <th>Far Rook moved:</th>
          <td>{game.blackPlayer.farRookMoved ? 'true' : 'false'}</td>
        </tr>
        <tr>
          <th>Close Rook moved:</th>
          <td>{game.whitePlayer.closeRookMoved ? 'true' : 'false'}</td>
          <th>Close Rook moved:</th>
          <td>{game.blackPlayer.closeRookMoved?'true':'false'}</td>
        </tr>
        <tr><td colSpan="4"><button onClick={() => boardService.onReset()}>Reset</button></td></tr>
      </tbody>
    </table>
  )
}

