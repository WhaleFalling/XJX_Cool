import React from 'react';
import { Button, Modal, Form, Input, Select,message } from 'antd';
import fd from '../../base/fetchData';


class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            role_list: []
        }
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

    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                //提交动作
                const doIt = () => {
                    values.user_id = this.props.editRecord.user_id;

                    this.setState({ submitting: true });
                    fd.postJSON(fd.ports.admin.user.update, values).then(() => {
                        this.setState({ submitting: false });
                        this.handler_hidden();
                        this.props.handler_refresh();
                    }).catch((error) => {
                        message.error(error.message);
                        this.setState({ submitting: false })
                    })
                }
                if(this.props.form.getFieldValue("password")){
                    Modal.confirm({
                        title: "确认操作",
                        content: "检测到您修改了密码，您确定么？",
                        onOk:()=>this.doIt()
                    })
                }else{
                    doIt();
                }
            }
        })
    }

    componentDidMount() {
        if (this.props.editRecord) {
            const { login_id, user_name, remark, role_id } = this.props.editRecord;
            this.props.form.setFieldsValue({
                login_id, user_name, remark, role_id:role_id.toString()
            })
        }
        this.get_role();
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
                title="添加教室"
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                footer={null}
                afterClose={() => this.props.handler_close()}
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
                            }],
                        })(<Input type="password" placeholder="若要更改请点击" />)}
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
                                validator: this.eq_password.bind(this)
                            }],
                        })(<Input type="password" placeholder="若要更改请点击" />)}
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
        )
    }
}

export default Form.create()(Edit);