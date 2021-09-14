// import { userService } from "../services/user-service.js"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux'


import {
    login,
    signup
} from '../store/actions/userActions'

export const LoginModal = () => {
    const [user, setUser] = useState({ username: '', password: '' })
    const [registerUser, setRegisterUser] = useState({ username: '', password: '', firstName: '', lastName: '', email: '' })
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

    const doRegister = async ev => {
        ev.preventDefault()
        const { username, password, firstName, lastName, email } = registerUser
        if (!username || !password || !firstName || !lastName || !email) {
            //   return this.setState({ msg: 'Please enter user/password' })
            console.log('Please enter all fields')
        }
        const userCreds = { username, password, firstName, lastName, email }
        try {
            dispatch(signup(userCreds))
            setRegisterUser({ username: '', password: '', firstName: '', lastName: '', email: '' })
            history.goBack();
        } catch (err) {
            //   this.setState({ msg: 'Login failed, try again.' })
            console.log('Login failed, try again.')
        }
    }

    return (
        <div className='login-modal flex'>
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
                    </div>
                </div>
            </form>
            <form className="flex column align-center w-100" onSubmit={doRegister}>
                <div className="form-inputs flex column w-75">
                    <span>
                        <input className="slide-up" id="card"
                            type="text"
                            placeholder="Enter username"
                            value={registerUser.username}
                            onChange={ev => setRegisterUser({ ...registerUser, username: ev.target.value })}
                            required />
                        <label htmlFor="card">Username</label>
                    </span>
                    <span>
                        <input className="slide-up" id="card"
                            type="password"
                            placeholder="Enter Password"
                            value={registerUser.password}
                            onChange={ev => setRegisterUser({ ...registerUser, password: ev.target.value })}
                            required />
                        <label htmlFor="card">Password</label>
                    </span>
                    <span>
                        <input className="slide-up" id="card"
                            type="text"
                            placeholder="Enter first name"
                            value={registerUser.name}
                            onChange={ev => setRegisterUser({ ...registerUser, firstName: ev.target.value })}
                            required />
                        <label htmlFor="card">First name</label>
                    </span>
                    <span>
                        <input className="slide-up" id="card"
                            type="text"
                            placeholder="Enter Last name"
                            value={registerUser.lastName}
                            onChange={ev => setRegisterUser({ ...registerUser, lastName: ev.target.value })}
                            required />
                        <label htmlFor="card">Last name</label>
                    </span>
                    <span>
                        <input className="slide-up" id="card"
                            type="text"
                            placeholder="Enter e-mail adress"
                            value={registerUser.email}
                            onChange={ev => setRegisterUser({ ...registerUser, email: ev.target.value })}
                            required />
                        <label htmlFor="card">E-mail</label>
                    </span>
                    <div className="flex space-around">
                        <button className="btn-login w-25 center" type="submit">Register</button>
                    </div>
                </div>
            </form>
        </div>)
}