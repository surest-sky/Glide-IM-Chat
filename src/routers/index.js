import { Route, Routes } from 'react-router-dom';
import Convert from 'src/pages/convert';
import Mobile from 'src/pages/mobile';
import Auth from '../pages/auth';
import Admin from '../pages/cm';
import Chat from '../pages/mobile/chat';
import Search from '../pages/mobile/search';
import WorkSpace from '../pages/workspace/index';
import Setting from '../pages/setting/index';


const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Convert />} />
            <Route path="/cm" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/m" element={<Mobile />} />
            <Route path="/m/s" element={<Search />} />
            <Route path="/m/chat" element={<Chat />} />
            <Route path="/workspace" element={<WorkSpace />} />
            <Route path="/setting" element={<Setting />} />
        </Routes>
    );
};
export default Routers;
