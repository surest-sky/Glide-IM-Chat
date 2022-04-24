import { useState } from 'react';
import { Button } from 'react-daisyui';
import { ReactComponent as MessageSvg } from '../../static/svg/message.svg';
import JoinImModal from './components/joinImModal';

const Home = () => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="start-btn">
            <Button
                onClick={() => {
                    setVisible(true);
                }}
            >
                <MessageSvg /> <span className="ml-2">联系客服</span>
            </Button>
            <JoinImModal visible={visible} setVisible={setVisible} />
        </div>
    );
};

export default Home;
