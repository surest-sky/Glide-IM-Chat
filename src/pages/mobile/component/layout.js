import { generateFrontId } from 'src/services/plugins/fingerprint'
import { guestLogin, getToUid } from '../apis/mobile'
import { Outlet, useNavigate } from 'react-router-dom';
import { Modal } from '@arco-design/web-react';
import { setLogin, isLogin } from 'src/services/auth';
import { useEffect, useState, useRef } from 'react'
import store from 'src/store/index';
import Loading from 'src/components/Loading'
import { useSearchParams } from 'react-router-dom';
import { updateAuthInfo } from 'src/store/reducer/container';
import { switchRoom } from 'src/services/chat_db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { initChatSession } from 'src/core/services'
import { get } from 'lodash'
import { getAuthInfo } from 'src/services/auth';
import '../styles/mobile.scss';

const Layout = (props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(!isLogin())
    const userInfo = useRef()
    const frontId = useRef()
    const uid = useRef()

    const loadChatRoom = (uid) => {
        window.ChatSession.setToId(uid)
        switchRoom(userInfo.current.Uid, uid)
    }

    const loadWidthUser = async () => {
        const result = await getToUid()
        const _uid = get(result, 'data.Data.uid')
        store.dispatch(updateChatWithUser({
            chatWithUser: {
                uid: _uid,
            }
        }));
        uid.current = _uid
        initChatSession(() => { loadChatRoom(_uid) })
    }

    const login = async () => {
        let result = await guestLogin({ fingerprint_id: frontId.current })
        const data = result?.data?.Data
        const code = result?.data.Code
        if (code !== 100) {
            Modal.error({
                title: '未正确配置',
            });
            return
        }
        userInfo.current = data
        store.dispatch(updateAuthInfo(data));
        setLogin(data)
        loadWidthUser()
        setLoading(false)
        navigate("/m")
    }

    useEffect(() => {
        if (!isLogin()) {
            generateFrontId().then(v => {
                frontId.current = v
                login()
            })
        } else {
            userInfo.current = getAuthInfo()
            store.dispatch(updateAuthInfo(userInfo.current));
            loadWidthUser()
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const loginP = searchParams.get("login")
        if (parseInt(loginP) === 1) {
            setLoading(true)
            generateFrontId().then(v => {
                frontId.current = v
                login()
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    if (loading) {
        return <Loading text="Loading" />
    }

    return <Outlet />
}

export default Layout