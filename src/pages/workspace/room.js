import { Typography, Spin, Message, Tooltip, Button, Tag } from '@arco-design/web-react';
import RightMenu from '@right-menu/react';
import { useSelector } from 'react-redux';
import { removeMessages } from 'src/services/chat_db';
import { IconCloseCircle } from '@arco-design/web-react/icon';
import Editor from './components/editor';
import Messages from './components/messages';
import { useState } from 'react'
import { ContactOpend, ContactStatus } from 'src/services/enum'
import './styles/room.scss';
const { Title } = Typography;

const Room = () => {
    const userInfo = useSelector((state: any) => state.container.userInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const [closeLoading, setCloseLoading] = useState(false);
    const roomOptions: OptionsType = [
        {
            type: 'li',
            style: { padding: '10px 26px 10px 8px' },
            text: '清空',
            callback: () => {
                removeMessages(userInfo.Uid, chatWithUser.uid);
            },
        },
    ];

    /**
     * 关闭会话
     */
    const closeSession = () => {
        setCloseLoading(true)
        setTimeout(() => {
            setCloseLoading(false)
            Message.success("关闭会话成功")
        }, 2000)
    }

    return <Spin loading={chatWithUser.uid === 0} className="w-chat-container">
        <div className="w-chat-header-container flex items-baseline justify-between">
            <div className="w-200 flex items-baseline">
                <Title heading={6}>{chatWithUser.name} (#{chatWithUser.uid})</Title>
                <div className="ml-2 w-chat-header-tags">
                    {chatWithUser.opend === ContactOpend.opend ? <Tag color="#00b42a">{'会话中'}</Tag> : <Tag color="#86909c">{'已结束'}</Tag>}
                    {chatWithUser.status === ContactStatus.online ? <Tag color="#00b42a">{'在线'}</Tag> : <Tag color="#86909c">{'离线'}</Tag>}
                </div>
            </div>
            <Tooltip content='关闭会话后, 将关闭客户聊天窗口(客户可以点击发送消息, 重新进入)'>
                <Button loading={closeLoading} onClick={closeSession} type='dashed' className="mr-10" size='small' icon={<IconCloseCircle />}>
                    Close
                </Button>
            </Tooltip>
        </div>

        <RightMenu theme={''} minWidth={200} maxWidth={200} onAfterInit={() => { }} onBeforeInit={() => { }} options={roomOptions}>
            <div className="w-chat-wrapper scrollbar">
                <Messages />
            </div>
        </RightMenu>

        <div className="w-eidtor-wrapper">
            <Editor />
        </div>
    </Spin>
}

export default Room