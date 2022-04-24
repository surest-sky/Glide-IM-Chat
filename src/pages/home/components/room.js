import { useState } from 'react';
import { Avatar } from 'react-daisyui';
const Room = () => {
    const [user, setUser] = useState({
        id: 1,
        name: '尘锋',
        avatar: 'https://api.multiavatar.com/Kuninori%20Bun%20Lord.png',
    });
    const [messages, setMessages] = useState([
        {
            id: 1,
            avatar: 'https://api.multiavatar.com/%E9%94%8B222.png',
            message:
                '基于约束的设计. 使用内联样式, 每个值都是一个魔术数字。 使用功能类, 您是从预定义的设计系统中选择样式，这使得构建统一的UI变得更加容易。',
        },
        {
            id: 2,
            avatar: 'https://api.multiavatar.com/Kuninori%20Bun%20Lord.png',
            message: '我在吃饭',
        },
    ]);
    return (
        <div className="tilt-in-fwd-br room">
            <div className="room-content">
                <div className="room-content-title text-center font-bold">...客服通道</div>
                <div className="room-content-wrapper">
                    {messages.map((message, key) => {
                        return (
                            <div key={key} className="room-content-wrapper-item flex-infobasic-informationbasic-informationCommunication Tools">
                                <div className="mr-2 room-content-wrapper-item-avatar">
                                    <Avatar shared={'circle'} size={'xs'} src={message.avatar} />
                                </div>
                                <div className="room-content-wrapper-item-message">{message.message}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Room;
