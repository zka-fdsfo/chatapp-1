import {createBrowserRouter} from 'react-router-dom'
import Login from './auth/pages/Login'
import Signup from './auth/pages/Signup'
import Home from './auth/pages/home'
import Provider from './auth/components/Provider.jsx'

export const router = createBrowserRouter([
    {     
        path: '/',
        element: <Provider><Home /></Provider>
    },
    {
        path: '/login',
        element: <Login />          
    }
    ,
    {
        path: '/signup',
        element: <Signup />
    }
])