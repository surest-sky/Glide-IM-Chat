import { Button, Input, Message, Spin, Tooltip } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addArticle, getArticle } from 'src/api/chat/faq';
import Breadcrumb from 'src/components/Breadcrumb';
import Braft from './components/braft';
import './styles/editor.scss';
import './styles/faq.scss';

const Editor = (props) => {
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const editorRef = useRef(null,)
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        content: '',
        status: 1,
        publish_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    const setFormField = (field, value) => {
        const _form = Object.assign({}, form)
        _form[field] = value
        setForm(_form)
    }
    const titleRef = useRef(null)
    const validate = () => {
        if (!form.title) {
            Message.error("请输入文章标题")
            return false
        }

        console.log(form)
        if (!form.content) {
            Message.error("请输入文章内容")
            return false
        }
        return true
    }
    const submit = async () => {
        if (!validate()) {
            return
        }
        setLoading(true)
        const { data } = await addArticle(form).finally(() => { setLoading(false) })
        if (data.Code !== 100) {
            Message.error(data.Msg || "服务异常")
            return
        }

        Message.success("创建文章成功")
        navigate('/faq/list')
    }
    useEffect(() => {
        const id = searchParams.get("id")
        if (!id) {
            setLoading(false)
            titleRef.current.focus();
            return
        }
        getArticle(id).then(({ data }) => {
            console.log('data.Data', data.Data)
            if (data.Data?.id) {
                setForm(data.Data)
                editorRef.current.initHtml(data.Data.content)
            }
        }).finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <div className="setting-container">
        <Spin className="setting-card card-wrapper" loading={loading} >
            <Breadcrumb title="文档编辑" options={[
                {
                    title: " 帮助中心",
                    url: '/faq/list'
                }
            ]} />
            <div className="faq-editor-wrapper">
                <Input value={form.title} onChange={(value) => setFormField('title', value)} className="faq-editor-title border-theme" ref={titleRef} />
                {/* <RadioGroup
                    onChange={(value) => setFormField('status', value)}
                    className="border-theme"
                    value={form.status}
                    options={options}
                    size='large'
                    type='button'
                    defaultValue='Beijing'
                    style={{ marginBottom: 20 }}
                /> */}
                <Braft ref={editorRef} onChange={(value) => setFormField('content', value)} value={form.content} />
                <Tooltip content='点击立即发布'>
                    <Button shape='circle' size='large' onClick={() => { submit() }} type='primary' className="publish-submit">确认</Button>
                </Tooltip>
            </div>
        </Spin>
    </div>
}

export default Editor;