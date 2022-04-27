import { map, mergeMap, Observable, of, throwError, toArray } from "rxjs";
import { UserInfoBean } from "src/api/model";
import { onNext } from "src/rx/next";
import { timeStampSecToDate } from "src/utils/TimeUtils";
import { Api } from "../api/api";
import { ChatMessage, SendingStatus } from "./chat_message";
import { LiveChat } from "./live_chat";
import { Message, MessageType, SessionType } from "./message";
import { Ws } from "./ws";

export interface SessionUpdateListener {
    (): void
}

export class Session {

    public Avatar: string;
    public Title: string;
    public UpdateAt: string;
    public UnreadCount: number;
    public To: number;

    private messageList = new Array<ChatMessage>();
    private messageMap = new Map<number, ChatMessage>();

    private messageListener: ((message: ChatMessage) => void) | null = null;
    private sessionUpdateListener: SessionUpdateListener | null = null;

    constructor(userinfo: UserInfoBean) {
        this.Avatar = userinfo.Avatar;
        this.Title = userinfo.Nickname;
        // TODO 
        this.To = 543629; // userinfo.Uid;
    }

    public static create(): Observable<Session> {
        return Api.getCustomerService()
            .pipe(
                map(res => new Session(res))
            )
    }

    public onMessage(message: Message) {
        console.log("onMessage", message);
        const c = ChatMessage.create(message)
        this.UnreadCount++;
        this.addMessageByOrder(c);
    }

    public sendTextMessage(msg: string): Observable<ChatMessage> {
        return this.send(msg, MessageType.Text);
    }

    public setSessionUpdateListener(listener: SessionUpdateListener | null) {
        this.sessionUpdateListener = listener;
    }

    public setMessageListener(listener: (message: ChatMessage) => void) {
        this.messageListener = listener;
    }

    public getMessages(): ChatMessage[] {
        return Array.from(this.messageMap.values());
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
        if (this.messageMap.has(message.Mid)) {
            this.messageMap.get(message.Mid).update(message);
        } else {
            let index = this.messageList.findIndex(msg => msg.Mid > message.Mid);
            if (index === -1) {
                this.messageMap.set(message.Mid, message);
                this.messageList.push(message);
            } else {
                this.messageMap.set(message.Mid, message);
                this.messageList.splice(index, 0, message);
            }
            this.messageListener && this.messageListener(message);
        }

        if (this.messageList[this.messageList.length - 1] === message) {
            this.UpdateAt = timeStampSecToDate(message.SendAt);
            this.sessionUpdateListener?.();
        }
    }

    private send(content: string, type: number): Observable<ChatMessage> {

        return Api.getMid()
            .pipe(
                map(resp => {
                    const time = Date.parse(new Date().toString()) / 1000;
                    return {
                        content: content,
                        from: LiveChat.getInstance().getUID(),
                        mid: resp.Mid,
                        sendAt: time,
                        seq: 0,
                        to: this.To,
                        type: type,
                        status: 0,
                    }
                }),
                onNext(msg => {
                    const r = ChatMessage.create(msg);
                    r.Sending = SendingStatus.Sending;
                    this.addMessageByOrder(r);
                }),
                mergeMap(msg =>
                    Ws.sendChatMessage(msg)
                ),
                map(resp => {
                    const r = ChatMessage.create(resp);
                    r.Sending = SendingStatus.Sent;
                    this.addMessageByOrder(r);
                    return r;
                }),
            )
    }
}
