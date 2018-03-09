import React from 'react';
import { Button, Table, Spin, Modal, Form, Input, message } from 'antd';
import Container from '../../component/container';
import fd from '../../base/fetchData';
import Btncreate from './create_user';
import Edit from './edit_user';
import moment from 'moment';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            redirect_student_list: null, //跳转到学生列表的参数
            redirect_schedule: null, //跳转到课表
            keyword: '',//关键字
            list: [],
            list_total: 0,
            pageSize: 10, //页大小
            pageNumber: 1,//页码
            loading: false,
            editRecord: null, //被选中的行
            showEdit: false //显示编辑窗口
        }
    }

    componentDidMount() {
        this.get_list();
    }

    get_list() {
        this.setState({ loading: true });
        //构建参数
        const { keyword, pageNumber, pageSize } = this.state;

        fd.getJSON(fd.ports.admin.user.list, { keyword, pageNumber, pageSize }).then((result) => {
            this.setState({
                list: result.list,
                list_total: result.total,
                loading: false
            });
        }).catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
        });
    }

    //删除动作
    handler_remove(user_id) {
        Modal.confirm({
            title: '删除用户',
            content: `你确定删除用户么？`,
            onOk: () => {
                fd.postJSON(fd.ports.admin.user.remove, { user_id }).then(() => {
                    this.get_list();
                }).catch((error) => {
                    message.error(error.message);
                })
            }
        })
    }

    render() {
        //定义表格列
        const table_columns = [{
            title: `姓名`,
            dataIndex: `user_name`
        }, {
            title: '登录ID',
            dataIndex: `login_id`
        }, {
            title: '角色',
            dataIndex: `role_name`
        }, {
            title: '上次登录',
            dataIndex: `last_login`,
            render:(text)=>text? moment(text).format("YYYY-MM-DD HH-mm-ss") : "用户未登录过"
        }, {
            title: ``,
            key: 'action',
            width: 240,
            render: (text, record) => {
                return (
                    <span>
                        <Button
                            icon="edit"
                            onClick={() => {
                                this.setState({
                                    showEdit: true,
                                    editRecord: record
                                })
                            }}
                        >
                            修改
                        </Button>
                        <span className="ant-divider" />
                        <Button
                            icon="delete"
                            onClick={() => this.handler_remove(record.user_id)}
                        >
                            删除
                        </Button>
                    </span>
                )
            }
        }]

        //分页定义
        const pagination = {
            total: this.state.list_total,
            defaultPageSize: this.state.pageSize,
            onShowSizeChange: (pageNumber, pageSize) => {
                this.setState({ pageNumber, pageSize }, () => {
                    this.get_list();
                });
            },
            onChange: (pageNumber, pageSize) => {
                this.setState({ pageNumber, pageSize }, () => {
                    this.get_list();
                });
            },
            showSizeChanger: true
        }

        return (
            <div>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Form layout="inline" style={{}}
                            onSubmit={(e) => {
                                e.preventDefault();
                                this.get_list();
                            }}
                        >
                            <Form.Item>
                                <Btncreate handler_refresh={() => { this.get_list() }} />
                            </Form.Item>
                            <Form.Item label="关键字">
                                <Input
                                    defaultValue=""
                                    placeholder="请输入名字"
                                    value={this.state.keyword}
                                    onChange={(e) => this.setState({ keyword: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button icon="search" htmlType="submit">查找</Button>
                            </Form.Item>
                        </Form>


                    </div>
                </Container>
                <Container>
                    <Spin spinning={this.state.loading}>
                        <div style={{ overflow: 'hidden' }}>
                            <Table
                                columns={table_columns}
                                dataSource={this.state.list}
                                pagination={pagination}
                                rowKey={(r) => r.room_id}
                            />
                        </div>
                    </Spin>
                </Container>
                {
                    this.state.showEdit && <Edit
                        visible={this.state.showEdit}
                        handler_close={() => this.setState({ showEdit: false })}
                        editRecord={this.state.editRecord}
                        handler_refresh={() => this.get_list()}
                    />
                }
            </div>
        );
    }
}
