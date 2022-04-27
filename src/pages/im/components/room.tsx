import { useEffect, useState } from 'react';
import { delay } from 'rxjs';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Message from './message';
import Editor from './editor'

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

    const MsgList = messages.map((message, key) => {
        return <Message key={key} message={message} isReply={false} />;
    })

    return (
        <div className="room">
            <div className="font-bold text-center room-content-title">...IM通道</div>
            <div className="room-content">
                <div className="room-content-wrapper">
                    {MsgList}
                </div>
            </div>
            <Editor />
        </div>
    );
};

export default Room;
