import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../pages/cm';
import Room from '../pages/room';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/cm" element={<Admin />} />
        </Routes>
    );
};
export default Routers;
