import { useEffect, useState } from 'react';
import { delay } from 'rxjs';
import { ChatMessage } from 'src/core/chat_message';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Editor from './editor';
import Message from './message';
import { initChat } from '../store/chat';

const Room = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        session?.setMessageListener(message => {
            console.log('message===', message);
            setMessages(messages => [...messages, message]);
        });
        return () => session?.setMessageListener(null);
    }, [session]);

    const started = () => {
        // 获取或初始化聊天会话
        LiveChat.getInstance()
            .getOrInitSession()
            .pipe(delay(1000))
            .subscribe({
                next: se => {
                    setSession(se);
                    setMessages(se.getMessages());
                    setLoading(false);
                },
                error: error => {
                    console.log(error);
                },
                complete: () => {},
            });
    };

    useEffect(() => {
        initChat(started());
    }, []);

    /**
     * 消息发送
     * @param message
     */
    const sendMessage = (message: string) => {
        session?.sendTextMessage(message).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                console.log(error);
            },
            complete: () => {
                // send sucess
            },
        });
    };

    const MsgList = messages.map((message, key) => {
        return <Message key={key} message={message} />;
    });

    let content: any;
    if (loading) {
        content = <div className="font-bold text-center room-content-title">连接中...</div>;
    } else {
        content = (
            <>
                <div className="font-bold text-center room-content-title">...IM通道</div>
                <div className="room-content">
                    <div className="room-content-wrapper">{MsgList}</div>
                </div>
                <Editor sendMessage={sendMessage} />
            </>
        );
    }

    return <div className="room">{content}</div>;
};

export default Room;
