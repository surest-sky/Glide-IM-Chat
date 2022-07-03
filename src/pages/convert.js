import { useNavigate } from 'react-router-dom';
import Mobile from 'src/pages/mobile';
import { useEffect } from 'react'


const Convert = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            if (window.host.indexOf("mobile") >= 0) {
                return <Mobile />
            }
        }
        navigate('/workspace')
    }, [])


    return <div></div>;
}

export default Convert