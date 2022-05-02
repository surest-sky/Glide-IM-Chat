import { Message } from './message';
import { LiveChat } from './live_chat';

export enum SendingStatus {
    Unknown,
    Sending,
    Sent,
    Failed,
}

export interface MessageUpdateListener {
    (message: ChatMessage): void;
}

export class ChatMessage {
    public From: number;
    public To: number;
    public Content: string;
    public Mid: number;
    public SendAt: number;
    public Type: number;

    public Status: number;
    public IsMe: boolean;
    public IsGroup: boolean;

    public Sending: SendingStatus = SendingStatus.Unknown;

    private updateListener: MessageUpdateListener | null = null;

    public setUpdateListener(l: MessageUpdateListener): void {
        this.updateListener = l;
    }

    public static create(m: Message): ChatMessage {
        const ret = new ChatMessage();
        ret.From = m.from;
        ret.To = m.to;
        ret.Content = m.content;
        ret.Mid = m.mid;
        ret.SendAt = m.sendAt;
        ret.IsMe = m.from === LiveChat.getInstance().getUID();
        ret.Status = m.status;
        ret.Type = m.type;
        return ret;
    }

    public update(m: ChatMessage): void {
        this.From = m.From;
        this.To = m.To;
        this.Content = m.Content;
        this.Mid = m.Mid;
        this.SendAt = m.SendAt;
        this.IsMe = m.IsMe;
        this.Status = m.Status;
        this.Sending = m.Sending;
        this.Type = m.Type;

        if (this.updateListener) {
            this.updateListener(this);
        }
    }
}
