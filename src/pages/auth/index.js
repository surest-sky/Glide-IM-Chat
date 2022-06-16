import { Link } from '@arco-design/web-react';
import { useToggle } from 'ahooks';
import LoginFrom from './login';
import RegisterFrom from './register';
import './styles/auth.scss'

const Auth = () => {
    const [state, { toggle }] = useToggle(true);

    return <div className='p-5 mx-auto mt-10 border border-gray-100 border-solid w-80'>
        <h1 className='mb-5 text-xl font-bold text-center'>{state ? '登录' : '注册'}</h1>
        {state ? <LoginFrom /> : <RegisterFrom toggle={toggle} />}
        <div className='flex justify-between'>
            <Link onClick={toggle}>{state ? '注册' : '登录'}</Link>
        </div>
    </div>
}

export default Auth;