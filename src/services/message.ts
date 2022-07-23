import { last } from 'lodash';
import { getMessagelist, setMessageRead } from 'src/api/chat/messages';
import { addMessages, incrContactsMessageCount } from './chat_db';
import { MessageStatus } from 'src/services/enum';
import store from 'src/store/index';
import { db } from './db';

// 根据 uid 加载聊天记录
const loadMessageByUid = async (params: any) => {
    const currentUser = store.getState().container.authInfo;
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
    const filterChats = [];
    const to = parseInt(params.to);
    await Promise.all(
        Data.map(async chat => {
            let temp;
            const mid = chat.mid;
            const _chat = await db.chat.where({ mid: mid }).first();
            if (!_chat) {
                temp = chat;
                filterChats.push(chat);
            } else {
                temp = _chat;
            }

            if (temp.status === MessageStatus.default) {
                incrContactsMessageCount(to);
            }
        })
    );

    const inserts = filterChats.map(message => {
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
        };
    });

    addMessages(inserts);

    // params.start_id
    // 表示在动态加载
    if (!params.start_id) {
        db.contacts.where({ uid: parseInt(params.to) }).modify(contact => (contact.lastMessage = lastMessage));
    }
    return Promise.resolve(Data);
};

const readMessages = (session_id, uid: number) => {
    db.chat.where({ session_id, to: uid }).modify(chat => (chat.status = 1));
    setMessageRead({ session_id: session_id });
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

export { loadMessageByUid, readMessages, readMessagesToTimeOut, getSessionId };
