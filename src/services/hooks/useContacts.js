import { useRequest } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { orderBy, filter, get, map, sum } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getContactsList } from 'src/api/chat/contacts';
import { addBlukContacts, getMessagesByOnelastMessage } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { ContactOpend, ContactStatus } from 'src/services/enum';
import { loadMessageByUid } from 'src/services/message';
import store from 'src/store/index';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { switchRoom } from 'src/services/chat_db';
import { useNetwork } from 'ahooks'

const useContacts = () => {
    const { pathname } = useLocation()
    const [contacts, setContacts] = useState([])
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const [user_id, setUserId] = useState(0)
    const [loading, setLoading] = useState(true)
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const db_contacts = useLiveQuery(() => db.contacts.toArray(), [chatWithUser])
    const [unReadCount, setUnReadCount] = useState(0)
    const { online } = useNetwork()

    const selfUser = {
        avatar: '',
        name: userInfo.nick_name + "(自己)",
        message_count: 0,
        uid: userInfo.uid,
        motto: '',
        category_ids: [],
        status: ContactStatus.online,
        opend: ContactOpend.opend,
        isMe: true
    }

    const dispatch = (callback) => {
        store.dispatch(callback)
    }

    const getCategoryId = () => {
        let reg = /\/workspace/
        if (reg.test(pathname)) {
            return 0
        }
        reg = /\/category\/(\d+){1}/
        const res = pathname.match(reg)
        let id = get(res, 1)
        return id
    }

    const syncLoadMessage = (localMessage, remoteMessage, to_id) => {
        const local_mid = localMessage?.mid
        const remote_mid = remoteMessage?.mid
        if (local_mid && !remote_mid) {
            return
        }
        if (local_mid > remote_mid) {
            return
        }
        if (!remote_mid) {
            return
        }
        // 拉所有的消息
        let params = {}
        if (local_mid) {
            params = {
                pageSize: 10,
                end_mid: local_mid,
                to: to_id,
                page: 1,
            }
        } else {
            params = {
                pageSize: 10,
                to: to_id,
                page: 1
            }
        }

        loadMessageByUid(params)
    }

    /**
     * 修改聊天对象
     */
    const changechatWithUser = withUser => {
        if (chatWithUser.uid === withUser.uid) {
            return
        }
        dispatch(updateChatWithUser({ chatWithUser: withUser }));
        window.ChatSession && window.ChatSession.setToId(withUser.uid)
        switchRoom(withUser.uid)
    };

    const loadMessages = async (users, me_uid) => {
        const _list = []
        for (let i = 0; i < users.length; i++) {
            const item = users[i]
            const to_id = parseInt(item.uid)
            const localMessage = await getMessagesByOnelastMessage(to_id, me_uid);
            const isMe = me_uid === to_id
            _list.push({
                lastMessage: localMessage,
                avatar: '',
                name: item.nickname,
                message_count: 0,
                uid: to_id,
                motto: '',
                category_ids: item.categoryIds,
                collect: item.collect,
                status: isMe ? selfUser.status : ContactStatus.offline,
                opend: isMe ? selfUser.opend : ContactOpend.close,
                isMe: isMe,
                from_id: user_id
            })

            // 检测 lastMessage mid 是否大于或者大于 message
            // 否则异步去拉消息
            syncLoadMessage(localMessage, item.lastMessage, to_id)
        }

        return _list
    }

    // 加载会话列表
    const loadUsers = async (users) => {
        const me_uid = parseInt(userInfo.uid)
        const list = loadMessages(users, me_uid)
        addBlukContacts(list)
        let selectUser;
        selectUser = list.length ? list[0] : selfUser
        changechatWithUser(selectUser)
        setContacts(list)
        setLoading(false)
    }

    // 获取聊天记录用户
    const { run } = useRequest(getContactsList, {
        manual: true,
        onSuccess: result => {
            const data = result.data.Data
            loadUsers(data)
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });

    const loadContacts = async () => {
        localStorage.setItem("online", true)
        setTimeout(() => {
            localStorage.removeItem("online")
        }, 5000)
        let list = []
        if (user_id) {
            list = await db.contacts.toArray()
        } else {
            return
        }

        if (list.length === 0) {
            run()
            return
        }

        const cateId = getCategoryId()
        let temp = []
        if (cateId) {
            const filterCate = (item) => {
                if (!Array.isArray(item.category_ids)) {
                    return false
                }
                return item.category_ids.includes(parseInt(cateId))
            }
            temp = filter(orderBy(list, 'weight', 'asc'), filterCate)
        } else {
            temp = orderBy(list, 'weight', 'asc')
        }
        setContacts(temp)
        !chatWithUser?.uid && changechatWithUser(list[0])
        setLoading(false)
    }

    // 用户信息发生变化的时候
    useEffect(() => {
        if (!userInfo?.uid) {
            return;
        }
        setUserId(userInfo.uid)
    }, [userInfo])

    useEffect(() => {
        loadContacts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id, db_contacts, pathname])

    useEffect(() => {
        if (!contacts) { setUnReadCount(0); return; }
        setUnReadCount(() => {
            return sum(map(contacts, 'message_count'))
        })
    }, [contacts])

    useEffect(() => {
        if (!online) {
            alert('网络连接失败 !!')
        }
        if (online) {
            setTimeout(() => {
                const o = localStorage.getItem("online")
                console.log('network', online, o)
                if (!o) { run() }
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [online])

    return { contacts, loading, changechatWithUser, loadUsers, unReadCount }
}

export { useContacts };
