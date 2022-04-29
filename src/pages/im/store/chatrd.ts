// 聊天记录处理
import { MessageType, Message } from '../../../core/message';

export interface MessageStruct {
    mid: number;
    seq: number;
    from: number;
    to: number;
    type: number;
    content: string;
    sendAt: number;
    status: number;
    isRead: boolean;
}

class ChatRecord {
    private cacheKey: string = '';
    public messageList: Array<MessageStruct> = [];

    /**
     * 给缓存记录添加一个消息记录
     * @param message
     * @param isRead
     */
    public addMessage(message: Message, isRead: boolean): void {
        const cacheMessage: MessageStruct = Object.assign(message, { isRead });
        this.messageList.push(cacheMessage);
    }

    /**
     * 消息记录存储化
     */
    public cacheMesage(): void {}
}
