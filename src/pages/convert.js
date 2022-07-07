import { useNavigate } from 'react-router-dom';
import Mobile from 'src/pages/mobile';
import { useEffect } from 'react'


const Convert = () => {
    const navigate = useNavigate()

    useEffect(() => {
        window.location.href = "/workspace"
        return
        if (process.env.NODE_ENV === 'production') {
            if (window.location.href.indexOf("chat.surest.cn") >= 0) {
                return <Mobile />
            }
        }
        window.location.href = "/workspace"
        // navigate('/workspace')
    }, [])

    http://127.0.0.1:8089/api


    return <div></div>;
}

export default Convert