// import { userService } from "../services/user-service.js"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux'


import {
    // loadUsers,
    // removeUser,
    login,
    // logout,
    // signup
} from '../store/actions/userActions'

export const LoginModal = () => {
    const [user, setUser] = useState({ username: '', password: '' })
    const dispatch = useDispatch()
    const history = useHistory();

    const doLogin = async ev => {
        ev.preventDefault()
        const { username, password } = user
        if (!username) {
            //   return this.setState({ msg: 'Please enter user/password' })
            console.log('Please enter user/password')
        }
        const userCreds = { username, password }
        try {
            dispatch(login(userCreds))
            setUser({ username: '', password: '' })
            history.goBack();
        } catch (err) {
            //   this.setState({ msg: 'Login failed, try again.' })
            console.log('Login failed, try again.')
        }
    }

    return (
        <div className='login-modal'>
            <form className="flex column align-center" onSubmit={doLogin}>
                <img src="https://picsum.photos/300/300" alt="Avatar" />
                <div className="form-inputs flex column w-75">
                    <span>
                        <input className="slide-up" id="card"
                            type="text"
                            placeholder="Enter username"
                            value={user.username}
                            onChange={ev => setUser({ ...user, username: ev.target.value })}
                            required />
                        <label htmlFor="card">Username</label>
                    </span>
                    <span>
                        <input className="slide-up" id="card"
                            type="password"
                            placeholder="Enter Password"
                            value={user.password}
                            onChange={ev => setUser({ ...user, password: ev.target.value })}
                            required />
                        <label htmlFor="card">Password</label>
                    </span>
                    <div className="flex space-around">
                        <button className="btn-login w-25 center" type="submit">Login</button>
                        <button className="btn-login w-25 center" type="submit">Register</button>
                    </div>
                </div>
            </form>
        </div>)
}