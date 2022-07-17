import BraftEditor from 'braft-editor'
import { useRef, forwardRef, useImperativeHandle } from 'react'
import 'braft-editor/dist/index.css'
import './styles/braft.scss'

const Editor = (props, ref) => {
    const editorRef = useRef(null)

    const initHtml = (value) => {
        const html = BraftEditor.createEditorState(value)
        editorRef.current.setValue(html)
    }

    useImperativeHandle(ref, () => ({
        initHtml: initHtml,
    }));

    return <BraftEditor ref={editorRef} className="braft-wrapper border-theme " onChange={(value) => { props.onChange(value.toHTML()) }} />
}

export default forwardRef(Editor);