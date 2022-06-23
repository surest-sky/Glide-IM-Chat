import Dexie, { Table } from 'dexie';
import { Message } from 'src/core/message';
import { ContactsType } from 'src/core/chat_type';

const dbName = 'chatDatabase';

export class DbSubDexie extends Dexie {
    chat: Table<Message>;
    contacts: Table<ContactsType>;
    activeChat: Table<Message>;

    constructor() {
        super(dbName);
        this.version(1).stores({
            chat: '++id, form, to, mid, sendAt',
        });

        this.version(1).stores({
            contacts: '++id, name, uid',
        });

        this.version(1).stores({
            activeChat: '++id, form, to, mid, sendAt',
        });

        // 清空联系人的数据
        this.contacts.clear();
    }
}

export const db = new DbSubDexie();
