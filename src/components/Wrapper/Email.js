import { Form, Input, Link, Message, Modal, Tooltip } from '@arco-design/web-react';
import { useState } from 'react';
import VerifyCode from './VerifyCode'
import './styles/input.scss';

const FormItem = Form.Item;
const Phone = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const value = props.value

    // 验证码提交
    const submit = async () => {
        const data = await form.validate()
        console.log(data)
        setConfirmLoading(true)

        setTimeout(() => {
            setConfirmLoading(false)
            Message.success("修改成功")
        }, 2000)
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
                <FormItem field='verifyCode' rules={[
                    {
                        required: true,
                        message: "请输入验证码",
                    },
                    {
                        length: 4,
                        message: "验证码错误"
                    }
                ]}>
                    <VerifyCode validate={validateAllowCode} />
                </FormItem>
            </Form>

        </Modal>
    </div>
}

export default Phone