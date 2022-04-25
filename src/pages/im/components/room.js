import { useEffect, useState } from 'react';
import Message from './message';
import { mockMessage, getInitMessages, getMessage } from '../faker';
import { id, avatar } from '../faker/enum';
const Room = () => {
    const _messages = [
        {
            id: id,
            avatar: avatar,
            message: getMessage(),
        },
    ];
    const [messages, setMessages] = useState([..._messages, ...getInitMessages()]);

    useEffect(() => {
        setTimeout(() => {
            mockMessage();
        }, 1000);

        setMessages(messages => {
            console.log(messages);
            return messages;
        });
    }, []);

    return (
        <div className="room">
            <div className="font-bold text-center room-content-title">...IM通道</div>
            <div className="room-content">
                <div className="room-content-wrapper">
                    {messages.map((message, key) => {
                        return <Message key={key} message={message} isReply={message.id === 1} />;
                    })}
                </div>
            </div>
            <div className="room-message-editor"></div>
        </div>
    );
};

export default Room;
