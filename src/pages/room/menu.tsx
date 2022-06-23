import { Avatar, Badge, Button, Input, List, Message, Modal } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { get } from 'lodash';
import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addContactsApi } from 'src/api/im/im';
import { ContactsType } from 'src/core/chat_type';
import { clearContactsMessageCount } from 'src/services/chat_db';
import { db } from 'src/services/db';
import store from 'src/store/index';
import { updateContacts } from 'src/store/reducer/chat';
import './styles/menu.scss';

const Menu = (props: any) => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState<string>('');
    const [contactsList, setContactsList] = useState<Array<ContactsType>>([]);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _contactsList = useLiveQuery(() => db.contacts.toArray());

    const addContacts = () => {
        return addContactsApi({ Uid: parseInt(value), Remark: '备注' + value });
    };

    const { run, loading } = useRequest(addContacts, {
        manual: true,
        onSuccess: ({ data }) => {
            store.dispatch(updateContacts());
            Message.success('添加成功 !');
            setVisible(false);
            return;
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });

    // 确认添加用户
    const confirmAddContacts = () => {
        if (!value.length) {
            Message.error('请输入...');
            return;
        }
        run();
    };

    // 聊天用户搜索
    const searchUser = value => {
        setContactsList(list => {
            if (!value.length) {
                return _contactsList;
            }
            return list.filter(item => {
                return item.name.indexOf(value) >= 0;
            });
        });
    };

    const updateContactsList = useCallback(() => {
        setContactsList(v => {
            if (_contactsList && _contactsList.length) {
                if (!v.length) {
                    props.changechatWithUser(get(_contactsList, 0));
                }
                return _contactsList;
            }
            return [];
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_contactsList]);

    useEffect(() => {
        updateContactsList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_contactsList]);

    return (
        <div className="w-full menu-container">
            <div className={'w-full flex justify-between'}>
                <Input onChange={v => searchUser(v)} className="w-full" style={{ width: 'calc(100% - 40px)' }} />{' '}
                <Button
                    onClick={() => {
                        setVisible(true);
                    }}
                    type="secondary"
                    icon={<IconPlus />}
                />
            </div>

            <List
                size={'small'}
                split={false}
                className="contacts-list scrollbar"
                dataSource={contactsList}
                render={(item, index) => (
                    <List.Item
                        onClick={() => {
                            clearContactsMessageCount(item.uid);
                            props.changechatWithUser(item);
                        }}
                        key={index}
                        className={chatWithUser.uid === item.uid ? 'active' : ''}
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge count={item.message_count}>
                                    <Avatar shape="square">{item.avatar ? <img alt="avatar" src={item.avatar} /> : item.uid} </Avatar>
                                </Badge>
                            }
                            title={item.name}
                            description={item.motto}
                        />
                    </List.Item>
                )}
            />

            <Modal unmountOnExit={false} title="添加联系人" visible={visible} confirmLoading={loading} onOk={() => confirmAddContacts()} onCancel={() => setVisible(false)} autoFocus={false} focusLock={true}>
                <Input onChange={setValue} value={value} placeholder="联系人ID" className={'w-full'} />
            </Modal>
        </div>
    );
};

export default memo(Menu);
