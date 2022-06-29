import { Modal, Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAuthApi, userInfoApi } from 'src/api/im/im';
import { getAuthInfo } from 'src/services/auth';
import Routers from './routers/index';
import store from 'src/store/index';
import { updateAuthInfo, updateUserInfo } from 'src/store/reducer/container';
import Loading from 'src/components/Loading'
import { initChatSession } from 'src/core/services'
import './static/main.scss';
import './static/animistr.css'

function App() {
    const [loading, setLoading] = useState(true)
    const [mode, setMode] = useState('p')
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const reLogin = () => {
        setLoading(false)
        Message.error("请登录 !")
        navigate('/auth');
    }

    const fetchUserInfo = async (authInfo) => {
        const { data } = await userInfoApi({ Uid: [authInfo.Uid] });
        store.dispatch(updateUserInfo(data.Data[0]));
        initChatSession(() => { setLoading(false) })
    };

    function fetchUserAuth() {
        const userInfo = getAuthInfo()
        if (!userInfo || !userInfo.Token) {
            reLogin()
            return
        }
        setLoading(true);
        userAuthApi({ Token: userInfo.Token }).then(res => {
            const data = res.data.Data
            if (!data) {
                reLogin()
            }
            store.dispatch(updateAuthInfo(data));
            fetchUserInfo(data)
        }).catch(err => {
            reLogin()
        })
    }

    useEffect(() => {
        if (['/m', '/m/chat', '/m/s', '/workspace'].includes(pathname)) {
            setMode('m')
            return
        }

        if (['/auth', '/m'].includes(pathname)) {
            setLoading(false)
            return
        }
        fetchUserAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        mode === 'p' ?
            <div className="app">
                <Modal className="room-modal" closeIcon={null} footer={null} visible={true} autoFocus={false} focusLock={true}>
                    {loading ? <Loading text={'启动中'} /> : <Routers />}
                </Modal>
            </div>
            :
            <div className="app-mobile"><Routers /></div>
    );
}

export default App;
