
import { IconPlusCircle } from '@arco-design/web-react/icon';
import { useRef } from 'react';
import { MessageType } from 'src/core/message';
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audiov2.svg';
import xss from 'xss';
import '../styles/editor.scss';

const Editors = () => {
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
        const m = xss(getMessage());
        m.length && sendChatMessage(m, MessageType.Text);
        resetEditor();
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


    const Editor = ({ mode }) => {
        return <div
            contentEditable="true"
            ref={editorRef}
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