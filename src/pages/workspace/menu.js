import { List, Avatar, Select, Input } from '@arco-design/web-react';
import { getSessionRecent } from 'src/api/chat/chat'
import { useState, useEffect } from 'react'
import { useRequest } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessages, switchRoom } from 'src/services/chat_db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import './styles/menu.scss';

const Menu = () => {
    const options = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan'];
    const [list, setList] = useState([])
    const dispatch = useDispatch();
    const userInfo = useSelector((state: any) => state.container.userInfo);
    const sessionUser = {
        uid: 543750,
        name: '峰',
        lastMsg: '你吃饭了没有'
    }

    /**
     * 修改聊天对象
     */
    const changechatWithUser = chatWithUser => {
        dispatch(updateChatWithUser({ chatWithUser }));
        window.ChatSession.setToId(chatWithUser.uid);
        switchRoom(userInfo.Uid, chatWithUser.uid);
    };

    const { run, loading } = useRequest(getSessionRecent, {
        manual: true,
        onSuccess: result => {
            // const code = result?.data?.Code
            setList([sessionUser])
            changechatWithUser(sessionUser)
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });

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
            dataSource={list}
            render={(item, index) => (
                <List.Item key={index} className={index === 0 ? 'active' : null}>
                    <List.Item.Meta
                        avatar={<Avatar shape='square'>A</Avatar>}
                        title={item.name}
                        description={item.lastMsg}
                    />
                    <span className="arco-list-item-mini">一分钟前</span>
                </List.Item>
            )}
        />
    </div>
}

export default Menu