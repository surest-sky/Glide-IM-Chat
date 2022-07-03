
import { IconPlusCircle } from '@arco-design/web-react/icon';
import { useRef, useEffect } from 'react';
import { MessageType } from 'src/core/message';
import { pasteImage, uploadBase64File } from 'src/services/store'
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audiov2.svg';
import { useSelector } from 'react-redux';
import xss from 'xss';
import '../styles/editor.scss';
import { Message } from '@arco-design/web-react';

const Editors = (props) => {
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const editorRef = useRef(null);
    /**
     * 消息发送
     * @param message
     */
    const sendChatMessage = (message: string, type: MessageType, callback: any) => {
        window.ChatSession.send(message, type).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                callback && callback();
            },
            complete: () => {
                callback && callback();
            },
        });
    };

    /**
     * 发送前消息验证
     */
    const sendValidateMessage = () => {
        try {
            if (!window.ChatSession.To) { window.ChatSession.setToId(chatWithUser.uid); }
            const m = xss(getMessage());
            m.length && sendChatMessage(m, MessageType.Text);
            resetEditor();
        } catch (error) {
            Message.error("网络异常，请稍后重试")
        }
    };

    /**
     * 将编辑器内容清空
     */
    const resetEditor = () => {
        editorRef.current.innerHTML = '';
    };

    /**
     * 获取消息内容
     * @returns 
     */
    const getMessage = (): string => {
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
        return editorRef.current.innerHTML;
    };

    /**
     * 编辑器粘贴处理
     * @param {*} event 
     * @returns 
     */
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
            const url = await uploadBase64File(file);
            insertFileMessage(url);
        }
        return false;
    };

    // 插入文件
    const insertFileMessage = (url: string) => {
        const imageNode = document.createElement('img');
        imageNode.src = url;
        editorRef.current.focus();
        const range = window.getSelection();
        range.selectAllChildren(editorRef.current);
        range.collapseToEnd();
        const position = window.getSelection().getRangeAt(0);
        position.insertNode(imageNode);
    };

    // 当发生变化时重新聚焦
    useEffect(() => {
        editorRef.current.focus()
    }, [chatWithUser])

    useEffect(() => {
        window.addEventListener('resize', () => {
        })
    }, [])

    const Editor = ({ mode }) => {
        return <div
            contentEditable="true"
            ref={editorRef}
            onPaste={pasteEvent}
            suppressContentEditableWarning
            onKeyDown={(event: any) => {
                if (event.keyCode === 13 && event.shiftKey === false) {
                    event.preventDefault();
                    sendValidateMessage();
                    return false;
                }
            }}
            className={`editor-item scrollbar`}
        ></div>
    };

    return <>
        <div className="relative flex w-full">
            <Editor />
            <div className=" editor-operate">
                <AudioRecordSvg className="text-2xl transition ease-in-out cursor-pointer hover:scale-110" />
                <IconPlusCircle className="text-2xl transition ease-in-out cursor-pointer hover:scale-110" />
            </div>
        </div>
    </>
}

export default Editors