import { useState } from 'react';
import { Button } from 'react-daisyui';
import { ReactComponent as MessageSvg } from '../../static/svg/message.svg';
import JoinImModal from './components/joinImModal';

const Home = () => {
    const [visible, setVisible] = useState(true);
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
