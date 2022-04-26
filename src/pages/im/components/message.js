import { Avatar } from 'react-daisyui';
import '../styles/message.scss';

const Message = ({ message, isReply }) => {
    return (
        <div className={`flex ${isReply ? ' flex-row-reverse to' : 'flex-row form'} room-content-wrapper-item`}>
            <div className=" room-content-wrapper-item-avatar">
                <Avatar shared={'circle'} size={'xs'} src={message} />
            </div>
            <div className="room-content-wrapper-item-message">{message.content}</div>
        </div>
    );
};

export default Message;
