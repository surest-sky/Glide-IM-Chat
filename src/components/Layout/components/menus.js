import { Badge, Menu, Message, Modal } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';
import { useLiveQuery } from 'dexie-react-hooks';
import { map, orderBy, sum } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setLogout } from 'src/services/auth';
import { db } from 'src/services/db';
import { getComponentSvg } from 'src/services/svgs';
import { ReactComponent as ChatSvg } from 'src/static/svg/chat.svg';
import { ReactComponent as DoubtSvg } from 'src/static/svg/doubt.svg';
import { ReactComponent as LogoutSvg } from 'src/static/svg/logout.svg';
import { ReactComponent as RobotSvg } from 'src/static/svg/robot.svg';
import { ReactComponent as SettingSvg } from 'src/static/svg/setting.svg';
import { ReactComponent as VideoSvg } from 'src/static/svg/video.svg';

const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;

const Menus = () => {
    const { pathname } = useLocation();
    const [unreadCount, setUnReadCount] = useState(0);
    const navigate = useNavigate();
    const authInfo = useSelector((state: any) => state.container.authInfo);
    const categoryList = useSelector((state: any) => orderBy(state.container.categoryList, 'weight'));
    const _contactsList = useLiveQuery(() => db.contacts.toArray());
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        setUnReadCount(() => {
            return sum(map(_contactsList, 'message_count'));
        });
    }, [_contactsList]);

    useEffect(() => {
        setKeys(pathname);
    }, [pathname]);

    const logout = () => {
        Modal.confirm({
            title: '是否继续退出登录',
            onOk: () => {
                setLogout();
                Message.success('退出登录成功');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            },
        });
    };

    return (
        <div className="menu-container">
            <Menu
                theme="dark"
                selectedKeys={keys}
                levelIndent={0}
                onClickMenuItem={(key, path) => {
                    if (key === 'logout') {
                        logout();
                        return false;
                    }
                    navigate(key);
                }}
            >
                <div className="flex justify-between menu-container-header">
                    <div className="flex pl-3">
                        {authInfo?.app?.logo ? <img src={authInfo.app.logo} alt="logo" /> : null}

                        <span className="font-bold text-white truncate app-name">{authInfo?.app?.name}</span>
                    </div>
                    <div className="operate">
                        <IconEdit
                            className="mr-2 text-white hover:text-gray-300"
                            onClick={() => {
                                navigate('/setting?avtive=system');
                            }}
                        />
                    </div>
                </div>
                <MenuItem key="/workspace">
                    <ChatSvg />
                    工作台 <Badge maxCount={99} count={unreadCount} />
                </MenuItem>
                <MenuItemGroup key="workspace-group" title={'分类'} className="mb-5">
                    {categoryList.map(item => {
                        return (
                            <MenuItem key={`/category/${item.id}`}>
                                {getComponentSvg(item.icon)} {item.name}
                            </MenuItem>
                        );
                    })}
                </MenuItemGroup>
                <MenuItemGroup key="workspace-sapce" title="工作空间">
                    {/* <MenuItem key='/customer'><UsersSvg /> 客户管理</MenuItem> */}
                    {/* <MenuItem key='/analysis'><ChartSvg /> 市场分析</MenuItem> */}
                    <MenuItem key="/faq/list">
                        <DoubtSvg /> 帮助中心
                    </MenuItem>
                    <MenuItem key="/robot">
                        <RobotSvg /> 回复机器人
                    </MenuItem>
                    <MenuItem key="/setting">
                        <SettingSvg /> 设置中心
                    </MenuItem>
                    {/* <MenuItem key="/live">
                        <VideoSvg /> 视频通话
                    </MenuItem> */}
                    <MenuItem key="logout">
                        <LogoutSvg /> 退出登录
                    </MenuItem>
                </MenuItemGroup>
            </Menu>
        </div>
    );
};

export default Menus;
