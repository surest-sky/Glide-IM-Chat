import { Typography } from '@arco-design/web-react';
import RightMenu from '@right-menu/react';
import { useSelector } from 'react-redux';
import { removeMessages } from 'src/services/chat_db';
import Editor from './components/editor';
import Messages from './components/messages';
import './styles/room.scss';
const { Title } = Typography;

const Room = () => {
    const userInfo = useSelector((state: any) => state.container.userInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
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

    return <div className="w-chat-container">
        <div className="w-chat-header-container">
            <Title heading={6}>{chatWithUser.name} (#{chatWithUser.uid})</Title>
        </div>

        <RightMenu theme={''} minWidth={200} maxWidth={200} onAfterInit={() => { }} onBeforeInit={() => { }} options={roomOptions}>
            <div className="w-chat-wrapper scrollbar">
                <Messages />
            </div>
        </RightMenu>

        <div className="w-eidtor-wrapper">
            <Editor />
        </div>
    </div>
}

export default Room