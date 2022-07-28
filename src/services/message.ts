import { debounce, last } from 'lodash';
import { getMessagelist, setMessageRead } from 'src/api/chat/messages';
import { getAuthInfo } from 'src/services/auth';
import { db } from './db';

// 根据 uid 加载聊天记录
const loadMessageByUid = async (params: any) => {
    const userInfo = getAuthInfo();
    let response = await getMessagelist(params);
    const {
        data: { Data },
    } = response;

    if (!Data || !Data.length) {
        return Promise.resolve([]);
    }

    // 只加载 200 提交聊天记录
    // 如果需要更多需要动态加载
    // 暂时没找到好的解决办法
    const lastMessage = last(Data);

    add(Data, userInfo.uid);

    // params.start_id
    // 表示在动态加载
    if (!params.start_id) {
        db.contacts.where({ uid: parseInt(params.to) }).modify(contact => (contact.lastMessage = lastMessage));
    }
    return Promise.resolve(Data);
};

const readMessages = (session_id, uid: number) => {
    db.chat.where({ session_id, to: uid }).modify(chat => (chat.status = 1));
    debounce(() => setMessageRead({ session_id: session_id }), 2000);
};

const readMessagesToTimeOut = (uid: number) => {
    setTimeout(async () => {
        const to = parseInt(window.ChatSession.To);
        const from = uid;
        const session_id = getSessionId(to, from);
        readMessages(session_id, uid);
    }, 20000);
};

const getSessionId = (from: number, to: number) => {
    return from > to ? `${from}_${to}` : `${to}_${from}`;
};

const add = async (messages, uid) => {
    const inserts = messages.map(message => {
        return {
            content: message.content,
            from: message.from,
            mid: message.mid,
            sendAt: message.send_at,
            seq: message.cliSeq,
            status: message.status,
            to: message.to,
            type: message.type,
            session_id: message.session_id,
            uid: uid,
        };
    });

    await Promise.all(
        inserts.map(async message => {
            const _chat = await db.chat.where({ mid: message.mid }).first();
            if (!_chat) {
                db.chat.add(message);
            }
        })
    );
};

export { loadMessageByUid, readMessages, readMessagesToTimeOut, getSessionId, add };
