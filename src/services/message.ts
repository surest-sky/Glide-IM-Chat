import { first, get, last, map } from 'lodash';
import { getMessagelist } from 'src/api/chat/messages';
import store from 'src/store/index';
import { addMessages, switchRoom } from './chat_db';
import { db } from './db';

const setFlag = () => {
    localStorage.setItem('message-record', new Date().getTime().toString());
};

const needFlag = () => {
    let flag = localStorage.getItem('message-record');
    const ct = new Date().getTime();
    if (flag) {
        const lflag = parseInt(flag);
        // 每天
        if (ct - lflag > 60 * 60 * 12 * 1000) {
            return true;
        }
        return false;
    }

    return true;
};

// 聊天记录加载
const loadMessageRecord = async params => {
    // 刷新当前聊天窗口的聊天记录
    // loadActiveMessageRecord();
};

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
    const lastMessage = last(Data);
    const end_at = get(first(Data), 'send_at');
    const start_at = get(lastMessage, 'send_at');

    const chats = await db.chat.where('sendAt').between(start_at, end_at).toArray();
    const mids = map(chats, 'mid');
    const filterChats = Data.filter(chat => {
        return !mids.includes(chat.mid);
    });
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
        };
    });

    // addMessages(inserts);

    // params.start_id
    // 表示在动态加载
    if (!params.start_id) {
        db.contacts.where({ uid: parseInt(params.to) }).modify(contact => (contact.lastMessage = lastMessage));
    }
    return Promise.resolve(inserts);
};

// 加载当前窗口的聊天记录
const loadActiveMessageRecord = () => {
    const {
        container: { userInfo },
        chat: { chatWithUser },
    } = store.getState();
    if (chatWithUser) {
        switchRoom(parseInt(userInfo.Uid), chatWithUser.uid);
    }
};

export { loadMessageRecord, loadMessageByUid };
