import React from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import fd from '../../base/fetchData';


class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            submitting: false,
            role_list:[]
        }
    }

    componentDidMount() {
        this.get_role();
    }

    //显隐弹层
    handler_show() {
        this.setState({
            visible: true
        })
    }
    handler_hidden() {
        this.setState({
            visible: false
        })
        this.props.form.resetFields();
    }

    get_role() {
        fd.getJSON(fd.ports.admin.role.list).then((result) => {
            this.setState({
                role_list: result
            });
        }).catch((error) => {
            message.error(error.message);
        });
    }

    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.admin.user.create, values).then(() => {
                    this.setState({ submitting: false });
                    this.handler_hidden();
                    this.props.handler_refresh();
                }).catch((error) => {
                    message.error(error.message);
                    this.setState({ submitting: false })
                })
            }
        })
    }

    eq_password(rule,value,callback){
        const form = this.props.form;
        const pw = form.getFieldValue("password");
        if(pw === value){
            callback();
        }else{
            callback("两次输入的密码不一致")
        }
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
            <span>
                <Button icon="file-add" onClick={this.handler_show.bind(this)}>添加用户</Button>
                <Modal
                    title="添加用户"
                    visible={this.state.visible}
                    onCancel={() => this.handler_hidden()}
                    maskClosable={false}
                    footer={null}
                >
                    <Form onSubmit={(e) => this.handler_submit(e)}>
                        <FormItem
                            {...formItemLayout}
                            label="姓名"
                        >
                            {getFieldDecorator('user_name', {
                                rules: [{
                                    max: 10,
                                    message: '最多可输入10个字'
                                }, {
                                    required: true,
                                    message: '请输名称',
                                }],
                            })(<Input />)}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="登录ID"
                        >
                            {getFieldDecorator('login_id', {
                                rules: [{
                                    max: 20,
                                    message: '最多可输入20个字'
                                }, {
                                    required: true,
                                    message: '请输入ID',
                                }],
                            })(<Input />)}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="密码"
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    max: 32,
                                    message: '最多可输入32个字'
                                }, {
                                    required: true,
                                    message: '请输入密码',
                                }],
                            })(<Input type="password" />)}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="确认密码"
                        >
                            {getFieldDecorator('eq_password', {
                                rules: [{
                                    max: 32,
                                    message: '最多可输入32个字'
                                }, {
                                    required: true,
                                    message: '请输入密码',
                                },{
                                    validator:this.eq_password.bind(this)
                                }],
                            })(<Input type="password" />)}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="用户角色"
                        >
                            {getFieldDecorator('role_id', {
                                rules: [{
                                    required: true,
                                    message: '请选择角色',
                                }],
                            })(
                                <Select placehoder="请选择角色">
                                    {
                                        this.state.role_list.map((v, k) => {
                                            return (
                                                <Select.Option key={v.role_id}>{v.role_name}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="备注信息"
                        >
                            {getFieldDecorator('remark', {
                                rules: [{
                                    max: 200,
                                    message: '最多可输入200个字'
                                }],
                            })(<Input.TextArea />)}
                        </FormItem>
                        <FormItem
                            wrapperCol={{ xs: { offset: 4, span: 20 } }}
                            style={{ marginBottom: 0, textAlign: 'right' }}
                        >
                            <Button type="primary" htmlType="submit" loading={this.state.submitting}>提交</Button>
                            <Button onClick={() => this.handler_hidden()} style={{ marginLeft: 15 }}>关闭</Button>
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(Create);