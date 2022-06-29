
import { IconPlusCircle } from '@arco-design/web-react/icon';
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audiov2.svg';
import '../styles/editor.scss';

const Editors = () => {
    const Editor = ({ mode }) => {
        return <div
            contentEditable="true"
            suppressContentEditableWarning
            className={`editor-item scrollbar`}
        ></div>
    };

    return <>
        <div className="relative flex w-full">
            <Editor />
            <div className=" editor-operate">
                <AudioRecordSvg className="text-2xl transition ease-in-out cursor-pointer hover:scale-110" />
                <IconPlusCircle className="text-2xl transition ease-in-out cursor-pointer hover:scale-110" />
            </div>
        </div>
    </>
}

export default Editors