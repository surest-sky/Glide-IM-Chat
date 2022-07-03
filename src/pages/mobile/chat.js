
import { IconLeft } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Editor from './component/editor';
import Messages from './component/message';
import Layout from './component/layout';
import './styles/chat.scss';

const Mobile = () => {
    const navigate = useNavigate();
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const [uid, setUid] = useState(chatWithUser.uid)

    useEffect(() => {
        setUid(chatWithUser.uid)
    }, [chatWithUser])

    return <Layout> <div className='chat-container fade-in-top'>
        <div className='chat-container-top'>
            <IconLeft className='chat-container-top-left' onClick={() => {
                navigate('/m')
            }} />
            <div className='chat-container-top-banner'>
                <h1>Messager </h1>
                <div>和我们一起来了解更多东西吧</div>
            </div>
        </div>

        <div className="chat-message-wrapper scrollbar">
            <Messages />
        </div>

        <div className="chat-message-editor"><Editor /></div>
    </div>
    </Layout>
}

export default Mobile
