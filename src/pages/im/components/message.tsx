import { Avatar } from 'react-daisyui';
import { ChatMessage } from 'src/core/chat_message';
import '../styles/message.scss';

function Message(props: { message: ChatMessage }) {

    const messageAlign = props.message.IsMe ? 'flex-row-reverse to' : 'flex-row form'

    return (
        <div className={`flex ${messageAlign} room-content-wrapper-item`}>
            <div className=" room-content-wrapper-item-avatar">
                <Avatar shape={'circle'} size={'xs'} />
            </div>
            <div className="room-content-wrapper-item-message">{props.message.Content}</div>
        </div>
    );
};


export default Message;
