//布局容器组件
import React from 'react'
import { Layout } from 'antd';

import Head from './head_bar';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import Routes from '../routes';
import LeftBar from './left_bar';





class Vive_Layout extends React.Component {
    constructor() {
        super();
        this.state = {
            collapsed: false
        }
    }

    render() {
        return (
            <LocaleProvider locale={zh_CN}>
                <Layout className="layout">
                    <LeftBar path={window.location.pathname} />
                    <Layout style={{ paddingBottom: 24 }}>
                        <Head collapsed={this.state.collapsed} path={window.location.pathname} />
                        <Routes />
                    </Layout>
                </Layout>
            </LocaleProvider>
        );
    }
}

export default Vive_Layout;