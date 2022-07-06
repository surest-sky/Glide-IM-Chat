import { Select } from '@arco-design/web-react';
import { svgs } from 'src/services/svgs';
import './styles/icon.scss';

const Icons = ({ icon, onChange }) => {
    return <Select defaultValue={icon} className={'icons'} onChange={onChange}>
        {svgs.map(svg => {
            return <Select.Option key={svg.icon} value={svg.icon} className="icon-select">
                {svg.component}
            </Select.Option>
        })}
    </Select>
}

export default Icons