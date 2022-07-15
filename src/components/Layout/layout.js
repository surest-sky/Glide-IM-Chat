
import { Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCategoryList } from 'src/api/chat/setting';
import { userAuthApi, userInfoApi } from 'src/api/im/im';
import Loading from 'src/components/Loading';
import { initChatSession } from 'src/core/services';
import { getAuthInfo, isLogin } from 'src/services/auth';
import store from 'src/store/index';
import lodash from 'lodash';
import { updateAuthInfo, updateUserInfo, updateCategory } from 'src/store/reducer/container';
import Menus from './components/menus';
import './styles/layout.scss';


const Layout = (props) => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const userInfo = getAuthInfo()
    const reLogin = () => {
        setLoading(false)
        Message.error("请登录 !")
        navigate('/login');
    }

    const loadApp = async () => {
        Promise.all([getCategoryList()]).then((result) => {
            const [category] = result
            const categoryList = lodash.get(category, 'data.Data')
            store.dispatch(updateCategory(categoryList));
        })
    }

    const fetchUserInfo = async (authInfo) => {
        store.dispatch(updateAuthInfo(authInfo));
        const { data } = await userInfoApi({ Uid: [authInfo.Uid] });
        store.dispatch(updateUserInfo(data.Data[0]));
        initChatSession(() => { setLoading(false) })
        loadApp()
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
            <Outlet />
        </div>
    </div>
}

export default Layout