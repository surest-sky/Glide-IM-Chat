import { Avatar, Badge, Input, List, Select, Spin } from '@arco-design/web-react';
import RightMenu from '@right-menu/core';
import { useRequest } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import lodash, { orderBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getContactsList } from 'src/api/chat/contacts';
import { loadMessageByUid } from 'src/services/message'
import { MessageType } from 'src/core/message';
import { getAuthInfo } from 'src/services/auth';
import { addBlukContacts, getMessagesByOnelastMessage, switchRoom } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { ContactOpend, ContactStatus } from 'src/services/enum';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { timeAgo } from 'src/utils/Utils';
import './styles/menu.scss';
import Category from './wrapper/category';

const Menu = () => {
    const options = [];
    const location = useLocation()
    const [cateId, setCateId] = useState(0)
    const dispatch = useDispatch();
    const userInfo = getAuthInfo();
    const childCateModal = useRef();
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _contactsList = useLiveQuery(() => db.contacts.toArray())
    const [contactsList, setContactList] = useState([])
    const curUser = useRef(null)
    const selfUser = {
        avatar: '',
        name: userInfo.NickName + "(自己)",
        message_count: 0,
        uid: userInfo.Uid,
        motto: '',
        category_ids: [],
        status: ContactStatus.online,
        opend: ContactOpend.opend,
        isMe: true
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

    // 加载会话列表
    const loadUsers = async (users) => {
        const me_uid = parseInt(userInfo.Uid)
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
            })

            // 检测 lastMessage mid 是否大于或者大于 message
            // 否则异步去拉消息
            syncLoadMessage(localMessage, item.lastMessage, to_id)
        }
        addBlukContacts(_list)
        changechatWithUser(_list.length ? _list[0] : selfUser)
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
    };

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

    const reloadContactList = () => {
        let tempContactList = []
        if (_contactsList) {
            if (cateId === 0) {
                tempContactList = [..._contactsList]
            } else {
                tempContactList = _contactsList.filter(item => {
                    return contactsIsShow(item)
                })
            }
        }

        tempContactList = tempContactList.length ? tempContactList : [selfUser]
        setContactList(tempContactList)
        return tempContactList
    }

    // 格式化消息
    const formatLastMessage = (message) => {
        if (!message) {
            return ''
        }
        if (message.type === MessageType.Image) {
            return "[图片]"
        }
        if (message.type === MessageType.Text) {
            return message.content.replace(/<img[^>]*?src\s*=\s*[""']?([^'"" >]+?)[ '""][^>]*?>/g, '[图片]')
        }
    }

    const contactsIsShow = (item) => {
        if (item.isMe) {
            return true
        }

        if (!item.category_ids) {
            return false
        }

        if (item.category_ids.includes(cateId)) {
            return true
        }

        return false
    }

    useEffect(() => {
        const pathname = location.pathname
        let reg = /\/workspace/
        if (reg.test(pathname)) {
            setCateId(0)
            return
        }
        reg = /\/category\/(\d){1}/
        const res = pathname.match(reg)
        let id = lodash.get(res, 1)
        setCateId(id ? parseInt(id) : 0)
        setCateId((id) => {
            const tempContactList = reloadContactList()
            changechatWithUser(tempContactList[0])
            return id
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    useEffect(() => {
        if (!_contactsList) {
            run()
            return
        }

        if (_contactsList.length < 0) {
            run()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const options = (item) => [
            {
                type: 'li',
                style: { padding: '10px 26px 10px 8px' },
                text: '分类',
                callback: () => {
                    childCateModal.current.setVisible(true)
                    childCateModal.current.setItem(item)
                    curUser.current = item
                },
            },
        ]
        const tempContactList = reloadContactList()
        return () => {
            tempContactList.forEach((item, index) => {
                new RightMenu(`.contact-${item.id}`, options(item))
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_contactsList, cateId])

    return <div className="contacts-container">
        <div className="contacts-menu"><Input placeholder="Search" className="w-full" /></div>
        <div className="flex justify-between contacts-select">
            <Select
                placeholder='Open'
                bordered={false}
            >
                {options.map((option, index) => (
                    <Select.Option key={option} disabled={index === 3} value={option}>
                        {option}
                    </Select.Option>
                ))}
            </Select>
            <Select
                placeholder='Time'
                bordered={false}
            >
                {options.map((option, index) => (
                    <Select.Option key={option} disabled={index === 3} value={option}>
                        {option}
                    </Select.Option>
                ))}
            </Select>
        </div>
        <Spin loading={!contactsList}>
            <List
                dataSource={orderBy(contactsList, 'weight', 'asc')}
                className="contacts-menu-wrapper scrollbar"
                render={(item, index) => (
                    <List.Item key={item.uid} className={`${chatWithUser.uid === item.uid ? 'active' : null} contact-${item.id} `} onClick={() => { changechatWithUser(item) }}>
                        <List.Item.Meta
                            data-id={item.uid}
                            avatar={
                                <Badge count={9} dot color={item.status === ContactStatus.online ? '#00B42A' : '#86909C'}>
                                    <Avatar shape='square'>{item.avatar ? <img src={item.avatar} alt={item.name} /> : item.name}</Avatar>
                                </Badge>
                            }
                            title={`${item.name}#${item.uid}`}
                            description={formatLastMessage(item.lastMessage)}
                        />
                        <div  >
                            {item.message_count ? <span className='item-badge arco-badge-number badge-zoom-appear-done badge-zoom-enter-done'>
                                <span>{item.message_count}</span>
                            </span> : null}
                            <span className="arco-list-item-mini">{timeAgo(item?.lastMessage?.sendAt)} </span>
                        </div>
                    </List.Item>
                )}
            />
        </Spin>

        <Category ref={childCateModal} loadUsers={loadUsers} />
    </div>
}

export default Menu