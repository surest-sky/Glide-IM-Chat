import { Spin } from '@arco-design/web-react';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ text }) => {
    return (
        <div className="flex items-center justify-center w-full h-full loadin-container">
            <Spin className="mr-2" /> {text ? text : '加入中...'}
        </div>
    )
}