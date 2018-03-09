import React from 'react';
import { Button, Modal, Form, Input, Select,message } from 'antd';
import fd from '../../base/fetchData';


class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            submitting: false,
            major_list:[]
        }
    }

    componentDidMount() {
        this.get_major();
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

    get_major() {
        fd.getJSON(fd.ports.option.major.list).then((result) => {
            this.setState({
                major_list: result
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
                fd.postJSON(fd.ports.option.class.create, values).then(() => {
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
                <Button icon="file-add" onClick={() => this.handler_show()}>添加班级</Button>
                <Modal
                    title="添加班级"
                    visible={this.state.visible}
                    onCancel={() => this.handler_hidden()}
                    maskClosable={false}
                    footer={null}
                >
                    <Form onSubmit={(e) => this.handler_submit(e)}>
                        <FormItem
                            {...formItemLayout}
                            label="班级名称"
                        >
                            {getFieldDecorator('class_name', {
                                rules: [{
                                    max: 20,
                                    message: '最多可输入20个字'
                                }, {
                                    required: true,
                                    message: '请输入教室名称',
                                }],
                            })(<Input />)}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="所属专业"
                        >
                            {getFieldDecorator('major_id', {
                                rules: [{
                                    required: true,
                                    message: '请选择专业',
                                }],
                            })(
                                <Select placehoder="请选择专业">
                                    {
                                        this.state.major_list.map((v, k) => {
                                            return (
                                                <Select.Option key={v.major_id}>{v.major_name}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="班级状态"
                        >
                            {getFieldDecorator('closed', {
                                rules: [{
                                    required: true,
                                    message: '请选择状态',
                                }],
                            })(
                                <Select placehoder="请选择状态">
                                    <Select.Option key="0">正常</Select.Option>
                                    <Select.Option key="1">闭班</Select.Option>
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