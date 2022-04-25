import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Im from '../pages/im';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Im />} />
        </Routes>
    );
};
export default Routers;
