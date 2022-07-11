import { Avatar, Input, Badge, List, Select, Spin } from '@arco-design/web-react';
import RightMenu from '@right-menu/core';
import { useRequest } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'src/services/db';
import { map, orderBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getSessionRecent } from 'src/api/chat/chat';
import { userInfoApi } from 'src/api/chat/im';
import { MessageType } from 'src/core/message';
import { getAuthInfo } from 'src/services/auth';
import { addBlukContacts, getMessagesByOnelastMessage, switchRoom } from 'src/services/chat_db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { ContactOpend, ContactStatus } from 'src/services/enum'
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

    // 获取用户信息
    const getUsersByIds = async (ids) => {
        const { data } = await userInfoApi({ Uid: ids })
        return data.Data
    }

    // 加载会话列表
    const loadUsers = async (ids) => {
        let data = await getUsersByIds(ids)
        const uid = userInfo.Uid
        const _list = []
        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            const message = await getMessagesByOnelastMessage(item.Uid, uid);
            const isMe = parseInt(userInfo.Uid) === parseInt(item.uid)
            _list.push({
                lastMessage: message,
                avatar: '',
                name: item.Nickname,
                message_count: 0,
                uid: item.Uid,
                motto: '',
                category_ids: item.CategoryIds,
                collect: item.Collect,
                status: isMe ? selfUser.status : ContactStatus.offline,
                opend: isMe ? selfUser.opend : ContactOpend.close,
                isMe: isMe,
            })
        }
        _list.unshift(selfUser)
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
        console.log(withUser)
        dispatch(updateChatWithUser({ chatWithUser: withUser }));
        switchRoom(userInfo.Uid, withUser.uid);
        window.ChatSession && window.ChatSession.setToId(withUser.uid)
    };

    const { run } = useRequest(getSessionRecent, {
        manual: true,
        onSuccess: result => {
            const data = result.data.Data
            const sids = map(data, 'To')
            loadUsers(sids)
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });

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


    useEffect(() => {
        const id = location.pathname.replace('/category/', '').replace("/category", '')
        setCateId(id ? parseInt(id) : 0)
        setCateId((id) => {
            const _allows = _contactsList ? _contactsList.filter(v => {
                return v.category_ids.includes(id) || id === 0
            }) : []
            if (_allows.length) {
                changechatWithUser(_allows[0])
            } else {
                changechatWithUser(selfUser)
            }
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
        return () => {
            _contactsList && _contactsList.forEach((item, index) => {
                new RightMenu(`.contact-${index}`, options(item))
            })
        }
    }, [_contactsList])

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
        <Spin loading={!_contactsList}>
            <List
                dataSource={_contactsList ? orderBy(_contactsList, 'weight', 'desc') : [selfUser]}
                className="contacts-menu-wrapper scrollbar"

                render={(item, index) => (
                    <List.Item key={item.uid} data-cate-id={cateId} className={`${chatWithUser.uid === item.uid ? 'active' : null} contact-${index} ${(item.isMe || cateId === 0 || item.category_ids.includes(cateId)) ? '' : 'hidden'}`} onClick={() => { changechatWithUser(item) }}>
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