import { Session } from './session';
import { setLogout } from 'src/services/auth';
import { LiveChat } from 'src/core/live_chat';
import { delay } from 'rxjs';

// interface Window {
//     ChatSession: Session;
// }

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

// 聊天服务错误
const serviceComplete = (session: Session, callback) => {
    session.notifyInputMessage();
    window.ChatSession = session;
    callback && callback();
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
