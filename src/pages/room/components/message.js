import { Avatar, Spin } from '@arco-design/web-react';
import { IconInfoCircle } from '@arco-design/web-react/icon';
import RightMenu from '@right-menu/react';
import AudioApp from 'src/components/AudioApp';
import HtmlApp from 'src/components/HtmlApp';
import { SendingStatus } from 'src/core/chat_message';
import { MessageType } from 'src/core/message';
import store from 'src/store/index';
import { withdrawMessage } from 'src/store/reducer/chat';

import xss from 'xss';
import '../styles/message.scss';

function Message(props) {
    const { mid, from } = props.message
    const options = [{
        type: 'li',
        style: { padding: '10px 26px 10px 8px' },
        text: '撤回',
        callback: () => {
            store.dispatch(withdrawMessage({ mid, from }));
        },
    }]
    const messageAlign = props.userInfo.Uid === props.message.from ? 'flex-row-reverse to' : 'flex-row form';
    const MessageHtml = ({ message }) => {
        if (message.type === MessageType.Image) {
            return <img src={message.content} alt="2" />;
        }
        if (message.type === MessageType.Audio) {
            return <AudioApp src={message.content} />;

            // <audio className="mr-2" style={{ height: 36, width: 240 }} src={message.Content} controls />;
        }

        return (
            <div className="break-words room-content-wrapper-item-message">
                <HtmlApp html={xss(props.message.content)} className="message-item" />
            </div>
        );
    };

    const MessageStatus = ({ sending }) => {
        return <></>;
        if (sending === SendingStatus.Sending) {
            return <Spin />;
        }

        if (sending === SendingStatus.Sent) {
            return <></>;
        }

        if (sending === SendingStatus.Failed) {
            return <IconInfoCircle style={{ color: 'red', marginRight: 2 }} />;
        }

        return <></>;
    };

    return (
        <div className={`flex ${messageAlign} room-content-wrapper-item`}>
            <div className=" room-content-wrapper-item-avatar">
                <Avatar>{props.userInfo.avatar ? <img src={props.userInfo.avatar} alt="" className="src" /> : props.userInfo.Uid}</Avatar>
            </div>
            {/* <MessageStatus sending={props.message.Sending} /> */}
            <RightMenu options={options}>
                <div>
                    {<MessageHtml message={props.message} />}
                </div>
            </RightMenu>
        </div>
    );
}

export default Message;
