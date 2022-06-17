import { Session } from './session';
import { ChatMessage } from './chat_message';
import { setLogout } from 'src/services/auth';
import { LiveChat } from 'src/core/live_chat';
import { delay } from 'rxjs';
import { addMessage } from 'src/services/chat_db';
import store from 'src/store/index';
import { updateContacts } from 'src/store/reducer/chat';
declare global {
    interface Window {
        ChatSession: Session;
    }
}

// 聊天服务错误
const serviceError = err => {
    console.log(err);
    setLogout();
};

// 加载服务完成
const serviceComplete = (session: Session, callback) => {
    session.notifyInputMessage();
    window.ChatSession = session;
    callback && callback();
    registerHanders(session);
    store.dispatch(updateContacts());
};

// 进行注册 message 事件
const registerHanders = (session: Session) => {
    session.setMessageListener((message: ChatMessage) => {
        // 注册事件触发
        console.log('我是来自接受到的 message', message);
        addMessage(message.revertMessage());
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
