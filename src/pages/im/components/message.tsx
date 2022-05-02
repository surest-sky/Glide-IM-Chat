import { useEffect } from 'react';
import { Avatar } from 'react-daisyui';
import HtmlApp from 'src/components/HtmlApp';
import { MessageType } from 'src/core/message';
import xss from 'xss';
import '../styles/message.scss';

function Message(props) {
    const messageAlign = props.message.IsMe ? 'flex-row-reverse to' : 'flex-row form';
    const MessageHtml = ({ message }) => {
        if (message.Type === MessageType.Image) {
            return <img src={message.Content} alt="2" />;
        }
        return <HtmlApp html={xss(props.message.Content)} className="message-item" />;
    };

    return (
        <div className={`flex ${messageAlign} room-content-wrapper-item`}>
            <div className=" room-content-wrapper-item-avatar">
                <Avatar shape={'circle'} size={'xs'} />
            </div>
            <div className="room-content-wrapper-item-message break-words">{<MessageHtml message={props.message} />}</div>
        </div>
    );
}

export default Message;
