
import { Avatar, Button } from '@arco-design/web-react';
import { IconClockCircle, IconClose, IconIdcard, IconRight, IconSearch, IconSend } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import './styles/mobile.scss';
const Mobile = () => {
    const navigate = useNavigate();
    return <div className='mobile-container fade-in-top'>
        <div className='mobile-close-container-btn cur'>
            <div className='mobile-container-top-btn cur' style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                <IconClose className='close-btn' />
            </div>
        </div>
        <div className='mobile-container-top'>
            <div className='mobile-container-top-text'>
                <div className='transcss'>
                    <div className='mobile-container-top-text-img'>
                        <IconIdcard className='top-img' />
                    </div>
                    <div className='mobile-container-top-text-title'><span>你好  👋</span></div>
                    <h1>我们通过将您与客户联系起来，帮助您的业务增长</h1>
                </div>
            </div>
        </div>
        <div className='mobile-container-main'>
            <div className='mobile-container-main-content'>
                <div className='container-card' style={{ paddingTop: '191px' }}>
                    <div className='mobile-container-message-card'>
                        <h2 className='h2'>
                            继续我们的对话
                        </h2>
                        <div className='mobile-container-message-card-content cur'>
                            <div className='mobile-container-card-content-imgcontent'>
                                <div className='mobile-container-card-content-img'>
                                    <Avatar>
                                        222
                                    </Avatar>
                                </div>
                            </div>
                            <div className='mobile-container-card-content-container cur'>
                                <div className='mobile-container-card-content-titContent'>
                                    <div className='mobile-container-card-content-tit'>
                                        我们可以通过一些问题获得我们的回答
                                    </div>
                                </div>
                                <div className='mobile-container-card-content-titText'>
                                    <span>锋</span>
                                    <span>19个小时 前</span>
                                </div>
                            </div>
                            <IconRight className='right-icon' />
                        </div>
                    </div>
                    <div className='mobile-container-message-card'>
                        <div className='height186'>
                            <h2 className='h2'>开始另外一个对话</h2>
                            <div className='mobile-container-message-send'>
                                <div className='img-content'>
                                    <div className='img-one'>

                                        <div className='img-container img-cover'>
                                            <Avatar>Surest</Avatar>
                                        </div>

                                    </div>
                                    <div className='img-two'>

                                        <div className='img-container img-cover'>
                                            <Avatar>Surest</Avatar>
                                        </div>

                                    </div>
                                    <div className='img-three'>

                                        <div className='img-container img-cover'>
                                            <Avatar>Surest</Avatar>
                                        </div>

                                    </div>
                                </div>
                                <div className='time-container'>
                                    <div className='name-container-tit'>
                                        <IconClockCircle className='time-icon' />
                                        我们会尽快的回复
                                    </div>
                                </div>
                            </div>
                            <div className='link-to'>
                                <Button type='primary' className='link-btn'>
                                    <div className='link-content cur'>
                                        <IconSend className='send-icon' />
                                        <span onClick={() => {
                                            navigate('/m/chat')
                                        }}>发送消息</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='mobile-container-message-card'>
                        <div className='height264'>
                            <h2 className='h2'>帮助文档</h2>
                            <Button className='search-btn'>
                                <IconSearch />
                                搜索
                            </Button>
                            <div className='search-tit'>
                                <h3>参考文章</h3>
                                <ul>
                                    <li>
                                        <div className='search-type'>
                                            <div className='type-item'>
                                                <div className='type-content'>Messager 优势是什么？</div>
                                            </div>
                                        </div>
                                        <div className='li-icon'>
                                            <IconRight className='right-icon' />
                                        </div>
                                    </li>
                                    <li>
                                        <div className='search-type'>
                                            <div className='type-item'>
                                                <div className='type-content'>我们能帮助到您什么？</div>
                                            </div>
                                        </div>
                                        <div className='li-icon'>
                                            <IconRight className='right-icon' />
                                        </div>
                                    </li>
                                    <li>
                                        <div className='search-type'>
                                            <div className='type-item'>
                                                <div className='type-content'>如何私有化部署 ？</div>
                                            </div>
                                        </div>
                                        <div className='li-icon'>
                                            <IconRight className='right-icon' />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Mobile
