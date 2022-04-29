export enum MessageType {
    Text = 1,
    Image = 2,
    Audio = 3,
    Recall = 100,
    GroupNotify = -1,
}

export enum SessionType {
    Single = 1,
    Group = 2,
}

export const WebSocketUrl = process.env.REACT_APP_WS_URL;

export enum Actions {
    MessageChat = 'message.chat',
    MessageChatRecall = 'message.chat.recall',
    MessageChatResend = 'message.chat.resend',
    MessageChatRetry = 'message.chat.retry',

    NotifyNeedAuth = 'notify.auth',
    NotifyKickOut = 'notify.kickout',
    NotifyNewContact = 'notify.contact',

    AckMessage = 'ack.message',
    AckRequest = 'ack.request',
    AckNotify = 'ack.notify',

    Api = 'api',
    ApiFailed = 'api.failed',
    ApiSuccess = 'api.success',
    ApiUserAuth = 'api.user.auth',
    ApiUserLogout = 'api.user.logout',
    Heartbeat = 'heartbeat',
}

export interface CommonMessage<T> {
    Seq: number;
    Action: string;
    Data: T;
}

export interface Message {
    mid: number;
    seq: number;
    from: number;
    to: number;
    type: number;
    content: string;
    sendAt: number;
    status: number;
}

export interface AckRequest {
    Mid: number;
    From: number;
}

export interface AckNotify {
    Mid: number;
}

export interface AckMessage {
    mid: number;
}

export interface Recall {
    Mid: string;
    RecallBy: number;
}
