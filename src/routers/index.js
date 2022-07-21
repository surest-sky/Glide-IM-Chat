import { Route, Routes } from 'react-router-dom';
import Layout from 'src/components/Layout/layout';
import Convert from 'src/pages/convert';
import Mobile from 'src/pages/mobile';
import LayoutAuth from '../pages/auth/layout';
import Login from '../pages/auth/loginV2';
import Forget from '../pages/auth/forget';
import Register from '../pages/auth/registerV2';
import Chat from '../pages/mobile/chat';
import MobileArticle from '../pages/mobile/article'
import MobileFaq from '../pages/mobile/faq'
import Search from '../pages/mobile/search';
import Setting from '../pages/setting/index';
import WorkSpace from '../pages/workspace/index';
import Robot from '../pages/robot/index';
import Customer from '../pages/customer/index';
import Analysis from '../pages/analysis/index';
import FaqEditor from '../pages/faq/editor';
import FaqList from '../pages/faq/list';
import LayoutMobile from '../pages/mobile/component/layout'
import Email from '../pages/notify/email'
import Test from '../pages/test'


const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Convert />} />

            <Route path="" element={<LayoutAuth />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forget" element={<Forget />} />
                <Route path="/register" element={<Register />} />
            </Route>


            {/* <Route path="/m" element={<LayoutMobile />}>
                <Route path="/m" element={<Mobile />} />
                <Route path="/m/s" element={<Search />} />
                <Route path="/m/chat" element={<Chat />} />
                <Route path="/m/faq" element={<MobileFaq />} />
                <Route path="/m/faq/show" element={<MobileArticle />} />
            </Route> */}

            <Route path="/" element={<Layout />}>
                <Route path="/category/:id" element={<WorkSpace />} />
                <Route path="/workspace" element={<WorkSpace />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/robot" element={<Robot />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/faq/list" element={<FaqList />} />
                <Route path="/faq/editor" element={<FaqEditor />} />
            </Route>

            <Route path="/email" element={<Email />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    );
};
export default Routers;
