import { Tabs, Typography } from '@arco-design/web-react';
import { getComponentSvg } from 'src/services/svgs';
import Category from './components/category';
import Breadcrumb from 'src/components/Breadcrumb'
import './styles/setting.scss';
const TabPane = Tabs.TabPane;

const Settings = () => {
    return (
        <div className="setting-container">
            <div className="setting-card card-wrapper">
                <Breadcrumb title="设置中心" />
                <Tabs defaultActiveTab='1' tabPosition='left'>
                    <TabPane key='1' title={<>{getComponentSvg('category')}<span className='ml-1'>分类设置</span></>}>
                        <Category />
                    </TabPane>
                    <TabPane key='2' title={<>{getComponentSvg('account')}<span className='ml-1'>账户设置</span></>}>
                        <Typography.Paragraph>账户设置 (开发中)</Typography.Paragraph>
                    </TabPane>
                    <TabPane key='3' title={<>{getComponentSvg('setting')}<span className='ml-1'>系统设置</span></>}>
                        <Typography.Paragraph>系统设置 (开发中)</Typography.Paragraph>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default Settings;