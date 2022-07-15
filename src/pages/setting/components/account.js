import { Card, Form } from '@arco-design/web-react';
import Email from 'src/components/Wrapper/Email';
import Phone from 'src/components/Wrapper/Phone';
import { getAuthInfo } from 'src/services/auth';
const FormItem = Form.Item;

const Account = () => {
    const [form] = Form.useForm();
    const userInfo = getAuthInfo()
    const defaultValue = {
        email: userInfo.email,
        phone: userInfo.phone
    }

    return <Card title="账户设置" bordered={false} className="system-container">
        <Form form={form} initialValues={defaultValue}
            layout={'vertical'} className="p-2 border border-dashed">
            <FormItem label="手机号码" field="phone">
                <Phone />
            </FormItem>

            <FormItem label="邮箱" field="email">
                <Email />
            </FormItem>
            {/* <FormItem label='密码' field={'password'} rules={[
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
            </FormItem> */}
        </Form>
    </Card >

}

export default Account