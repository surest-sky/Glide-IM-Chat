import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import { LiveChat } from 'src/core/live_chat';
import { ReactComponent as MessageSvg } from '../../static/svg/message.svg';
import JoinImModal from './components/joinImModal';

const Home = () => {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        console.log('Home');
        const chat = LiveChat.getInstance()
        let req;
        if (chat.isAuthenticated()) {
            req = chat.auth()
        } else {
            req = chat.register()
        }
        req.subscribe({
            next: (data) => {
                console.log(data)
            },
            error: (err) => {
                console.log(err)
            },
        })
    }, [])

    return (
        <div className="start-btn im-wrapper">
            <Button
                onClick={() => {
                    setVisible(true);
                }}
            >
                <MessageSvg /> <span className="ml-2">IM</span>
            </Button>
            <JoinImModal visible={visible} setVisible={setVisible} />
        </div>
    );
};

export default Home;
