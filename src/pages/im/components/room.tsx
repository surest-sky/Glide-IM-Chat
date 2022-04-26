import { useEffect, useState } from 'react';
import { delay } from 'rxjs';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Message from './message';

const Room = () => {

    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (session != null) {
            session.setMessageListener(message => {
                setMessages(messages => [...messages, message]);
            })
        }
    }, [session]);

    useEffect(() => {
        LiveChat.getInstance().getSession()
            .pipe(
                delay(1000),
            )
            .subscribe({
                next: (se) => {
                    setSession(se)
                    setMessages(se.getMessages())
                },
                error: (error) => {
                    console.log(error);
                },
                complete: () => {
                }
            })
        return () => { }
    }, []);

    const msgList = messages.map((message, key) => {
        return <Message key={key} message={message} isReply={false} />;
    })

    return (
        <div className="room">
            <div className="font-bold text-center room-content-title">...IM通道</div>
            <div className="room-content">
                <div className="room-content-wrapper">
                    {msgList}
                </div>
            </div>
            <div className="room-message-editor">
                <input type="text" placeholder="Type here" className="input w-full max-w-xs" />
                <button className="btn">Send</button>
            </div>
        </div>
    );
};

export default Room;
