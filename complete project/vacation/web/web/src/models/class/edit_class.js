import React from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import fd from '../../base/fetchData';


class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            major_list:[]
        }
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

                values.class_id = this.props.editRecord.class_id;

                this.setState({ submitting: true });
                fd.postJSON(fd.ports.option.class.update, values).then(() => {
                    this.setState({ submitting: false });
                    this.handler_hidden();
                    this.props.handler_refresh();
                }).catch((error) => {
                    message.error(error.message);
                    this.setState({submitting:false})
                })
            }
        })
    }

    componentDidMount() {
        if (this.props.editRecord) {
            const { class_name, major_id, remark, closed } = this.props.editRecord;
            this.props.form.setFieldsValue({
                class_name, major_id, remark, closed
            })
        }
        this.get_major();
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
                afterClose={()=>this.props.handler_close()}
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
        )
    }
}

export default Form.create()(Edit);