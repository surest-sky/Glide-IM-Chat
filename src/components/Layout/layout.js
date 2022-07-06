
import { Message } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userAuthApi, userInfoApi } from 'src/api/im/im';
import { initChatSession } from 'src/core/services';
import { getAuthInfo, isLogin } from 'src/services/auth';
import Loading from 'src/components/Loading'
import store from 'src/store/index';
import { updateAuthInfo, updateUserInfo } from 'src/store/reducer/container';
import Menus from './components/menus'
import './styles/layout.scss';


const Layout = (props) => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const userInfo = getAuthInfo()
    const reLogin = () => {
        setLoading(false)
        Message.error("请登录 !")
        navigate('/auth');
    }

    const loadApp = () => {
        setLoading(false)
    }

    const fetchUserInfo = async (authInfo) => {
        const { data } = await userInfoApi({ Uid: [authInfo.Uid] });
        store.dispatch(updateUserInfo(data.Data[0]));
        initChatSession(() => { setLoading(false) })
    };

    function fetchUserAuth() {
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
            console.error(err)
            reLogin()
        })
    }

    useEffect(() => {
        if (!isLogin()) {
            fetchUserAuth()
        }
        fetchUserInfo(userInfo)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading && !isLogin()) {
        return <Loading />
    }

    return <div className="flex space-container">
        <Menus />
        <div className="child-container">
            {props.children}
        </div>
    </div>
}

export default Layout