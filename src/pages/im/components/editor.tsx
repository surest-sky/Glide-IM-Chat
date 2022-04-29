import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import { getMessageLen, scrollToBottom } from '../../../utils/Utils';
import xss from 'xss'
import '../styles/editor.scss';

const Editor = ({ session }) => {
    const [message, setMessage] = useState<string>('');
    // 这里暂时不要 Loading，发送太快了，有抖动感觉，很不好看
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const editorRef = useRef<HTMLDivElement | null>(null);

    /**
     * 消息发送
     * @param message
     */
    const sendMessage = (message: string) => {
        // setSendLoading(true);
        session?.sendTextMessage(message).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                scrollToBottom('.room-content');
                console.log(false);
                // 发送失败，好像发送成功了
            },
            complete: () => {
                scrollToBottom('.room-content');
                // setSendLoading(false);
            },
        });
    };

    const _sendMessage = () => {
        sendMessage(xss(message));
        editorRef.current.innerHTML = "";
    };

    const _changeTextContent = ({ currentTarget: textContent }) => {
        const content = textContent.innerHTML;
        setMessage(content);
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
    };

    return (
        <div className="room-message-editor flex justify-between  items-end">
            <div contentEditable="true" ref={editorRef} suppressContentEditableWarning onInput={_changeTextContent} className="textarea editor-item w-full textarea-primary focus:outline-offset-0 textarea-bordered"></div>
            {/* <Textarea rows={multiline ? 2 : 1} color={'primary'} bordered={true} value={message} onChange={({ target: { value } }) => setMessage(value)} borderOffset={false} className="editor-item w-full"></Textarea> */}
            <Button disabled={!message.length} className="ml-2" onClick={_sendMessage} loading={sendLoading}>
                发送
            </Button>
        </div>
    );
};

export default Editor;
