import { useState, useEffect } from "react"
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Navbar = () => {
    const { loggedInUser } = useSelector(state => state.userModule);
    debugger;
    const [isLoggedin, setIsLoggedIn]  = useState(false)
    // const [reduxUser, setReduxUser] = useState(useSelector(state => state.userModule))
    console.log(loggedInUser);
    // useEffect(() => {
    // //     // const newUser = useSelector(state => state.userModule)
    // //     setLoggedinUser(reduxUser)
    //     console.log('@@@@@@@@@@@change');
    // },[loggedinUser])
    return (
        <nav className="flex align-center">
            <ul className="flex align-center">
                <li><NavLink activeClassName="active" to='/gamerooms'>Games</NavLink></li>
                <li>{!loggedInUser ?
                    <NavLink activeClassName="active" to='/login'>Login</NavLink>
                    :
                    <NavLink activeClassName="active" to='/Member/'>{loggedInUser.username}</NavLink>
                }</li>
            </ul>
        </nav>
    )
}
