import { cloneElement } from 'react';
const TransitionSale = props => {
    const className = `cursor-pointer transition ease-in-out hover:scale-150 ` + props.className;
    return cloneElement(props.children, { className });
};

export default TransitionSale;
