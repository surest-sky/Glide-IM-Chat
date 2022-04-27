import { LiveChat } from 'src/core/live_chat';

export const initChat = callback => {
    LiveChat.getInstance()
        .initChat()
        .subscribe({
            error: err => {
                alert(err);
            },
            complete: () => {
                callback && callback();
            },
        });
};
