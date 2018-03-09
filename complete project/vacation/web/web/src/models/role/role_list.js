/* 课程管理 */
import React from 'react';
import fd from '../../base/fetchData';
import Container from '../../component/container';
import { Button, List, Modal, Icon, message } from 'antd';
import Create from './create_role';
import Edit from './edit_role';
import Set from './set_access';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            loading: false,
            showEdit: false,
            editRecord: null,
            showSet:false
        }
    }

    async get_list() {
        try {
            this.setState({ loading: true });
            let list = await fd.getJSON(fd.ports.admin.role.list);
            this.setState({ list });
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({ loading: false });
        }
    }

    async handler_remove(role_id) {
        try {
            await fd.postJSON(fd.ports.admin.role.remove, { role_id });
            this.get_list();
        } catch (error) {
            message.error(error.message);
        } finally {

        }
    }

    componentDidMount() {
        this.get_list();
    }

    render() {
        return (
            <Container>
                <List
                    bordered
                    header={
                        <div>
                            <Create handler_refresh={() => this.get_list()} />
                        </div>
                    }
                    dataSource={this.state.list}
                    loading={this.state.loading}
                    renderItem={
                        (item) => (
                            <List.Item actions={
                                [
                                    <Button icon="edit" size="small"
                                        onClick={() => this.setState({
                                            showSet: true,
                                            editRecord: item
                                        })}
                                    >
                                        设置权限
                                    </Button>,
                                    <Button icon="edit" size="small"
                                        onClick={() => this.setState({
                                            showEdit: true,
                                            editRecord: item
                                        })}
                                    >
                                        修改
                                    </Button>,
                                    <Button icon="delete" size="small" onClick={
                                        () => {
                                            Modal.confirm({
                                                title: '删除角色',
                                                content: `你确定删除角色么？`,
                                                onOk: () => this.handler_remove(item.role_id)
                                            })
                                        }
                                    }>
                                        删除
                                    </Button>
                                ]
                            }>
                                <List.Item.Meta
                                    avatar={<Icon type="user" />}
                                    title={item.role_name}
                                />
                            </List.Item>
                        )
                    }
                />
                {
                    this.state.showEdit && <Edit
                        visible={this.state.showEdit}
                        handler_close={() => this.setState({ showEdit: false })}
                        editRecord={this.state.editRecord}
                        handler_refresh={() => this.get_list()}
                    />
                }
                {
                    this.state.showSet && <Set
                        visible={this.state.showSet}
                        handler_close={() => this.setState({ showSet: false })}
                        editRecord={this.state.editRecord}
                        handler_refresh={() => this.get_list()}
                    />
                }
            </Container>
        )
    }
}