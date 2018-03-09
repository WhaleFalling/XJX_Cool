import React from 'react';
import { Button, Modal, Form, Input, Select,message } from 'antd';
import fd from '../../base/fetchData';


class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            lesson_list:[]
        }
    }

    async get_lesson(){
        try{
            this.setState({submitting:true});
            let list = await fd.getJSON(fd.ports.option.lesson.list);
            this.setState({lesson_list:list});
        }catch(error){
            message.error(error.message);
        }finally{
            this.setState({submitting:false});
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

                values.lesson_id = this.props.editRecord.major_id;

                this.setState({ submitting: true });
                fd.postJSON(fd.ports.option.major.update, values).then(() => {
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
            const { major_name, lesson_list, remark } = this.props.editRecord;
            this.props.form.setFieldsValue({
                major_name, lesson_list:lesson_list.split(","), remark
            })
        }
        this.get_lesson();
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
                title="修改专业"
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="专业名称"
                    >
                        {getFieldDecorator('major_name', {
                            rules: [{
                                max: 20,
                                message: '最多可输入20个字'
                            }, {
                                required: true,
                                message: '请输入专业名称',
                            }],
                        })(<Input />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="选择课程"
                    >
                        {getFieldDecorator('lesson_list', {
                            rules: [{
                                required: true,
                                message: '请选择课程',
                            }],
                        })(
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                            >
                                {
                                    this.state.lesson_list.map((v, k) => {
                                        return (
                                            <Select.Option key={v.lesson_id}>{v.lesson_name}</Select.Option>
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