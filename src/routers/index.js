import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Im from '../pages/im';
import Room from '../pages/im/room';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Im />} />
            <Route path="/room" element={<Room />} />
        </Routes>
    );
};
export default Routers;
