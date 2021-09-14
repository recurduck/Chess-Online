import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { logout } from '../store/actions/userActions';

export const Navbar = () => {
    const { loggedInUser } = useSelector(state => state.userModule);
    const dispach = useDispatch()
    const history = useHistory()
    const onLogout = () => {
        history.push(`/`)
        dispach(logout())
    }
    return (
        <nav className="flex align-center">
            <ul className="flex align-center">
                <li><NavLink to='/home'>Home</NavLink></li>
                <li><NavLink to='/gamerooms'>Games</NavLink></li>
                <li>{!loggedInUser ?
                    <NavLink to='/login'>Login</NavLink>
                    :
                    <NavLink to='/Member/'>{loggedInUser.username}</NavLink>
                }</li>
                {loggedInUser && <li><ExitToAppIcon className="icon" onClick={()=> onLogout()} /></li>}
            </ul>
        </nav>
    )
}
