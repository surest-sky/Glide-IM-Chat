import { useLiveQuery } from 'dexie-react-hooks';
import { useState, useEffect } from 'react';
import { scrollToBottom } from 'src/utils/Utils';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import HtmlApp from 'src/components/HtmlApp';
import { db } from 'src/services/db';
import xss from 'xss';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const userInfo = useSelector((state: any) => state.container.userInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _messages = useLiveQuery(() => db.activeChat.orderBy('sendAt').toArray());
    const me_id = userInfo.Uid;

    // 延迟触发
    useEffect(() => {
        setMessages(_messages ? _messages : []);
        setTimeout(() => {
            scrollToBottom('.w-chat-wrapper');
        });
    }, [_messages]);

    if (!chatWithUser) {
        return <></>;
    }

    const Message = ({ message }) => {
        const isMe = me_id === message.from
        const sendAt = dayjs(message.SendAt).format('HH:mm a DD-MM');
        return <div className={`flex message-wrapper  ${isMe ? 'message-to flex-row-reverse' : 'message-from flex-row'}`}>
            <img className="message-avatar" src="https://teacher.tutorpage.net/static/media/new-logo-circular.33be506198f72cf366b7.png" alt="message" />
            <div>
                <span className="message-at">{isMe ? userInfo.Nickname : chatWithUser.name} · {sendAt}</span>
                <div className="message-content">
                    <HtmlApp html={xss(message.content)} />
                </div>
            </div>
        </div>
    }

    return messages.map((message, key) => <Message key={key} message={message} />)
}


export default Messages