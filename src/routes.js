import { Home } from './pages/Home.jsx'
import { Gamerooms } from './pages/Gamerooms.jsx'
import { Gameroom } from './pages/Gameroom.jsx'
import { Member } from './pages/Member.jsx'
import { Login } from './pages/Login.jsx'
import { Admin } from './pages/Admin.jsx'

export const routes = [
    {
        path: '/gamerooms/',
        component: Gamerooms
    },
    {
        path: '/gamerooms/:roomId',
        component: Gameroom
    },
    {
        path: '/login/',
        component: Login
    },
    {
        path: '/Member/:userId',
        component: Member,
    },
    {
        path: '/Admin/:userId',
        component: Admin,
    },
    {
        path: '/',
        component: Home,
    }
]