import { generateFrontId } from 'src/services/plugins/fingerprint'
import { guestLogin, getToUid } from '../apis/mobile'
import { userInfoApi } from 'src/api/chat/im';
import { Outlet, useNavigate } from 'react-router-dom';
import { Modal } from '@arco-design/web-react';
import { setLogin, isLogin } from 'src/services/auth';
import { useEffect, useState, useRef } from 'react'
import store from 'src/store/index';
import Loading from 'src/components/Loading'
import { useSearchParams } from 'react-router-dom';
import { updateAuthInfo } from 'src/store/reducer/container';
import { switchRoom, addBlukContacts } from 'src/services/chat_db';
import { ContactOpend, ContactStatus } from 'src/services/enum'
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
        switchRoom(userInfo.current.uid, uid)
    }

    // 获取用户信息
    const getUsersByIds = async (ids) => {
        const { data } = await userInfoApi({ uid: ids })
        return data.Data
    }

    const loadWidthUser = async () => {
        const result = await getToUid()
        const _uid = get(result, 'data.Data.uid')
        const users = await getUsersByIds([_uid])
        const user = users[0]
        const contacts = [
            {
                lastMessage: "",
                avatar: '',
                name: user.nick_name,
                message_count: 0,
                uid: user.uid,
                motto: '',
                category_ids: user.category_ids,
                collect: user.collect,
                status: ContactStatus.offline,
                opend: ContactOpend.close,
                isMe: false,
            }
        ]
        addBlukContacts(contacts)
        store.dispatch(updateChatWithUser({
            chatWithUser: contacts[0]
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