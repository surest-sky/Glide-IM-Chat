import { Tabs, Typography } from '@arco-design/web-react';
import { getComponentSvg } from 'src/services/svgs';
import Category from './components/category';
import Account from './components/account';
import System from './components/system';
import Breadcrumb from 'src/components/Breadcrumb'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import './styles/setting.scss';
const TabPane = Tabs.TabPane;

const Settings = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState('category')

    const changeActive = (value) => {
        setActiveTab(value)
        navigate(`/setting?avtive=${value}`)
    }

    useEffect(() => {
        const active = searchParams.get("avtive")
        setActiveTab(active ? active : "category")
    }, [searchParams])

    return (
        <div className="setting-container">
            <div className="setting-card card-wrapper">
                <Breadcrumb title="设置中心" />
                <Tabs activeTab={activeTab} onChange={changeActive} tabPosition='left'>
                    <TabPane key='category' title={<>{getComponentSvg('category')}<span className='ml-1'>分类设置</span></>}>
                        <Category />
                    </TabPane>
                    <TabPane key='account' title={<>{getComponentSvg('account')}<span className='ml-1'>账户设置</span></>}>
                        <Account />
                    </TabPane>
                    <TabPane key='system' title={<>{getComponentSvg('setting')}<span className='ml-1'>平台设置</span></>}>
                        <System />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default Settings;