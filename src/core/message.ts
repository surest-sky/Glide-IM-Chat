const maskFromWeb = 1 << 30;
const maskMessageType = (1 << 31) | maskFromWeb;

// 客户端自定义消息的类型
export enum ClientMessageType {
    Inputing = 1,
}

// 聊天消息类型
export enum MessageType {
    Text = maskMessageType | 1,
    Image = maskMessageType | 2,
    Audio = maskMessageType | 3,
    Recall = maskMessageType | 4,
    File = maskMessageType | 5,
    Video = maskMessageType | 6,
    Location = maskMessageType | 7,
    RedEnvelope = maskMessageType | 8,
    Transfer = maskMessageType | 9,
    System = maskMessageType | 10,
}

export const WebSocketUrl = process.env.REACT_APP_WS_URL;

// IM 指令
export enum Actions {
    // 聊天消息
    MessageChat = 'message.chat',
    // 消息撤回
    MessageChatRecall = 'message.chat.recall',
    MessageChatResend = 'message.chat.resend',
    MessageChatRetry = 'message.chat.retry',
    // 客户端控制消息
    MessageCli = 'message.cli',
    // 需要认证
    NotifyNeedAuth = 'notify.auth',
    // 被踢出
    NotifyKickOut = 'notify.kickout',
    // 新的联系人
    NotifyNewContact = 'notify.contact',

    AckMessage = 'ack.message',
    AckRequest = 'ack.request',
    AckNotify = 'ack.notify',

    Api = 'api',
    ApiFailed = 'api.failed',
    ApiSuccess = 'api.success',
    ApiUserAuth = 'api.auth',
    ApiUserLogout = 'api.user.logout',
    Heartbeat = 'heartbeat',
}

// 公共消息体
export interface CommonMessage<T> {
    Seq: number;
    Action: string;
    Data: T;
}

// 聊天消息
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

// 接收者收到确认请求
export interface AckRequest {
    Mid: number;
    From: number;
}

// 接收者收到确认通知
export interface AckNotify {
    Mid: number;
}

// 服务器收到确认
export interface AckMessage {
    mid: number;
}

// 撤回
export interface Recall {
    Mid: number;
    RecallBy: number;
}

// 客户端自定义控制类型消息
export interface CliCustomMessage {
    From: number;
    To: number;
    Type: number;
    Content: string;
}
