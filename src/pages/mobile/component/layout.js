import { generateFrontId } from 'src/services/plugins/fingerprint'
import { guestLogin, getToUid } from '../apis/mobile'
import { setLogin, isLogin } from 'src/services/auth';
import { useEffect, useState, useRef } from 'react'
import store from 'src/store/index';
import Loading from 'src/components/Loading'
import { updateAuthInfo } from 'src/store/reducer/container';
import { switchRoom } from 'src/services/chat_db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { initChatSession } from 'src/core/services'
import { get } from 'lodash'
import '../styles/mobile.scss';

const Layout = (props) => {
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
        console.log('uid', _uid)
    }

    const login = async () => {
        let result = await guestLogin({ fingerprint_id: frontId.current })
        const data = result?.data?.Data
        userInfo.current = data
        store.dispatch(updateAuthInfo(data));
        setLogin(data)
        loadWidthUser()

    }

    useEffect(() => {
        if (!isLogin()) {
            generateFrontId().then(v => {
                frontId.current = v
                login()
                setLoading(false)
            })
        } else {
            loadWidthUser()
            setLoading(false)
        }

    }, [])

    if (loading) {
        return <Loading text="Loading" />
    }

    return props.children
}

export default Layout