import { Avatar, Divider, Grid, Image } from '@arco-design/web-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AudioHtml from 'src/components/AudioHtml';
import { Message, MessageType } from 'src/core/message';
import { Session } from 'src/core/session';
import RightMenu from '@right-menu/react';
import { ConfigType, OptionsType } from '@right-menu/core';
import { switchRoom } from 'src/services/chat_db';
import { db } from 'src/services/db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { scrollToBottom } from 'src/utils/Utils';
import Editor from './components/editor';
import MessageComponent from './components/message';
import Tools from './components/tools';
import Menu from './menu';
import Modules from './modules';
import { dateLine, eventDelegation } from 'src/utils/Utils';
import { removeMessages } from 'src/services/chat_db';
import './styles/room.scss';

const Row = Grid.Row;
const Col = Grid.Col;

const Room = () => {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState<Message[]>([]);
    const _messages = useLiveQuery(() => db.activeChat.toArray());
    const editorRef = useRef<any>(null);
    const [imageVisible, setImageVisible] = useState<any>({
        visible: false,
        src: '',
    });
    const userInfo = useSelector((state: any) => state.container.userInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const session = useRef<Session>(null);
    const options: OptionsType = [
        {
            type: 'li',
            style: { padding: '10px 26px 10px 8px' },
            text: '清空',
            callback: () => {
                removeMessages(userInfo.Uid, chatWithUser.uid);
            },
        },
    ];

    // 绑定图片显示
    const bindImageWrapper = () => {
        eventDelegation(document.querySelector('.room-content-wrapper'), 'click', 'img', el => {
            console.log('el');
            setImageVisible(v => {
                const src = el.getAttribute('src');
                if (v.visible === false) {
                    return {
                        visible: true,
                        src: src,
                    };
                }
                return v;
            });
        });
    };

    useEffect(() => {
        session.current = window.ChatSession;
    }, []);

    // 延迟触发
    useEffect(() => {
        setMessages(_messages ? _messages : []);
        setTimeout(() => {
            scrollToBottom('.room-content');
        });
    }, [_messages]);

    useEffect(() => {
        return () => {
            bindImageWrapper();
        };
    });

    /**
     * 修改聊天对象
     */
    const changechatWithUser = chatWithUser => {
        console.log('chatWithUser', chatWithUser);
        dispatch(updateChatWithUser({ chatWithUser }));
        session.current.setToId(chatWithUser.uid);
        switchRoom(userInfo.Uid, chatWithUser.uid);
    };

    // 发送消息
    const sendChatMessage = (message: string, type: MessageType, callback: any) => {
        session.current.send(message, type).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                callback && callback();
            },
            complete: () => {
                callback && callback();
            },
        });
    };

    const MsgList = messages.map((message, key) => {
        const _dateline = dateLine(message.sendAt, key, messages);
        return (
            <div key={key}>
                {_dateline ? <div className="mt-5 mb-5 text-xs text-center text-gray-500">{_dateline}</div> : <></>}
                <MessageComponent sendChatMessage={sendChatMessage} userInfo={userInfo} setVisible={setImageVisible} key={message.sendAt} message={message} />
            </div>
        );
    });

    return (
        <div className="room">
            <div className="room-container">
                <Row className="h-full">
                    <Col span={1} xl={1} lg={1} md={1} className="h-full p-2 bg-black bg-white bg-gray-400 border-r">
                        <Modules userInfo={userInfo} />
                    </Col>
                    <Col span={4} xl={4} lg={4} md={4} className="h-full p-2 bg-white border-r border-gray-300">
                        <Menu changechatWithUser={changechatWithUser} />
                    </Col>
                    <Col span={19} xl={19} lg={19} md={19} className="h-full">
                        <div className="flex justify-between h-full">
                            <div className="w-2/3 p-5">
                                <div className="flex justify-between font-bold text-center room-content-title">
                                    <div className="flex items-center">
                                        <Avatar className="mr-2">{chatWithUser.avatar ? <img alt="avatar" src={chatWithUser.avatar} /> : chatWithUser.uid}</Avatar>
                                        <div className="title-name ">{chatWithUser.name}</div>
                                    </div>
                                    <div className="flower">
                                        <Tools sendChatMessage={sendChatMessage} />
                                    </div>
                                </div>
                                <div className="room-body">
                                    <div className="chat-body">
                                        <RightMenu theme={''} minWidth={200} maxWidth={200} onAfterInit={() => {}} onBeforeInit={() => {}} options={options}>
                                            <div className="room-content scrollbar">
                                                <div className="room-content-wrapper">{MsgList}</div>
                                            </div>
                                        </RightMenu>

                                        <Editor editorRef={editorRef} sendChatMessage={sendChatMessage} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center w-1/3 bg-slate-50 align-center">
                                <div className="">
                                    <div className="flex justify-center mt-10">
                                        <Avatar size={128}>{chatWithUser.avatar ? <img alt="avatar" src={chatWithUser.avatar} /> : chatWithUser.uid}</Avatar>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="text-2xl ">{chatWithUser.name}</div>
                                        <div className="text-base text-gray-500 ">{chatWithUser.motto}</div>
                                    </div>

                                    <div className="flex justify-center mt-10">
                                        <div>
                                            <svg className="mx-auto text-6xl transition ease-in-out cursor-pointer icon hover:scale-110" style={{ color: '#1990FF' }} aria-hidden="true">
                                                <use xlinkHref="#icon-dianhua1"></use>
                                            </svg>
                                            <div className="mt-2 font-bold text-center">电话</div>
                                        </div>
                                        <div className="ml-10 mr-10 ">
                                            <Divider type="vertical" style={{ height: 60 }} />
                                        </div>
                                        <div className="text-center">
                                            <svg className="mx-auto text-6xl transition ease-in-out cursor-pointer icon hover:scale-110" aria-hidden="true">
                                                <use xlinkHref="#icon-shipintonghua"></use>
                                            </svg>
                                            <div className="mt-2 font-bold ">视频</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Image.Preview
                    src={imageVisible.src}
                    visible={imageVisible.visible}
                    onVisibleChange={() => {
                        setImageVisible({ visible: false, src: '' });
                    }}
                />
                <AudioHtml />
            </div>
        </div>
    );
};

export default Room;
