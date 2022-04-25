import { useState } from 'react';
import { Modal, Button } from 'react-daisyui';
import { ReactComponent as JoinSvg } from '../../../static/svg/join.svg';
import Room from './room';
const JoinIm = ({ visible, setVisible }) => {
    const [message, setMessage] = useState(true);
    /**
     * 加入房间
     */
    const joinRoom = () => {
        setMessage(true);
    };

    return (
        <Modal
            open={visible}
            onClickBackdrop={() => {
                setVisible(false);
                setMessage(false);
            }}
        >
            {!message ? (
                <>
                    <Modal.Body className="text-base font-bold">现在立即为您接入客服通道，是否继续？</Modal.Body>
                    <Modal.Actions>
                        <Button
                            color="primary"
                            onClick={() => {
                                joinRoom();
                            }}
                        >
                            <JoinSvg /> <span className="ml-2">加入</span>
                        </Button>
                        <Button
                            onClick={() => {
                                setVisible(false);
                            }}
                        >
                            离开
                        </Button>
                    </Modal.Actions>
                </>
            ) : (
                <Room />
            )}
        </Modal>
    );
};

export default JoinIm;
