
import { IconClose, IconIdcard, IconRight, IconClockCircle, IconSend, IconSearch } from '@arco-design/web-react/icon';
import { Button } from '@arco-design/web-react';
import 'src/static/mobile.scss';
const Mobile = () => {
    return <div className='mobile-container'>
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
                    <div className='mobile-container-top-text-title'><span>Hi  👋</span></div>
                    <h1>We help your business grow by connecting you to your customers.</h1>
                </div>
            </div>
        </div>
        <div className='mobile-container-main'>
            <div className='mobile-container-main-content'>
                <div className='container-card' style={{ paddingTop: '191px' }}>
                    <div className='mobile-container-message-card height284'>
                        <h2 className='h2'>
                            Continue the conversation
                        </h2>
                        <div className='mobile-container-message-card-content cur'>
                            <div className='mobile-container-card-content-imgcontent'>
                                <div className='mobile-container-card-content-img'>
                                    <img />
                                </div>
                            </div>
                            <div className='mobile-container-card-content-container cur'>
                                <div className='mobile-container-card-content-titContent'>
                                    <div className='mobile-container-card-content-tit'>
                                        May we begin with your name, email, and the business or website this is for, so I can get some context? 😊
                                    </div>
                                </div>
                                <div className='mobile-container-card-content-titText'>
                                    <span>Maria•</span>
                                    <span>19h ago</span>
                                </div>
                            </div>
                            <IconRight className='right-icon' />
                        </div>
                    </div>
                    <div className='mobile-container-message-card'>
                        <div className='height186'>
                            <h2 className='h2'>Start another conversation</h2>
                            <div className='mobile-container-message-send'>
                                <div className='img-content'>
                                    <div className='img-one'>

                                        <div className='img-container img-cover'>
                                            <img />
                                        </div>

                                    </div>
                                    <div className='img-two'>

                                        <div className='img-container img-cover'>
                                            <img />
                                        </div>

                                    </div>
                                    <div className='img-three'>

                                        <div className='img-container img-cover'>
                                            <img />
                                        </div>

                                    </div>
                                </div>
                                <div className='time-container'>
                                    <div className='name-container-tit'>Our usual reply time</div>
                                    <div className='time-text'>
                                        <IconClockCircle className='time-icon' />
                                        <span>A few minutes</span>
                                    </div>
                                </div>
                            </div>
                            <div className='link-to'>
                                <Button type='primary' className='link-btn'>
                                    <div className='link-content cur'>
                                        <IconSend className='send-icon' />
                                        <span>Send us a message</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='mobile-container-message-card'>
                        <div className='height264'>
                            <h2 className='h2'>Search for help</h2>
                            <Button className='search-btn'>
                                <IconSearch />
                                Search articles...
                            </Button>
                            <div className='search-tit'>
                                <h3>Suggested articles</h3>
                                <ul>
                                    <li>
                                        <div className='search-type'>
                                            <div className='type-item'>
                                                <div className='type-content'>A/B test different message variations</div>
                                            </div>
                                        </div>
                                        <div className='li-icon'>
                                            <IconRight className='right-icon' />
                                        </div>
                                    </li>
                                    <li>
                                        <div className='search-type'>
                                            <div className='type-item'>
                                                <div className='type-content'>A/B test different message variations</div>
                                            </div>
                                        </div>
                                        <div className='li-icon'>
                                            <IconRight className='right-icon' />
                                        </div>
                                    </li>
                                    <li>
                                        <div className='search-type'>
                                            <div className='type-item'>
                                                <div className='type-content'>A/B test different message variations</div>
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
