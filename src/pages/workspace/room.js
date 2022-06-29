import { Typography } from '@arco-design/web-react';
import Messages from './components/messages'
import Editor from './components/editor'
import './styles/room.scss';
const { Title } = Typography;

const Room = () => {
    return <div className="w-chat-container">
        <div className="w-chat-header-container">
            <Title heading={6}>峰发如4放</Title>
        </div>

        <div className="w-chat-wrapper scrollbar">
            <Messages />
        </div>

        <div className="w-eidtor-wrapper">
            <Editor />
        </div>
    </div>
}

export default Room