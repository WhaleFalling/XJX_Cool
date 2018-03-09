import React from 'react';
import { Button, Table, Spin, Modal,  message } from 'antd';
import Container from '../../component/container';
import fd from '../../base/fetchData';
import Btncreate from './creat_room';
import Edit from './edit_room';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            loading: false,
            editRecord: null,
            showEdit: false
        }
    }

    componentDidMount() {
        this.get_list();
    }

    get_list() {
        this.setState({ loading: true });
        fd.getJSON(fd.ports.option.class_room.list).then((result) => {
            this.setState({
                list: result,
                loading: false
            });
        }).catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
        })
    }

    //删除动作
    handler_remove(room_id) {
        Modal.confirm({
            title: '删除教室',
            content: `你确定删除教室么？`,
            onOk: () => {
                fd.postJSON(fd.ports.option.class_room.remove, { room_id }).then(() => {
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
            title: '教室名称',
            dataIndex: `room_name`
        }, {
            title: '容纳人数',
            dataIndex: `size`
        }, {
            title: ``,
            key: 'action',
            width:260,
            render: (text, record) => {
                return (
                    <span>
                        <Button 
                            icon="edit"
                            onClick={()=>{this.setState({
                                showEdit:true,
                                editRecord:record
                                })
                            }}
                        >
                            修改
                        </Button>
                        <span className="ant-divider" />
                        <Button
                            icon="delete"
                            onClick={() => this.handler_remove(record.room_id)}
                        >
                            删除
                        </Button>
                    </span>
                )
            }
        }]

        return (
            <div>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Btncreate handler_refresh={() => { this.get_list() }} />
                    </div>
                </Container>
                <Container>
                    <Spin spinning={this.state.loading}>
                        <div style={{ overflow: 'hidden' }}>
                            <Table
                                columns={table_columns}
                                dataSource={this.state.list}
                                pagination={false}
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
