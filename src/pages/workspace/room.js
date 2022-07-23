import { Spin, Tag, Typography } from '@arco-design/web-react';
import RightMenu from '@right-menu/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { removeMessages } from 'src/services/chat_db';
import { getSessionId } from 'src/services/message';
import { ContactStatus } from 'src/services/enum';
import Editor from './components/editor';
import Messages from './components/messages';
import './styles/room.scss';
const { Title } = Typography;

const Room = () => {
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);

    /**
     * 关闭会话
     */
    // const closeSession = () => {
    //     setCloseLoading(true)
    //     setTimeout(() => {
    //         setCloseLoading(false)
    //         Message.success("关闭会话成功")
    //     }, 2000)
    // }

    useEffect(() => {
        if (!chatWithUser.uid || !userInfo.uid) { return; }
        const options = () => [
            {
                type: 'li',
                style: { padding: '5px', cursor: 'pointer' },
                text: '清空',
                callback: () => {
                    const session_id = getSessionId(userInfo.uid, chatWithUser.uid);
                    removeMessages({ session_id });
                },
            }];
        new RightMenu(`.w-chat-wrapper`, options());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatWithUser, userInfo])

    return <Spin loading={chatWithUser.uid === 0} className="w-chat-container">
        <div className="flex items-baseline justify-between w-chat-header-container">
            <div className="flex items-baseline w-200">
                <Title heading={6}>{chatWithUser.name} (#{chatWithUser.uid})</Title>
                <div className="ml-2 w-chat-header-tags">
                    {/* {chatWithUser.opend === ContactOpend.opend ? <Tag color="#00b42a">{'会话中'}</Tag> : <Tag color="#86909c">{'已结束'}</Tag>} */}
                    {chatWithUser.status === ContactStatus.online ? <Tag color="#00b42a">{'在线'}</Tag> : <Tag color="#86909c">{'离线'}</Tag>}
                </div>
            </div>
            {/* <Tooltip content='关闭会话后, 将关闭客户聊天窗口(客户可以点击发送消息, 重新进入)'>
                <Button loading={closeLoading} onClick={closeSession} type='dashed' className="mr-10" size='small' icon={<IconCloseCircle />}>
                    Close
                </Button>
            </Tooltip> */}
        </div>

        <Messages />

        <div className="w-eidtor-wrapper">
            <Editor />
        </div>
    </Spin>
}

export default Room