import { last } from 'lodash';
import { getMessagelist, setMessageRead } from 'src/api/chat/messages';
import { addMessages } from './chat_db';
import { db } from './db';

// 根据 uid 加载聊天记录
const loadMessageByUid = async (params: any) => {
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
    // const end_at = get(first(Data), 'send_at');
    // const start_at = get(lastMessage, 'send_at');

    // const chats = await db.chat.where('sendAt').between(start_at, end_at).toArray();
    // const mids = map(chats, 'mid');
    // const filterChats = Data.filter(chat => {
    //     return !mids.includes(chat.mid);
    // });
    const filterChats = [];
    await Promise.all(
        Data.map(async chat => {
            const mid = chat.mid;
            const _chat = await db.chat.where({ mid: mid }).first();
            if (_chat) {
                return;
            }
            filterChats.push(chat);
        })
    );

    console.log('filterChats', filterChats);
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

const readMessages = () => {
    setTimeout(async () => {
        const messages = await db.chat.where({ status: 3 }).toArray();
        const m_ids = messages.map((message: any) => message.m_id);
        setMessageRead({ m_ids });
    }, 20000);
};

const getSessionId = (from: number, to: number) => {
    return from > to ? `${from}_${to}` : `${to}_${from}`;
};

export { loadMessageByUid, readMessages, getSessionId };
