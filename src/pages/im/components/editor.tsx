import { useState, useEffect } from 'react';
import { Button, Textarea } from 'react-daisyui';
import {getMessageLen} from '../../../utils/Utils'
import '../styles/editor.scss';

const Editor = ({ sendMessage }) => {
    const [message, setMessage] = useState<string>('');
    const [multiline, setMultiline] = useState<boolean>(false);
    const [sendLoading, setSendLoading] = useState<boolean>(false);

    const _sendMessage = () => {
        setSendLoading(true);
        sendMessage(message);
        setSendLoading(false);
        setMessage('');
    };

    useEffect(() => {
        if (getMessageLen(message) > 100 || message.indexOf('\n') > -1) {
            setMultiline(true);
        } else {
            setMultiline(false);
        }
    }, [message]);

    return (
        <div className="room-message-editor flex justify-between  items-end">
            <Textarea rows={multiline ? 2 : 1} color={'primary'} bordered={true} value={message} onChange={({ target: { value } }) => setMessage(value)} borderOffset={false} className="editor-item w-full"></Textarea>
            <Button disabled={!message.length} className="ml-2" onClick={_sendMessage} loading={sendLoading}>
                发送
            </Button>
        </div>
    );
};

export default Editor;
