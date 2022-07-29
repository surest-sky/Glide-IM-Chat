import { filter, get, orderBy } from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getContactsList } from 'src/api/chat/contacts';
import { getMessagelist } from 'src/api/chat/messages';
import { useLiveQuery } from 'dexie-react-hooks';
import { addBlukContacts, getMessagesByOnelastMessage, getMyLastMessageMid, switchRoom } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { ContactOpend, ContactStatus } from 'src/services/enum';
import { add } from 'src/services/message';
import store from 'src/store/index';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { getAuthInfo } from '../auth';

const useContacts = () => {
    const { pathname } = useLocation()
    const [contacts, setContacts] = useState([])
    const userInfo = getAuthInfo()
    const [loading, setLoading] = useState(true)
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const [unReadCount, setUnReadCount] = useState(0)
    const db_contacts = useLiveQuery(() => db.contacts.toArray())
    const me_id = userInfo.uid

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

    const convertContactLastMessage = async (users) => {
        const _list = []
        let count = 0
        for (let i = 0; i < users.length; i++) {
            const item = users[i]
            const to_id = parseInt(item.uid)
            const isMe = me_id === to_id
            count += item.message_count
            _list.push({
                lastMessage: item.lastMessage ? item.lastMessage : await getMessagesByOnelastMessage(to_id, me_id),
                avatar: '',
                name: item.nickname,
                message_count: item.message_count,
                uid: to_id,
                motto: '',
                category_ids: item.categoryIds,
                collect: item.collect,
                status: isMe ? selfUser.status : ContactStatus.offline,
                opend: isMe ? selfUser.opend : ContactOpend.close,
                isMe: isMe,
                from_id: me_id
            })
        }
        setUnReadCount(count)
        return _list
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
        setContacts((contacts) => {
            return contacts.map(contact => {
                const _contact = Object.assign({}, contact)
                if (contact.uid === withUser.uid) {
                    _contact.message_count = 0
                }
                return _contact
            })
        })
    };

    // 获取聊天记录用户
    const lodaContacts = async () => {
        const result = await getContactsList()
        const data = result.data.Data
        const list = await convertContactLastMessage(data)
        await addBlukContacts(list)
        return list
    }


    const setContactsList = async () => {
        let constactsList = await db.contacts.where({ from_id: me_id }).toArray()
        // 条件检查
        // 把本地的和远程的最后一条消息做一次对比。如果本地小于远程，则拉取他们中间的差额
        const lastMid = await getMyLastMessageMid(me_id)
        let { data: { Data } } = await getMessagelist({
            page: 1,
            pageSize: 200,
            end_mid: lastMid
        });
        Data = Array.isArray(Data) ? Data : []
        if (Data.length > 0 || constactsList.length === 0) {
            await add(Data, me_id)
            constactsList = await lodaContacts()
        }
        const cateId = getCategoryId()
        if (cateId) {
            const filterCate = (item) => {
                if (!Array.isArray(item.category_ids)) { return false }
                return item.category_ids.includes(parseInt(cateId))
            }
            constactsList = filter(orderBy(constactsList, 'weight', 'asc'), filterCate)
        } else {
            constactsList = orderBy(constactsList, 'weight', 'asc')
        }
        setContacts(constactsList)
        setLoading(false)
        return constactsList
    }

    useEffect(() => {
        if (!db_contacts) { return; }
        if (db_contacts.length > contacts.length) {
            setContactsList()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db_contacts])

    return { contacts, loading, changechatWithUser, lodaContacts, setContactsList, unReadCount }
}

export { useContacts };
