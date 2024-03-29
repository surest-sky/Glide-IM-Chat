
import { IconLeft } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Editor from './component/editor';
import Messages from './component/message';
import { useContacts } from 'src/services/hooks/useContacts';
import './styles/chat.scss';

const Mobile = () => {
    const { changechatWithUser } = useContacts()
    const navigate = useNavigate();
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const [uid, setUid] = useState(chatWithUser.uid)
    const [height, setHeight] = useState(window.innerHeight - 150)

    useEffect(() => {
        setUid(chatWithUser.uid)
    }, [chatWithUser])

    useEffect(() => {
        let withUserInfo = localStorage.getItem("with_user_info")
        if (!withUserInfo) {
            navigate('/m')
            return
        }

        withUserInfo = JSON.parse(withUserInfo)
        if (!withUserInfo.uid) {
            navigate('/m')
            return
        }
        changechatWithUser(withUserInfo)
    }, [])

    const changeHeight = () => {
        setHeight(window.innerHeight - 185 - 200)
    }

    return <div className='chat-container fade-in-top' >
        <div className='chat-container-top'>
            <IconLeft className='chat-container-top-left' onClick={() => {
                navigate('/m')
            }} />
            <div className='chat-container-top-banner'>
                <h1>{chatWithUser.name} (#{uid})</h1>
                {/* <div>和我们一起来了解更多东西吧</div> */}
            </div>
        </div>

        <div className="chat-message-wrapper scrollbar" style={{ height: height }}>
            <Messages />
        </div>

        <div className="chat-message-editor"><Editor changeHeight={changeHeight} /></div>
    </div>
}

export default Mobile
