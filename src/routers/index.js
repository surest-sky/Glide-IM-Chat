import { Route, Routes } from 'react-router-dom';
import Layout from 'src/components/Layout/layout';
import Convert from 'src/pages/convert';
import Mobile from 'src/pages/mobile';
import Auth from '../pages/auth';
import Chat from '../pages/mobile/chat';
import Search from '../pages/mobile/search';
import Setting from '../pages/setting/index';
import WorkSpace from '../pages/workspace/index';
import Robot from '../pages/robot/index';
import Customer from '../pages/customer/index';
import Analysis from '../pages/analysis/index';
import Faq from '../pages/faq/index';
import LayoutMobile from '../pages/mobile/component/layout'


const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Convert />} />
            <Route path="/auth" element={<Auth />} />

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

        </Routes>
    );
};
export default Routers;
