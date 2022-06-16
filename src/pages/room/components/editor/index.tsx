import { forwardRef, useRef, useState, useEffect } from 'react';
import { IconVoice, IconPlusCircle, IconMessage } from '@arco-design/web-react/icon';
import { Modal } from '@arco-design/web-react';

import xss from 'xss';
import { MessageType } from '../../../../core/message';
import Draw from './draw';
import './editor.scss';
import { pasteImage, uploadBase64File } from './store';
import Audio from '../tools/audio';

const Editor = forwardRef((props: any, ref) => {
    // 这里暂时不要 Loading，发送太快了，有抖动感觉，很不好看
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [src, setSrc] = useState<string>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('message');

    /**
     * 消息发送
     * @param message
     */
    const sendMessage = (message: string) => {
        props.sendChatMessage(message, MessageType.Text);
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
        console.log('file', file);
        if (file) {
            setSrc(file);
            const url = await uploadBase64File(file);
            insertFileMessage(url);
        }
        return false;
    };

    const insertFileMessage = (url: string) => {
        const imageNode = document.createElement('img');
        imageNode.src = url;
        focusEditor(mode);
        const range = window.getSelection();
        range.selectAllChildren(editorRef.current);
        range.collapseToEnd();
        const position = window.getSelection().getRangeAt(0);
        position.insertNode(imageNode);
        setModalVisible(false);
    };

    const focusEditor = mode => {
        if (mode === 'message') {
            editorRef.current.focus();
        }
    };

    const switchMode = () => {
        const _mode = mode === 'video' ? 'message' : 'video';
        setMode(_mode);
    };

    useEffect(() => {
        return () => {
            setMode(mode => {
                focusEditor(mode);
                return mode;
            });
        };
    });

    const Editor = ({ mode }) => {
        return mode === 'video' ? (
            <div className={`w-full ${mode === 'message' ? 'hidden' : ''}`}>
                <Audio
                    sendChatMessage={message => {
                        props.sendChatMessage(message, MessageType.Audio);
                    }}
                />
            </div>
        ) : (
            <div
                contentEditable="true"
                onPaste={pasteEvent}
                ref={editorRef}
                suppressContentEditableWarning
                onKeyDown={(event: any) => {
                    console.log(event.keyCode);
                    if (event.keyCode === 13 && event.shiftKey === false) {
                        event.preventDefault();
                        _sendMessage();
                        return false;
                    }
                }}
                className={`editor-item ${mode === 'video' ? 'hidden' : ''}`}
            ></div>
        );
    };

    return (
        <div className="flex items-end justify-between room-message-editor">
            <div className="relative flex w-full">
                {<Editor mode={mode} />}
                <div className="flex items-center justify-center ml-2 mr-2">
                    {mode === 'message' ? (
                        <IconVoice
                            onClick={() => {
                                switchMode();
                            }}
                            className="text-2xl transition ease-in-out cursor-pointer hover:scale-110"
                        />
                    ) : (
                        <IconMessage
                            onClick={() => {
                                switchMode();
                            }}
                            className="text-2xl transition ease-in-out cursor-pointer hover:scale-110"
                        />
                    )}
                </div>
                <div className="flex items-center justify-center">
                    <IconPlusCircle className="text-2xl transition ease-in-out cursor-pointer hover:scale-110" />
                </div>
            </div>

            <Modal title="图片裁剪" visible={modalVisible} onOk={() => setModalVisible(false)} onCancel={() => setModalVisible(false)}>
                <Draw insertFileMessage={insertFileMessage} src={src} />
            </Modal>
        </div>
    );
});

export default Editor;
