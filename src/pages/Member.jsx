import { useSelector } from 'react-redux';

export function Member() {
  const { loggedInUser } = useSelector(state => state.userModule);
  if (!loggedInUser) return <div> 404 page please login first </div>
  let joined = new Date(loggedInUser.joined * 1000);
  let active = new Date(loggedInUser.last_online * 1000);
  return (
    <div className="member">
      <h1 className="mb-4"><strong>{loggedInUser.name} {loggedInUser.lastName} - Profile</strong></h1>
      <ul className="flex space-around w-75 mb-4">
        <li className="flex column align-center user-info"><p>{loggedInUser.followers.length}</p><p>followers</p></li>
        <li className="flex column align-center user-info"><p>{loggedInUser.game_played}</p><p>Total Game Played</p></li>
        <li className="flex column align-center user-info green"><p>{loggedInUser.win}</p><p>Wins</p></li>
        <li className="flex column align-center user-info red"><p>{loggedInUser.lose}</p><p>Loses</p></li>
        <li className="flex column align-center user-info"><p>{loggedInUser.draw}</p><p>Draws</p></li>
        {/* <li className="flex column align-center user-info"></li> */}
      </ul>
      <div className="user-info-extra">
        <p>Member since: {joined.toDateString()}</p>
        <p>Active: {active.toDateString()}</p>
        <h2 className="mb-4">Game History</h2>
        <ul className="flex wrap">
          {loggedInUser.game_history.map(gameNote => {
            let time = new Date(gameNote.time * 1000)
            return <li key={gameNote.gameNum} className='user-info history flex column space-between'>
              <span className='winner'>Win: {gameNote.win}</span>
              <span className='loser'>Lose: {gameNote.lose}</span>
              <span className='date'>{time.toDateString()}</span>
            </li>
          })}
        </ul>
      </div>
    </div>
  )
}
