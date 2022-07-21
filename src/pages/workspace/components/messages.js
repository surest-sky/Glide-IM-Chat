import { Avatar, Spin, Link } from '@arco-design/web-react';
import RightMenu from '@right-menu/react';
import dayjs from 'dayjs';
import { orderBy } from 'lodash';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadMessageByUid } from 'src/services/message'
import HtmlApp from 'src/components/HtmlApp';
import { removeMessage } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { scrollToBottom, getScrollBottom, scrollToTop } from 'src/utils/Utils';
import { addRoomMessages } from "src/services/chat_db"
import xss from 'xss';
import { first, get, throttle } from 'lodash';
import '../styles/message.scss';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _messages = useLiveQuery(() => db.activeChat.orderBy('mid').toArray());
    const me_id = userInfo.Uid;
    const lastMsgId = useRef(0)

    // 发送撤回消息
    const sendRecallMessage = (mid: number, from: number) => {
        window.ChatSession.sendRecallMessage(mid);
    };
    const loadMoreMessages = async () => {
        let messages = await loadMessageByUid({
            to: chatWithUser.uid,
            page: 1,
            pageSize: 10,
            start_mid: lastMsgId.current
        })

        const target = `#message_${lastMsgId.current}`
        if (!messages.length) {
            return Promise.resolve(true);
        }
        const scrollHieght = getScrollBottom(".w-chat-wrapper", target)
        setMessages(_messages => {
            messages = [...messages, ..._messages]
            messages = orderBy(messages, 'mid')

            setTimeout(() => {
                scrollToTop(".w-chat-wrapper", target, scrollHieght)
            }, 300)

            lastMsgId.current = get(first(messages), 'mid')
            return messages
        });
        return Promise.resolve(false);
    }

    // 延迟触发
    useEffect(() => {
        setMessages(_messages ? _messages : []);
        lastMsgId.current = get(first(_messages), 'mid')
        setMessages(_messages => {
            setTimeout(() => {
                scrollToBottom('.w-chat-wrapper')
            }, 100)
            return _messages
        })
    }, [_messages]);

    useEffect(() => {
        if (!chatWithUser.uid) return;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatWithUser])

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
        const avatar = isMe ? userInfo.avatar : chatWithUser.avatar
        const sendAt = dayjs(message.SendAt).format('HH:mm a DD-MM');
        return <div data-id={message.mid} id={`message_${message.mid}`} className={`flex message-wrapper  ${isMe ? 'message-to flex-row-reverse' : 'message-from flex-row'}`}>
            {avatar ? <img className="message-avatar" src={avatar} alt="message" /> : <Avatar className="message-avatar">Messager</Avatar>}
            <div className={isMe ? 'mr-1' : 'ml-1'}>
                <span className="message-at" >{isMe ? userInfo.Nickname : chatWithUser.name} · {sendAt}</span>
                {/* <span className="message-at">客户未在线，发送消息可能无法及时触达 ~</span> */}
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

    const LoadingText = (props) => {
        const [status, setStatus] = useState(1)

        const loadM = async () => {
            setStatus(3)
            const isEnd = await props.loadMoreMessages()
            console.log("isEnd", isEnd)
            if (isEnd) {
                setStatus(2)
                return
            }
            setTimeout(() => {
                setStatus(1)
            }, 500)
        }

        if (status === 1) {
            return <Link onClick={() => { loadM() }}>加载更多?</Link>
        }

        if (status === 2) {
            return <Link>没有更多了</Link>
        }

        if (status === 3) {
            return <><Spin /> 加载中</>
        }
        return null
    }

    return <div className="w-chat-wrapper scrollbar">
        <div className="w-chat-load-tip">
            <LoadingText loadMoreMessages={loadMoreMessages} />
        </div>
        {messages.map((message, key) => <Message key={key} message={message} />)}
    </div>

}


export default Messages