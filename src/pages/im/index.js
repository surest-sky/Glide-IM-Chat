import { useState } from 'react';
import { Button } from 'react-daisyui';
import { ReactComponent as MessageSvg } from '../../static/svg/message.svg';
import ImModal from './components/im_modal';

const Home = () => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="start-btn im-wrapper">
            <Button
                onClick={() => {
                    setVisible(true);
                }}
            >
                <MessageSvg /> <span className="ml-2">IM</span>
            </Button>
            <ImModal visible={visible} setVisible={setVisible} />
        </div>
    );
};

export default Home;
