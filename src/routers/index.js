import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../pages/cm';
import Room from '../pages/room';
import Auth from '../pages/auth';
import Mobile from '../pages/mobile';
import Search from '../pages/mobile/search';
import Chat from '../pages/mobile/chat';
import WorkSpace from '../pages/workspace/index';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/cm" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/m" element={<Mobile />} />
            <Route path="/m/s" element={<Search />} />
            <Route path="/m/chat" element={<Chat />} />
            <Route path="/workspace" element={<WorkSpace />} />
        </Routes>
    );
};
export default Routers;
