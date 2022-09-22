import { map, mergeMap, Observable } from 'rxjs';
import { UserInfoBean } from 'src/api/model';
import { onNext } from 'src/rx/next';
import { timeStampSecToDate } from 'src/utils/TimeUtils';
import { Api } from '../api/api';
import { ChatMessage, SendingStatus } from './chat_message';
import { LiveChat } from './live_chat';
import { CliCustomMessage, ClientMessageType, Message, MessageType, Recall } from './message';
import { Ws } from './ws';

// 会话更新监听器, 例如消息接收
export interface SessionUpdateListener {
    (): void;
}

// 对方输入中监听器, 如果对方在输入, 则回调这个方法, 如果在约定时间内没有回调, 则说明对方结束输入
export interface MessageInputListener {
    (): void;
}

// 消息撤回
export interface MessageRecallListener {
    (): void;
}

export class Session {
    public Avatar: string;
    public Title: string;
    public UpdateAt: string;
    public UnreadCount: number;
    public To: string;

    private messageList = new Array<ChatMessage>();
    private messageMap = new Map<string, ChatMessage>();

    private messageListener: ((message: ChatMessage) => void) | null = null;
    private sessionUpdateListener: SessionUpdateListener | null = null;
    private messageInputListener: MessageInputListener | null = null;
    private messageRecallListener: MessageRecallListener | null = null;

    constructor(userinfo: UserInfoBean) {
        this.Avatar = userinfo.avatar;
        this.Title = userinfo.nick_name;
        // TODO
        // TOGO:0616 由 redux 接管传入数据
        // this.To = 543662; // userinfo.uid;
    }

    public static create(): Observable<Session> {
        return Api.getCustomerService().pipe(map(res => new Session(res)));
    }

    // 收到客户端自定义消息
    public onCliCustomMessage(msg: CliCustomMessage) {
        switch (msg.type) {
            case ClientMessageType.Inputing:
                this.messageInputListener?.();
                break;
            default:
                console.log('onCliCustomMessage', msg);
                break;
        }
    }

    // 收到聊天消息
    public onMessage(message: Message) {
        console.log('onMessage', message);

        const c = ChatMessage.create(message);
        this.UnreadCount++;
        this.addMessageByOrder(c);
    }

    // 通知对方自己正在输入消息, 需要约定一个频率检测用户是否在输入消息, 然后调用这个方法
    public notifyInputMessage() {
        const msg: CliCustomMessage = {
            from: LiveChat.getInstance().getUID().toString(),
            to: this.To,
            type: ClientMessageType.Inputing,
            content: null,
        };
        Ws.sendCliCustomMessage(msg).pipe().subscribe();
    }

    public sendTextMessage(msg: string): Observable<ChatMessage> {
        return this.send(msg, MessageType.Text);
    }

    public setSessionUpdateListener(listener: SessionUpdateListener | null) {
        this.sessionUpdateListener = listener;
    }

    public setMessageInputListener(listener: MessageInputListener | null) {
        this.messageInputListener = listener;
    }

    public setMessageListener(listener: (message: ChatMessage) => void) {
        this.messageListener = listener;
    }

    public setMessageRecallListener(listener: MessageRecallListener | null) {
        this.messageRecallListener = listener;
    }

    public getMessages(): ChatMessage[] {
        return Array.from(this.messageMap.values());
    }

    public setToId(uid: number): void {
        this.To = uid.toString();
    }

    private getMessageBeforeMid(mid: number): ChatMessage[] {
        if (this.messageList.length === 0) {
            return [];
        }

        let index = 0;
        if (mid !== 0) {
            index = this.messageList.findIndex(msg => msg.Mid <= mid);
            if (index === -1) {
                return [];
            }
        }

        return this.messageList.slice(index, this.messageList.length - index);
    }

    private addMessageByOrder(message: ChatMessage) {
        if (this.messageMap.has(message.CliId)) {
            this.messageMap.get(message.CliId).update(message);
        } else {
            // TODO 2022年9月22日16:31:59 这里排序可能有问题
            let index = this.messageList.findIndex(msg => msg.SendAt > message.SendAt);
            if (index === -1) {
                this.messageMap.set(message.CliId, message);
                this.messageList.push(message);
            } else {
                this.messageMap.set(message.CliId, message);
                this.messageList.splice(index, 0, message);
            }
            this.messageListener && this.messageListener(message);
        }

        if (this.messageList[this.messageList.length - 1] === message) {
            this.UpdateAt = timeStampSecToDate(message.SendAt);
            this.sessionUpdateListener?.();
        }
    }

    public send(content: string, type: number): Observable<ChatMessage> {
        const time = Date.parse(new Date().toString()) / 1000;
        const from = LiveChat.getInstance().getUID().toString();
        const m: Message = {
            cliId: uuid(32, 16),
            content: content,
            from: from,
            mid: 0,
            sendAt: time,
            seq: 0,
            to: this.To,
            type: type,
            status: 0,
            isMe: true,
            isMeToo: from === this.To,
        };
        const r = ChatMessage.create(m);
        r.Sending = SendingStatus.Sending;
        this.addMessageByOrder(r);

        return Ws.sendChatMessage(m).pipe(
            map(resp => {
                const r = ChatMessage.create(resp);
                r.Sending = SendingStatus.Sent;
                this.addMessageByOrder(r);
                return r;
            })
        );
    }

    // 发送撤回消息
    public sendRecallMessage(mid: number) {
        const recall: Recall = {
            mid: mid,
            recallBy: LiveChat.getInstance().getUID().toString(),
        };

        return Api.getMid()
            .pipe(
                map(resp => {
                    const time = Date.parse(new Date().toString()) / 1000;
                    return {
                        content: JSON.stringify(recall),
                        from: LiveChat.getInstance().getUID().toString(),
                        mid: resp.mid,
                        sendAt: time,
                        seq: 0,
                        to: this.To,
                        type: MessageType.Recall,
                        status: 0,
                    };
                }),
                onNext((msg: Message) => {
                    const r = ChatMessage.create(msg);
                    r.Sending = SendingStatus.Sending;
                    this.addMessageByOrder(r);
                }),
                mergeMap(msg => Ws.sendRecallMessage(msg)),
                map(resp => {
                    const r = ChatMessage.create(resp);
                    r.Sending = SendingStatus.Sent;
                    this.addMessageByOrder(r);
                    return r;
                })
            )
            .subscribe();
    }
}

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}