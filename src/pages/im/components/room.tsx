import { useEffect, useState } from 'react';
import { delay } from 'rxjs';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Editor from './editor';
import Message from './message';

const Room = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState([]);
    const chatInstance = LiveChat.getInstance().getSession();

    useEffect(() => {
        if (session != null) {
            session.setMessageListener(message => {
                setMessages(messages => [...messages, message]);
            });
        }
    }, [session]);

    useEffect(() => {
        chatInstance.pipe(delay(1000)).subscribe({
            next: se => {
                setSession(se);
                setMessages(se.getMessages());
            },
            error: error => {
                console.log(error);
            },
            complete: () => { },
        });
        return () => { };
    }, []);

    const sendMessage = (message: string) => {
        // chatInstance.sendTextMessage(message)
        session.sendTextMessage(message)
            .subscribe({
                next: (m) => {
                    console.log("send message: message status changed=>", m);
                },
                error: error => {
                    console.log(error);
                },
                complete: () => {
                    // send sucess
                },
            });
    }

    const MsgList = messages.map((message, key) => {
        return <Message key={key} message={message} isReply={false} />;
    });

    return (
        <div className="room">
            <div className="font-bold text-center room-content-title">...IM通道</div>
            <div className="room-content">
                <div className="room-content-wrapper">{MsgList}</div>
            </div>
            <Editor sendMessage={sendMessage} />
        </div>
    );
};

export default Room;
