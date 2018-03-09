import React from 'react';
import { Button, Modal, Form, Input,Icon,Checkbox,message } from 'antd';
import fd from '../base/fetchData';


class LoginModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            submitting: false
        }
    }

    doLogin(e) {
        const {dispatch,actionTypes}=this.props;
        this.props.form.validateFields((error, values) => {
            if (!error) {
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.admin.login, values).then((result) => {
                    //成功后更新状态
                    dispatch(
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

        //验证组件
        const { getFieldDecorator } = this.props.form;
        //表单输入大小比例
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        const FormItem = Form.Item;

        return (
            <Modal
                title="请登录"
                visible={this.props.visible}
                maskClosable={false}
                footer={null}
                width={300}
                zIndex={100000}
            >
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
            </Modal>
        )
    }
}

export default Form.create()(LoginModal);