import { Menu, Modal } from '@arco-design/web-react';
import { IconEdit, IconPlusCircle } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as BitSvg } from 'src/static/svg/bit.svg';
import { ReactComponent as ChartSvg } from 'src/static/svg/chart.svg';
import { ReactComponent as ChatSvg } from 'src/static/svg/chat.svg';
import { ReactComponent as DoubtSvg } from 'src/static/svg/doubt.svg';
import { ReactComponent as PoteSvg } from 'src/static/svg/pote.svg';
import { ReactComponent as RobotSvg } from 'src/static/svg/robot.svg';
import { ReactComponent as SettingSvg } from 'src/static/svg/setting.svg';
import { ReactComponent as UsersSvg } from 'src/static/svg/users.svg';
import { ReactComponent as VipSvg } from 'src/static/svg/vip.svg';

const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;

const Menus = () => {
    const [cateVisible, setCateVisible] = useState(false);
    const navigate = useNavigate();
    const editCategory = () => {
        setCateVisible(true)
        alert(2)
    }

    return <div className="menu-container">
        <Menu theme='dark' levelIndent={0} onClickMenuItem={(key, path) => {
            // console.log(key, path)
            navigate(key)
        }}>
            <div className="flex justify-between menu-container-header">
                <div className="flex">
                    <img src="https://cdn.surest.cn/chat/dot-v2.png" alt="2" />
                    <span className="font-bold text-white">Im Chat</span>
                </div>
                <div className="operate">
                    <IconEdit className="mr-2 text-white hover:text-gray-300" />
                    <IconPlusCircle className="text-white hover:text-gray-300" />
                </div>
            </div>
            <MenuItem key='/workspace'>
                <ChatSvg />
                工作台
            </MenuItem>
            <MenuItemGroup key='workspace-group' onClick={editCategory} title={"分类"} className="mb-5">
                <MenuItem key='/workspace?c=vip'><VipSvg /> VIP</MenuItem>
                <MenuItem key='/workspace?c=v1'><PoteSvg /> 待沟通客户</MenuItem>
                <MenuItem key='/workspace?c=v2'><UsersSvg /> 潜在客户</MenuItem>
                <MenuItem key='/workspace?c=v3'><BitSvg /> 其他</MenuItem>
            </MenuItemGroup>
            <MenuItemGroup key='workspace-sapce' title='工作空间'>
                <MenuItem key='/customer'><UsersSvg /> 客户管理</MenuItem>
                <MenuItem key='/analysis'><ChartSvg /> 市场分析</MenuItem>
                <MenuItem key='/faq'><DoubtSvg /> 帮助中心</MenuItem>
                <MenuItem key='/robot'><RobotSvg /> 回复机器人</MenuItem>
                <MenuItem key='/setting'><SettingSvg /> 设置中心</MenuItem>
            </MenuItemGroup>
        </Menu>
        <Modal
            title='分类编辑'
            visible={cateVisible}
            onOk={() => setCateVisible(false)}
            onCancel={() => setCateVisible(false)}
            autoFocus={false}
            focusLock={true}
        >

        </Modal>
    </div>
}

export default Menus