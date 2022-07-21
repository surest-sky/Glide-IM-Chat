import { Message } from '@arco-design/web-react';
import { delay } from 'rxjs';
import { LiveChat } from 'src/core/live_chat';
import { MessageType, Recall } from 'src/core/message';
import { addMessage, withdrawMessage } from 'src/services/chat_db';
import { readMessages } from 'src/services/message';
import { ChatMessage } from './chat_message';
import { Session } from './session';

declare global {
    interface Window {
        ChatSession: Session;
    }
}

// 聊天服务错误
const serviceError = err => {
    console.error('连接聊天服务器 失败: serviceError', err);
    Message.error('连接聊天服务器 失败, 请刷新重试 ~');
    // setLogout();
};

// 加载服务完成
const serviceComplete = async (session: Session, callback) => {
    // const userInfo = getAuthInfo();
    // session.notifyInputMessage();
    window.ChatSession = session;
    callback && callback();
    registerHanders(session);
    readMessages();
};

// 进行注册 message 事件
const registerHanders = (session: Session) => {
    session.setMessageListener((message: ChatMessage) => {
        // 注册事件触发
        const convertMessage = message.revertMessage();

        // 消息撤回
        if (message.Type === MessageType.Recall) {
            const m: Recall = JSON.parse(convertMessage.content);
            convertMessage.mid = m.mid;
            withdrawMessage(convertMessage);
            return;
        }

        // 添加一条消息到 库中
        addMessage(convertMessage);
    });
};

/**
 * 初始化聊天服务
 */
export const initChatSession = callback => {
    const instance = LiveChat.getInstance();
    instance.initChat().subscribe({
        error: err => {
            serviceError(err);
        },
        complete: () => {
            instance
                .getOrInitSession()
                .pipe(delay(1000))
                .subscribe({
                    next: se => {
                        serviceComplete(se, callback);
                    },
                    error: err => {
                        serviceError(err);
                    },
                });
        },
    });
};
