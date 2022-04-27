import { LiveChat } from 'src/core/live_chat';
export const initChat = callback => {
    const chat = LiveChat.getInstance();
    let req;
    if (chat.isAuthenticated()) {
        req = chat.auth();
    } else {
        req = chat.register();
    }

    req.subscribe({
        next: data => {
            callback && callback();
        },
        error: err => {
            console.log(err);
        },
    });
};
