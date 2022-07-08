
import Routers from './routers/index';
import { useEffect } from 'react'
import dayjs from 'dayjs'
import './static/main.scss';
import './static/animistr.css'
require('dayjs/locale/zh-cn')


function App() {
    useEffect(() => {
        dayjs.locale('zh-cn')
    }, [])
    return <Routers />
}

export default App;
