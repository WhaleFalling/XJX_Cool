import React from 'react';
import { Layout } from 'antd';
import Left_nav from './left_nav';
import {connect} from 'react-redux';

class LeftBar extends React.Component {
    render() {
        return (
            <Layout.Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
            >
                <div className="logo">
                    学生管理系统
                </div>
                <Left_nav />
            </Layout.Sider>
        )
    }
}

export default connect(state => ({ collapsed: state.getIn(["view", "collapsed"]) }))(LeftBar);