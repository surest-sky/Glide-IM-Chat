import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../pages/cm';
import Room from '../pages/room';
import Auth from '../pages/auth';
import Mobile from '../pages/mobile';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/cm" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/m" element={<Mobile />} />
        </Routes>
    );
};
export default Routers;
