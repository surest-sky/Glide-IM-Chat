import { Form, Input, Typography, Link, Message, Modal, Tooltip } from '@arco-design/web-react';
import { useState, useCallback } from 'react';
import { updateAppHost } from 'src/api/chat/app';
import { getAuthInfo } from 'src/services/auth';
import store from 'src/store/index';
import { updateAuthInfo } from 'src/store/reducer/container';
import './styles/input.scss';

const FormItem = Form.Item;
const Phone = (props) => {
    const prefixHost = process.env.REACT_APP_HOST
    let authInfo = getAuthInfo()
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const value = props.value

    const submit = async () => {
        setConfirmLoading(true)
        let res = await form.validate()
        const host = `${res.host}${prefixHost}`
        const { data: { Code, Msg } } = await updateAppHost({ host: host })
        if (Code !== 100) {
            setConfirmLoading(false)
            Message.warning(Msg)
            return
        }

        setConfirmLoading(false)
        Message.success("修改成功")
        authInfo.host = host
        authInfo.app.host = host
        console.log("authInfo", authInfo)
        store.dispatch(updateAuthInfo(authInfo))
        props.onChange(host)
        setVisible(false)
    }

    const getHost = useCallback(() => {
        if (process.env.NODE_ENV === 'production') {
            return `<script src="https://${value}/chat.js" id="chatjs"></script>`
        } else {
            return `<script src="https://${value}/chat.js" id="chatjs" data-env="local" data-url="http://${value}"></script>`
        }
    }, [value])

    return <div>
        <Tooltip mini content='点击修改客户端域名'>
            <Link onClick={() => { setVisible(true) }}>{value ? value : '域名设置'}</Link>
        </Tooltip>

        {value ? <Link className="ml-2" onClick={() => {
            Modal.confirm({
                title: '使用教程',
                content: <><p className="mb-2">您可以将此段JS 复制到 你的浏览器任意位置</p>  <Typography.Paragraph copyable>{getHost()}</Typography.Paragraph></>,
                okText: 'Ok',
                cancelText: 'Cancel',
            });
        }}>立即使用</Link> : null}

        <Modal
            title='域名设置'
            visible={visible}
            onOk={() => submit()}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
            confirmLoading={confirmLoading}
        >
            <Form
                form={form}
                layout={'vertical'}
            >
                <FormItem className="w-full" field='host' rules={[
                    {
                        required: true,
                        message: "请输入",
                    },
                    {
                        match: /[a-z|A-Z]/,
                        message: "只允许输入纯字母",
                    },
                    {
                        maxLength: 6,
                        message: "最长不要超过6个字符",
                    }
                ]}>
                    <Input addAfter={prefixHost} className={' border border-solid '} placeholder="mobile" />
                </FormItem>
            </Form>

        </Modal>
    </div>
}

export default Phone