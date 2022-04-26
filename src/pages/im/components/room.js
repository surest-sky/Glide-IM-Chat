import { useEffect, useState } from 'react';
import { getInitMessages, getMessage } from '../faker';
import { avatar, id } from '../faker/enum';
import Editor from './editor';
import Message from './message';
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
        setMessages(messages => {
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
            <Editor />
        </div>
    );
};

export default Room;
