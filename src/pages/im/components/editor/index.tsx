import { useRef, useState } from 'react';
import { Modal, Button } from 'react-daisyui';
import xss from 'xss';
import { scrollToBottom } from '../../../../utils/Utils';
import './editor.scss';
import Draw from './draw';
import { pasteImage } from './store';

const Editor = ({ session }) => {
    const [message, setMessage] = useState<string>('');
    // 这里暂时不要 Loading，发送太快了，有抖动感觉，很不好看
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [src, setSrc] = useState<string>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

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
            },
        });
    };

    const _sendMessage = () => {
        sendMessage(xss(getMessage()));
        resetEditor();
    };

    const getMessage = (): string => {
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
        return editorRef.current.innerHTML;
    };

    const resetEditor = () => {
        editorRef.current.innerHTML = '';
    };

    const pasteEvent = async event => {
        // 禁止粘贴垃圾数据
        let data = event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain');
        // Filter out everything except simple text and allowable HTML elements
        let regex = /<(?!(\/\s*)?(a|b|i|em|s|strong|u)[>,\s])([^>])*>/g;
        data = data.replace(regex, '');
        document.execCommand('insertHTML', false, data);
        event.preventDefault();

        const file = await pasteImage(event);
        if (file) {
            setSrc(file);
            setModalVisible(true);
        }
        return false;
    };

    const insertMessage = (url: string) => {
        const dom = `<img src="${url}" />`;
        editorRef.current.innerHTML += dom;
        setModalVisible(false);
    };

    return (
        <div className="room-message-editor flex justify-between  items-end">
            <div
                contentEditable="true"
                onPaste={pasteEvent}
                ref={editorRef}
                suppressContentEditableWarning
                // onInput={_changeTextContent}
                className="textarea editor-item w-full textarea-primary focus:outline-offset-0 textarea-bordered"
            ></div>
            {/* <Textarea rows={multiline ? 2 : 1} color={'primary'} bordered={true} value={message} onChange={({ target: { value } }) => setMessage(value)} borderOffset={false} className="editor-item w-full"></Textarea> */}
            <Button style={{ height: 48 }} className="ml-2" onClick={_sendMessage} loading={sendLoading}>
                发送
            </Button>

            <Modal
                open={modalVisible}
                onClickBackdrop={() => {
                    setModalVisible(false);
                }}
            >
                <Modal.Header>图片裁剪</Modal.Header>
                <Draw insertMessage={insertMessage} src={src} />
            </Modal>
        </div>
    );
};

export default Editor;
