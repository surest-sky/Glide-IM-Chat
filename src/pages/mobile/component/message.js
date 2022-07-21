import RightMenu from '@right-menu/react';
import { Avatar } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HtmlApp from 'src/components/HtmlApp';
import { removeMessage } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { scrollToBottom } from 'src/utils/Utils';
import '../styles/message.scss';


import xss from 'xss';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _messages = useLiveQuery(() => db.activeChat.orderBy('mid').toArray());
    const me_id = userInfo.Uid;

    // 发送撤回消息
    const sendRecallMessage = (mid: number, from: number) => {
        window.ChatSession.sendRecallMessage(mid);
    };

    // 延迟触发
    useEffect(() => {
        setMessages(_messages ? _messages : []);
        console.log(_messages)
        return () => {
            setTimeout(() => {
                scrollToBottom('.chat-message-wrapper');
            }, 0);
        }
    }, [_messages]);

    if (!chatWithUser) {
        return <></>;
    }

    const Message = ({ message }) => {
        const options = [
            {
                type: 'li',
                style: { padding: '10px 26px 10px 8px' },
                text: '撤回',
                callback: () => {
                    sendRecallMessage(message.mid);
                },
            },
            {
                type: 'hr',
            },
            {
                type: 'li',
                style: { padding: '10px 26px 10px 8px' },
                text: '删除',
                callback: () => {
                    removeMessage(message);
                },
            },
        ];
        const isMe = me_id === message.from
        const sendAt = dayjs(message.SendAt).format('HH:mm a DD-MM');
        const avatar = isMe ? userInfo.avatar : chatWithUser.avatar
        return <div className={`flex message-wrapper  ${isMe ? 'message-to flex-row-reverse' : 'message-from flex-row'}`}>
            {avatar ? <img className="message-avatar" src={avatar} alt="message" /> : <Avatar className="">Messager</Avatar>}
            <div className={isMe ? 'mr-1' : 'ml-1'}>
                <span className="message-at" data-id={message.mid}>{(isMe ? userInfo.Nickname : chatWithUser.name) || "Messager"} · {sendAt}</span>
                {
                    isMe ?
                        <RightMenu theme={''} minWidth={200} maxWidth={200} onAfterInit={() => { }} onBeforeInit={() => { }} options={options}>
                            <div className="message-content">
                                <HtmlApp html={xss(message.content)} />
                            </div>
                        </RightMenu>
                        :
                        <div className="message-content">
                            <HtmlApp html={xss(message.content)} />
                        </div>
                }
            </div>
        </div >
    }

    return messages.map((message, key) => <Message key={key} message={message} />)

}


export default Messages