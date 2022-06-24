import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../pages/cm';
import Room from '../pages/room';
import Auth from '../pages/auth';
import Mobile from '../pages/mobile';
import Search from '../pages/search';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/cm" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/m" element={<Mobile />} />
            <Route path="/s" element={<Search />} />
        </Routes>
    );
};
export default Routers;
