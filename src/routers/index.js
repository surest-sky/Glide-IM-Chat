import { Route, Routes } from 'react-router-dom';
import Layout from 'src/components/Layout/layout';
import Convert from 'src/pages/convert';
import Mobile from 'src/pages/mobile';
import LayoutAuth from '../pages/auth/layout';
import Login from '../pages/auth/loginV2';
import Forget from '../pages/auth/forget';
import Register from '../pages/auth/registerV2';
import Chat from '../pages/mobile/chat';
import Search from '../pages/mobile/search';
import Setting from '../pages/setting/index';
import WorkSpace from '../pages/workspace/index';
import Robot from '../pages/robot/index';
import Customer from '../pages/customer/index';
import Analysis from '../pages/analysis/index';
import Faq from '../pages/faq/index';
import LayoutMobile from '../pages/mobile/component/layout'
import Email from '../pages/notify/email'



const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Convert />} />

            <Route path="" element={<LayoutAuth />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forget" element={<Forget />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route path="" element={<LayoutMobile />}>
                <Route path="/m" element={<Mobile />} />
                <Route path="/m/s" element={<Search />} />
                <Route path="/m/chat" element={<Chat />} />
            </Route>

            <Route path="" element={<Layout />}>
                <Route path="/category/:id" element={<WorkSpace />} />
                <Route path="/workspace" element={<WorkSpace />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/robot" element={<Robot />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/faq" element={<Faq />} />
            </Route>

            <Route path="/email" element={<Email />} />
        </Routes>
    );
};
export default Routers;
