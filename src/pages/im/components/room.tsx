import { useEffect, useState } from 'react';
import { delay } from 'rxjs';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Editor from './editor';
import Message from './message';
import { initChat } from '../store/chat';

const Room = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     if (session != null) {
    //         session.setMessageListener(message => {
    //             setMessages(messages => [...messages, message]);
    //         });
    //     }
    // }, [session]);

    useEffect(() => {
        initChat(started());
        return () => {}
    })

    /**
     * 初始化完成
     */
    const started = () => {
    //     const chatInstance = LiveChat.getInstance().getSession();
    //     chatInstance.pipe(delay(1000)).subscribe({
    //         next: se => {
    //             setSession(se);
    //             console.log('------------')
    //             setMessages(se.getMessages());
    //             setLoading(false);
    //         },
    //         error: error => {
    //             console.log(error);
    //         },
    //         complete: () => {},
    //     });
    };

    /**
     * 消息发送
     * @param message
     */
    const sendMessage = (message: string) => {
        session.sendTextMessage(message).subscribe({
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
        return <Message key={key} message={message} isReply={false} />;
    });

    return (
        <div className="room">
            {loading ? (
                <>
                    <div className="font-bold text-center room-content-title">连接中...</div>
                </>
            ) : (
                <>
                    <div className="font-bold text-center room-content-title">...IM通道</div>
                    <div className="room-content">
                        <div className="room-content-wrapper">{MsgList}</div>
                    </div>
                    <Editor sendMessage={sendMessage} />
                </>
            )}
        </div>
    );
};

export default Room;
