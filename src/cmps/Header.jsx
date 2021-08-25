// import React, {useState} from "react"
import { Link } from "react-router-dom"
import { Navbar } from "./Navbar.jsx"
export const Header = () => {
    // const [user, setUser] = useState(null)
    function toggleMenu(el) {
        console.log(el);
    } 
    return (
        <header className="main-header">
            <section className="header-container container flex main-header space-between align-center">
                <Link className="logo flex align-center" to='/' >Chess</Link>
                <Navbar />
                <button className="menu-btn" onClick={() => toggleMenu(this)}>☰</button>
            </section>
        </header>
    )
}