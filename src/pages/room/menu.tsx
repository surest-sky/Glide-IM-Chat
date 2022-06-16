import { addContactsApi } from 'src/api/im/im';
import { updateActiveUser } from 'src/store/reducer/chat';
import { Avatar, Button, Input, List, Message, Modal } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContactsType } from 'src/core/chat_type';
import lodash from 'lodash';
import './styles/menu.scss';

const Menu = () => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState<string>('');
    const [contactList, setContactList] = useState<Array<ContactsType>>([]);
    const allAontactList = useRef<Array<ContactsType>>([]);
    const activeUser = useSelector((state: any) => state.chat.activeUser);
    const dispatch = useDispatch();
    const { run, loading } = useRequest(addContactsApi({ Uid: value, Remark: '备注' + value }), {
        manual: true,
        onSuccess: result => {
            console.log(result);
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });

    const addContacts = () => {
        return addContactsApi({ Uid: value, Remark: '备注' + value });
    };

    const setActiveUser = (activeUser: ContactsType) => {
        dispatch(updateActiveUser({ activeUser }));
    };

    const confirm = () => {
        if (!value.length) {
            Message.error('请输入...');
            return;
        }
        run();
    };

    const searchUser = value => {
        setContactList(list => {
            if (!value.length) {
                return allAontactList.current;
            }
            return list.filter(item => {
                return item.name.indexOf(value) >= 0;
            });
        });
    };

    const loadData = () => {
        const contacts = new Array<ContactsType[]>();
        const _temp = [];

        const temp: ContactsType[] = [
            {
                avatar: 'https://api.surest.cn/storage/resource/20220511/1652258608-1652258607609.png',
                name: 'Lang',
                motto: '推动科技同经济深度融合热',
                uid: 12,
            },
            {
                avatar: 'http://cdn.surest.cn/iDJFWYmJX6maB6MhGawiZBhsz3xJT8zb',
                name: '峰',
                message: '欢迎欢迎！',
                motto: '名画《蒙娜丽莎》被游客扔蛋糕',
                uid: 13,
            },
            {
                avatar: 'https://api.surest.cn/storage/resource/20220530/1653891906-1653891905754.png',
                name: '峰',
                uid: 14,
                motto: '欢迎欢迎！',
            },
        ];
        contacts.push(...new Array(10).fill(temp));
        // eslint-disable-next-line array-callback-return
        contacts.map((contact: ContactsType[]) => {
            _temp.push(...contact);
        });

        setContactList(_temp);
        allAontactList.current = _temp;
        // setActive(lodash.get(contacts, '0.uid'))
        setActiveUser(lodash.get(_temp, 0));
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
                dataSource={contactList}
                render={(item, index) => (
                    <List.Item
                        onClick={() => {
                            setActiveUser(item);
                        }}
                        key={index}
                        className={activeUser.uid === item.uid ? 'active' : ''}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar shape="square">
                                    <img src={item.avatar} alt="" />
                                </Avatar>
                            }
                            title={item.name}
                            description={item.message}
                        />
                    </List.Item>
                )}
            />

            {/* <Modal title="添加联系人" visible={visible} confirmLoading={loading} onOk={() => confirm()} onCancel={() => setVisible(false)} autoFocus={false} focusLock={true}>
                <Input onChange={setValue} value={value} placeholder="联系人ID 或者 手机号码" className={'w-full'} />
            </Modal> */}
        </div>
    );
};

export default Menu;
