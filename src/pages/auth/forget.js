import { Button, Form, Input, Link, Message } from '@arco-design/web-react';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgetPassword } from 'src/api/chat/app';
import AuthVerifyCode from 'src/components/Wrapper/AuthVerifyCode';

const FormItem = Form.Item;
const LoginForm = () => {
    const navigate = useNavigate();
    const defaultLoading = {
        loading: false,
        disabled: false,
        text: "提交"
    }
    const [loading, setLoading] = useState(defaultLoading)
    const { run } = useRequest(forgetPassword, {
        manual: true,
        onSuccess: result => {
            const code = result?.data.Code;
            if (parseInt(code) === 100) {
                Message.success('修改密码成功, 请登录...');
                navigate('/login')
                return;
            }
            Message.error(result?.data.Msg);
        },
        onFinally: () => {
            setLoading(defaultLoading);
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });
    const [form] = Form.useForm();
    const submitForm = async () => {
        const data = await form.validate();
        setLoading({
            loading: true,
            disabled: true,
            text: "登录中"
        })
        console.log(data)
        run(data);
    };
    const validateAllowCode = () => {
        const email = form.getFieldValue("email")
        if (!email) {
            return ['', "请先输入邮箱"]
        }
        return [email, ""]
    }

    return (
        <div className="login-container">
            <section className="flex flex-col md:flex-row h-screen items-center">
                <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                    <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover" />
                </div>

                <div
                    className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center"
                >
                    <div className="w-full h-100">
                        <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">找回密码</h1>
                        <Form className="mt-6" wrapperCol={{ span: 24 }} form={form}>
                            <label className="block text-gray-700">邮箱</label>
                            <FormItem field='email' rules={[
                                {
                                    required: true,
                                    message: '请输入你的邮箱'
                                },
                            ]}>
                                <Input placeholder="请输入你的用户名" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" />
                            </FormItem>


                            <label className="block text-gray-700">密码</label>
                            <FormItem field={'password'} rules={[
                                {
                                    maxLength: 16,
                                    message: "请输入密码",
                                },
                                {
                                    minLength: 8,
                                    message: "请不要少于8个字符",
                                },
                            ]}>
                                <Input type="password" placeholder="请输入密码" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" />
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
                                <Input type="password" placeholder="请输入确认密码" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" />
                            </FormItem>

                            <FormItem field={'captcha'} rules={[
                                {
                                    required: true,
                                    message: '请输入你的验证码'
                                },
                            ]}>
                                <AuthVerifyCode mode={"forget"} validate={validateAllowCode} getValue={() => form.getFieldValue("email")} />
                            </FormItem>

                            <FormItem>
                                <Button size='large' className='submit-login w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 font-semibold ' type="primary" disabled={loading.disabled} loading={loading.loading} onClick={submitForm}>{loading.text}</Button>
                            </FormItem>
                        </Form>

                        <p className="mt-8">
                            <Link onClick={() => navigate('/login')}>去登录</Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default LoginForm;
