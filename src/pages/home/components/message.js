import { Avatar } from 'react-daisyui';
const Message = ({ message, isReply }) => {
    return (
        <div className={`flex ${isReply ? ' flex-row-reverse' : 'flex-row'} room-content-wrapper-item`}>
            <div className="ml-1 mr-1 room-content-wrapper-item-avatar">
                <Avatar shared={'circle'} size={'xs'} src={message.avatar} />
            </div>
            <div className="room-content-wrapper-item-message">{message.message}</div>
        </div>
    );
};

export default Message;
