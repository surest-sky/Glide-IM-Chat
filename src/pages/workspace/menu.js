import { List, Avatar, Select, Input } from '@arco-design/web-react';
import './styles/menu.scss';

const Menu = () => {
    const options = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan'];
    return <div className="contacts-container">
        <div className="contacts-menu"><Input placeholder="Search" className="w-full" /></div>
        <div className="flex justify-between contacts-select">
            <Select
                placeholder='Open'
                bordered={false}
            >
                {options.map((option, index) => (
                    <Select.Option key={option} disabled={index === 3} value={option}>
                        {option}
                    </Select.Option>
                ))}
            </Select>
            <Select
                placeholder='Time'
                bordered={false}
            >
                {options.map((option, index) => (
                    <Select.Option key={option} disabled={index === 3} value={option}>
                        {option}
                    </Select.Option>
                ))}
            </Select>
        </div>
        <List
            dataSource={new Array(4).fill({
                title: 'Beijing.',
                description: 'Beijing Bterprise locina.',
            })}
            render={(item, index) => (
                <List.Item key={index} className={index === 0 ? 'active' : null}>
                    <List.Item.Meta
                        avatar={<Avatar shape='square'>A</Avatar>}
                        title={item.title}
                        description={item.description}
                    />
                    <span className="arco-list-item-mini">一分钟前</span>
                </List.Item>
            )}
        />
    </div>
}

export default Menu