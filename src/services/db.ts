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
        this.version(13).stores({
            chat: '++id, [form+to], *session_id, *status, &mid, *sendAt',
        });

        this.version(13).stores({
            contacts: '++id, *name, &uid, *from_id',
        });

        this.version(13).stores({
            activeChat: '++id, [form+to], &mid, *sendAt',
        });
    }
}

export const db = new DbSubDexie();
