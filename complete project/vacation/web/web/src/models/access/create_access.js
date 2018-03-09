import React from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import fd from '../../base/fetchData';


class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            isChildren: !!props.parentNodeData
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

                values.node_type = this.state.isChildren ? 1 : 0
                values.parent_id=this.state.isChildren?this.props.parentNodeData.access_id:undefined;

                this.setState({ submitting: true });
                fd.postJSON(fd.ports.admin.access.create, values).then(() => {
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

    }

    render() {
        const { isChildren } = this.state;

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
                title={isChildren ? "编辑权限节点" : "添加权限分类"}
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label={isChildren ? "权限名称" : "分类名称"}
                    >
                        {getFieldDecorator('access_name', {
                            rules: [{
                                max: 20,
                                message: '最多可输入20个字'
                            }, {
                                required: true,
                                message: '请输入名称',
                            }],
                        })(<Input />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label={isChildren ? "接口地址" : "菜单地址"}
                    >
                        {getFieldDecorator('url', {
                            rules: [{
                                required: true,
                                message: '请填写接口',
                            }],
                        })(
                            <Input placeholder={isChildren ? "必须输入服务路径" : "必须输入前端路径"} />
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