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
        if (message.Type === MessageType.Audio) {
            return <audio className="mr-2" style={{ height: 36, width: 240 }} src={message.Content} controls />;
        }

        return (
            <div className="room-content-wrapper-item-message break-words">
                <HtmlApp html={xss(props.message.Content)} className="message-item" />
            </div>
        );
    };

    return (
        <div className={`flex ${messageAlign} room-content-wrapper-item`}>
            <div className=" room-content-wrapper-item-avatar">
                <Avatar shape={'circle'} size={'xs'} />
            </div>
            {<MessageHtml message={props.message} />}
        </div>
    );
}

export default Message;
