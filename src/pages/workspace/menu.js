import { Avatar, Input, List, Select } from '@arco-design/web-react';
import { useRequest } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { map, orderBy } from 'lodash';
import { useEffect } from 'react';
import { MessageType } from 'src/core/message'
import { useDispatch, useSelector } from 'react-redux';
import { getSessionRecent } from 'src/api/chat/chat';
import { userInfoApi } from 'src/api/chat/im';
import { addBlukContacts, getMessagesByOnelastMessage, switchRoom } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import './styles/menu.scss';

const Menu = () => {
    const options = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan'];
    const dispatch = useDispatch();
    const userInfo = useSelector((state: any) => state.container.userInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _contactsList = useLiveQuery(() => db.contacts.toArray())
    const selfUser = {
        avatar: '',
        name: userInfo.Nickname + "(自己)",
        message_count: 0,
        uid: userInfo.Uid,
        motto: '',
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
            _list.push({
                lastMessage: message,
                avatar: '',
                name: item.Nickname,
                message_count: 0,
                uid: item.Uid,
                motto: '',
            })
        }
        addBlukContacts(_list)
        changechatWithUser(_list.length ? _list[0] : selfUser)
    }

    /**
     * 修改聊天对象
     */
    const changechatWithUser = withUser => {
        dispatch(updateChatWithUser({ chatWithUser: withUser }));
        switchRoom(userInfo.Uid, withUser.uid);
        window.ChatSession && window.ChatSession.setToId(withUser.uid)
    };

    const { run } = useRequest(getSessionRecent, {
        manual: true,
        onSuccess: result => {
            // const code = result?.data?.Code
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
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        <List
            dataSource={orderBy(_contactsList, 'weight', 'desc')}
            className="contacts-menu-wrapper"
            render={(item, index) => (
                <List.Item key={item.uid} className={chatWithUser.uid === item.uid ? 'active' : null} onClick={() => { changechatWithUser(item) }}>
                    <List.Item.Meta
                        data-id={item.uid}
                        avatar={<Avatar shape='square'>A</Avatar>}
                        title={item.name}
                        description={formatLastMessage(item.lastMessage)}
                    />
                    {item.message_count ? <span className='item-badge arco-badge-number badge-zoom-appear-done badge-zoom-enter-done'>
                        <span>{item.message_count}</span>
                    </span> : null}
                    <span className="arco-list-item-mini">一分钟前</span>
                </List.Item>
            )}
        />
    </div>
}

export default Menu