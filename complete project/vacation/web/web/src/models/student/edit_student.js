import React from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import fd from '../../base/fetchData';


class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            class_list: []
        }
    }

    get_class() {
        fd.getJSON(fd.ports.option.class.all_list).then((result) => {
            this.setState({
                class_list: result
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

                values.student_id = this.props.editRecord.student_id;

                this.setState({ submitting: true });
                fd.postJSON(fd.ports.option.student.update, values).then(() => {
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
            const { student_name, mobile, id_card_number, class_id, remark, student_id } = this.props.editRecord;
            this.props.form.setFieldsValue({
                student_name, mobile, id_card_number, class_id, remark, student_id
            })
        }
        this.get_class();
    }

    //验证身份证号码的方法
    isIdCard(value) {
        //测试需要，直接返回true
        return true;

        if (!value && value !== 0) {
            return true;
        }
        //身份证号码位权值
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        var validCode = ["1", "0", "x", "9", "8", "7", "6", "5", "4", "3", "2",]
        try {
            //长度不是18位，不给通过
            if (parseInt(value).toString().length !== 18) {
                return false;
            } else {
                //加权取徐计算
                var number = value.substring(0, 17);
                var count = 0;
                for (var i = 0; i < number.length; i++) {
                    count += Number(number[i]) * factor[i];
                }
                var last = validCode[count % 11];
                var CardNumber = number.toString() + last;
                if (CardNumber.toUpperCase() === value.toUpperCase()) {
                    return true;
                } else {
                    return false;
                }

            }
        } catch (ex) {
            return false;
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
                        label="学生姓名"
                    >
                        {getFieldDecorator('student_name', {
                            rules: [{
                                max: 10,
                                message: '最多可输入10个字'
                            }, {
                                required: true,
                                message: '请输入教室名称',
                            }],
                        })(<Input />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        {getFieldDecorator('mobile', {
                            rules: [{
                                required: true,
                                message: '请输入手机号',
                            }, {
                                max: 11,
                                message: '请输入正确手机号'
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="身份证号码"
                    >
                        {getFieldDecorator('id_card_number', {
                            rules: [{
                                required: true,
                                message: '请输入身份证号码',
                            }, {
                                max: 18,
                                message: '身份证号码最多18位'
                            }, {
                                validate: (rule, value, callback) => {
                                    if (this.isIdCard(value)) {
                                        callback();
                                    } else {
                                        callback("输入身份证号有误")
                                    }
                                }
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="所在班级"
                    >
                        {getFieldDecorator('class_id', {
                            rules: [{
                                required: true,
                                message: '请选择班级',
                            }],
                        })(
                            <Select placehoder="请选择班级"
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    this.state.class_list.map((v, k) => {
                                        return (
                                            <Select.Option key={v.class_id}>{v.class_name}</Select.Option>
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