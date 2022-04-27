import { useState } from 'react';
import { Button, Textarea } from 'react-daisyui';
import '../styles/editor.scss';

// https://blog.csdn.net/qq_43437571/article/details/106088271
const getMessageLen = str => {
    var count = 0;
    if (str) {
        const len = str.length;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) > 255) {
                count += 2;
            } else {
                count++;
            }
        }
        console.log(count);
        return count;
    } else {
        console.log(0);
    }
};

const Editor = ({ sendMessage }) => {
    const [message, setMessage] = useState('');
    const [multiline, setMultiline] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

    const changeMessage = ({ target: { value } }) => {
        setMessage(value);
        if (getMessageLen(value) > 100 || value.indexOf('\n') > -1) {
            setMultiline(true);
        } else {
            setMultiline(false);
        }
    };

    const _sendMessage = () => {
        setSendLoading(true);
        // setTimeout(() => {
        //     setSendLoading(false);
        //     setMessage('');
        //     setMultiline(false);
        // }, 2000);
        sendMessage(message);
        setSendLoading(false);
        setMessage('');
        setMultiline(false);
    };

    return (
        <div className="room-message-editor flex justify-between  items-end">
            <Textarea rows={multiline ? 2 : 1} color={'primary'} bordered={true} value={message} onChange={changeMessage} borderOffset={false} className="editor-item w-full"></Textarea>
            <Button className="ml-2" onClick={_sendMessage} loading={sendLoading}>
                发送
            </Button>
        </div>
    );
};

export default Editor;
