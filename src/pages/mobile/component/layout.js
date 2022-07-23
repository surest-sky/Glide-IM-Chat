import { get } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { addContact } from 'src/api/chat/contacts';
import Loading from 'src/components/Loading';
import { initChatSession } from 'src/core/services';
import { getAuthInfo, isLogin, setLogin } from 'src/services/auth';
import { addBlukContacts } from 'src/services/chat_db';
import { isNewContact, switchRoom } from 'src/services/chat_db';
import { generateFrontId } from 'src/services/plugins/fingerprint';
import store from 'src/store/index';
import { updateAuthInfo } from 'src/store/reducer/container';
import { useContacts } from 'src/services/hooks/useContacts';
import { getToUid, guestLogin } from '../apis/mobile';
import '../styles/mobile.scss';


const Layout = (props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(!isLogin())
    const [loadingText, setLoadingText] = useState("loading...")
    const userInfo = useRef()
    const frontId = useRef()
    useContacts()

    const loadChatRoom = (uid) => {
        window.ChatSession.setToId(uid)
        switchRoom(userInfo.current.uid, uid)
    }

    const loadWidthUser = async () => {
        const result = await getToUid()
        const _uid = get(result, 'data.Data.uid')
        localStorage.setItem('with_user_id', _uid)
        if (isNewContact(_uid)) {
            await addContact(_uid)
        }
        initChatSession(() => { loadChatRoom(_uid) })
    }

    const login = async () => {
        let result = await guestLogin({ fingerprint_id: frontId.current })
        const data = result?.data?.Data
        const code = result?.data.Code
        if (code !== 100) {
            setLoadingText("未配置域名, 无法加载!")
            return
        }
        userInfo.current = data
        store.dispatch(updateAuthInfo(data));
        setLogin(data)
        loadWidthUser()
        setLoading(false)
        setTimeout(() => {
            navigate("/m")
        }, 1000)
    }

    useEffect(() => {
        addBlukContacts([])
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
        return <Loading text={loadingText} />
    }

    return <Outlet />
}

export default Layout