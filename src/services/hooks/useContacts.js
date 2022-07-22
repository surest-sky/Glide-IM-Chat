import { useRequest } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getContactsList } from 'src/api/chat/contacts';
import { addBlukContacts, getMessagesByOnelastMessage } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { ContactOpend, ContactStatus } from 'src/services/enum';
import { loadMessageByUid } from 'src/services/message';
import store from 'src/store/index';
import { updateChatWithUser } from 'src/store/reducer/chat';

const useContacts = () => {
    const [contacts, setContacts] = useState([])
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const [user_id, setUserId] = useState(0)
    const [loading, setLoading] = useState(true)
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);

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

    // const contactsIsShow = (item) => {
    //     if (item.isMe) {
    //         return true
    //     }

    //     if (!item.category_ids) {
    //         return false
    //     }

    //     if (item.category_ids.includes(cateId)) {
    //         return true
    //     }

    //     return false
    // }

    // const reloadContactList = () => {
    //     let tempContactList = []
    //     if (_contactsList) {
    //         if (cateId === 0) {
    //             tempContactList = [..._contactsList]
    //         } else {
    //             tempContactList = _contactsList.filter(item => {
    //                 return contactsIsShow(item)
    //             })
    //         }
    //     }

    //     tempContactList = tempContactList.length ? tempContactList : [selfUser]
    //     setContactList(tempContactList)
    //     return tempContactList
    // }


    /**
     * 修改聊天对象
     */
    const changechatWithUser = withUser => {
        if (chatWithUser.uid === withUser.uid) {
            return
        }
        dispatch(updateChatWithUser({ chatWithUser: withUser }));
        window.ChatSession && window.ChatSession.setToId(withUser.uid)
    };

    // 加载会话列表
    const loadUsers = async (users) => {
        const me_uid = parseInt(userInfo.uid)
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
        addBlukContacts(_list)
        changechatWithUser(_list.length ? _list[0] : selfUser)
        setContacts(_list)
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
        let list = []
        if (user_id) {
            list = await db.contacts.where({ "from_id": user_id }).toArray()
        } else {
            return
        }

        if (list.length === 0) {
            run()
            return
        }

        setContacts(orderBy(list, 'weight', 'asc'))
        changechatWithUser(list[0])
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
    }, [user_id])

    return { contacts, loading }
}

export { useContacts };
