import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Navbar = () => {
    const { loggedInUser } = useSelector(state => state.userModule);
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
            </ul>
        </nav>
    )
}
