
import { IconLeft, IconSend } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import './styles/chat.scss';
const Mobile = () => {
    const navigate = useNavigate();
    return <div className='chat-container fade-in-top'>
        <div className='chat-container-top'>
            <IconLeft className='chat-container-top-left' onClick={() => {
                navigate('/m')
            }} />
            <div className='chat-container-top-banner'>
                <h1>Messager </h1>
                <div>和我们一起来了解更多东西吧</div>
                {/* <div className='reply'>
                    Our usual reply time: <b>A few minutes</b>
                </div> */}
            </div>
        </div>

        <div className='chat-message-wrapper'>
            <div className='init-message-wrapper message-wrapper'>
                <div className='init-message-wrapper-title'>👋 点击发送快速触达客服，我们将会尽快回复您的消息</div>
                <div className="flex flex-row-reverse">
                    <div className='init-message'>只浏览</div>
                </div>
                <div className="flex flex-row-reverse">
                    <div className='init-message'>我想了解更多有关对讲机的信息</div>
                </div>
                <div className="flex flex-row-reverse">
                    <div className='init-message'>我是一个对讲机客户，有一个问题。</div>
                </div>
            </div>

            {/* <div className='message-wrapper'>
            </div> */}

            <div className='message-editor'>
                <textarea className='message-editor-input' />
                <IconSend className='message-editor-send' />
            </div>
        </div>
    </div>
}

export default Mobile
