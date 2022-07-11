import { Button, Card, Form, Input } from '@arco-design/web-react';
const FormItem = Form.Item;

const Account = () => {
    const [form] = Form.useForm();

    const submit = async () => {
        const data = await form.validate();
        console.log(data)
    }

    return <Card title="账户设置" bordered={false} className="system-container">
        <Form form={form} layout={'vertical'} className="p-2 border border-dashed">
            <FormItem label='' field={'password'} rules={[
                {
                    required: true,
                    message: "请输入密码",
                },
                {
                    maxLength: 16,
                    message: "请输入密码",
                },
                {
                    minLength: 8,
                    message: "请不要少于8个字符",
                },
            ]}>
                <Input type="password" placeholder="请输入密码" />
            </FormItem>
            <FormItem label='' field={'confirmPassword'} rules={[
                {
                    required: true,
                    message: "请输入确认密码",
                },
                {
                    validator(value, cb) {
                        const password = form.getFieldValue('password')
                        if (password !== value) {
                            return cb('密码不一致，请检查');
                        }
                        return cb();
                    },
                }
            ]}>
                <Input type="password" placeholder="请输入确认密码" />
            </FormItem>

            <FormItem>
                <Button type='primary' htmlType='submit' long onClick={() => { submit() }}>
                    提交
                </Button>
            </FormItem>
        </Form>
    </Card>

}

export default Account