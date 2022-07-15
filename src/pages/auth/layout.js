import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { isLogin } from 'src/services/auth';
import './styles/auth.scss'

const Layout = () => {
    useEffect(() => {
        if (isLogin()) {
            window.location.href = '/workspace'
        }
    }, [])
    return <Outlet />
}
export default Layout