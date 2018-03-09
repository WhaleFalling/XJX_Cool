import React from 'react';
import { Button, Modal, Form, Input,message } from 'antd';
import fd from '../../base/fetchData';


class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false
        }
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

    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {

                values.role_id = this.props.editRecord.role_id;
                values.access_list = this.props.editRecord.access_list;

                this.setState({ submitting: true });
                fd.postJSON(fd.ports.admin.role.update, values).then(() => {
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

    componentDidMount() {
        if (this.props.editRecord) {
            const { role_name, remark } = this.props.editRecord;
            this.props.form.setFieldsValue({
                role_name, remark
            })
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
            <Modal
                title="编辑角色"
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="角色名称"
                    >
                        {getFieldDecorator('role_name', {
                            rules: [{
                                max: 10,
                                message: '最多可输入10个字'
                            }, {
                                required: true,
                                message: '请输入角色名称',
                            }],
                        })(<Input />)}
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