import { Avatar, Button, Input, List, Message, Modal } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import lodash from 'lodash';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { addContactsApi, getContactsListApi, userInfoApi } from 'src/api/im/im';
import { ContactsType } from 'src/core/chat_type';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'src/services/db';
import { addBlukContacts } from 'src/services/chat_db';
import './styles/menu.scss';

const Menu = (props: any) => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState<string>('');
    const [contactsList, setContactsList] = useState<Array<ContactsType>>([]);
    const allAontactList = useRef<Array<ContactsType>>([]);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const _contactsList = useLiveQuery(() => db.contacts.toArray());

    const addContacts = () => {
        return addContactsApi({ Uid: parseInt(value), Remark: '备注' + value });
    };

    const contactsUsers = async (Uids: Array<string>) => {
        try {
            const {
                data: { Data },
            } = await userInfoApi({ Uid: Uids });
            return Data;
        } catch (error) {
            return [];
        }
    };

    const { run, loading } = useRequest(addContacts, {
        manual: true,
        onSuccess: ({ data }) => {
            console.log(data);
            if (data.Code === 100) {
                Message.success('添加成功 !');
                return;
            }

            Message.warning('已经再好友列表里面了 !');
            return;
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });

    const getContactsList = async () => {
        try {
            const {
                data: { Data },
            } = await getContactsListApi();
            const uids = lodash.map(Data, 'Id');
            let _contactsList = await contactsUsers(uids);
            _contactsList = _contactsList.map(contacts => {
                return {
                    avatar: undefined,
                    name: contacts.Nickname,
                    motto: contacts.Nickname + ':测试格言',
                    uid: contacts.Uid,
                };
            });
            console.log('contactsList', contactsList);
            // setContactsList(_contactsList);
            // allAontactList.current = _contactsList;
            addBlukContacts(_contactsList);
            props.changechatWithUser(lodash.get(_contactsList, 0));
        } catch (error) {}
    };

    const confirm = () => {
        if (!value.length) {
            Message.error('请输入...');
            return;
        }
        run();
    };

    const searchUser = value => {
        setContactsList(list => {
            if (!value.length) {
                return allAontactList.current;
            }
            return list.filter(item => {
                return item.name.indexOf(value) >= 0;
            });
        });
    };

    const mockContactsList = () => {
        const contacts = new Array<ContactsType[]>();
        const _temp = [];
        const temp: ContactsType[] = [
            {
                avatar: 'https://api.surest.cn/storage/resource/20220511/1652258608-1652258607609.png',
                name: 'Lang',
                motto: '推动科技同经济深度融合热',
                message_count: 0,
                uid: 12,
            },
            {
                avatar: 'http://cdn.surest.cn/iDJFWYmJX6maB6MhGawiZBhsz3xJT8zb',
                name: '峰',
                message_count: 0,
                motto: '名画《蒙娜丽莎》被游客扔蛋糕',
                uid: 13,
            },
            {
                avatar: 'https://api.surest.cn/storage/resource/20220530/1653891906-1653891905754.png',
                name: '峰',
                message_count: 0,
                uid: 14,
                motto: '欢迎欢迎！',
            },
        ];
        contacts.push(...new Array(10).fill(temp));
        // eslint-disable-next-line array-callback-return
        contacts.map((contact: ContactsType[]) => {
            _temp.push(...contact);
        });

        setContactsList(_temp);
        allAontactList.current = _temp;
        props.changechatWithUser(lodash.get(_temp, 0));
    };

    const loadData = () => {
        getContactsList();
    };

    React.useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                dataSource={_contactsList}
                render={(item, index) => (
                    <List.Item
                        onClick={() => {
                            props.changechatWithUser(item);
                        }}
                        key={index}
                        className={chatWithUser.uid === item.uid ? 'active' : ''}
                    >
                        <List.Item.Meta avatar={<Avatar shape="square">{item.avatar ? <img alt="avatar" src={item.avatar} /> : item.uid}</Avatar>} title={item.name} description={item.motto} />
                    </List.Item>
                )}
            />

            <Modal title="添加联系人" visible={visible} confirmLoading={loading} onOk={() => confirm()} onCancel={() => setVisible(false)} autoFocus={false} focusLock={true}>
                <Input onChange={setValue} value={value} placeholder="联系人ID" className={'w-full'} />
            </Modal>
        </div>
    );
};

export default Menu;
