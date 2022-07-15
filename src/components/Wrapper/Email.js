import { Form, Input, Link, Message, Modal, Tooltip } from '@arco-design/web-react';
import { useState } from 'react';
import VerifyCode from './VerifyCode'
import { updateEmail } from 'src/api/chat/setting'
import { getAuthInfo } from 'src/services/auth';
import { updateAuthInfo } from 'src/store/reducer/container';
import store from 'src/store/index';
import './styles/input.scss';

const FormItem = Form.Item;
const Phone = (props) => {
    let authInfo = getAuthInfo()
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const value = props.value

    // 验证码提交
    const submit = async () => {
        setConfirmLoading(true)
        let res = await form.validate()

        const { data: { Code, Msg } } = await updateEmail(res)
        if (Code !== 100) {
            setConfirmLoading(false)
            Message.warning(Msg)
            return
        }

        setConfirmLoading(false)
        Message.success("修改成功")
        authInfo.email = res.email
        store.dispatch(updateAuthInfo(authInfo))
        props.onChange(res.email)
        setVisible(false)
    }

    const validateAllowCode = () => {
        const email = form.getFieldValue("email")
        if (!email) {
            return ['', "请先输入邮箱"]
        }
        return [email, ""]
    }

    return <div>
        <Tooltip mini content='点击修改邮箱'>
            <Link onClick={() => { setVisible(true) }}>{value ? value : '设置邮箱'}</Link>
        </Tooltip>

        <Modal
            title='邮箱设置'
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
                <FormItem className="w-full" field='email' rules={[
                    {
                        required: true,
                        message: "请输入邮箱",
                    },
                    {
                        match: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
                        message: "请输入正确的邮箱",
                    }
                ]}>
                    <Input className={' border border-dashed border-gray-400'} placeholder="请输入邮箱" />
                </FormItem>
                <FormItem field='captcha' rules={[
                    {
                        required: true,
                        message: "请输入验证码",
                    },
                    {
                        length: 4,
                        message: "验证码错误"
                    }
                ]}>
                    <VerifyCode validate={validateAllowCode} getValue={() => form.getFieldValue("email")} />
                </FormItem>
            </Form>

        </Modal>
    </div>
}

export default Phone