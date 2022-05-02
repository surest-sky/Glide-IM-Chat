import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Button } from 'react-daisyui';
import xss from 'xss';
import { scrollToBottom } from '../../../../utils/Utils';
import './editor.scss';
import Draw from './draw';
import { pasteImage } from './store';

const Editor = forwardRef((props: any, ref) => {
    // 这里暂时不要 Loading，发送太快了，有抖动感觉，很不好看
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [src, setSrc] = useState<string>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        insertContent: insertFileMessage,
        scrollToBottom: () => {
            scrollToBottom('.room-content');
        },
    }));

    /**
     * 消息发送
     * @param message
     */
    const sendMessage = (message: string) => {
        // setSendLoading(true);
        props.session?.sendTextMessage(message).subscribe({
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
        setMessage('');
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

    const insertFileMessage = (url: string) => {
        const imageNode = document.createElement('img');
        imageNode.src = url;
        editorRef.current.focus();
        const range = window.getSelection();
        range.selectAllChildren(editorRef.current);
        range.collapseToEnd();
        const position = window.getSelection().getRangeAt(0);
        position.insertNode(imageNode);
        setModalVisible(false);
    };

    return (
        <div className="room-message-editor flex justify-between  items-end">
            <div
                contentEditable="true"
                onPaste={pasteEvent}
                ref={editorRef}
                suppressContentEditableWarning
                onKeyDown={(event: any) => {
                    if (event.keyCode === 13 && event.shiftKey === false) {
                        event.preventDefault();
                        if (message.length > 0) {
                            _sendMessage();
                        }
                        return false;
                    }
                }}
                onInput={(event: any) => {
                    setMessage(editorRef.current.innerHTML);
                }}
                className="textarea editor-item w-full textarea-primary focus:outline-offset-0 textarea-bordered"
            ></div>
            {/* <Textarea rows={multiline ? 2 : 1} color={'primary'} bordered={true} value={message} onChange={({ target: { value } }) => setMessage(value)} borderOffset={false} className="editor-item w-full"></Textarea> */}
            <Button disabled={message.length < 1} style={{ height: 48 }} className="ml-2" onClick={_sendMessage} loading={sendLoading}>
                发送
            </Button>

            <Modal
                open={modalVisible}
                onClickBackdrop={() => {
                    setModalVisible(false);
                }}
            >
                <Modal.Header>图片裁剪</Modal.Header>
                <Draw insertFileMessage={insertFileMessage} src={src} />
            </Modal>
        </div>
    );
});

export default Editor;
