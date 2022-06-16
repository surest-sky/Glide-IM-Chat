import { Form, Input, Button, Message } from '@arco-design/web-react';
import { registerUserApi } from 'src/api/im/im'
import { useRequest } from 'ahooks'
const FormItem = Form.Item;

const RegisterForm = () => {
    const registerUser = (formData) => {
        return registerUserApi({ Account: formData.name, Password: formData.password });
    };

    const { run, loading } = useRequest(registerUser, {
        manual: true,
        onSuccess: result => {
            const code = result?.data?.Code
            if (code === 100) {
                Message.success("注册成功, 请登录...")
                return
            }

            Message.error(result?.data.Msg + '...')
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });
    const [form] = Form.useForm();
    const submitForm = async () => {
        const data = await form.validate()
        run(data)
    }

    return (
        <Form wrapperCol={{ span: 24 }} form={form}>
            <FormItem field='name' rules={[
                {
                    required: true,
                    message: '请输入你的用户名',
                },

                {
                    minLength: 2,
                    message: '最短2个字符',
                },

                {
                    maxLength: 15,
                    message: '最长15个字符',
                }
            ]}>
                <Input placeholder="请输入你的用户名" />
            </FormItem>
            <FormItem field='password' rules={[
                {
                    required: true,
                    message: '请输入你的密码',
                },
                {
                    minLength: 6,
                    message: '最短6个字符',
                },
                {
                    maxLength: 16,
                    message: '最长16个字符',
                }
            ]}>
                <Input type="password" placeholder="请输入你的密码" />
            </FormItem>
            <FormItem field='confirm_password' rules={[
                {
                    required: true,
                    message: '请确认你的密码',
                },
                {
                    validator(value, cb) {
                        const password = form.getFieldValue("password")
                        if (value !== password) {
                            return cb('确认密码不一致，请检查')
                        }
                        return cb()
                    }
                }
            ]}>
                <Input type="password" placeholder="请再次输入你的密码" />
            </FormItem>
            <FormItem>
                <Button className='w-full' type="primary" loading={loading} onClick={submitForm}>Submit</Button>
            </FormItem>
        </Form>
    );
};
export default RegisterForm;
