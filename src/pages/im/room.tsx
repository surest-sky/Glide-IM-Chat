import { useEffect, useState } from 'react';
import { delay } from 'rxjs';
import { ChatMessage } from 'src/core/chat_message';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Editor from './components/editor';
import Message from './components/message';
import { Avatar } from 'react-daisyui';
import { initChat } from './store/chat';
import { Rate } from '@arco-design/web-react';

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
        initChat(started);
    }, []);

    const MsgList = messages.map((message, key) => {
        return <Message key={key} message={message} />;
    });

    let content: any;
    if (loading) {
        content = <div className="font-bold text-center room-content-title">连接中...</div>;
    } else {
        content = (
            <>
                <div className="font-bold text-center room-content-title flex justify-between">
                    <div className="flex items-center">
                        <Avatar shape={'circle'} size={'xs'} className="title-avatar mr-2" />
                        <span className=" title-name">锋</span>
                    </div>
                    <div className="flower">
                        <Rate count={5} className="mr-3" />
                    </div>
                </div>
                {/* <div className="room-body flex justify-between"> */}
                <div className="room-body">
                    {/* <div className="contacts">
                        <div className="contact">

                        </div>
                    </div> */}
                    <div className="chat-body">
                        <div className="room-content scrollbar">
                            <div className="room-content-wrapper">{MsgList}</div>
                        </div>
                        <Editor session={session} />
                    </div>
                </div>
            </>
        );
    }

    return <div className="room">{content}</div>;
};

export default Room;
