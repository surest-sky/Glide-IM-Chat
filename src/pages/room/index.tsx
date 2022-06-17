import { Avatar, Divider, Grid, Image } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AudioHtml from 'src/components/AudioHtml';
import { Message, MessageType } from 'src/core/message';
import { Session } from 'src/core/session';
import { db } from 'src/services/db';
import { updateChatWithUser } from 'src/store/reducer/chat';
import { scrollToBottom } from 'src/utils/Utils';
import Editor from './components/editor';
import MessageComponent from './components/message';
import Tools from './components/tools';
import Menu from './menu';
import Modules from './modules';
import { switchRoom } from 'src/services/chat_db';
import './styles/room.scss';

const Row = Grid.Row;
const Col = Grid.Col;

const Room = () => {
    const dispatch = useDispatch();
    // const [session, setSession] = useState<Session | null>(null);
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

    useEffect(() => {
        session.current = window.ChatSession;
    }, []);

    // useEffect(() => {
    //     return session.current.setMessageListener(message => {
    //         if (!isRoomMessage(message, chatWithUser)) {
    //             return;
    //         }
    //         setMessages(messages => [...messages, message]);
    //         setTimeout(() => {
    //             scrollToBottom('.room-content');
    //         }, 100);
    //     });
    // });

    // 延迟触发
    useEffect(() => {
        setMessages(_messages ? _messages : []);
        setTimeout(() => {
            scrollToBottom('.room-content');
        });
    }, [_messages]);

    // const initFirstMessage = () => {
    //     return;
    //     const robot = new ChatRobot();
    //     const fmsg = robot.loadMessageByFirst();
    //     const chatMsg = new ChatMessage();
    //     chatMsg.Content = fmsg;
    //     setMessages([...messages, chatMsg]);
    // };

    /**
     * 修改聊天对象
     */
    const changechatWithUser = chatWithUser => {
        dispatch(updateChatWithUser({ chatWithUser }));
        session.current.setToId(chatWithUser.uid);
        switchRoom(userInfo.Uid, chatWithUser.uid);
    };

    /**
     * 初始化房间
     * @param se
     */
    // const initLoadChatRoom = (se: Session) => {
    //     se.notifyInputMessage();
    //     setSession(se);
    //     setMessages(se.getMessages());
    //     setLoading(false);
    //     setTimeout(() => {
    //         $('.room-container').on('click', 'img', (element: any) => {
    //             const src = element.target.getAttribute('src');
    //             setImageVisible({ visible: true, src: src });
    //         });
    //     });
    //     setTimeout(() => {
    //         initFirstMessage();
    //     }, 1000);
    // };

    /**
     * 初始化聊天回话
     */
    // const initLoadSession = () => {
    //     // 获取或初始化聊天会话
    //     LiveChat.getInstance()
    //         .getOrInitSession()
    //         .pipe(delay(1000))
    //         .subscribe({
    //             next: se => {
    //                 initLoadChatRoom(se);
    //             },
    //             error: error => {
    //                 console.log(error);
    //             },
    //         });
    // };

    useEffect(() => {
        // LiveChat.getInstance()
        //     .initChat()
        //     .subscribe({
        //         error: err => {
        //             console.error(err);
        //         },
        //         complete: () => {
        //             initLoadSession();
        //         },
        //     });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dateLine = (at, key) => {
        const dateDayjs = dayjs(at * 1000);
        const _date = dateDayjs.format('YYYY-MM-DD HH:mm:ss');
        if (key === 0) {
            return _date;
        }

        let lastAt = dayjs(messages[key - 1].sendAt * 1000);
        if (dateDayjs.diff(lastAt, 'minute') > 1) {
            return _date;
        }

        const fl: any = key / 5;
        if (fl % 1 === 0) {
            return _date;
        }
        return false;
    };

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
        const _dateline = dateLine(message.sendAt, key);
        return (
            <div key={key}>
                {_dateline ? <div className="mt-5 mb-5 text-xs text-center text-gray-500">{_dateline}</div> : <></>}
                <MessageComponent userInfo={userInfo} setVisible={setImageVisible} key={message.sendAt} message={message} />
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
                                        <div className="room-content scrollbar">
                                            <div className="room-content-wrapper">{MsgList}</div>
                                        </div>
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
