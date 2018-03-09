//顶部工具条组件
import React, { Component } from 'react';
import { Layout, Icon, Menu, Dropdown, Button,message } from 'antd';
import {connect} from 'react-redux';
import actionTypes from '../redux/actionTypes';
import Breadcrumb from './breadcrumb';
import fd from '../base/fetchData';
import LoginModal from './login_modal';
const { Header } = Layout;

class UserBtn extends React.Component{

    handler_click(e){
        switch(e.key){
            case "2":
                this.props.handler_logout();
                break;
            default:
                break;
        }
    }

    render(){
        const menu = (
            <Menu onClick={(e)=>this.handler_click(e)}>
                <Menu.Item key="1">修改密码</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">退出登录</Menu.Item>
            </Menu>
        );

        if(this.props.isLogin){
            return(
                <Dropdown overlay={menu}>
                    <Button shaoe="circle"><Icon type="user" /></Button>
                </Dropdown>
            )
        }else{
            return null
        }

    }
}

class Head extends Component {
    toggle() {
        this.props.dispatch(actionTypes.create(actionTypes.COLLAPSED_VIEW_SIDER,!this.props.collapsed));
    };

    handler_logout(){
        fd.postJSON(fd.ports.admin.logout,{}).then(()=>{
            this.props.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE,{isLogin:false}));
            this.props.dispatch(actionTypes.create(actionTypes.SET_VIEW_IS_MOUNT,true));
        }).catch((error)=>{
            message.error(error.message);
        })
    }

    render() {
        return (
            <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle.bind(this)}
                />
                <Breadcrumb path={window.location.pathname} path={this.props.path} />
                <div style={{float:'right',padding:'0 15px'}}>
                    <UserBtn 
                        isLogin={this.props.isLogin}
                        handler_logout={this.handler_logout.bind(this)}
                    />
                </div>
                <LoginModal 
                    visible={!this.props.isLogin}
                    dispatch={this.props.dispatch}
                    actionTypes={actionTypes}
                />
            </Header>
        )
    }
}

export default connect(state => ({ collapsed: state.getIn(["view", "collapsed"]),isLogin:state.get("isLogin") }))(Head);