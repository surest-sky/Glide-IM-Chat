import { ReactComponent as ImageSvg } from '../../../../static/svg/image.svg';
import { ReactComponent as AudioSvg } from '../../../../static/svg/audio.svg';
import { uploadFile } from '../../../../services/upload';

const Tools = ({ editorRef }) => {
    const imageUpload = () => {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = async function () {
            var file = this.files[0];
            const { data } = await uploadFile(file, file.name);
            editorRef.current.insertContent(data.data.url);
        };
        input.click();
    };
    return (
        <div className="mr-5 flex">
            <ImageSvg onClick={imageUpload} className="cursor-pointer mr-2" />
            <AudioSvg className="cursor-pointer mr-2" />
        </div>
    );
};

export default Tools;
