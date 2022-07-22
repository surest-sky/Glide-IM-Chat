import { Avatar, Badge, Input, List, Select, Spin } from '@arco-design/web-react';
import RightMenu from '@right-menu/core';
import lodash from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { MessageType } from 'src/core/message';
import { ContactStatus } from 'src/services/enum';
import { useContacts } from 'src/services/hooks/useContacts';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { timeAgo } from 'src/utils/Utils';
import './styles/menu.scss';
import Category from './wrapper/category';

const Menu = () => {
    const options = [];
    const location = useLocation()
    const [cateId, setCateId] = useState(0)
    const dispatch = useDispatch();
    const childCateModal = useRef();
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const { contacts, loading } = useContacts()
    const curUser = useRef(null)

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
            // const tempContactList = reloadContactList()
            // changechatWithUser(tempContactList[0])
            return id
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

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
        const tempContactList = []
        return () => {
            tempContactList.forEach((item, index) => {
                new RightMenu(`.contact-${item.id}`, options(item))
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cateId])

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
        <Spin loading={loading}>
            <List
                dataSource={contacts}
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

        <Category ref={childCateModal} />
    </div>
}

export default Menu