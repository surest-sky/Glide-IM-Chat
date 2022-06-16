import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../pages/cm';
import Room from '../pages/room';
import Auth from '../pages/auth';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/cm" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
    );
};
export default Routers;
