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
        this.version(14).stores({
            chat: '++id, [from+to], *session_id, *status, &mid, *sendAt, *uid',
        });

        this.version(14).stores({
            contacts: '++id, *name, &uid, *from_id',
        });
    }
}

export const db = new DbSubDexie();
