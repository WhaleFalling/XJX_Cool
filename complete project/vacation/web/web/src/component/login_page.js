import React from 'react';
import {
    Row, Col, Card, Form, Icon, Input, Button, Checkbox, Spin, message
} from 'antd';
import fd from '../base/fetchData';
import { connect } from 'react-redux';
import actionTypes from '../redux/actionTypes';

const FormItem = Form.Item;

class LoginPage extends React.Component {
    state = {
        submitting: false,
        videoUrl:'../../public/video/冲浪.mp4'
    }
    //第一次载入时验证登录状态
    componentDidMount() {
        this.setState({ submitting: true });
        fd.getJSON(fd.ports.admin.login).then((result) => {
            this.props.dispatch(
                actionTypes.create(
                    actionTypes.SET_LOGIN_STATE,
                    { isLogin: true }
                )
            )
        }).catch(() => {
            this.setState({ submitting: false });
        })
    }
    //登录动作
    doLogin(e) {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.admin.login, values).then((result) => {
                    //成功后更新状态
                    this.props.dispatch(
                        actionTypes.create(
                            actionTypes.SET_LOGIN_STATE,
                            { isLogin: true }
                        )
                    )
                }).catch((error) => {
                    message.error(error.message);
                    this.setState({ submitting: false });
                })
            }
        });
        e.preventDefault();
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div className="loginPage" >
                <Row
                    type="flex"
                    style={{
                        position: 'absolute',
                        top: 0, right: 0, bottom: 0, left: 0
                    }}
                >
                    <Col sm={16}>
                        <div className="lift_photo" style={{
                            height: '100%', margin: '0 15%', overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}>
                            {/* <video autoplay="autoplay" loop="loop">
			                    <source src={this.state.videoUrl} type="video/mp4"></source>
                            </video> */}
                            <img src="http://www.web-frontend.com/img/PTG.jpg" style={{
                                width: "100%", height: 'auto'
                            }} />
                        </div>
                    </Col>
                    <Col sm={8} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Spin spinning={this.state.submitting}>
                            <div style={{ overflow: 'hidden' }}>
                                <Card title="登录" bordered={false} style={{ minWidth: 300 }}>
                                    <Form onSubmit={(e) => this.doLogin(e)} className="login_form">
                                        <FormItem>
                                            {
                                                getFieldDecorator('login_id', {
                                                    rules: [{
                                                        required: true, message: '请输入登录用户名'
                                                    }]
                                                })(<Input
                                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25' }} />}
                                                    placeholder="用户名"
                                                />)
                                            }
                                        </FormItem>
                                        <FormItem>
                                            {
                                                getFieldDecorator('password', {
                                                    rules: [{
                                                        required: true, message: '请输入密码'
                                                    }]
                                                })(<Input
                                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25' }} />}
                                                    placeholder="密码"
                                                    type="password"
                                                />)
                                            }
                                        </FormItem>
                                        <FormItem>
                                            {
                                                getFieldDecorator('remeber', {
                                                    valuePropsName: 'checked',
                                                    initialValue: true
                                                })(<Checkbox>一个月免登陆</Checkbox>)
                                            }
                                        </FormItem>
                                        <FormItem style={{ textAlign: 'right' }}>
                                            <Button
                                                type="primary" htmlType="submit"
                                            >登录</Button>
                                        </FormItem>
                                    </Form>
                                </Card>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(state => ({ isLogin: state.get("isLogin") }))(Form.create()(LoginPage));