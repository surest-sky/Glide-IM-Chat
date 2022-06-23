import { first, get, last, map } from 'lodash';
import { getChatHistory } from 'src/api/im/chat';
import { getContactsListApi } from 'src/api/im/im';
import { addMessages, switchRoom } from './chat_db';
import { db } from './db';
import store from 'src/store/index';

const setFlag = () => {
    localStorage.setItem('message-record', new Date().getTime().toString());
};

const needFlag = () => {
    let flag = localStorage.getItem('message-record');
    const ct = new Date().getTime();
    if (flag) {
        const lflag = parseInt(flag);
        if (lflag - ct > 60 * 60 * 12 * 5 * 1000) {
            return true;
        }
        return false;
    }

    return true;
};

// 聊天记录加载
// 需要打一个标记 || 最多5天加载一次
const loadMessageRecord = async () => {
    console.log(needFlag());
    if (!needFlag()) {
        return;
    }
    const {
        data: { Data },
    } = await getContactsListApi();
    const uids = map(Data, 'Id');
    uids.forEach(async uid => {
        await loadMessageByUid(uid);
    });
    setFlag();
    // 刷新当前聊天窗口的聊天记录
    loadActiveMessageRecord();

    Promise.resolve(true);
};

// 根据 uid 加载聊天记录
const loadMessageByUid = async uid => {
    // 只加载 200 提交聊天记录
    // 如果需要更多需要动态加载
    const {
        data: { Data },
    } = await getChatHistory({ uid: uid });
    const end_at = get(first(Data), 'SendAt');
    const start_at = get(last(Data), 'SendAt');

    const chats = await db.chat.where('sendAt').between(start_at, end_at).toArray();
    const mids = map(chats, 'mid');
    const filterChats = Data.filter(chat => {
        return !mids.includes(chat.Mid);
    });

    addMessages(
        filterChats.map(message => {
            return {
                content: message.Content,
                from: message.From,
                mid: message.Mid,
                sendAt: message.SendAt,
                seq: message.CliSeq,
                status: message.Status,
                to: message.To,
                type: message.Type,
            };
        })
    );
};

// 加载当前窗口的聊天记录
const loadActiveMessageRecord = () => {
    const {
        container: { userInfo },
        chat: { chatWithUser },
    } = store.getState();
    console.log(chatWithUser, 'chatWithUserchatWithUserchatWithUserchatWithUser');
    if (chatWithUser) {
        switchRoom(parseInt(userInfo.Uid), chatWithUser.uid);
    }
};

export { loadMessageRecord, loadMessageByUid };
